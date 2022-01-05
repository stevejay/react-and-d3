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
    assetsInlineLimit: 0
  }
});
