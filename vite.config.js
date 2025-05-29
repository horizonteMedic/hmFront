import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/', 
  plugins: [react()],
  build: {
    outDir: 'build' 
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://testbackendhm.azurewebsites.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
