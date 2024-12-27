import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router';

const app = createApp(App);

// Configuração global do Axios
app.config.globalProperties.$axios = axios;

app.use(router);
app.mount('#app');
