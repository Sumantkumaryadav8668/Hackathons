import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/product': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/user': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/cart': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/order': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/payment': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/offer': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/category': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})

