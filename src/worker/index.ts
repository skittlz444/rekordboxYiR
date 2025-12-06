import { Hono } from 'hono';
import { cors } from 'hono/cors';
import initSqlcipher from '@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs';
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
    let db;
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
      
      // Run queries
      const yearFilter = `${year}%`;
      
      // Helper to add exclusion clause
      const excludeArtistClause = (field: string) => {
        if (includeUnknownArtist) return '';
        return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Artist'`;
      };

      const excludeGenreClause = (field: string) => {
        if (includeUnknownGenre) return '';
        return `AND ${field} IS NOT NULL AND ${field} != '' AND ${field} != 'Unknown Genre'`;
      };

      // 1. Top 10 Tracks
      const topTracks = db.query(`
        SELECT c.Title, a.Name as Artist, COUNT(*) as count
        FROM djmdSongHistory sh
        JOIN djmdHistory h ON sh.HistoryID = h.ID
        JOIN djmdContent c ON sh.ContentID = c.ID
        LEFT JOIN djmdArtist a ON c.ArtistID = a.ID
        WHERE h.DateCreated LIKE '${yearFilter}'
        AND c.Title IS NOT NULL AND c.Title != ''
        ${excludeArtistClause('a.Name')}
        GROUP BY c.ID
        ORDER BY count DESC
        LIMIT 10
      `);

      // 2. Top 10 Artists
      const topArtists = db.query(`
        SELECT a.Name, COUNT(*) as count
        FROM djmdSongHistory sh
        JOIN djmdHistory h ON sh.HistoryID = h.ID
        JOIN djmdContent c ON sh.ContentID = c.ID
        LEFT JOIN djmdArtist a ON c.ArtistID = a.ID
        WHERE h.DateCreated LIKE '${yearFilter}'
        ${excludeArtistClause('a.Name')}
        GROUP BY a.ID
        ORDER BY count DESC
        LIMIT 10
      `);

      // 3. Top 10 Genres
      const topGenres = db.query(`
        SELECT g.Name, COUNT(*) as count
        FROM djmdSongHistory sh
        JOIN djmdHistory h ON sh.HistoryID = h.ID
        JOIN djmdContent c ON sh.ContentID = c.ID
        LEFT JOIN djmdGenre g ON c.GenreID = g.ID
        WHERE h.DateCreated LIKE '${yearFilter}'
        ${excludeGenreClause('g.Name')}
        GROUP BY g.ID
        ORDER BY count DESC
        LIMIT 10
      `);

      // 4. Top 10 BPMs
      const topBPMs = db.query(`
        SELECT c.BPM, COUNT(*) as count
        FROM djmdSongHistory sh
        JOIN djmdHistory h ON sh.HistoryID = h.ID
        JOIN djmdContent c ON sh.ContentID = c.ID
        WHERE h.DateCreated LIKE '${yearFilter}'
        AND c.BPM != 0 AND c.BPM IS NOT NULL
        GROUP BY c.BPM
        ORDER BY count DESC
        LIMIT 10
      `);

      // 5. Most songs in a session
      const mostSongsSession = db.query(`
        SELECT h.DateCreated, COUNT(sh.ID) as song_count
        FROM djmdHistory h
        JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
        WHERE h.DateCreated LIKE '${yearFilter}'
        GROUP BY h.ID
        ORDER BY song_count DESC
        LIMIT 1
      `);

      // 6. Most active month by song count
      const mostActiveMonthSongs = db.query(`
        SELECT substr(h.DateCreated, 1, 7) as month, COUNT(sh.ID) as song_count
        FROM djmdHistory h
        JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
        WHERE h.DateCreated LIKE '${yearFilter}'
        GROUP BY month
        ORDER BY song_count DESC
        LIMIT 1
      `);

      // 7. Most active month by session count
      const mostActiveMonthSessions = db.query(`
        SELECT substr(h.DateCreated, 1, 7) as month, COUNT(h.ID) as session_count
        FROM djmdHistory h
        WHERE h.DateCreated LIKE '${yearFilter}'
        GROUP BY month
        ORDER BY session_count DESC
        LIMIT 1
      `);

      // 8. Average session length
      const avgSessionLength = db.query(`
        SELECT AVG(song_count) as avg_length
        FROM (
            SELECT COUNT(sh.ID) as song_count
            FROM djmdHistory h
            JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
            WHERE h.DateCreated LIKE '${yearFilter}'
            GROUP BY h.ID
        )
      `);

      return c.json({
        year,
        topTracks,
        topArtists,
        topGenres,
        topBPMs,
        mostSongsSession: mostSongsSession[0] || null,
        mostActiveMonthSongs: mostActiveMonthSongs[0] || null,
        mostActiveMonthSessions: mostActiveMonthSessions[0] || null,
        avgSessionLength: avgSessionLength[0]?.avg_length || 0
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
