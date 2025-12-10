import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { useFileUpload } from './useFileUpload';

describe('useFileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFileUpload());
    expect(result.current.file).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isUploading).toBe(false);
  });

  it('should accept a valid .db file', () => {
    const { result } = renderHook(() => useFileUpload());
    const file = new File(['dummy content'], 'master.db', { type: 'application/x-sqlite3' });

    act(() => {
      result.current.handleFileSelect(file);
    });

    expect(result.current.file).toBe(file);
    expect(result.current.error).toBeNull();
  });

  it('should reject a file with invalid extension', () => {
    const { result } = renderHook(() => useFileUpload());
    const file = new File(['dummy content'], 'master.txt', { type: 'text/plain' });

    act(() => {
      result.current.handleFileSelect(file);
    });

    expect(result.current.file).toBeNull();
    expect(result.current.error).toContain('Invalid file type');
  });

  it('should reject a file that is too large', () => {
    const { result } = renderHook(() => useFileUpload());
    // 101MB
    const size = 101 * 1024 * 1024;
    const file = {
      name: 'master.db',
      size: size,
    } as File;

    act(() => {
      result.current.handleFileSelect(file);
    });

    expect(result.current.file).toBeNull();
    expect(result.current.error).toContain('File size exceeds 100MB limit');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle successful upload', async () => {
    const { result } = renderHook(() => useFileUpload());
    const file = new File(['dummy content'], 'master.db', { type: 'application/x-sqlite3' });
    const mockResponse = { success: true };

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    act(() => {
      result.current.handleFileSelect(file);
    });

    await act(async () => {
      const data = await result.current.uploadFile('2023', undefined);
      expect(data).toEqual(mockResponse);
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/upload', expect.objectContaining({
      headers: {
        'X-File-Content-Encoding': 'gzip'
      }
    }));
  });

  it('should handle upload failure', async () => {
    const { result } = renderHook(() => useFileUpload());
    const file = new File(['dummy content'], 'master.db', { type: 'application/x-sqlite3' });

    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    act(() => {
      result.current.handleFileSelect(file);
    });

    await act(async () => {
      try {
        await result.current.uploadFile('2023', undefined);
      } catch {
        // Expected error
      }
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toContain('Failed to upload file');
    expect(console.error).toHaveBeenCalled();
  });
});

// Mock the compression module
vi.mock('@/client/lib/compression', () => ({
  compressFile: vi.fn().mockImplementation((file) => Promise.resolve(new Blob([file], { type: 'application/gzip' }))),
}));

