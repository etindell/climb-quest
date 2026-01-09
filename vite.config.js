import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use /climb-quest/ for GitHub Pages, / for Railway
  base: process.env.RAILWAY_ENVIRONMENT ? '/' : '/climb-quest/',
})
