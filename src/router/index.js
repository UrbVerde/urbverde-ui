import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Platform from '@/pages/Platform.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/mapa', name: 'Platform', component: Platform },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
