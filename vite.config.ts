import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      exclude: [/\.(stories|spec|test)\.(t|j)sx?$/, /__tests__/]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    minify: true,
    sourcemap: true,
    // Don't allow small assets to be included as inline base64 URLs.
    // These are rejected by the site's CSP.
    assetsInlineLimit: 0
  }
});
