/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-dropzone', 'file-selector', 'tslib'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@7mind.io/sqlcipher-wasm/dist/sqlcipher.wasm": path.resolve(__dirname, "./src/worker/test/mocks/empty.ts"),
      "@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs": path.resolve(__dirname, "./src/worker/test/mocks/empty.ts"),
    },
  },
  root: '.',
  build: {
    outDir: 'public',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  publicDir: false,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/client/test/setup.ts',
    reporters: [
      'default',
      ['junit', { outputFile: 'test-results/unit/junit.xml' }]
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportOnFailure: true,
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
})
