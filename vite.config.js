import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Para importar os styles globais nos arquivos
  // Tem que utilizar o caminho de todos, e não do @/assets/styles/main.scss
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/colors.scss" as *;
          @use "@/assets/styles/fonts.scss" as *;
          @use "@/assets/styles/shadows.scss" as *;
        `,
      },
    },
  },
});