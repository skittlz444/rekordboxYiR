import fs from 'node:fs';
import path from 'node:path';
import initSqlcipher from '@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs';
import { SQLiteAPI } from '@7mind.io/sqlcipher-wasm';
import { performance } from 'node:perf_hooks';

const INPUT_PATH = path.resolve('mock-master.db');
const DB_PATH = '/mock.db'; // VFS path
const WASM_PATH = path.resolve('node_modules/@7mind.io/sqlcipher-wasm/dist/sqlcipher.wasm');
const KEY = 'test-key';
const TARGET_YEAR = '2024';

// Helper to add exclusion clause for unknown artists (copied from index.ts)
const getExcludeArtistClause = (field: string) => {
  return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Artist'`;
};

// Helper to add exclusion clause for unknown genres (copied from index.ts)
const getExcludeGenreClause = (field: string) => {
  return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Genre'`;
};

async function main() {
  console.log('Running Baseline Benchmark...');

  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Mock DB not found at ${INPUT_PATH}. Run create-mock-db.ts first.`);
    process.exit(1);
  }

  const wasmBuffer = fs.readFileSync(WASM_PATH);

  const module = await initSqlcipher({
    instantiateWasm: async (imports, successCallback) => {
      const instance = await WebAssembly.instantiate(wasmBuffer, imports);
      successCallback(instance.instance);
      return instance;
    }
  });

  // Load DB into VFS
  const dbBuffer = fs.readFileSync(INPUT_PATH);
  console.log(`DEBUG: Loaded DB buffer size: ${dbBuffer.length}`);
  module.FS.writeFile(DB_PATH, dbBuffer);

  const sqlite = new SQLiteAPI(module);
  const db = sqlite.open(DB_PATH);

  try {
    db.exec(`PRAGMA key = '${KEY}'`);
    // Optimizations
    db.exec('PRAGMA synchronous = OFF');
    db.exec('PRAGMA journal_mode = MEMORY');
    db.exec('CREATE INDEX IF NOT EXISTS idx_history_date ON djmdHistory(DateCreated)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_content_date ON djmdContent(DateCreated)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_sh_history ON djmdSongHistory(HistoryID)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_sh_content ON djmdSongHistory(ContentID)');

    // Ensure we can read it
    const check = db.query('SELECT count(*) as c FROM djmdContent');
    console.log("DEBUG: Content count check:", JSON.stringify(check));
  } catch (e) {
    console.error("Failed to open encrypted DB.", e);
    process.exit(1);
  }

  // DEBUG: Check data existence - Verified
  const start = performance.now();

  // --- LOGIC FROM index.ts (Optimized) ---
  const yearFilter = `${TARGET_YEAR}%`;
  const excludeArtistClause = (field: string) => getExcludeArtistClause(field);
  const excludeGenreClause = (field: string) => getExcludeGenreClause(field);

  // 1. Consolidated Aggregation Query (Tracks, Playtime, Sessions)
  const aggResult: any[] = db.query(`
    SELECT
      (SELECT COUNT(*) FROM djmdSongHistory sh 
       JOIN djmdHistory h ON sh.HistoryID = h.ID 
       WHERE h.DateCreated LIKE ?) as totalTracks,
      (SELECT SUM(c.Length) FROM djmdSongHistory sh 
       JOIN djmdHistory h ON sh.HistoryID = h.ID
       JOIN djmdContent c ON sh.ContentID = c.ID
       WHERE h.DateCreated LIKE ?) as totalPlaytime,
      (SELECT COUNT(*) FROM djmdHistory h 
       WHERE h.DateCreated LIKE ?) as totalSessions
  `, [yearFilter, yearFilter, yearFilter]);

  const totalTracks = Number(aggResult[0]?.totalTracks || 0);
  const totalSessions = Number(aggResult[0]?.totalSessions || 0);

  // 2. Library Growth Query
  const nextYear = (parseInt(TARGET_YEAR) + 1).toString();
  const growthResult: any[] = db.query(`
    SELECT
      (SELECT COUNT(*) FROM djmdContent WHERE DateCreated < ?) as libraryTotal,
      (SELECT COUNT(*) FROM djmdContent WHERE DateCreated LIKE ?) as libraryAdded
  `, [nextYear, yearFilter]);

  const libraryTotal = Number(growthResult[0]?.libraryTotal || 0);
  const libraryAdded = Number(growthResult[0]?.libraryAdded || 0);

  // 3. Consolidated Top Entities (Tracks, Artists, Genres, BPMs)
  // using UNION ALL with 'type' discriminator
  const topEntitiesResult: any[] = db.query(`
    SELECT * FROM (
      SELECT 'track' as type, c.Title as name, a.Name as artist, COUNT(*) as count
      FROM djmdSongHistory sh
      JOIN djmdHistory h ON sh.HistoryID = h.ID
      JOIN djmdContent c ON sh.ContentID = c.ID
      LEFT JOIN djmdArtist a ON c.ArtistID = a.ID
      WHERE h.DateCreated LIKE ? AND c.Title IS NOT NULL AND c.Title != ''
      ${excludeArtistClause('a.Name')}
      GROUP BY c.ID ORDER BY count DESC LIMIT 10
    )
    UNION ALL
    SELECT * FROM (
      SELECT 'artist' as type, a.Name as name, NULL as artist, COUNT(*) as count
      FROM djmdSongHistory sh
      JOIN djmdHistory h ON sh.HistoryID = h.ID
      JOIN djmdContent c ON sh.ContentID = c.ID
      LEFT JOIN djmdArtist a ON c.ArtistID = a.ID
      WHERE h.DateCreated LIKE ?
      ${excludeArtistClause('a.Name')}
      GROUP BY a.ID ORDER BY count DESC LIMIT 10
    )
    UNION ALL
    SELECT * FROM (
      SELECT 'genre' as type, g.Name as name, NULL as artist, COUNT(*) as count
      FROM djmdSongHistory sh
      JOIN djmdHistory h ON sh.HistoryID = h.ID
      JOIN djmdContent c ON sh.ContentID = c.ID
      LEFT JOIN djmdGenre g ON c.GenreID = g.ID
      WHERE h.DateCreated LIKE ?
      ${excludeGenreClause('g.Name')}
      GROUP BY g.ID ORDER BY count DESC LIMIT 10
    )
    UNION ALL
    SELECT * FROM (
      SELECT 'bpm' as type, CAST(c.BPM as TEXT) as name, NULL as artist, COUNT(*) as count
      FROM djmdSongHistory sh
      JOIN djmdHistory h ON sh.HistoryID = h.ID
      JOIN djmdContent c ON sh.ContentID = c.ID
      WHERE h.DateCreated LIKE ? AND c.BPM != 0 AND c.BPM IS NOT NULL
      GROUP BY c.BPM ORDER BY count DESC LIMIT 10
    )
  `, [yearFilter, yearFilter, yearFilter, yearFilter]);

  // Process rows just to simulate work
  topEntitiesResult.forEach((row: any) => {
    // iterating
  });

  // 4. Session Stats Query
  const sessionStatsResult: any[] = db.query(`
    WITH SessionCounts AS (
      SELECT h.ID, h.DateCreated, COUNT(sh.ID) as song_count
      FROM djmdHistory h
      JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
      WHERE h.DateCreated LIKE ?
      GROUP BY h.ID
    ),
    MostSongs AS (
      SELECT ID, DateCreated, song_count 
      FROM SessionCounts 
      ORDER BY song_count DESC LIMIT 1
    ),
    SessionDurations AS (
       SELECT sh.HistoryID, SUM(c.Length) as duration
       FROM djmdSongHistory sh
       JOIN djmdContent c ON sh.ContentID = c.ID
       WHERE sh.HistoryID IN (SELECT ID FROM MostSongs)
       GROUP BY sh.HistoryID
    ),
    MonthCounts AS (
      SELECT substr(h.DateCreated, 1, 7) as month, COUNT(sh.ID) as song_count
      FROM djmdHistory h
      JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
      WHERE h.DateCreated LIKE ?
      GROUP BY month
      ORDER BY song_count DESC
      LIMIT 1
    )
    SELECT 
      (SELECT DateCreated FROM MostSongs) as maxSessionDate,
      (SELECT song_count FROM MostSongs) as maxSessionCount,
      (SELECT duration FROM SessionDurations) as maxSessionDuration,
      (SELECT month FROM MonthCounts) as busiestMonth,
      (SELECT song_count FROM MonthCounts) as busiestMonthCount
  `, [yearFilter, yearFilter]);

  const sessionStats = sessionStatsResult[0] || {};
  // --- END LOGIC ---

  const end = performance.now();
  console.log(`Baseline execution time: ${(end - start).toFixed(2)} ms`);
  console.log(`Stats found: Total Tracks=${totalTracks}, Sessions=${totalSessions}`);

  db.close();
}

main().catch(console.error);
