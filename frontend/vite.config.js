import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// BASE_PATH solo se define al publicar en GitHub Pages (/del-barrio/)
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
