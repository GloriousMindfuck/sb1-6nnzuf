import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Deshabilitar el proxy para pruebas
    // Puedes reactivarlo después si es necesario
    proxy: {}
  }
});



//Original login borrar barras a partir de abajo

//import { defineConfig } from 'vite';
//import react from '@vitejs/plugin-react';
//
//export default defineConfig({
//  plugins: [react()],
//  optimizeDeps: {
//    exclude: ['lucide-react'],
//  },
//  server: {
//    proxy: {
//      '/api': {
//        target: 'http://localhost:3001',
//        changeOrigin: true,
//        rewrite: (path) => path.replace(/^\/api/, '')
//      }
//    }
//  }
//});