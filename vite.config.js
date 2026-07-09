import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = repo name, GitHub Pages ke liye zaroori
export default defineConfig({
  plugins: [react()],
  base: '/thewalldecor/',
})
