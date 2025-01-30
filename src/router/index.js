// router/index.js (example)
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import MapPage from '@/pages/MapPage.vue';
import AboutUs from '@/pages/AboutUs.vue';
import WorkTogether from '@/pages/WorkTogether.vue';
import ContactPage from '@/pages/ContactPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/mapa', name: 'MapPage', component: MapPage },
    { path: '/sobre', name: 'AboutUs', component: AboutUs },
    { path: '/parceiro', name: 'WorkTogether', component: WorkTogether },
    { path: '/contato', name: 'ContactPage', component: ContactPage },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
});

export default router;
