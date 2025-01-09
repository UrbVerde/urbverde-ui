/* eslint-disable no-undef */
import './assets/main.css';
import '@/assets/styles/main.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createHead } from '@vueuse/head';
import axios from 'axios';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

async function prepareApp() {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    const { worker } = await import('./mocks/browser');
    console.log('test');
    console.log('test');
    console.log('test');

    return worker.start();
  }

  return Promise.resolve();
}

const app = createApp(App);
const head = createHead();

prepareApp().then(() => {
  app.config.globalProperties.$axios = axios;

  app.use(head);
  app.use(router);
  app.mount('#app');
});
