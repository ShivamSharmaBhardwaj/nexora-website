// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true, // Listen on all addresses (including localhost and network)
    open: true,
    // Add allowed hosts
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'sight-exploring-validity-discretion.trycloudflare.com',
      '.trycloudflare.com' // Allow all cloudflare subdomains
    ],
    // For better development experience with tunnels
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5174
    }
  },
  // If you're using API proxy
  proxy: {
    '/api': {
      target: 'http://localhost:5002',
      changeOrigin: true,
      secure: false,
      ws: true
    }
  }
})