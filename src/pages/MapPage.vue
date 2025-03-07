<!-- urbverde-ui/src/pages/MapPage.vue -->
<template>
  <div class="layout-container">

    <div
      class="sidebar-wrapper"
      :class="{ collapsed: !isSidebarOpen }"
    >
      <Sidebar
        :is-open="isSidebarOpen"
        @toggle-sidebar="toggleSidebar"
        class="sidebar-animate"
      />

    </div>

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
          ref="navbarRef"
          :class="{ 'navbar-collapsed': !isSidebarOpen }"
          :active-section="activeSection"
          :is-sidebar-open="isSidebarOpen"
          @toggle-sidebar="toggleSidebar"
          @navigate-to="scrollToSection"
        />

        <div class="page-content" :style="pageContentStyle">

          <div class="map-section">
            <div id="map"
                 ref="Mapa"
                 class="map-container"
                 :style="mapContainerStyle">
              <MapBox :coordinates="coordinates" class="map-box">
                <Legend />
              </MapBox>
            </div>
          </div>

          <div class="mobile-scroll" @click="handleMobileScroll">
            <i class="bi bi-chevron-up"></i>
            <p class="body-small-regular">
              Arrastar para ver estatísticas
            </p>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationStore } from '@/stores/locationStore';
import { useHead } from '@vueuse/head';
import { useWindowSize } from '@/utils/useWindowsSize';

import Sidebar from '../components/side_bar/SideBar.vue';
import Navbar from '../components/navbar/NavbarMap.vue';
import MapBox from '../components/map/mapGenerator.vue';
import Legend from '../components/legend/MapLegend.vue';
import WidgetsSection from '@/components/widgets_section/WidgetsSection.vue';
import UrbVerdeFooter from '@/components/homepage/UrbVerdeFooter.vue';

// Store and router setup
const locationStore = useLocationStore();
const route = useRoute();

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

const { smallerThan } = useWindowSize();

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
      behavior: 'smooth',
    });

    activeSection.value = sectionId;
    history.pushState(null, null, `#${sectionId}`);
  }
};

// Scroll ao clicar na div mobile-scroll
const handleMobileScroll = () => {

  const newScrollPosition = window.scrollY + window.innerHeight;

  window.scrollTo({
    top: newScrollPosition,
    behavior: 'smooth'
  });
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

// Function to measure navbar height for responsiveness
const measureNavbarHeight = () => {
  console.log('measureNavbarHeight called');
  console.log('navbarRef.value exists:', !!navbarRef.value);

  if (navbarRef.value) {
    console.log('navbarRef.$el exists:', !!navbarRef.value.$el);

    if (navbarRef.value.$el) {
      console.log('Tipo de $el:', typeof navbarRef.value.$el);
      console.log('$el é um elemento DOM?', navbarRef.value.$el instanceof Element);

      try {
        const offsetHeight = navbarRef.value.$el.offsetHeight;
        const clientHeight = navbarRef.value.$el.clientHeight;
        let boundingRect = null;

        if (navbarRef.value.$el instanceof Element) {
          boundingRect = navbarRef.value.$el.getBoundingClientRect().height;
        }

        console.log('offsetHeight:', offsetHeight);
        console.log('clientHeight:', clientHeight);
        console.log('boundingRect.height:', boundingRect);

        const computedHeight = offsetHeight || clientHeight || (boundingRect ? boundingRect : 0);

        if (computedHeight) {
          navbarHeight.value = computedHeight;
          console.log('Navbar height set to:', navbarHeight.value, 'px');
        } else {
          const navbar = document.querySelector('.navbar');
          if (navbar) {
            const navbarDOMHeight = navbar.offsetHeight;
            console.log('Direct DOM navbar height:', navbarDOMHeight);
            if (navbarDOMHeight) {
              navbarHeight.value = navbarDOMHeight;
              console.log('Navbar height set from DOM:', navbarHeight.value, 'px');
            } else {
              console.log('Using fallback height');
              navbarHeight.value = 147;
            }
          } else {
            console.log('Navbar element not found in DOM');
            navbarHeight.value = 147;
          }
        }
      } catch (error) {
        console.error('Erro ao medir altura:', error);

        const navbar = document.querySelector('.navbar');
        if (navbar) {
          const navbarDOMHeight = navbar.offsetHeight;
          console.log('Altura após erro:', navbarDOMHeight);
          navbarHeight.value = navbarDOMHeight || 147;
        } else {
          navbarHeight.value = 147;
        }
      }
    } else {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        const navbarDOMHeight = navbar.offsetHeight;
        console.log('Altura DOM de backup:', navbarDOMHeight);
        navbarHeight.value = navbarDOMHeight || 147;
      } else {
        navbarHeight.value = 147;
      }
    }
  } else {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const navbarDOMHeight = navbar.offsetHeight;
      console.log('Altura DOM último recurso:', navbarDOMHeight);
      navbarHeight.value = navbarDOMHeight || 147;
    } else {
      navbarHeight.value = 147;
    }
  }
};

