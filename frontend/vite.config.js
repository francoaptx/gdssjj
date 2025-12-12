import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Escucha en todas las direcciones IP, incluyendo localhost
    port: 5174, // Using port 8080 for frontend
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend runs on port 3000
        changeOrigin: true, // Necesario para vhosts
        rewrite: (path) => path.replace(/^\/api/, ''), // Reescribe la URL eliminando /api
      },
    },
  },
})