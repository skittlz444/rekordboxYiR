/**
 * @vitest-environment node
 */
// import { describe, it, expect, vi, beforeEach } from 'vitest';

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

    // Smart mock implementation based on year
    mocks.mockDb.query.mockImplementation((_sql, params) => {
      const paramYear = params?.[0]; // e.g., '2024%'

      // If it's the comparison year (2023), return empty
      if (paramYear === '2023%') {
        return [];
      }

      // Otherwise (2024), return valid mock data
      // Return an array that satisfies all queries (superset of fields) or logic to differentiate.
      // Since the code simply plucks fields from the first row or loops over rows, 
      // a single array with all fields can work for Aggregation, Library, Session.
      // For Top Entities, we need specific rows.

      // But wait, getYearStats calls 4 DIFFERENT queries.
      // If we return the SAME array for all 4 queries, it must be compatible with ALL 4.

      return [
        {
          // Aggregation
          totalTracks: 100,
          totalPlaytime: 3600,
          totalSessions: 50,

          // Library
          libraryTotal: 500,
          libraryAdded: 100,

          // Session
          maxSessionDate: '2024-01-01',
          maxSessionCount: 15,
          maxSessionDuration: 3600,
          busiestMonth: '2024-01',
          busiestMonthCount: 30,

          // Top Entities (First row)
          type: 'track',
          name: 'Test Track',
          artist: 'Test Artist',
          count: 10
        },
        // Additional Top Entities rows
        { type: 'artist', name: 'Test Artist', count: 20 },
        { type: 'genre', name: 'Test Genre', count: 30 },
        { type: 'bpm', name: '120', count: 40, BPM: 120 }
      ];
    });
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
    // console.log("Debug Data:", JSON.stringify(data, null, 2));
    expect(data.comparison.diffs.tracksPercentage).toBe(100);
  });
});
