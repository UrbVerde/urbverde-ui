<!-- urbverde-ui/src/pages/MapPage.vue -->
<template>
  <div class="global">

    <div class="content-wrapper">
      <!-- Sidebar -->
      <Sidebar :class="[{ 'sidebar-collapsed': !isSidebarOpen }]"
               :is-open="isSidebarOpen"
               @toggle-sidebar="toggleSidebar"
               @update-coordinates="updateCoordinates" />

      <!-- Main content (navbar, map, etc.) -->
      <div class="main-wrapper" :class="{ 'sidebar-open': isSidebarOpen }">
        <!-- If no coordinates, show a placeholder -->
        <div v-if="!coordinates?.lat || !coordinates?.lng" class="placeholder-container">
          <img src="../assets/images/setLocation.png" alt="Imagem de espera" class="map-placeholder" />
        </div>

        <div v-else>
          <Navbar :class="{ 'navbar-collapsed': !isSidebarOpen }"
                  :active-section="activeSection"
                  @navigate-to="scrollToSection" />

          <div id="map" ref="Mapa" class="content-area">
            <MapBox :coordinates="coordinates" class="map-box">
              <Legenda />
            </MapBox>
          </div>

          <!-- Stats Section (scroll target) -->
          <div id="stats" ref="statsSection" class="box">
            <div class="statistics-container">
              <span class="title-statistics-container heading-h5">Estatísticas do {{ category }} em {{ cityName
              }}</span>
              <!-- <div class="date-picker-container"></div> -->
              <YearPicker v-model="firstSelectedYear"
                          :default-year="defaultYear"
                          :city-code="cityCode"
                          @update:modelValue="handleFirstYearChange" />

            </div>
            <TemperatureSection :city-code="cityCode" :selected-year="firstSelectedYear" />
          </div>

          <!-- Pop Vulnerável -->
          <div id="vulnerable"
               ref="vulnerableSection"
               class="box"
               style="border-top: 1px solid black">
            <div class="statistics-container">
              <span class="title-statistics-container heading-h5">Quem é Mais Afetado Pelo Calor Extremo em {{
                cityName }}?</span>
              <YearPicker v-model="secondSelectedYear"
                          :default-year="defaultYear"
                          :city-code="cityCode"
                          @update:modelValue="handleSecondYearChange" />
            </div>
            <HeatSection :city-code="cityCode" :selected-year="secondSelectedYear" />
          </div>

          <!-- Ranking -->
          <div id="ranking"
               ref="rankingSection"
               class="box"
               style="border-top: 1px solid black">
            <div class="statistics-container">
              <span class="title-statistics-container heading-h5">
                {{ cityName }} no Ranking dos Municípios</span>
              <YearPicker v-model="thirdSelectedYear"
                          :default-year="defaultYear"
                          :city-code="cityCode"
                          @update:modelValue="handleThirdYearChange" />
            </div>
            <RankSection :city-code="cityCode" :selected-year="thirdSelectedYear" />
          </div>

          <!-- Dados Gerais e Baixar Relatório -->
          <div id="data"
               ref="dataSection"
               class="box"
               style="height:636px; border-top: 1px solid black">
            Veja mais sobre {{ cityName }}

          </div>

          <!-- Footer -->
          <div id="newsletter"
               ref="newsletterSection"
               class="box"
               style="height:341px; align-items: center; justify-content: none;background: linear-gradient(180deg, #146C43 0%, #0F5132 100%); border: 1px solid black; color:white">
            RECEBA AS NOVIDADES POR EMAIL
          </div>
        </div>
      </div>
      <!-- <div ref="statsSection" class="box" >
      </div> -->
    </div>
  </div>
</template>

<script>
/**
 * We are still using the Options API (classic)
 * instead of <script setup> the new recommended approach
 * in Vue 3.2+ for clean, concise code.
*/
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationStore } from '@/stores/locationStore';
import Sidebar from '../components/side_bar/SideBar.vue';
import Navbar from '../components/navbar/Navbar.vue';
import MapBox from '../components/map/mapGenerator.vue';
import Legenda from '../components/map/Legenda.vue';
import TemperatureSection from '@/components/cards/weather/TemperatureSection.vue';
import RankSection from '@/components/cards/weather/RankSection.vue';
import HeatSection from '@/components/cards/weather/HeatSection.vue';
import { useHead } from '@vueuse/head';
import YearPicker from '@/components/cards/weather/YearPicker.vue'; // Caminho para o YearPicker.vue

