import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  build: {
    lib: {
      entry: resolve(__dirname, 'index.html'),
      formats: ['es'],
    },
    minify: true,
    outDir: resolve(__dirname, '..', '..', 'dist', 'frontend'),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        // secure: false,
        // ws: true,
      },
    },
  },
  define: {
    'process.env': `(${JSON.stringify(process.env)})`,
  },
});
