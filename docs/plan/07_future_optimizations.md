# Future Optimization Opportunities

## Overview

This document captures optimization strategies that are not currently planned for implementation but may become viable or necessary in the future. These are documented for reference when revisiting performance constraints.

---

## Cloudflare Workers Paid Plan

**Pricing as of December 2025:**

| Tier | Base Cost | Requests | CPU Time | Max CPU/Invocation |
|------|-----------|----------|----------|-------------------|
| Free | $0/month | 100,000/day | 10ms/invocation | 10ms |
| Paid (Standard) | $5/month | 10M included (+$0.30/million) | 30M ms included (+$0.02/million ms) | 5 minutes |

### Key Benefits for This Project
- **30,000x more CPU headroom**: 5 minutes vs 10ms per invocation
- **Sufficient for large databases**: SQLCipher decryption + complex queries can complete
- **Cost-effective**: $5/month base covers most usage scenarios

### Important Limitation
- **Memory Limit stays at 128MB**: The paid plan does **NOT** increase the 128MB RAM limit per worker. It only increases CPU time.
- Therefore, the Paid Plan solves *CPU timeout* issues but does *not* solve *Out of Memory (OOM)* crashes if you try to load a >100MB file into memory at once.

### When to Consider
- If free tier optimizations are insufficient for typical user database sizes
- If user feedback indicates frequent timeouts
- If processing time consistently approaches 10ms limit after optimizations

### Migration Path
1. Upgrade Cloudflare account to Workers Paid plan
2. Update `wrangler.toml` with CPU limit configuration:
   ```toml
   [limits]
   cpu_ms = 30000  # 30 seconds, adjust as needed
   ```
3. Monitor usage via Cloudflare dashboard
4. Adjust limits based on actual processing times

---

## Streaming Decryption Investigation

### Current Limitation
SQLCipher uses page-based encryption where each 4KB page is independently encrypted. However, the current `@7mind.io/sqlcipher-wasm` implementation requires the entire database file to be loaded into the Emscripten virtual filesystem before decryption can begin.

### Why Streaming Isn't Currently Possible
1. **SQLCipher architecture**: While pages are independently encrypted, the library needs random access to pages for query execution
2. **WASM filesystem**: Emscripten FS expects complete files
3. **No streaming API**: Current WASM bindings don't expose incremental decryption

### Future Investigation Areas
- Monitor `@7mind.io/sqlcipher-wasm` releases for streaming support
- Investigate alternative SQLCipher WASM implementations
- Consider custom SQLCipher WASM build with streaming capability
- Explore whether specific queries can work with partial database (likely not feasible)

### Potential Approach (Theoretical)
If a streaming-capable SQLCipher becomes available:
1. Stream chunks from client to worker
2. Decrypt pages as they arrive
3. Execute queries against partial data where possible
4. Return early results for "top N" queries

**Status**: Not actionable with current tooling. Revisit if SQLCipher WASM ecosystem evolves.

---

## Memory Optimization via Chunked VFS Writing

### Current Behavior
```typescript
const buffer = await file.arrayBuffer();     // ~100MB in memory
const u8 = new Uint8Array(buffer);           // ~100MB copy
module.FS.writeFile(dbPath, u8);             // ~100MB in VFS
// Peak memory: ~300MB for 100MB file
```

### Cloudflare Worker Memory Limit
- **128MB** per Worker instance
- Current implementation exceeds this for files >~40MB

### Potential Optimization
Investigate whether Emscripten FS supports chunked/streaming writes:

```typescript
// Theoretical approach (needs validation)
const stream = module.FS.open(dbPath, 'w');
const reader = file.stream().getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  module.FS.write(stream, value, 0, value.length);
}
module.FS.close(stream);
```

### Investigation Required
- [ ] Test if `FS.write()` works with encrypted SQLite files
- [ ] Verify SQLCipher can open incrementally-written files
- [ ] Measure actual memory reduction
- [ ] Test with various file sizes