export default {
  name: 'MapPage',
  components: {
    Sidebar,
    MapBox,
    Navbar,
    Legenda,
    TemperatureSection,
    HeatSection,
    RankSection,
    YearPicker,
  },
  data() {
    return {
      defaultYear: null,
      firstSelectedYear: null,
      secondSelectedYear: null,
      thirdSelectedYear: null,
      cityCode: 3547809
    };
  },
  created() {
    
    this.initializeYears(2020);
  },
  watch: {
    defaultYear(newValue) {
      this.firstSelectedYear = newValue;
      this.secondSelectedYear = newValue;
      this.thirdSelectedYear = newValue;
    },

    firstSelectedYear(newValue) {
      console.log('Selected year changed to:', newValue);
    },
    secondSelectedYear(newValue) {
      console.log('Selected year changed to:', newValue);
    },
    thirdSelectedYear(newValue) {
      console.log('Selected year changed to:', newValue);
    },

  },
  methods: {

    initializeYears(defaultYear = new Date().getFullYear()) {
      this.defaultYear = defaultYear;
      this.firstSelectedYear = defaultYear;
      this.secondSelectedYear = defaultYear;
      this.thirdSelectedYear = defaultYear;
    }

  },
  setup() {
    const route = useRoute();
    const locationStore = useLocationStore();
    // Configuração das meta tags de SEO
    useHead({
      title: 'Plataforma UrbVerde: Explore dados ambientais e sociais do seu município',
      meta: [
        {
          name: 'description',
          content:
            'Acesse a Plataforma UrbVerde para explorar dados sociais e ambientais detalhados do seu município. Ferramenta gratuita feita para planejamento urbano e sustentável.',
        },
        {
          name: 'keywords',
          content:
            'plataforma de dados sociais, plataforma de dados ambientais, planejamento sustentável, cidades verdes, análise de dados municipais, sustentabilidade urbana, desenvolvimento sustentável, UrbVerde, ferramenta para planejamento urbano, dados socioambientais, acesso gratuito',
        },
        {
          property: 'og:title',
          content: 'Plataforma UrbVerde - Ferramenta de Dados para Sustentabilidade Urbana',
        },
        {
          property: 'og:description',
          content:
            'Descubra como a Plataforma UrbVerde pode ajudar a acessar e analisar dados sociais e ambientais detalhados, promovendo cidades resilientes e sustentáveis.',
        },
      ],
    });

    const coordinates = ref({ lat: null, lng: null });
    const activeSection = ref('map');
    const isSidebarOpen = ref(true);

    // Computed properties from store
    const category = computed(() => locationStore.category || 'category?');
    const currentLayer = computed(() => locationStore.layer || 'layer?');
    const cityName = computed(() => locationStore.nm_mun || 'city?');

    // const sections = {
    //   map: null,
    //   stats: null,
    //   ranking: null,
    // };

    // Methods

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const updateCoordinates = (newCoordinates) => {
      coordinates.value = newCoordinates;
      locationStore.setCoordinates(newCoordinates);

    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const navbarHeight = 100; // Adjust this value based on your navbar height
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
        const navbarHeight = 100; // Adjust this value based on your navbar height
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
      // Check if URL has ?nm_mun=..., ?cd_mun=...
      const { nm_mun, cd_mun } = route.query;
      if (nm_mun || cd_mun) {
        locationStore.setLocation({
          cd_mun: cd_mun ?? null,
          nm_mun: nm_mun ?? null,
        });

      }

      // Set coordinates from store if available
      if (locationStore.coordinates?.lat && locationStore.coordinates?.lng) {
        coordinates.value = locationStore.coordinates;
      }
      // Otherwise fetch them if we have cd_mun
      else if (cd_mun) {
        locationStore.fetchCoordinatesByCdMun(cd_mun);
      }
      // Or by name if we have nm_mun
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
      // Refs
      coordinates,
      activeSection,
      isSidebarOpen,

      // Computed properties
      category,
      currentLayer,
      cityName,

      // Methods
      updateCoordinates,
      scrollToSection,
      toggleSidebar,
    };
  }
};
</script>

<style scoped>
.global {
  background-color: #F8F9FACC;
  width: 100%;
/*   height: 100vh; */
  display: flex;
  flex-direction: column;
}

/* Flex container to hold sidebar (left) and main content (right) */
.content-wrapper {
  flex: 1;
  display: flex;
}

/* Sidebar “collapsed” style (if you want a narrower width) */
.sidebar-collapsed {
  width: 72px;
  transition: width 0.3s;
}

/* Main content takes the rest of the horizontal space */
.main-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
/*   height: 100vh; */
/*   overflow-y: auto; */
  margin-left: 72px;
  transition: margin-left 0.3s;
}

.main-wrapper.sidebar-open {
  margin-left: 301px;
}

.content-area {
  flex: 1;
  position: relative;
  display: flex;
}

.map-box {
  flex: 1;
  position: relative;
}

.legend-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 264px;
  background-color: #ffffff;
  border-radius: 16px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  z-index: 10;
}

/* Center the placeholder vertically and horizontally */
.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* margin-top: 3%; */
}

/* Placeholder image if coordinates are not set */
.map-placeholder {
  display: block;
  margin: 40px auto;
  opacity: 0.45;
}

.statistics-container {
  display: flex;
  align-items: center;
  gap: 24px;
  align-self: stretch;
}

.title-statistics-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
}

/* Just a section to hold stats or other elements */
.box {

  display: flex;
  max-width: 100%;
  padding: 40px 48px 32px 48px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;

  /* display: flex;
    flex-direction: column;
    gap: 80px;
    gap: 16px;
    margin-top: 0px;
    justify-content: center;
    padding: 32px 40px;
    justify-content: space-between;
    width: 100%;

    color: var(--Body-Text-Body-Color, #212529);
    font-family: Inter, sans-serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px; */
}
</style>
