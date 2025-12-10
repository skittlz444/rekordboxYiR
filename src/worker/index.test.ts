/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define mocks using vi.hoisted to allow access in vi.mock
const mocks = vi.hoisted(() => {
  const mockFS = {
    writeFile: vi.fn(),
    unlink: vi.fn(),
  };

  const mockDb = {
    exec: vi.fn(),
    query: vi.fn(),
    close: vi.fn(),
  };

  return {
    mockFS,
    mockDb,
    mockModule: { FS: mockFS },
  };
});

// Mock the WASM binary
vi.mock('@7mind.io/sqlcipher-wasm/dist/sqlcipher.wasm', () => ({
  default: new ArrayBuffer(0),
}));

vi.mock('@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs', () => ({
  default: vi.fn().mockResolvedValue(mocks.mockModule),
}));

vi.mock('@7mind.io/sqlcipher-wasm', () => ({
  SQLiteAPI: vi.fn(function () {
    return {
      open: vi.fn().mockReturnValue(mocks.mockDb),
    };
  }),
}));

// Import app AFTER mocks are defined
import app from './index';

describe('Worker API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock sequence for single year stats (4 consolidated queries)

    // 1. Aggregation
    mocks.mockDb.query.mockReturnValueOnce([{
      totalTracks: 100,
      totalPlaytime: 3600,
      totalSessions: 50
    }]);

    // 2. Library Growth
    mocks.mockDb.query.mockReturnValueOnce([{
      libraryTotal: 500,
      libraryAdded: 100
    }]);

    // 3. Top Entities (Union)
    // Return a mix of types
    mocks.mockDb.query.mockReturnValueOnce([
      { type: 'track', name: 'Test Track', artist: 'Test Artist', count: 10 },
      { type: 'artist', name: 'Test Artist', artist: null, count: 20 },
      { type: 'genre', name: 'Test Genre', artist: null, count: 30 },
      { type: 'bpm', name: '120', artist: null, count: 40 }
    ]);

    // 4. Session Stats
    mocks.mockDb.query.mockReturnValueOnce([{
      maxSessionDate: '2024-01-01',
      maxSessionCount: 15,
      maxSessionDuration: 3600,
      busiestMonth: '2024-01',
      busiestMonthCount: 30
    }]);

    // Fallback for any subsequent calls (e.g., comparison year)
    // Returning empty array will result in 0 stats, which is valid for comparison baseline logic
    mocks.mockDb.query.mockReturnValue([]);
  });

  it('sanity check', () => {
    expect(true).toBe(true);
  });

  it('should handle file upload and return stats', async () => {
    const formData = new FormData();
    formData.append('file', new File(['dummy'], 'master.db'));
    formData.append('year', '2024');

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await app.request(req, undefined, {
      REKORDBOX_KEY: 'test-key',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ASSETS: { fetch: vi.fn() } as any
    });

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data).toHaveProperty('year', '2024');
    expect(data).toHaveProperty('stats');

    // content from mock 1
    expect(data.stats).toHaveProperty('totalTracks', 100);
    expect(data.stats).toHaveProperty('totalPlaytimeSeconds', 3600);
    expect(data.stats).toHaveProperty('totalSessions', 50);

    // content from mock 2
    expect(data.stats.libraryGrowth).toHaveProperty('total', 500);
    expect(data.stats.libraryGrowth).toHaveProperty('added', 100);

    // content from mock 3
    expect(data.stats.topTracks).toHaveLength(1);
    expect(data.stats.topTracks[0].Title).toBe('Test Track');

    expect(data.stats.topArtists).toHaveLength(1);
    expect(data.stats.topArtists[0].Name).toBe('Test Artist');

    // content from mock 4
    expect(data.stats.longestSession.count).toBe(15);
    expect(data.stats.busiestMonth.month).toBe('2024-01');

    // Verify DB interactions
    expect(mocks.mockDb.exec).toHaveBeenCalledWith(expect.stringContaining('PRAGMA key'));
    expect(mocks.mockDb.exec).toHaveBeenCalledWith(expect.stringContaining('PRAGMA synchronous = OFF'));
    expect(mocks.mockDb.exec).toHaveBeenCalledWith(expect.stringContaining('CREATE INDEX'));
    expect(mocks.mockFS.writeFile).toHaveBeenCalled();
    expect(mocks.mockFS.unlink).toHaveBeenCalled();
    expect(mocks.mockDb.close).toHaveBeenCalled();
  });

  it('should return 400 if no file is uploaded', async () => {
    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: new FormData(),
    });

    const res = await app.request(req, undefined, {
      REKORDBOX_KEY: 'test-key',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ASSETS: { fetch: vi.fn() } as any
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toHaveProperty('error', 'No file uploaded');
  });

  it('should handle comparison year', async () => {
    // Reset mocks to ensure we have enough responses for 2 runs (if needed)
    // The beforeEach setup provides 4 specific One-time returns and then infinite empty returns.
    // The first 4 satisfy the main year. The next 4 (for comparison) will get empty arrays.
    // This results in comparison stats being 0, which is fine for structure testing.

    const formData = new FormData();
    formData.append('file', new File(['dummy'], 'master.db'));
    formData.append('year', '2024');
    formData.append('comparisonYear', '2023');

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await app.request(req, undefined, {
      REKORDBOX_KEY: 'test-key',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ASSETS: { fetch: vi.fn() } as any
    });

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data).toHaveProperty('comparison');
    expect(data.comparison).toHaveProperty('year', '2023');
    expect(data.comparison).toHaveProperty('diffs');

    // Since comparison data is all 0s (from empty mock), diffing 100 vs 0 => 100%
    // Check one diff to ensure calculation ran
    expect(data.comparison.diffs.tracksPercentage).toBe(100);
  });
});
