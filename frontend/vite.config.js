import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '..', // use the .env in the repo root
  server: {
    port: 5173,
    // dev: send /api to the backend (no CORS issues)
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
