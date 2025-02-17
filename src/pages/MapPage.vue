<!-- urbverde-ui/src/pages/MapPage.vue -->
<template>
  <div class="layout-container">
    <Sidebar
      :is-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
      class="sidebar-animate"
    />

    <!-- Main content -->
    <main
      class="main-content"
      :class="{ 'content-collapsed': !isSidebarOpen }"
    >
      <div v-if="!locationStore.cd_mun" class="placeholder-container">
        <div class="placeholder-wrapper">
          <img src="../assets/images/setLocation.png" alt="Selecione um município" />
          <div class="label">
            <h5 class="heading-h5">Inicie buscando um lugar</h5>
            <p class="body-small-regular">Experimente um município ou estado</p>
          </div>
        </div>
      </div>

      <div v-else class="content-wrapper content-animate">
        <Navbar
          :class="{ 'navbar-collapsed': !isSidebarOpen }"
          :active-section="activeSection"
          @navigate-to="scrollToSection"
        >
        </Navbar>
        <div class="page-content">
          <div class="map-section">
            <div id="map" ref="Mapa" class="map-container">
              <MapBox :coordinates="coordinates" class="map-box">
                <Legend />
              </MapBox>
            </div>
          </div>

          <WidgetsSection
            :default-year="defaultYear"
            :city-code="cityCode"
            @first-year-change="handleFirstYearChange"
            @second-year-change="handleSecondYearChange"
            @third-year-change="handleThirdYearChange"
          />

          <UrbVerdeFooter id="newsletter" />
        </div>
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
import Navbar from '../components/navbar/NavbarMap.vue';
import MapBox from '../components/map/mapGenerator.vue';
import Legend from '../components/legend/MapLegend.vue';
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
h5, p{
  margin: 0;
}

.layout-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #F8F9FACC;
  overflow-x: hidden;
}

/* Sidebar styles */
.sidebar {
  position: fixed;
  height: 100vh;
  width: 301px;
  overflow-y: auto;
  transition: width 0.3s ease;
  z-index: 100;
}

.sidebar.collapsed {
  width: 72px;
}

/* Main content styles */
.main-content {
  flex: 1;
  margin-left: 301px;
  min-height: 100vh;
  width: calc(100% - 301px);
  transition: all 0.3s ease;
  overflow-x: hidden;
  position: relative;
}

.main-content.content-collapsed {
  margin-left: 72px;
  width: calc(100% - 72px);
}

.page-content {
  padding-top: 147px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

/* Navbar styles */
.navbar {
  width: calc(100% - 301px);
  position: fixed;
  top: 0;
  left: 301px;
  z-index: 99;
  transition: all 0.3s ease;
}

.navbar.navbar-collapsed {
  width: calc(100% - 72px);
  left: 72px;
}

/* Map container styles */
.map-section {
  padding: 0 24px;
  width: 100%;
}

.map-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 171px);
  overflow: hidden;
}

.map-box {
  width: 100%;
  height: 100%;
}

/* Widgets section styles */
.widgets-section {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

/* Footer styles */
.footer {
  width: 100%;
  margin-top: auto;
}

/* Placeholder styles */
.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.placeholder-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  align-self: stretch;
}

  .placeholder-wrapper .label{
    color: #212529;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
  }

  /* Animações de entrada da página */
  .sidebar-animate {
    animation: fadeIn 0.75s ease-out;
    animation-delay: 0.1s;
    animation-fill-mode: backwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .content-animate {
    animation: contentFade 1s ease-out;
    animation-delay: 0.75s;
    animation-fill-mode: backwards;
  }

  @keyframes contentFade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

</style>
