// urbverde-ui/src/main.js

import './assets/main.css';
import '@/assets/styles/main.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { initializeTooltips } from '@/utils/bootstrapTooltips';
import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
const head = createHead();

app.config.globalProperties.$axios = axios;
app.use(head);
app.use(router);
app.use(pinia);
app.mount('#app');

initializeTooltips();

window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`Page loaded in ${(loadTime/1000).toFixed(2)}s`);
});
