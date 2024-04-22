import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Define la ruta base aquí
  plugins: [react()],
  build: {
    outDir: 'build' // Especifica la carpeta de salida de la compilación
  }
})
