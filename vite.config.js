import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 7773,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  resolve: {
    alias: {
      $lib: '/src/lib',
      $components: '/src/components',
      $store: '/src/store',
      $utils: '/src/utils'
    }
  }
});
