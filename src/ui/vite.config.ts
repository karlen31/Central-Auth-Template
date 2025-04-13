import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT || '3001'),
    strictPort: true,
  },
  preview: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT || '3001'),
    strictPort: true,
  }
}) 