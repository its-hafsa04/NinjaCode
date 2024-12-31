import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    target: 'https://ninja-code-backend.vercel.app',
    },
  plugins: [react()],
})
