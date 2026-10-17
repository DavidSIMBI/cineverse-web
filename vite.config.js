import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Read only PORT from the backend environment file; never load its TMDB secret into Vite.
  const backendEnv = loadEnv(mode, resolve(process.cwd(), 'backend'), 'PORT')
  const backendPort = process.env.PORT || backendEnv.PORT || '3001'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': `http://localhost:${backendPort}`,
      },
    },
  }
})
