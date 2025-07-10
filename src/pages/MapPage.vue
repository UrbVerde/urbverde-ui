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
          <img src="../assets/images/setLocation.svg" alt="Selecione um município" class="placeholder-image" />
          <div class="label">
            <h5 class="heading-h5">Inicie buscando uma cidade</h5>
            <p class="body-small-regular">Experimente buscar onde você mora</p>
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

          <div v-show="!shouldHideMap" class="map-section">
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

    <!-- Botão de voltar ao topo -->
    <div class="back-to-top shadow" :class="{ 'visible': showBackToTop }" @click="scrollToTop">
      <i class="bi bi-arrow-up"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationStore } from '@/stores/locationStore';
import { useHead } from '@vueuse/head';
import { useWindowSize } from '@/utils/useWindowsSize';

import Sidebar from '../components/side_bar/SideBar.vue';
import Navbar from '../components/navbar/NavbarMap.vue';
import MapBox from '../components/map/mapGenerator.vue';
import Legend from '../components/legend/MapLegend.vue';
import WidgetsSection from '@/components/cards/panel-config/base/PanelsCards.vue';
import UrbVerdeFooter from '@/components/homepage/UrbVerdeFooter.vue';

// Store and router setup
const locationStore = useLocationStore();
const route = useRoute();

// UI State
const activeSection = ref('map');
const isSidebarOpen = ref(true);
const showBackToTop = ref(false);
// const coordinates = ref({ lat: null, lng: null });

// Computed Properties
// const category = computed(() => locationStore.category || 'category?');
// const currentLayerName = computed(() => locationStore.currentLayerName);
// const currentLayer = computed(() => locationStore.layer || 'layer?');
// const cityName = computed(() => locationStore.nm_mun || 'city?');
// const uf = computed(() => locationStore.uf || 'uf?');

// Data

const hasMunicipality = computed(() => !!locationStore.cd_mun);
const defaultYear = computed(() => locationStore.year);
const cityCode = ref(3547809);

// Função para verificar se deve ocultar o mapa baseado no ID da categoria ou camada
const shouldHideMap = computed(() => {
  const hideMapIds = [
    'overview',
  ];

  const currentCategoryId = locationStore.category;
  const currentLayerId = locationStore.layer;

  return hideMapIds.includes(currentCategoryId) || hideMapIds.includes(currentLayerId);
});

// Methods
const toggleSidebar = () => {
  if (!isSidebarOpen.value && !shouldAllowSidebarToggle.value) {
    isSidebarOpen.value = true;

    return;
  }

  if (isSidebarOpen.value && !shouldAllowSidebarToggle.value) {
    return;
  }

  isSidebarOpen.value = !isSidebarOpen.value;
};

// const updateCoordinates = (newCoordinates) => {
//   coordinates.value = newCoordinates;
//   locationStore.setCoordinates(newCoordinates);
// };

const { smallerThan } = useWindowSize();

const isProgrammaticScrolling = ref(false);

const handleScroll = () => {
  // Se estiver em rolagem programática, não atualizar o activeSection
  if (isProgrammaticScrolling.value) {return;}

  const scrollPosition = window.scrollY;
  const navbarHeight = 100;

  showBackToTop.value = scrollPosition > window.innerHeight * 0.2;

  const sectionElements = document.querySelectorAll(
    '[id^="map"], [id^="stats"], [id^="vulnerable"], [id^="ranking"], [id^="data"], [id^="newsletter"], [id^="metas"], [id^="indicadores"], [id^="planejamento"], [id^="parks"], [id^="vegetation"], [id^="hidro"], [id^="agriculture"], [id^="climate"]'
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

// Scroll ao clicar nas opções da navbar
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight + 1;

    // Configurar a flag para informar que estamos em rolagem programática
    isProgrammaticScrolling.value = true;

    // Iniciar a rolagem
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Aguardar o término da rolagem e depois atualizar o activeSection
    setTimeout(() => {
      activeSection.value = sectionId;
      history.pushState(null, null, `#${sectionId}`);

      // Desativar a flag após completar a rolagem
      isProgrammaticScrolling.value = false;
    }, 0); // Ajuste este tempo com base na duração da rolagem suave
  }
};

// Função para rolar até o topo da página
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Scroll ao clicar na div mobile-scroll
const handleMobileScroll = () => {
  const newScrollPosition = window.scrollY + window.innerHeight;

  window.scrollTo({
    top: newScrollPosition,
    behavior: 'smooth'
  });
};

// Function to measure navbar height for responsiveness
const measureNavbarHeight = () => {
  if (navbarRef.value && navbarRef.value.$el) {
    try {
      const boundingRect = navbarRef.value.$el.getBoundingClientRect().height;
      const offsetHeight = navbarRef.value.$el.offsetHeight;
      const clientHeight = navbarRef.value.$el.clientHeight;

      const computedHeight = boundingRect || offsetHeight || clientHeight;

      if (computedHeight) {
        navbarHeight.value = computedHeight;

        return;
      }
    } catch {
      void 0;
    }
  }

  // Fallback
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbarHeight.value = navbar.offsetHeight || 147;
  } else {
    navbarHeight.value = 147;
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

// When municipality is selected or changes, recalculate navbar height
watch(() => locationStore.cd_mun, (newValue, oldValue) => {
  console.log('Municipality changed from', oldValue, 'to', newValue);

  if (newValue) {
    setTimeout(() => {
      measureNavbarHeight();
    }, 300);
  }
}, { immediate: true });

watch([
  () => smallerThan('tablet'),
  () => locationStore.cd_mun
], ([isMobile, hasMun]) => {
  if (isMobile && !hasMun) {
    isSidebarOpen.value = true;
  }
}, { immediate: true });

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
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', measureNavbarHeight);
});

// Verify sidebar toggle conditions in mobile
const shouldAllowSidebarToggle = computed(() => {
  const isMobile = smallerThan('tablet');

  if (isMobile && !hasMunicipality.value) {
    return false;
  }

  return true;
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
  background-color: map-get($primary-fade, 50);
  overflow-x: hidden;
  position: relative;
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

.back-to-top {
  display: none;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: map-get($primary-fade, 200);
  justify-content: center;
  align-items: center;
  z-index: -1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.back-to-top i {
  font-size: 24px;
  color: map-get($theme, primary);
}

.back-to-top.visible {
  opacity: 1;
  z-index: 1000;
  pointer-events: auto;
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
  opacity: 0.8;
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

  .placeholder-image{
    width: 250px;
    height: 250px;
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

    .map-section {
      padding: 0 8px;
    }

    .placeholder-container {
      display: none;
    }

    .back-to-top {
      display: flex;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(0);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
</style>
