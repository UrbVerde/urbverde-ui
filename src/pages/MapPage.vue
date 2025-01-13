  <!-- urbverde-ui/src/pages/MapPage.vue -->
  <template>
    <div class="global">

      <div class="content-wrapper">
        <!-- Sidebar -->
        <Sidebar
          :class="[{ 'sidebar-collapsed': !isSidebarOpen }]"
          :is-open="isSidebarOpen"
          @toggle-sidebar="toggleSidebar"
          @update-coordinates="updateCoordinates"
        />

        <!-- Main content (navbar, map, etc.) -->
        <div class="main-wrapper">
          <!-- If no coordinates, show a placeholder -->
          <div v-if="!coordinates?.lat || !coordinates?.lng" class="placeholder-container">
            <img src="../assets/images/setLocation.png" alt="Imagem de espera" class="map-placeholder" />
          </div>

          <div v-else>
            <Navbar
              :class="{ 'navbar-collapsed': !isSidebarOpen }"
              :active-section="activeSection"
              @navigate-to="scrollToSection"
            />

            <div id="map" ref="Mapa" class="content-area">
              <MapBox :coordinates="coordinates" class="map-box">
                <Legenda />
              </MapBox>
            </div>

            <!-- 
              Criar componente de widgets daqui pra frente: 
                procedural 
            -->
            
            <!-- Stats Section (scroll target) -->
            <div id="stats" ref="statsSection" class="box">
              Estatísticas do {{ category }} em {{ cityName }}
              <!-- <TemperatureSection /> -->
            </div>

            <!-- Pop Vulnerável -->
            <div id="vulnerable"
                ref="vulnerableSection"
                class="box"
                style="border-top: 1px solid black">
              Quem é o mais afetado pelo [calor extremo] em {{ cityName }}?
              <!-- <HeatSection/> -->
            </div>

            <!-- Ranking -->
            <div id="ranking"
                ref="rankingSection"
                class="box"
                style="border-top: 1px solid black">
              {{ cityName }} no ranking dos municípios
              <!-- <RankSection/> -->
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

  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { watchEffect } from 'vue'; 
  import { useRoute, useRouter } from 'vue-router';
  import { useLocationStore } from '@/stores/locationStore';
  import Sidebar from '../components/side_bar/SideBar.vue';
  import Navbar from '../components/navbar/Navbar.vue';
  import MapBox from '../components/map/mapGenerator.vue';
  import Legenda from '../components/map/Legenda.vue';
  // import TemperatureSection from '@/components/cards/weather/TemperatureSection.vue';
  // import RankSection from '@/components/cards/weather/RankSection.vue';
  // import HeatSection from '@/components/cards/weather/HeatSection.vue';
  import { useHead } from '@vueuse/head';

  // SEO Configuration
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

  // Store and router setup
  const route = useRoute();
  const router = useRouter();
  const locationStore = useLocationStore();

  // Refs and Computed Properties
  const coordinates = ref({ lat: null, lng: null });
  const activeSection = ref('map');
  const isSidebarOpen = ref(true);

  const category = computed(() => locationStore.category || 'category?');
  const currentLayer = computed(() => locationStore.layer || 'layer?');
  const cityName = computed(() => locationStore.nm_mun || 'city?');

  // Methods
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const updateCoordinates = (newCoordinates) => {
    coordinates.value = newCoordinates;
    // locationStore.setCoordinates(newCoordinates);
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const navbarHeight = 100; // Adjust based on your navbar height
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

  const syncStoreWithQuery = async () => {
    const query = route.query;
    // console.log('Syncing store with query:', query);

    if (Object.keys(query).length > 0) {
      locationStore.updateFromQueryParams(query);
      
      // If we have a municipal code and coordinates aren't set, fetch them
      if (locationStore.cd_mun && (!coordinates.value?.lat || !coordinates.value?.lng)) {
        try {
          const response = await fetch(`${API_URLS.SUGGESTIONS}?query=${locationStore.nm_mun}`);
          const data = await response.json();
          
          if (data && data.length > 0 && data[0].coordinates) {
            coordinates.value = data[0].coordinates;
            locationStore.setCoordinates(data[0].coordinates);
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      }
    }
  };

  // Lifecycle hooks

  onMounted(() => {
    syncStoreWithQuery();
    window.addEventListener('scroll', handleScroll);

    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => scrollToSection(sectionId), 100);
    }
    handleScroll();
  });

  watchEffect(() => {
    const storeParams = locationStore.urlParams;
    const currentQuery = route.query;
    if (Object.keys(storeParams).length > 0 && 
        JSON.stringify(storeParams) !== JSON.stringify(currentQuery)) {
      const currentHash = window.location.hash;
      router.replace({ 
        path: '/mapa',
        query: storeParams,
        hash: currentHash 
      });
    }
  });


  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  </script>

  <style scoped>
    .global {
      background-color: #F8F9FACC;
      width: 100%;
      height: 100vh;
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
      height: 100vh;
      overflow-y: auto;
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
      height: 100%;
      margin-top: 3%;
    }

    /* Placeholder image if coordinates are not set */
    .map-placeholder {
      display: block;
      margin: 40px auto;
      opacity: 0.45;
    }

    /* Just a section to hold stats or other elements */
    .box {
      display: flex;
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
      line-height: 24px;
    }
  </style>
