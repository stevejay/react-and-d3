/// <reference types="vitest" />
import svgr from '@honkhonk/vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import optimisePersistPlugin from 'vite-plugin-optimize-persist';
import packageConfigPlugin from 'vite-plugin-package-config';

export default defineConfig({
  plugins: [
    react({
      exclude: [/\.(stories|spec|test)\.(t|j)sx?$/, /__tests__/]
    }),
    svgr(), // Also added to storybook
    packageConfigPlugin(), // Also added to storybook
    optimisePersistPlugin() // Also added to storybook
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    strictPort: true,
    port: 3000
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
