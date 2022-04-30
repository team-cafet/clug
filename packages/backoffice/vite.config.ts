import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/backoffice',
  server: {
    'proxy': {
      '/api/backoffice':"http://backend:3001"
    },
    hmr: {
      'port': 3010,
    }
  }
})
