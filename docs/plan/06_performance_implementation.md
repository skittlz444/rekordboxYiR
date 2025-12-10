# Performance Optimization Implementation Plan

## Overview

This phase focuses on optimizing the Cloudflare Worker to handle larger `master.db` files more efficiently within platform constraints. The optimizations target three main areas: reducing upload size via compression, reducing CPU time via query consolidation, and improving user experience via better error handling.

### Cloudflare Free Tier Constraints
- **Upload Size**: 100MB max request body
- **CPU Time**: 10ms per invocation
- **Memory**: 128MB per Worker instance

---

## Phase 6: Performance Optimizations

### Task 6.1: Client-Side Compression

Implement gzip compression on the client before uploading to reduce transfer size and effectively extend the 100MB upload limit.

#### Sub-tasks

- [x] **Task 6.1.1: Install compression library**
    - Install `fflate` package (lightweight, ~8KB gzipped, fast compression)
    - Command: `npm install fflate`
    - Add to `package.json` dependencies

- [x] **Task 6.1.2: Create compression utility**
    - Create `src/client/lib/compression.ts`
    - Implement `compressFile(file: File): Promise<Blob>` function using `fflate.gzipSync()`
    - Export utility for use in upload flow
    - Example pattern:
      ```typescript
      import { gzipSync } from 'fflate';
      
      export async function compressFile(file: File): Promise<Blob> {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const compressed = gzipSync(uint8Array);
        return new Blob([compressed], { type: 'application/gzip' });
      }
      ```

- [x] **Task 6.1.3: Update upload hook**
    - Modify `src/client/features/upload/hooks/useUpload.ts`
    - Compress file using `fflate`
    - **Important**: Do NOT use `Content-Encoding: gzip` on the main request, as it applies to the entire multipart body.
    - Instead, add a custom header: `X-File-Content-Encoding: gzip`
    - Update loading state to show "Compressing..." then "Uploading..."

- [x] **Task 6.1.4: Update Worker to decompress**
    - Modify `src/worker/index.ts`
    - Check for `X-File-Content-Encoding: gzip` header
    - Decompress using native `DecompressionStream` API with piping to minimize peak memory:
      ```typescript
      // Use stream() to avoid loading compressed blob entirely into a separate buffer if possible
      const decompressedStream = compressedFile.stream().pipeThrough(
        new DecompressionStream('gzip')
      );
      // Note: This still loads the result into memory, but avoids some intermediate copies
      const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();
      ```
    - Fall back to uncompressed handling if header not present

- [x] **Task 6.1.5: Add compression tests**
    - Add unit tests in `src/client/lib/compression.test.ts`
    - Test compression/decompression round-trip
    - Test handling of various file sizes
    - Update `src/worker/index.test.ts` with compressed payload tests

---

### Task 6.2: SQL Query Consolidation

Reduce CPU time by consolidating multiple SQL queries into fewer, optimized queries using CTEs (Common Table Expressions) and UNION ALL patterns.

#### Current State
- ~11 separate queries per year (22+ with comparison year)
- Each query has parsing and execution overhead
- Queries: total tracks, total playtime, total sessions, library total, library added, top tracks, top artists, top genres, top BPMs, most songs in session, longest session, busiest month

#### Target State
- 4-6 consolidated queries per year
- Reduced query parsing overhead
- Single-pass table scans where possible

#### Sub-tasks

- [ ] **Task 6.2.1: Consolidate aggregation queries**
    - Combine into single query with subqueries:
        - Total tracks count
        - Total playtime sum
        - Total sessions count
    - Pattern:
      ```sql
      SELECT
        (SELECT COUNT(*) FROM djmdSongHistory sh 
         JOIN djmdHistory h ON sh.HistoryID = h.ID 
         WHERE strftime('%Y', h.DateCreated) = ?) as totalTracks,
        (SELECT SUM(c.Length) FROM djmdSongHistory sh 
         JOIN djmdHistory h ON sh.HistoryID = h.ID
         JOIN djmdContent c ON sh.ContentID = c.ID
         WHERE strftime('%Y', h.DateCreated) = ?) as totalPlaytime,
        (SELECT COUNT(DISTINCT h.ID) FROM djmdHistory h 
         WHERE strftime('%Y', h.DateCreated) = ?) as totalSessions
      ```

- [ ] **Task 6.2.2: Consolidate library growth queries**
    - Merge library total and library added counts:
      ```sql
      SELECT
        (SELECT COUNT(*) FROM djmdContent WHERE ...) as libraryTotal,
        (SELECT COUNT(*) FROM djmdContent WHERE strftime('%Y', DateCreated) = ?) as libraryAdded
      ```

- [ ] **Task 6.2.3: Consolidate top entities queries**
    - Combine top tracks, artists, genres, BPMs using UNION ALL with type discriminator:
      ```sql
      WITH plays AS (
        SELECT sh.ContentID, c.ArtistID, c.GenreID, c.BPM
        FROM djmdSongHistory sh
        JOIN djmdHistory h ON sh.HistoryID = h.ID
        JOIN djmdContent c ON sh.ContentID = c.ID
        WHERE strftime('%Y', h.DateCreated) = ?
      )
      SELECT 'track' as type, c.Name, a.Name as artist, COUNT(*) as count
      FROM plays p JOIN djmdContent c ON p.ContentID = c.ID 
      JOIN djmdArtist a ON c.ArtistID = a.ID
      GROUP BY p.ContentID ORDER BY count DESC LIMIT 10
      UNION ALL
      SELECT 'artist' as type, a.Name, NULL, COUNT(*)
      FROM plays p JOIN djmdArtist a ON p.ArtistID = a.ID
      GROUP BY p.ArtistID ORDER BY count DESC LIMIT 10
      -- ... etc for genres and BPMs
      ```

