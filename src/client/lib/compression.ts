
import { gzipSync } from 'fflate';

/**
 * Compresses a file using GZIP.
 * Returns a Blob with type 'application/gzip'.
 */
export async function compressFile(file: File): Promise<Blob> {
    const arrayBuffer = await new Response(file).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Use fflate's gzipSync for fast, synchronous compression on the main thread.
    // For very large files, this might block the UI slightly, but for <100MB it should be acceptable.
    // If UIBlocking becomes an issue, we can move this to a Worker.
    const compressed = gzipSync(uint8Array, {
        // Optional: level of compression (0-9), default is 6.
        // 9 is best compression but slowest. 6 is a good balance.
        level: 6,
        mtime: Date.now(),
    });

    return new Blob([compressed], { type: 'application/gzip' });
}