// Map content styles based on navbar height
const mapContainerStyle = computed(() => {
  const isSmallScreen = smallerThan('tablet');

  const paddingAdjustment = isSmallScreen ? 64 : 24;

  const fallbackHeight = 147 + paddingAdjustment; // 24px padding
  const totalHeight = navbarHeight.value ? navbarHeight.value + paddingAdjustment : fallbackHeight;

  return {
    height: `calc(100vh - ${totalHeight}px)`,
    overflow: 'hidden',
    width: '100%'
  };
});

// Page content styles based on navbar height
const pageContentStyle = computed(() => {
  const fallbackHeight = 147;

  return {
    paddingTop: `${navbarHeight.value || fallbackHeight}px`,
  };
});

const navbarRef = ref(null);
const navbarHeight = ref(0);

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

  const attemptMeasurement = (attempt = 1, maxAttempts = 5) => {
    console.log(`Measurement attempt ${attempt} of ${maxAttempts}`);

    measureNavbarHeight();

    // If measurement failed and we haven't reached the max attempts, try again
    if (!navbarHeight.value && attempt < maxAttempts) {
      setTimeout(() => attemptMeasurement(attempt + 1, maxAttempts), 100 * attempt);
    }
  };

  // Start with a short delay to let the component render
  setTimeout(() => attemptMeasurement(), 100);

  // Setup resize listener
  window.addEventListener('resize', measureNavbarHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', measureNavbarHeight);
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

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

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
.sidebar-wrapper {
  width: 301px;
  flex-shrink: 0;
  transition: width 0.3s ease;
}

.sidebar-wrapper.collapsed {
  width: 72px;
}

/* Main content styles */
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
  transition: all 0.3s ease;
  position: relative;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.page-content {
  display: flex;
  flex-direction: column;
}

.mobile-scroll{
  display: none;
  height: 56px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
}

.mobile-scroll i{
  font-size: 18px;
  color: map-get($theme, primary);
}

.mobile-scroll p{
  color: map-get($theme, primary);
}

/* Navbar styles */
::v-deep(.navbar) {
  width: calc(100% - 301px); // Adjust based on sidebar width
  position: fixed;
}

.navbar.navbar-collapsed {
  width: calc(100% - 72px); // Adjust based on sidebar collapsed width
}

/* Map container styles */
.map-section {
  padding: 0 24px;
  width: 100%;
}

.map-container {
  position: relative;
  width: 100%;
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

  @include breakpoint-down('tablet') {
    ::v-deep(.navbar) {
      width: 100%;
    }

    .navbar.navbar-collapsed {
      width: 100%;
    }

    .sidebar-wrapper {
      width: 0;

      &.collapsed {
        width: 0;
      }
    }

    .mobile-scroll{
      display: flex;
    }

  }

</style>
