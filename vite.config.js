import instagramFeed from './scripts/instagram-feed.mjs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // The form URL is public. Whitelist it explicitly; no private environment is exposed.
  const endpoint = loadEnv(mode, process.cwd(), 'PUBLIC_CONTACT_FORM_ENDPOINT').PUBLIC_CONTACT_FORM_ENDPOINT || ''
  if (endpoint && !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) throw new Error('PUBLIC_CONTACT_FORM_ENDPOINT deve ser um endpoint Formspree HTTPS válido.')
  return {
    define: { 'import.meta.env.VITE_CONTACT_FORM_ENDPOINT': JSON.stringify(endpoint) },
    plugins: [react(), tailwindcss(), instagramFeed()],
    // Instagram credentials are read only by the build plugin. Never expose VITE_* secrets.
    envPrefix: [],
    preview: { host: '127.0.0.1' },
    server: {
      host: '127.0.0.1',
      fs: {
        strict: true,
        deny: ['.env', '.env.*', '**/.git/**', '**/backups/**', '**/*.pem', '**/*.key', '**/scripts/admin-*.mjs', '**/tests/**'],
      },
    },
    build: { sourcemap: false },
  }
})
