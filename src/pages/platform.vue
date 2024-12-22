<template>
  <div class="global">
    <Sidebar :is-open="isSidebarOpen"
             @toggle-sidebar="toggleSidebar"
             @update-coordinates="updateCoordinates" />

    <div v-if="!coordinates.lat || !coordinates.lng">
      <img src="../assets/images/setLocation.png" alt="Imagem de espera" class="map-placeholder">
    </div>

    <div v-else :class="['painel', { 'painel-collapsed': !isSidebarOpen }]">
      <Navbar :class="{ 'navbar-collapsed': !isSidebarOpen }"  @scrollToStats="scrollToStats" @scrollToMap="scrollToMap" />

      <!-- Adicionar o ref "mapSection" para a div do mapa -->
      <div ref="mapSection">
        <MapBox :coordinates="coordinates" />
      </div>

      <div class="legend">
        <Legenda />
      </div>

      <!-- Seção de Estatísticas -->
      <div ref="statsSection" class="box">

      </div>

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
  components: {
    Sidebar,
    MapBox,
    Navbar,
    Legenda,
  },
  setup() {
    const coordinates = ref({ lat: null, lng: null });

    // Referências para o mapa e a seção de estatísticas
    const statsSection = ref(null);

    // Controle de estado da sidebar
    const isSidebarOpen = ref(true);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const updateCoordinates = (newCoordinates) => {
      coordinates.value = newCoordinates;
    };

    // Função que faz scroll até a seção de estatísticas
    const scrollToStats = () => {
      if (statsSection.value) {
        statsSection.value.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Função que faz scroll até o topo da página
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
      toggleSidebar
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
