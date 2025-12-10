import { Hono } from 'hono';
import { cors } from 'hono/cors';
// @ts-expect-error - missing types
import initSqlcipher from '@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs';
// @ts-expect-error - missing types
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

    if (!(file instanceof File)) {
      return c.json({
        success: false,
        error: {
          code: 'NO_FILE_PROVIDED',
          message: 'No valid file was uploaded. Please select a file and try again.'
        }
      }, 400);
    }

    // Performance logging
    console.time('Total Processing');

    const buffer = await file.arrayBuffer();
    let u8 = new Uint8Array(buffer);

    // Check for compression
    const encoding = c.req.header('X-File-Content-Encoding');
    try {
      if (encoding === 'gzip') {
        console.time('Decompression');
        console.log('Decompressing gzip payload...');
        const ds = new DecompressionStream('gzip');
        const compressedStream = new Blob([u8]).stream();
        const decompressedStream = compressedStream.pipeThrough(ds);
        const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();
        u8 = new Uint8Array(decompressedBuffer);
        console.log(`Decompressed size: ${u8.length} bytes`);
        console.timeEnd('Decompression');
      }
    } catch (e) {
      console.error('Decompression failed:', e);
      return c.json({
        success: false,
        error: {
          code: 'DECOMPRESSION_FAILED',
          message: 'Failed to decompress the uploaded file. Please try again.'
        }
      }, 400);
    }

    // Initialize SQLCipher
    const module = await initSqlcipher({
      instantiateWasm: function (imports: WebAssembly.Imports, successCallback: (instance: WebAssembly.Instance) => void) {
        WebAssembly.instantiate(wasmBinary, imports).then(function (instance) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let db: any;
    try {
      console.time('DB Open & Key');
      // Open without key first
      db = sqlite.open(dbPath);

      // Manually set key to handle raw hex format correctly
      const key = c.env.REKORDBOX_KEY;
      if (!key) {
        throw new Error('REKORDBOX_KEY is not defined in environment variables');
      }

      // Try using the key as a passphrase (standard SQLCipher behavior)
      db.exec(`PRAGMA key = '${key}'`);

      // Try SQLCipher 4 defaults first
      db.exec('PRAGMA cipher_page_size = 4096');
      db.exec('PRAGMA kdf_iter = 256000');
      db.exec('PRAGMA cipher_hmac_algorithm = HMAC_SHA512');
      db.exec('PRAGMA cipher_kdf_algorithm = PBKDF2_HMAC_SHA512');
      db.exec('PRAGMA cipher_plaintext_header_size = 0');

      // Verify decryption by attempting a simple read
      try {
        db.exec('SELECT count(*) FROM sqlite_master');
      } catch (e) {
        console.error('Decryption verification failed:', e);
        // If simple read fails, it's likely a decryption or DB format issue
        // Distinguish if possible, but mostly it's decryption with wrong key or params
        throw new Error('DECRYPTION_FAILED_SIGNAL');
      }
      console.timeEnd('DB Open & Key');

      console.time('Query Execution');
      console.log(`Opening DB with key length: ${key.length}, File size: ${u8.length}`);

      // Optimizations for ephemeral read-mostly usage
      db.exec('PRAGMA synchronous = OFF');
      db.exec('PRAGMA journal_mode = MEMORY');

      // NOTE: Removed CREATE INDEX statements - benchmarking showed they add ~176ms overhead
      // without improving query performance (the database already has suitable indexes)


      // Helper to add exclusion clause for unknown artists
      const getExcludeArtistClause = (field: string) => {
        return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Artist'`;
      };

      // Helper to add exclusion clause for unknown genres
      const getExcludeGenreClause = (field: string) => {
        return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Genre'`;
      };

      const getYearStats = (targetYear: string) => {
        const yearFilter = `${targetYear}%`;
        const excludeArtistClause = (field: string) => getExcludeArtistClause(field);
        const excludeGenreClause = (field: string) => getExcludeGenreClause(field);

        // 1. Consolidated Aggregation Query (Tracks, Playtime, Sessions)
        const aggResult = db.query(`
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
        const totalPlaytimeSeconds = Number(aggResult[0]?.totalPlaytime || 0);
        const totalSessions = Number(aggResult[0]?.totalSessions || 0);

        // 2. Library Growth Query
        const nextYear = (parseInt(targetYear) + 1).toString();
        const growthResult = db.query(`
          SELECT
            (SELECT COUNT(*) FROM djmdContent WHERE DateCreated < ?) as libraryTotal,
            (SELECT COUNT(*) FROM djmdContent WHERE DateCreated LIKE ?) as libraryAdded
        `, [nextYear, yearFilter]);

        const libraryTotal = Number(growthResult[0]?.libraryTotal || 0);
        const libraryAdded = Number(growthResult[0]?.libraryAdded || 0);

        // 3. Consolidated Top Entities (Tracks, Artists, Genres, BPMs)
        const topEntitiesResult = db.query(`
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const topTracks: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const topArtists: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const topGenres: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const topBPMs: any[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        topEntitiesResult.forEach((row: any) => {
          const count = Number(row.count);
          if (row.type === 'track') {
            topTracks.push({ Title: row.name, Artist: row.artist, count });
          } else if (row.type === 'artist') {
            topArtists.push({ Name: row.name, count });
          } else if (row.type === 'genre') {
            topGenres.push({ Name: row.name, count });
          } else if (row.type === 'bpm') {
            topBPMs.push({ BPM: Number(row.name), count });
          }
        });

        // 4. Session Stats Query
        const sessionStatsResult = db.query(`
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

        return {
          totalTracks,
          totalPlaytimeSeconds,
          totalSessions,
          libraryGrowth: {
            total: libraryTotal,
            added: libraryAdded
          },
          longestSession: {
            date: sessionStats.maxSessionDate || '',
            count: Number(sessionStats.maxSessionCount || 0),
            durationSeconds: Number(sessionStats.maxSessionDuration || 0)
          },
          busiestMonth: {
            month: sessionStats.busiestMonth || '',
            count: Number(sessionStats.busiestMonthCount || 0)
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

      console.timeEnd('Query Execution');
      console.timeEnd('Total Processing');

      return c.json({
        success: true,
        year,
        stats: mainStats,
        comparison: comparisonData
      });

    } catch (dbError: unknown) {
      console.error('Database operation failed:', dbError);

      const err = dbError as Error;
      let errorCode = 'UNKNOWN_ERROR';
      let errorMessage = 'An unexpected error occurred while processing the database.';

      if (err.message === 'DECRYPTION_FAILED_SIGNAL' || err.message?.includes('file is not a database') || err.message?.includes('encrypted') || err.message?.includes('image is malformed')) {
        errorCode = 'DECRYPTION_FAILED';
        errorMessage = 'Failed to decrypt the database. This usually means the Rekordbox version is incompatible or the database key is incorrect.';
      } else if (err.message?.includes('no such table')) {
        errorCode = 'INVALID_DATABASE';
        errorMessage = 'The database file does not contain the expected tables. Please ensure you uploaded a valid Rekordbox master.db file.';
      } else if (err.message?.includes('SQL logic error')) {
        errorCode = 'QUERY_FAILED';
        errorMessage = 'Failed to execute analysis queries. The database might be corrupted.';
      }

      return c.json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      }, 400);

    } finally {
      if (db) {
        try { db.close(); } catch (e) { console.error(e); }
      }
      try { module.FS.unlink(dbPath); } catch (e) { console.error(e); }
    }

  } catch (e: unknown) {
    console.error('Unhandled worker error:', e);
    const error = e as Error;
    return c.json({
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected server error occurred.'
      }
    }, 500);
  }
});

// Serve static assets
app.get('/*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
