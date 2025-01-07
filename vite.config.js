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
        api: 'modern-compiler',
        additionalData: `
          @use "@/assets/styles/colors.scss" as *;
          @use "@/assets/styles/fonts.scss" as *;
          @use "@/assets/styles/shadows.scss" as *;
        `,
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      },
    },
  },

  server: {
    host: '0.0.0.0', // Permite acesso via IP
    port: 5173, // Porta padrão, você pode alterar se necessário
  },
});