- [ ] **Task 6.2.4: Consolidate session stats queries**
    - Combine most songs in session, longest session, busiest month:
      ```sql
      WITH session_stats AS (
        SELECT h.ID, h.DateCreated, COUNT(sh.ID) as song_count,
               SUM(c.Length) as duration
        FROM djmdHistory h
        JOIN djmdSongHistory sh ON h.ID = sh.HistoryID
        JOIN djmdContent c ON sh.ContentID = c.ID
        WHERE strftime('%Y', h.DateCreated) = ?
        GROUP BY h.ID
      )
      SELECT 
        (SELECT song_count FROM session_stats ORDER BY song_count DESC LIMIT 1) as mostSongs,
        -- ... etc
      ```

- [ ] **Task 6.2.5: Refactor worker query execution**
    - Update `src/worker/index.ts` to use consolidated queries
    - Create helper functions for each consolidated query
    - Parse combined results into existing response structure
    - Ensure backward compatibility with `StatsResponse` type in `src/shared/types.d.ts`

- [ ] **Task 6.2.6: Update query tests**
    - Update `src/worker/index.test.ts` with new query patterns
    - Ensure all existing test assertions still pass
    - Add performance timing assertions if feasible

---

### Task 6.3: Graceful Error Handling

Improve error messages and handling for failures that can be caught (note: Worker CPU timeout cannot be caught and returns nothing).

#### Sub-tasks

- [ ] **Task 6.3.1: Define error types**
    - Create error type enumeration in `src/shared/types.d.ts`:
      ```typescript
      type WorkerErrorCode = 
        | 'DECRYPTION_FAILED'
        | 'INVALID_DATABASE'
        | 'QUERY_FAILED'
        | 'DECOMPRESSION_FAILED'
        | 'UNKNOWN_ERROR';
      
      interface WorkerErrorResponse {
        success: false;
        error: {
          code: WorkerErrorCode;
          message: string;
        };
      }
      ```

- [ ] **Task 6.3.2: Implement error handling in Worker**
    - Update `src/worker/index.ts` with specific try/catch blocks
    - Catch and classify errors:
        - SQLCipher decryption errors → `DECRYPTION_FAILED`
        - Invalid/corrupt DB structure → `INVALID_DATABASE`
        - Query execution errors → `QUERY_FAILED`
        - Gzip decompression errors → `DECOMPRESSION_FAILED`
    - Return structured `WorkerErrorResponse` with user-friendly messages

- [ ] **Task 6.3.3: Add processing duration logging**
    - Add `console.time()` / `console.timeEnd()` around key operations
    - Log: decompression time, decryption time, query time, total time
    - Use Cloudflare's `ctx.waitUntil()` for async logging if needed

- [ ] **Task 6.3.4: Update client error display**
    - Update `src/client/features/upload/UploadContainer.tsx` to handle `WorkerErrorResponse`
    - Display user-friendly error messages based on error code
    - Provide actionable guidance where possible (e.g., "Database may be corrupted or from an unsupported Rekordbox version")

- [ ] **Task 6.3.5: Add error handling tests**
    - Add tests for each error type in `src/worker/index.test.ts`
    - Test malformed gzip data
    - Test invalid SQLite file
    - Test wrong encryption key scenario (simulated)

---

## Acceptance Criteria

### Task 6.1 Complete When:
- [x] Files compress before upload without user interaction
- [x] Worker correctly decompresses gzip payloads
- [x] Uncompressed uploads still work (backward compatibility)
- [x] Compression achieves ~60%+ size reduction on test `.db` files
- [x] All existing tests pass

### Task 6.2 Complete When:
- [ ] Query count reduced from ~11 to ~4-6 per year
- [ ] Response data structure unchanged (`StatsResponse` compatible)
- [ ] All existing tests pass with refactored queries
- [ ] No regression in data accuracy

### Task 6.3 Complete When:
- [ ] All catchable errors return structured `WorkerErrorResponse`
- [ ] Client displays appropriate error messages
- [ ] Processing duration is logged
- [ ] Error handling tests pass

---

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `fflate` dependency |
| `src/client/lib/compression.ts` | New file - compression utility |
| `src/client/lib/compression.test.ts` | New file - compression tests |
| `src/client/features/upload/hooks/useUpload.ts` | Add compression before upload |
| `src/client/features/upload/UploadContainer.tsx` | Update error display, loading states |
| `src/worker/index.ts` | Decompression, query consolidation, error handling |
| `src/worker/index.test.ts` | Update tests for all changes |
| `src/shared/types.d.ts` | Add `WorkerErrorCode`, `WorkerErrorResponse` types |

---

## Dependencies

- `fflate` ^0.8.x - Client-side gzip compression
- Native `DecompressionStream` API - Worker-side decompression (no package needed)
