import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app':     resolve('src/app'),
      '@pages':   resolve('src/pages'),
      '@widgets': resolve('src/widgets'),
      '@features': resolve('src/features'),
      '@shared':  resolve('src/shared'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
