/**
 * Shared constants between client and worker
 */

/**
 * Maximum file size in MB (Cloudflare upload limitation)
 */
export const MAX_FILE_SIZE_MB = 100;

/**
 * Maximum file size in bytes
 */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Error message for files exceeding the size limit
 */
export const getFileSizeLimitErrorMessage = (fileSizeMB: string) => 
  `Sorry! Your file (${fileSizeMB}MB) exceeds the ${MAX_FILE_SIZE_MB}MB limit due to Cloudflare restrictions. If you'd like a Year in Review created, please reach out to @dj_skittlz on Instagram for manual processing.`;
