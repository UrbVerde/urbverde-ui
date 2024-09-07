import { createApp } from 'vue';
import App from './App.vue';

// Importando arquivos de estilo Bootstrap e BootstrapVue
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import './assets/main.css';
import './assets/styles/custom.scss';

import BootstrapVue3 from 'bootstrap-vue-3';
import axios from 'axios';

const app = createApp(App);

// Configuração global do Axios
app.config.globalProperties.$axios = axios;

// Usando BootstrapVue3 no Vue 3
app.use(BootstrapVue3);

app.mount('#app');
