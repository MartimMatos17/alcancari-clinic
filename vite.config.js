import instagramFeed from './scripts/instagram-feed.mjs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), instagramFeed()],
  // Instagram credentials are read only by the build plugin. Never expose VITE_* secrets.
  envPrefix: [],
  server: {
    host: '127.0.0.1',
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '**/.git/**', '**/backups/**', '**/*.pem', '**/*.key'],
    },
  },
  build: { sourcemap: false },
})
