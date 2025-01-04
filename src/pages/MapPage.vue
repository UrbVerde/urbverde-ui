<!-- urbverde-ui/src/pages/MapPage.vue -->
<template>
  <div class="global">
    <!-- Custom warning alert -->
    <div v-if="showWarning" class="warning-alert">
      <button class="close-button" @click="closeWarning">✕</button>
      <div class="warning-text">
        <h3>ERRO: A API de localização atingiu seu limite! :(</h3>
        <span>Usando suas coordenadas locais temporariamente. Isso não acontecerá mais nas versões futuras da UrbVerde, logo resolvo.</span>
      </div>
    </div>

    <Sidebar
      :is-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
      @update-coordinates="updateCoordinates"
      @api-error="handleApiError"
    />
    <div v-if="!coordinates.lat || !coordinates.lng">
      <img
        src="../assets/images/setLocation.png"
        alt="Imagem de espera"
        class="map-placeholder"
      >
    </div>
    <div
      :class="['painel', { 'painel-collapsed': !isSidebarOpen }]"
      v-else
    >
      <Navbar
        :class="{ 'navbar-collapsed': !isSidebarOpen }"
        @scroll-to-stats="scrollToStats"
        @scroll-to-map="scrollToMap"
      />
      <div ref="mapSection">
        <MapBox :coordinates="coordinates" />
      </div>
      <div class="legend">
        <Legenda />
      </div>
      <div ref="statsSection" class="box" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Sidebar from '../components/side_bar/SideBar.vue';
import Navbar from '../components/navbar/Navbar.vue';
import MapBox from '../components/map/mapGenerator.vue';
import Legenda from '../components/map/Legenda.vue';

export default {
  name: 'MapPage',
  components: {
    Sidebar,
    MapBox,
    Navbar,
    Legenda
  },
  setup() {
    const coordinates = ref({ lat: null, lng: null });
    const statsSection = ref(null);
    const isSidebarOpen = ref(true);
    const showWarning = ref(false);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const updateCoordinates = (newCoordinates) => {
      coordinates.value = newCoordinates;
    };

    const handleApiError = () => {
      showWarning.value = true;
    };

    const closeWarning = () => {
      showWarning.value = false;
    };

    const scrollToStats = () => {
      if (statsSection.value) {
        statsSection.value.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const scrollToMap = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
      coordinates,
      updateCoordinates,
      scrollToStats,
      scrollToMap,
      statsSection,
      isSidebarOpen,
      toggleSidebar,
      showWarning,
      handleApiError,
      closeWarning
    };
  }
};
</script>

<style>
.global {
  background-color: #F8F9FACC;
  width: 100%;
  height: 100vh;
}

.warning-alert {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #ffebeb;
  padding: 1rem;
  max-width: 28rem;
  z-index: 1000;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-text {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 1.5rem;
  color: #dc2626;
}

.warning-text h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.warning-text span {
  font-size: 0.875rem;
  line-height: 1.4;
}

.close-button {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  line-height: 1;
}

.close-button:hover {
  opacity: 0.8;
}

.map-placeholder {
  display: flex;
  justify-self: center;
  transform: translate(-10%, 160%);
  width: 280px;
  height: 175px;
  margin-left: 252px;
}

.painel {
  transition: 0.6s ease;
}

.painel-collapsed {
  margin-left: -100px;
  transition: 0.6s ease;
}

.legend {
  position: absolute;
  top: 170px;
  right: 60px;
}

.box {
  display: flex;
  gap: 80px;
  margin-top: 110px;
  justify-content: center;
}

.static {
  padding: 26px 30px;
  background-color: rgb(176, 171, 171);
  border-radius: 16px;
}
</style>