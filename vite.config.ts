/// <reference types="vitest" />
import svgr from '@honkhonk/vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import optimisePersistPlugin from 'vite-plugin-optimize-persist';
import packageConfigPlugin from 'vite-plugin-package-config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react({
      exclude: [/\.(stories|spec|test)\.(t|j)sx?$/, /__tests__/]
    }),
    svgr(), // Also added to storybook
    packageConfigPlugin(), // Also added to storybook
    optimisePersistPlugin() // Also added to storybook
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    strictPort: true,
    port: 3030
  },
  build: {
    minify: true,
    sourcemap: true,
    // Don't allow small assets to be included as inline base64 URLs.
    // These are rejected by the site's CSP.
    assetsInlineLimit: 0
  },
  test: {
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e-tests'],
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['lcov']
    },
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    globals: true
  }
});
