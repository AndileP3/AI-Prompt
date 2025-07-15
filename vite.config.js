import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/get_posts": {
        target: "https://keailand.ct.ws",
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()],
})
