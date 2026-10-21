import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Os dois plugins: React (entende JSX) e Tailwind (gera o CSS das classes que você usa).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
