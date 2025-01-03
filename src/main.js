import './assets/main.css';
import '@/assets/styles/main.scss'; // Importação dos estilos globais
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router';
import { createHead } from '@vueuse/head'; // Para criar meta tags de SEO

const app = createApp(App);
const head = createHead();

// Configuração global do Axios
app.config.globalProperties.$axios = axios;
app.use(head);
app.use(router);
app.mount('#app');
