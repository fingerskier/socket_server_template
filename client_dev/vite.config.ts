import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@com': '/src/com',
      '@assets': '/src/assets',
      '@api': '/src/api',
      '@style': '/src/style',
    },
  },
})
