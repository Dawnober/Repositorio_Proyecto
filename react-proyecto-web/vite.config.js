import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Carpeta de salida de los archivos compilados
    outDir: '../../Proyecto/proceso-web/src/main/webapp/static/react-build', 
    emptyOutDir: true, // Borra la carpeta de salida antes de cada build

    rollupOptions: {
      output: {
        // Asegura que solo se genere un archivo JS y un archivo CSS
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return `[name].[ext]`; // Para CSS, mantén el nombre original
          }
          return `assets/[name].[ext]`; // Para otros assets como imágenes
        },
      },
    },
  },
});