**Status**: Requires investigation and testing. May reduce memory but won't solve CPU time limit.

---

## R2 Temporary Storage Architecture

### Concept
Use Cloudflare R2 (object storage) to temporarily store the uploaded file, then process it asynchronously with a Durable Object or Queue worker that has longer execution time.

### Architecture
```
Client → Worker (immediate) → R2 (store file) → Return job ID
                                    ↓
                            Queue/Cron Worker → Process → Store results
                                    ↓
Client (polling) ← Worker ← Retrieve results ← KV/D1
```

### Benefits
- Eliminates 128MB memory constraint (R2 handles large files)
- Longer processing time via Queues (15 minutes max)
- Can handle arbitrarily large databases

### Drawbacks
- **Does not solve CPU time limit** (still 10ms on free tier for Workers)
- Adds complexity (multiple services, job tracking)
- Requires temporary data storage (privacy consideration)
- Increased latency (async processing)
- Additional cost (R2 storage, Queue operations)

### Privacy Mitigation
If implemented:
1. Generate unique, unguessable job ID (UUID v4)
2. Set R2 object lifecycle policy for auto-deletion (e.g., 5 minutes)
3. Delete file immediately after processing
4. Never store results persistently - return directly to client

### Cost Estimate (Cloudflare R2)
- Storage: $0.015/GB-month
- Class A operations (write): $4.50/million
- Class B operations (read): $0.36/million
- Temporary 100MB file for 5 minutes: negligible cost

**Status**: Documented for future consideration. Does not solve the primary CPU time constraint on free tier.

---

## Query-Level Optimizations (Beyond Consolidation)

### Database Indexes
If we could modify the database schema (we can't - it's Rekordbox's), these indexes would help:
- `djmdHistory(DateCreated)` - Year filtering
- `djmdSongHistory(HistoryID, ContentID)` - Join optimization
- `djmdContent(ArtistID, GenreID)` - Entity lookups

### Virtual Tables
SQLite FTS5 for text search could optimize artist/genre name filtering, but requires schema modification.

### Materialized Views
Pre-computed aggregates would dramatically speed up queries, but requires persistent storage and schema access.

**Status**: Not actionable - Rekordbox database schema is fixed.

---

## Client-Side WebAssembly Processing

### Concept
Ship SQLCipher WASM to the client and perform all processing client-side, eliminating Worker constraints entirely.

### Critical Blocker
**The Rekordbox decryption key cannot be exposed to the client.**

This is a fundamental security requirement. The key allows decryption of any Rekordbox database, and exposing it would compromise all users' data.

### Alternative: User-Provided Key
Theoretically, users could provide their own decryption key:
1. User extracts key from their Rekordbox installation
2. Key is used client-side only, never sent to server
3. All processing happens in browser

**Status**: Rejected. Requiring users to extract encryption keys is not acceptable for UX and security reasons.

---

## Summary Matrix

| Optimization | Solves CPU Limit | Solves Memory Limit | Complexity | Privacy Impact | Status |
|--------------|------------------|---------------------|------------|----------------|--------|
| Paid Plan | ✅ | ❌ | Low | None | Consider if needed |
| Streaming Decrypt | ✅ (partial) | ✅ | High | None | Not feasible yet |
| Chunked VFS | ❌ | ✅ (maybe) | Medium | None | Needs investigation |
| R2 + Queue | ❌ (free tier) | ✅ | High | Temporary storage | Future option |
| Client WASM | ✅ | ✅ | Medium | Key exposure ⚠️ | Rejected |

---

## Recommended Next Steps

1. **Implement Phase 6 optimizations** (compression, query consolidation, error handling)
2. **Measure impact** on real-world database files of various sizes
3. **If still insufficient**: Consider Cloudflare Workers Paid plan ($5/month)
4. **If paid plan insufficient**: Investigate R2 + Queue architecture
5. **Monitor ecosystem**: Watch for SQLCipher WASM streaming support
