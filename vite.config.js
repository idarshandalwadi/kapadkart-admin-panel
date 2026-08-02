import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Must match nginx location prefix (e.g. /kapadkart_admin/)
const base = process.env.VITE_BASE_PATH || '/kapadkart_admin/'
const basePath = base.replace(/\/$/, '') || ''

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      [`${basePath}/api`]: {
        target: 'http://localhost:3011',
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${basePath}`), ''),
      },
      [`${basePath}/uploads`]: {
        target: 'http://localhost:3011',
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${basePath}`), ''),
      },
      [`${basePath}/images`]: {
        target: 'http://localhost:3011',
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${basePath}`), ''),
      },
    },
  },
})
