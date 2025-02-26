// urbverde-ui/vite.config.js
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
  // Add build configuration for cache busting
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'img/[name].[hash].[ext]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'css/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      },
    },
  },
  // server: {
  //   host: '0.0.0.0', // Permite acesso via IP
  //   port: 5173, // Porta padrão, você pode alterar se necessário
  // },
});
