import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      // Use default Vite chunking to prevent circular dependencies
    },
    chunkSizeWarningLimit: 1000
  }
})
