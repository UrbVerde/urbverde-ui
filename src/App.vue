<template>
  <div class="global">
    <Sidebar @update-coordinates="updateCoordinates" />

    <div v-if="!coordinates.lat || !coordinates.lng">
      <img src="./assets/images/setLocation.png" alt="Imagem de espera" class="map-placeholder">
    </div>

    <div v-else class="painel">
      <Navbar @scrollToStats="scrollToStats" @scrollToMap="scrollToMap" />

      <!-- Adicionar o ref "mapSection" para a div do mapa -->
      <div ref="mapSection">
        <MapBox :coordinates="coordinates" />
      </div>

      <div class="legend">
        <Legenda />
      </div>

      <!-- Seção de Estatísticas -->
      <div ref="statsSection" class="box">
        <div class="static"></div>  
        <div class="static"></div>
        <div class="static"></div>
        <div class="static"></div>
      </div>

      <div class="box">
        <div class="static"></div>  
        <div class="static"></div>
        <div class="static"></div>
        <div class="static"></div>
      </div>

      <div class="box">
        <div class="static"></div>  
        <div class="static"></div>
        <div class="static"></div>
        <div class="static"></div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Sidebar from './view/SideBar.vue';
import Navbar from './components/Navbar/Navbar.vue';
import MapBox from './components/Map/mapGenerator.vue'; 
import Legenda from './components/Map/Legenda.vue';

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

    return { coordinates, updateCoordinates, scrollToStats, scrollToMap, statsSection };
  }
};
</script>



<style>
.global {
  background-color: #F8F9FACC;
  width: 100%;
  height: 100vh; 
  display: flex; 
  flex-direction: column; 
  justify-content: center;
  align-items: center; 
}

.map-placeholder{
  width: 280px;
  height: 175px;
  margin: auto 0;
  margin-left: 252px;
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
.static{
  padding: 26px 30px;
  background-color: rgb(176, 171, 171);
  border-radius: 16px;
}

</style>