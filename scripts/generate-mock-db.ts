import fs from 'node:fs';
import path from 'node:path';
import initSqlcipher from '@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs';
import { SQLiteAPI } from '@7mind.io/sqlcipher-wasm';

const OUTPUT_PATH = path.resolve('mock-master.db');
const DB_PATH = '/mock.db'; // VFS path
const WASM_PATH = path.resolve('node_modules/@7mind.io/sqlcipher-wasm/dist/sqlcipher.wasm');
const KEY = 'test-key';

async function main() {
  console.log(`Generating mock database to ${OUTPUT_PATH}...`);

  const wasmBuffer = fs.readFileSync(WASM_PATH);

  const module = await initSqlcipher({
    instantiateWasm: async (imports, successCallback) => {
      const instance = await WebAssembly.instantiate(wasmBuffer, imports);
      successCallback(instance.instance);
      return instance;
    }
  });

  const sqlite = new SQLiteAPI(module);

  // Clean up existing on disk
  if (fs.existsSync(OUTPUT_PATH)) {
    fs.unlinkSync(OUTPUT_PATH);
  }

  // Create DB in VFS
  const db = sqlite.open(DB_PATH);

  db.exec(`PRAGMA key = '${KEY}'`);
  db.exec('PRAGMA cipher_page_size = 4096');
  db.exec('PRAGMA kdf_iter = 256000');
  db.exec('PRAGMA cipher_hmac_algorithm = HMAC_SHA512');
  db.exec('PRAGMA cipher_kdf_algorithm = PBKDF2_HMAC_SHA512');

  // Create Tables
  db.exec(`
    CREATE TABLE djmdContent (
      ID TEXT PRIMARY KEY,
      Title TEXT,
      ArtistID TEXT,
      GenreID TEXT,
      BPM INTEGER,
      DateCreated TEXT,
      Length INTEGER
    );
    CREATE TABLE djmdArtist (
      ID TEXT PRIMARY KEY,
      Name TEXT
    );
    CREATE TABLE djmdGenre (
      ID TEXT PRIMARY KEY,
      Name TEXT
    );
    CREATE TABLE djmdHistory (
      ID TEXT PRIMARY KEY,
      DateCreated TEXT
    );
    CREATE TABLE djmdSongHistory (
      ID TEXT PRIMARY KEY,
      HistoryID TEXT,
      ContentID TEXT
    );
  `);

  console.log('Tables created. Inserting data...');

  db.exec('BEGIN TRANSACTION');

  // Insert Arrays
  const artists: string[] = [];
  const genres: string[] = [];
  const contentIds: string[] = [];

  // 1. Generate Artists (~100)
  // 1. Generate Artists (~100)
  for (let i = 0; i < 100; i++) {
    const id = `artist-${i}`;
    artists.push(id);
    db.query('INSERT INTO djmdArtist (ID, Name) VALUES (?, ?)', [id, `Artist ${i}`]);
  }

  // 2. Generate Genres (~20)
  for (let i = 0; i < 20; i++) {
    const id = `genre-${i}`;
    genres.push(id);
    db.query('INSERT INTO djmdGenre (ID, Name) VALUES (?, ?)', [id, `Genre ${i}`]);
  }

  // 3. Generate Tracks (~6000)
  for (let i = 0; i < 6000; i++) {
    const id = `content-${i}`;
    contentIds.push(id);
    const artistId = artists[Math.floor(Math.random() * artists.length)];
    const genreId = genres[Math.floor(Math.random() * genres.length)];
    const bpm = 120 + Math.floor(Math.random() * 30); // 120-150
    const length = 180 + Math.floor(Math.random() * 120); // 3m - 5m
    const year = 2023 + Math.floor(Math.random() * 2); // 2023, 2024
    const dateCreated = `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`;

    db.query(`INSERT INTO djmdContent (ID, Title, ArtistID, GenreID, BPM, DateCreated, Length) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, `Track ${i}`, artistId, genreId, bpm, dateCreated, length]);
  }

  // 4. Generate Sessions
  const TARGET_YEAR = '2024';
  let historyIdCounter = 0;
  let songHistoryIdCounter = 0;

  for (let i = 0; i < 200; i++) {
    const historyId = `history-${historyIdCounter++}`;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const dateCreated = `${TARGET_YEAR}-${month}-${day} 20:00:00`;

    db.query('INSERT INTO djmdHistory (ID, DateCreated) VALUES (?, ?)', [historyId, dateCreated]);

    const numSongs = 20 + Math.floor(Math.random() * 20); // 20-40 songs (avg 30)
    for (let j = 0; j < numSongs; j++) {
      const songHistoryId = `sh-${songHistoryIdCounter++}`;
      const contentId = contentIds[Math.floor(Math.random() * contentIds.length)];

      db.query('INSERT INTO djmdSongHistory (ID, HistoryID, ContentID) VALUES (?, ?, ?)',
        [songHistoryId, historyId, contentId]);
    }
  }

  db.exec('COMMIT');
  db.close();

  // Write VFS to Disk
  const data = module.FS.readFile(DB_PATH);
  fs.writeFileSync(OUTPUT_PATH, data);

  console.log(`Mock DB generated at ${OUTPUT_PATH} with 6000 tracks and 200 sessions.`);
}

main().catch(console.error);
