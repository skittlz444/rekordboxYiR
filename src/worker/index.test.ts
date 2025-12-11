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
  SQLiteAPI: vi.fn(function() {
    return {
      open: vi.fn().mockReturnValue(mocks.mockDb),
    };
  }),
}));

// Import app AFTER mocks are defined
import app from './index';

// Mock row that satisfies all queries
const mockRow = {
  count: 100,
  total_seconds: 3600,
  Title: 'Test Track',
  Artist: 'Test Artist',
  Name: 'Test Genre',
  BPM: 120,
  song_count: 10,
  ID: '1',
  DateCreated: '2024-01-01',
  total_duration: 3600,
  month: '2024-01'
};

describe('Worker API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock return for queries
    mocks.mockDb.query.mockReturnValue([mockRow]);
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
    expect(data.stats).toHaveProperty('totalTracks', 100);
    expect(data.stats).toHaveProperty('totalPlaytimeSeconds', 3600);
    expect(data.stats.topTracks).toHaveLength(1);
    expect(data.stats.topTracks[0].Title).toBe('Test Track');
    
    // Verify DB interactions
    expect(mocks.mockDb.exec).toHaveBeenCalledWith(expect.stringContaining('PRAGMA key'));
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
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('code', 'NO_FILE_PROVIDED');
      expect(data.error).toHaveProperty('message');
  });

  it('should return 413 if file exceeds MAX_FILE_SIZE_BYTES', async () => {
    // Create a file with actual large content to exceed 100MB
    const largeFileSize = 101 * 1024 * 1024; // 101MB
    const largeBuffer = new Uint8Array(largeFileSize);
    
    const formData = new FormData();
    const largeFile = new File([largeBuffer], 'master.db');
    formData.append('file', largeFile);
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

    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error');
    expect(data.error).toHaveProperty('code', 'FILE_TOO_LARGE');
    expect(data.error).toHaveProperty('message');
    expect(data.error.message).toContain('100MB limit');
    expect(data.error.message).toContain('@dj_skittlz');
    expect(data.error.message).toContain('Instagram');
  });

  it('should handle comparison year', async () => {
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
  });
});
