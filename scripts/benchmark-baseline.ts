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
    // Ensure we can read it
    const check = db.query('SELECT count(*) as c FROM djmdContent');
    console.log("DEBUG: Content count check:", JSON.stringify(check));
  } catch (e) {
    console.error("Failed to open encrypted DB.", e);
    process.exit(1);
  }

  // DEBUG: Check data existence - Verified
  const start = performance.now();

  // --- LOGIC FROM index.ts (Existing) ---
  const yearFilter = `${TARGET_YEAR}%`;
  const excludeArtistClause = (field: string) => getExcludeArtistClause(field);
  const excludeGenreClause = (field: string) => getExcludeGenreClause(field);

  // 0. Basic Stats (Total Tracks, Total Playtime)
  const totalTracksResult: any[] = db.query(`
    SELECT COUNT(*) as count
    FROM djmdSongHistory sh
    JOIN djmdHistory h ON sh.HistoryID = h.ID
    WHERE h.DateCreated LIKE ?
  `, [yearFilter]);
  const totalTracks = Number(totalTracksResult[0]?.count || 0);

  const totalPlaytimeResult: any[] = db.query(`
    SELECT SUM(c.Length) as total_seconds
    FROM djmdSongHistory sh
    JOIN djmdHistory h ON sh.HistoryID = h.ID
    JOIN djmdContent c ON sh.ContentID = c.ID
    WHERE h.DateCreated LIKE ?
  `, [yearFilter]);
  const totalPlaytimeSeconds = Number(totalPlaytimeResult[0]?.total_seconds || 0);

  const totalSessionsResult: any[] = db.query(`
    SELECT COUNT(*) as count
    FROM djmdHistory
    WHERE DateCreated LIKE ?
  `, [yearFilter]);
  const totalSessions = Number(totalSessionsResult[0]?.count || 0);

  // 0.5 Library Growth
  const nextYear = (parseInt(TARGET_YEAR) + 1).toString();
  const libraryTotalResult: any[] = db.query(`
    SELECT COUNT(*) as count 
    FROM djmdContent 
    WHERE DateCreated < ?
  `, [nextYear]);
  const libraryTotal = Number(libraryTotalResult[0]?.count || 0);

  const libraryAddedResult: any[] = db.query(`
    SELECT COUNT(*) as count 
    FROM djmdContent 
    WHERE DateCreated LIKE ?
  `, [yearFilter]);
  const libraryAdded = Number(libraryAddedResult[0]?.count || 0);

  // 1. Top 10 Tracks
  db.query(`
    SELECT c.Title, a.Name as Artist, COUNT(*) as count
    FROM djmdSongHistory sh
    JOIN djmdHistory h ON sh.HistoryID = h.ID
    JOIN djmdContent c ON sh.ContentID = c.ID
    LEFT JOIN djmdArtist a ON c.ArtistID = a.ID
    WHERE h.DateCreated LIKE ?
    AND c.Title IS NOT NULL AND c.Title != ''
    ${excludeArtistClause('a.Name')}
    GROUP BY c.ID
    ORDER BY count DESC
    LIMIT 10
  `, [yearFilter]);

  // 2. Top 10 Artists
  db.query(`
    SELECT a.Name, COUNT(*) as count
    FROM djmdSongHistory sh
    JOIN djmdHistory h ON sh.HistoryID = h.ID
    JOIN djmdContent c ON sh.ContentID = c.ID
    LEFT JOIN djmdArtist a ON c.ArtistID = a.ID
    WHERE h.DateCreated LIKE ?
    ${excludeArtistClause('a.Name')}
    GROUP BY a.ID
    ORDER BY count DESC
    LIMIT 10
  `, [yearFilter]);

  // 3. Top 10 Genres
  db.query(`
    SELECT g.Name, COUNT(*) as count
    FROM djmdSongHistory sh
    JOIN djmdHistory h ON sh.HistoryID = h.ID
    JOIN djmdContent c ON sh.ContentID = c.ID
    LEFT JOIN djmdGenre g ON c.GenreID = g.ID
    WHERE h.DateCreated LIKE ?
    ${excludeGenreClause('g.Name')}
    GROUP BY g.ID
    ORDER BY count DESC
    LIMIT 10
  `, [yearFilter]);

  // 4. Top 10 BPMs
  db.query(`
    SELECT c.BPM, COUNT(*) as count
    FROM djmdSongHistory sh
    JOIN djmdHistory h ON sh.HistoryID = h.ID
    JOIN djmdContent c ON sh.ContentID = c.ID
    WHERE h.DateCreated LIKE ?
    AND c.BPM != 0 AND c.BPM IS NOT NULL
    GROUP BY c.BPM
    ORDER BY count DESC
    LIMIT 10
  `, [yearFilter]);

  // 5. Most songs in a session
  const resMostSongs: any[] = db.query(`
    SELECT h.ID, h.DateCreated, COUNT(sh.ID) as song_count
    FROM djmdHistory h
    JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
    WHERE h.DateCreated LIKE ?
    GROUP BY h.ID
    ORDER BY song_count DESC
    LIMIT 1
  `, [yearFilter]);

  if (resMostSongs && resMostSongs.length > 0) {
    const historyId = resMostSongs[0].ID;

    db.query(`
            SELECT SUM(c.Length) as total_duration
            FROM djmdSongHistory sh
            JOIN djmdContent c ON sh.ContentID = c.ID
            WHERE sh.HistoryID = ?
         `, [historyId]);
  }

  // 6. Most active month
  db.query(`
    SELECT substr(h.DateCreated, 1, 7) as month, COUNT(sh.ID) as song_count
    FROM djmdHistory h
    JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
    WHERE h.DateCreated LIKE ?
    GROUP BY month
    ORDER BY song_count DESC
    LIMIT 1
  `, [yearFilter]);

  // --- END LOGIC ---

  const end = performance.now();
  console.log(`Baseline execution time: ${(end - start).toFixed(2)} ms`);
  console.log(`Stats found: Total Tracks=${totalTracks}, Sessions=${totalSessions}`);

  db.close();
}

main().catch(console.error);
