import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'



import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

const app = createApp(App);

// Configuração global do Axios
app.config.globalProperties.$axios = axios;

app.mount('#app');