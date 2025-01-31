<!-- urbverde-ui/src/pages/MapPage.vue -->
  <!-- urbverde-ui/src/pages/MapPage.vue -->
<template>
  <div class="layout-container">
    <Sidebar
      :is-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />
    <!-- Main content (navbar, map, etc.) -->
    <main
      class="main-content"
      :class="{ 'content-expanded': !isSidebarOpen }"
    >
      <div v-if="!locationStore.cd_mun" class="placeholder-container">
        <img src="../assets/images/setLocation.png" alt="Selecione um município" class="map-placeholder" />
      </div>

      <div v-else class="content-wrapper">
        <Navbar
          :class="{ 'navbar-collapsed': !isSidebarOpen }"
          :active-section="activeSection"
          @navigate-to="scrollToSection"
        />

        <div id="map" ref="Mapa" class="content-area">
          <MapBox class="map-box">
            <Legenda />
          </MapBox>
        </div>

        <WidgetsSection
          :default-year="defaultYear"
          :city-code="cityCode"
          @first-year-change="handleFirstYearChange"
          @second-year-change="handleSecondYearChange"
          @third-year-change="handleThirdYearChange"
        />

        <UrbVerdeFooter />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationStore } from '@/stores/locationStore';
import { useHead } from '@vueuse/head';
import Sidebar from '../components/side_bar/SideBar.vue';
import Navbar from '../components/navbar/Navbar.vue';
import MapBox from '../components/map/mapGenerator.vue';
import Legenda from '../components/map/Legenda.vue';

import WidgetsSection from '@/components/widgets_section/WidgetsSection.vue';
import UrbVerdeFooter from '@/components/homepage/UrbVerdeFooter.vue';

// Store and router setup
const locationStore = useLocationStore();
const route = useRoute();
// const router = useRouter();

// UI State
const activeSection = ref('map');
const isSidebarOpen = ref(true);
// const coordinates = ref({ lat: null, lng: null });

// Computed Properties
// const category = computed(() => locationStore.category || 'category?');
// const currentLayerName = computed(() => locationStore.currentLayerName);
// const currentLayer = computed(() => locationStore.layer || 'layer?');
// const cityName = computed(() => locationStore.nm_mun || 'city?');
// const uf = computed(() => locationStore.uf || 'uf?');

// Data
const defaultYear = ref(2020);
const cityCode = ref(3547809);

// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// const updateCoordinates = (newCoordinates) => {
//   coordinates.value = newCoordinates;
//   locationStore.setCoordinates(newCoordinates);
// };

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  const navbarHeight = 100;
  const sectionElements = document.querySelectorAll(
    '[id^="map"], [id^="stats"], [id^="vulnerable"], [id^="ranking"], [id^="data"], [id^="newsletter"]'
  );

  for (const element of sectionElements) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + scrollPosition - navbarHeight;
    const bottom = top + rect.height;

    if (scrollPosition >= top && scrollPosition < bottom) {
      activeSection.value = element.id;
      history.replaceState(null, null, `#${element.id}`);
      break;
    }
  }
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = 100; // Adjust based on your navbar height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    activeSection.value = sectionId;
    history.pushState(null, null, `#${sectionId}`);
  }
};

// Commented out for later use
// const syncStoreWithQuery = async() => {
//   const query = route.query;
//   console.log('MapPage: Syncing store with query:', query);

//   if (Object.keys(query).length > 0) {
//     await locationStore.updateFromQueryParams(query);

//     // If we have coordinates but they're not set, fetch them
//     if (locationStore.cd_mun && (!coordinates.value?.lat || !coordinates.value?.lng)) {
//       try {
//         const coords = await locationStore.fetchCoordinatesByCode(locationStore.cd_mun);
//         if (coords) {
//           coordinates.value = coords;
//         }
//       } catch (error) {
//         console.error('MapPage: Error fetching coordinates:', error);
//       }
//     }
//   }
// };

// Add this new function to fetch categories
// async function fetchCategoriesForLocation(code) {
//   try {
//     console.log('Fetching categories for location:', code);
//     const response = await fetch(`https://api.urbverde.com.br/v1/categories?city=${code}`);
//     const data = await response.json();

//     if (data?.categories) {
//       locationStore.setCategories(data.categories);
//     }
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//   }
// }

// Lifecycle hooks
// Initialize store with URL params
onMounted(async() => {

  // Setup URL syncing in store
  locationStore.setupUrlSync();

  // Initial sync from URL
  if (Object.keys(route.query).length > 0) {
    await locationStore.updateFromQueryParams(route.query);
  }

  // Setup scroll handling
  window.addEventListener('scroll', handleScroll);

  // Handle initial hash if present
  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1);
    setTimeout(() => scrollToSection(sectionId), 100);
  }
  handleScroll();
});

// Cleanup
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Configuração das meta tags de SEO
useHead({
  title: 'Plataforma UrbVerde: Explore dados ambientais e sociais do seu município',
  meta: [
    {
      name: 'description',
      content: 'Acesse a Plataforma UrbVerde para explorar dados sociais e ambientais detalhados do seu município. Ferramenta gratuita feita para planejamento urbano e sustentável.',
    },
    {
      name: 'keywords',
      content: 'plataforma de dados sociais, plataforma de dados ambientais, planejamento sustentável, cidades verdes, análise de dados municipais, sustentabilidade urbana, desenvolvimento sustentável, UrbVerde, ferramenta para planejamento urbano, dados socioambientais, acesso gratuito',
    },
    {
      property: 'og:title',
      content: 'Plataforma UrbVerde - Ferramenta de Dados para Sustentabilidade Urbana',
    },
    {
      property: 'og:description',
      content: 'Descubra como a Plataforma UrbVerde pode ajudar a acessar e analisar dados sociais e ambientais detalhados, promovendo cidades resilientes e sustentáveis.',
    },
  ],
});
</script>

<style scoped>
.layout-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #F8F9FACC;
}

.main-content {
  position: relative;
  min-height: 100vh;
  margin-left: 301px;
  transition: margin-left 0.3s ease;
}

.main-content.content-expanded {
  margin-left: 72px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.map-container {
  position: relative;
  flex: 1;
  display: flex;
}

.map-box {
  flex: 1;
}

.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.map-placeholder {
  display: block;
  margin: 40px auto;
  opacity: 0.45;
}
</style>
