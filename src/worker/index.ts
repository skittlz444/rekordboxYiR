import { Hono } from 'hono';
import { cors } from 'hono/cors';
// @ts-ignore
import initSqlcipher from '@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs';
// @ts-ignore
import { SQLiteAPI } from '@7mind.io/sqlcipher-wasm';
// @ts-expect-error - wasm import
import wasmBinary from '@7mind.io/sqlcipher-wasm/dist/sqlcipher.wasm';

type Bindings = {
  REKORDBOX_KEY: string;
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

app.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];
    const year = body['year'] as string || new Date().getFullYear().toString();
    const includeUnknownArtist = body['unknownArtist'] === 'true';
    const includeUnknownGenre = body['unknownGenre'] === 'true';

    if (!(file instanceof File)) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    const buffer = await file.arrayBuffer();
    const u8 = new Uint8Array(buffer);

    // Initialize SQLCipher
    const module = await initSqlcipher({
      instantiateWasm: function(imports: WebAssembly.Imports, successCallback: (instance: WebAssembly.Instance) => void) {
        WebAssembly.instantiate(wasmBinary, imports).then(function(instance) {
          successCallback(instance);
        });
        return {};
      }
    });
    const sqlite = new SQLiteAPI(module);

    // Write to VFS
    const dbPath = '/master.db';
    module.FS.writeFile(dbPath, u8);

    // Open DB
    let db: any;
    try {
      // Open without key first
      db = sqlite.open(dbPath);
      
      // Manually set key to handle raw hex format correctly
      const key = c.env.REKORDBOX_KEY;
      if (!key) {
        throw new Error('REKORDBOX_KEY is not defined in environment variables');
      }

      // Try using the key as a passphrase (standard SQLCipher behavior)
      // This matches how pyrekordbox passes the key in the connection string
      db.exec(`PRAGMA key = '${key}'`);

      // Try SQLCipher 4 defaults first (most likely for modern libs)
      // If this fails, we might need to try compatibility=3
      db.exec('PRAGMA cipher_page_size = 4096');
      db.exec('PRAGMA kdf_iter = 256000');
      db.exec('PRAGMA cipher_hmac_algorithm = HMAC_SHA512');
      db.exec('PRAGMA cipher_kdf_algorithm = PBKDF2_HMAC_SHA512');
      db.exec('PRAGMA cipher_plaintext_header_size = 0');
      
      console.log(`Opening DB with key length: ${key.length}, File size: ${u8.length}`);
      
      // Helper to add exclusion clause
      const getExcludeArtistClause = (includeUnknownArtist: boolean, field: string) => {
        if (includeUnknownArtist) return '';
        return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Artist'`;
      };

      const getExcludeGenreClause = (includeUnknownGenre: boolean, field: string) => {
        if (includeUnknownGenre) return '';
        return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Genre'`;
      };

      const getYearStats = (targetYear: string) => {
        const yearFilter = `${targetYear}%`;
        const excludeArtistClause = (field: string) => getExcludeArtistClause(includeUnknownArtist, field);
        const excludeGenreClause = (field: string) => getExcludeGenreClause(includeUnknownGenre, field);

        // 0. Basic Stats (Total Tracks, Total Playtime)
        const totalTracksResult = db.query(`
          SELECT COUNT(*) as count
          FROM djmdSongHistory sh
          JOIN djmdHistory h ON sh.HistoryID = h.ID
          WHERE h.DateCreated LIKE ?
        `, [yearFilter]);
        const totalTracks = Number(totalTracksResult[0]?.count || 0);

        const totalPlaytimeResult = db.query(`
          SELECT SUM(c.Length) as total_seconds
          FROM djmdSongHistory sh
          JOIN djmdHistory h ON sh.HistoryID = h.ID
          JOIN djmdContent c ON sh.ContentID = c.ID
          WHERE h.DateCreated LIKE ?
        `, [yearFilter]);
        const totalPlaytimeSeconds = Number(totalPlaytimeResult[0]?.total_seconds || 0);

        const totalSessionsResult = db.query(`
          SELECT COUNT(*) as count
          FROM djmdHistory
          WHERE DateCreated LIKE ?
        `, [yearFilter]);
        const totalSessions = Number(totalSessionsResult[0]?.count || 0);

        // 0.5 Library Growth
        const nextYear = (parseInt(targetYear) + 1).toString();
        const libraryTotalResult = db.query(`
          SELECT COUNT(*) as count 
          FROM djmdContent 
          WHERE DateCreated < ?
        `, [nextYear]);
        const libraryTotal = Number(libraryTotalResult[0]?.count || 0);

        const libraryAddedResult = db.query(`
          SELECT COUNT(*) as count 
          FROM djmdContent 
          WHERE DateCreated LIKE ?
        `, [yearFilter]);
        const libraryAdded = Number(libraryAddedResult[0]?.count || 0);

        // 1. Top 10 Tracks
        const topTracksRaw = db.query(`
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
        const topTracks = topTracksRaw.map((t: any) => ({ ...t, count: Number(t.count) }));

        // 2. Top 10 Artists
        const topArtistsRaw = db.query(`
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
        const topArtists = topArtistsRaw.map((t: any) => ({ ...t, count: Number(t.count) }));

        // 3. Top 10 Genres
        const topGenresRaw = db.query(`
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
        const topGenres = topGenresRaw.map((t: any) => ({ ...t, count: Number(t.count) }));

        // 4. Top 10 BPMs
        const topBPMsRaw = db.query(`
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
        const topBPMs = topBPMsRaw.map((t: any) => ({ ...t, count: Number(t.count) }));

        // 5. Most songs in a session
        const mostSongsSession = db.query(`
          SELECT h.ID, h.DateCreated, COUNT(sh.ID) as song_count
          FROM djmdHistory h
          JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
          WHERE h.DateCreated LIKE ?
          GROUP BY h.ID
          ORDER BY song_count DESC
          LIMIT 1
        `, [yearFilter]);

        let longestSessionDuration = 0;
        if (mostSongsSession.length > 0) {
             const historyId = mostSongsSession[0].ID;
             const durationResult = db.query(`
                SELECT SUM(c.Length) as total_duration
                FROM djmdSongHistory sh
                JOIN djmdContent c ON sh.ContentID = c.ID
                WHERE sh.HistoryID = ?
             `, [historyId]);
             longestSessionDuration = Number(durationResult[0]?.total_duration || 0);
        }

        // 6. Most active month by song count
        const mostActiveMonthSongs = db.query(`
          SELECT substr(h.DateCreated, 1, 7) as month, COUNT(sh.ID) as song_count
          FROM djmdHistory h
          JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
          WHERE h.DateCreated LIKE ?
          GROUP BY month
          ORDER BY song_count DESC
          LIMIT 1
        `, [yearFilter]);

        return {
          totalTracks,
          totalPlaytimeSeconds,
          totalSessions,
          libraryGrowth: {
            total: libraryTotal,
            added: libraryAdded
          },
          longestSession: {
            date: mostSongsSession[0]?.DateCreated || '',
            count: Number(mostSongsSession[0]?.song_count || 0),
            durationSeconds: longestSessionDuration
          },
          busiestMonth: {
            month: mostActiveMonthSongs[0]?.month || '',
            count: Number(mostActiveMonthSongs[0]?.song_count || 0)
          },
          topTracks,
          topArtists,
          topGenres,
          topBPMs
        };
      };

      // Get stats for the main year
      const mainStats = getYearStats(year);
      
      // Handle comparison if requested
      let comparisonData = undefined;
      const comparisonYear = body['comparisonYear'] as string;
      
      if (comparisonYear && comparisonYear !== year) {
        const compStats = getYearStats(comparisonYear);
        
        // Calculate diffs
        const calculateDiff = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return Math.round(((current - previous) / previous) * 100);
        };

        comparisonData = {
          year: comparisonYear,
          stats: compStats,
          diffs: {
            tracksPercentage: calculateDiff(mainStats.totalTracks, compStats.totalTracks),
            playtimePercentage: calculateDiff(mainStats.totalPlaytimeSeconds, compStats.totalPlaytimeSeconds),
            sessionPercentage: calculateDiff(mainStats.longestSession.count, compStats.longestSession.count),
            totalSessionsPercentage: calculateDiff(mainStats.totalSessions, compStats.totalSessions)
          }
        };
      }

      return c.json({
        year,
        stats: mainStats,
        comparison: comparisonData
      });

    } finally {
      if (db) {
        try { db.close(); } catch(e) { console.error(e); }
      }
      try { module.FS.unlink(dbPath); } catch(e) { console.error(e); }
    }

  } catch (e: unknown) {
    console.error(e);
    const error = e as Error;
    return c.json({ error: error.message, stack: error.stack }, 500);
  }
});

// Serve static assets
app.get('/*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
