<!-- urbverde-ui/src/pages/MapPage.vue -->
<template>
  <div class="layout-container">
    <Sidebar
      :is-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
      @update-coordinates="updateCoordinates"
    />
    <!-- Main content (navbar, map, etc.) -->
    <main
      class="main-content"
      :class="{ 'content-expanded': !isSidebarOpen }"
    >
      <div v-if="!coordinates?.lat || !coordinates?.lng" class="placeholder-container">
        <img src="../assets/images/setLocation.png" alt="Imagem de espera" class="map-placeholder" />
      </div>

      <div v-else class="content-wrapper">
        <Navbar
          :class="{ 'navbar-collapsed': !isSidebarOpen }"
          :active-section="activeSection"
          @navigate-to="scrollToSection"
        />

        <div id="map" ref="Mapa" class="map-container">
          <MapBox :coordinates="coordinates" class="map-box">
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

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationStore } from '@/stores/locationStore';
import { useHead } from '@vueuse/head';
import Sidebar from '../components/side_bar/SideBar.vue';
import Navbar from '../components/navbar/Navbar.vue';
import MapBox from '../components/map/mapGenerator.vue';
import Legenda from '../components/map/Legenda.vue';

import WidgetsSection from '@/components/widgets_section/WidgetsSection.vue';
import UrbVerdeFooter from '@/components/homepage/UrbVerdeFooter.vue';

export default {
  name: 'MapPage',
  components: {
    Sidebar,
    MapBox,
    Navbar,
    Legenda,
    WidgetsSection,
    UrbVerdeFooter,
  },
  data() {
    return {
      defaultYear: 2020,
      cityCode: 3547809
    };
  },
  setup() {
    const route = useRoute();
    const locationStore = useLocationStore();

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

    const coordinates = ref({ lat: null, lng: null });
    const activeSection = ref('map');
    const isSidebarOpen = ref(true);

    const category = computed(() => locationStore.category || 'category?');
    const currentLayer = computed(() => locationStore.layer || 'layer?');
    const cityName = computed(() => locationStore.nm_mun || 'city?');

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const updateCoordinates = (newCoordinates) => {
      coordinates.value = newCoordinates;
      locationStore.setCoordinates(newCoordinates);
    };

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
        const navbarHeight = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        activeSection.value = sectionId;
        history.pushState(null, null, `#${sectionId}`);
      }
    };

    onMounted(() => {
      const { nm_mun, cd_mun } = route.query;
      if (nm_mun || cd_mun) {
        locationStore.setLocation({
          cd_mun: cd_mun ?? null,
          nm_mun: nm_mun ?? null,
        });
      }

      if (locationStore.coordinates?.lat && locationStore.coordinates?.lng) {
        coordinates.value = locationStore.coordinates;
      }
      else if (cd_mun) {
        locationStore.fetchCoordinatesByCdMun(cd_mun);
      }
      else if (nm_mun) {
        locationStore.fetchCoordinatesByName(nm_mun);
      }

      window.addEventListener('scroll', handleScroll);
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        setTimeout(() => scrollToSection(sectionId), 100);
      }
      handleScroll();
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      coordinates,
      activeSection,
      isSidebarOpen,
      category,
      currentLayer,
      cityName,
      updateCoordinates,
      scrollToSection,
      toggleSidebar,
    };
  },

};
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #F8F9FACC;
  overflow: hidden;
}

/* Sidebar styles */
.sidebar {
  position: fixed;
  height: 100vh;
  width: 301px;
  overflow-y: auto;
  transition: width 0.3s ease;
  z-index: 10;
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
}

.main-content.content-expanded {
  margin-left: 72px;
  width: calc(100% - 72px);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

/* Navbar styles */
.navbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 5;
}

/* Map container styles */
.map-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 133px); /* Adjust based on navbar height */
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

.widget {
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 100%;
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
  height: calc(100vh - 60px);
  width: 100%;
}

.map-placeholder {
  max-width: 100%;
  height: auto;
  opacity: 0.45;
}
</style>
