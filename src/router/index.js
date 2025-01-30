// urbverde-ui/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import MapPage from '@/pages/MapPage.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/mapa', name: 'MapPage', component: MapPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
