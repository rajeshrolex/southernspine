import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://green-starling-853859.hostingersite.com',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://green-starling-853859.hostingersite.com',
        changeOrigin: true,
        secure: false,
      },
      '/assessments': {
        target: 'https://green-starling-853859.hostingersite.com',
        changeOrigin: true,
        secure: false,
      },
      '/products': {
        target: 'https://green-starling-853859.hostingersite.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  publicDir: 'public'
})
