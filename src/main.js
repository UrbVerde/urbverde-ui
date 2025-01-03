/* eslint-disable no-undef */
import './assets/main.css';
import '@/assets/styles/main.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router';

async function prepareApp() {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    const { worker } = await import('./mocks/browser');

    return worker.start();
  }

  return Promise.resolve();
}

const app = createApp(App);

prepareApp().then(() => {
  app.config.globalProperties.$axios = axios;

  app.use(router);
  app.mount('#app');
});
