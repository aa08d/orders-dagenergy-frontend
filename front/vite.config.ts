import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app':      resolve(__dirname, 'src/app'),
      '@pages':    resolve(__dirname, 'src/pages'),
      '@widgets':  resolve(__dirname, 'src/widgets'),
      '@features': resolve(__dirname, 'src/features'),
      '@shared':   resolve(__dirname, 'src/shared'),
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
