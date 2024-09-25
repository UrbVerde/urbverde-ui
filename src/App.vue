<template>
  <div class="container">
    <!-- Componente Sidebar que emite o evento para atualizar as coordenadas -->
    <Sidebar @update-coordinates="updateCoordinates" />

    <!-- Exibe a imagem enquanto as coordenadas não forem alteradas -->
    <div v-if="!coordinates.lat || !coordinates.lng">
      <img src="./assets/setLocation.png" alt="Imagem de espera" class="map-placeholder">
    </div>
    
    <!-- Renderiza o componente MapBox quando há coordenadas válidas -->
    <div v-else>
      <MapBox :coordinates="coordinates" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Sidebar from './components/side_bar/SideBar.vue';
import MapBox from './components/map/mapGenerator.vue'; 

export default {
  components: {
    Sidebar,
    MapBox,
  },
  setup() {
    // Coordenadas padrão (ou nulas se preferir que não haja nada inicialmente)
    const coordinates = ref({ lat: null, lng: null });

    const updateCoordinates = (newCoordinates) => {
      coordinates.value = newCoordinates;
      console.log('App.vue - Novas coordenadas:', newCoordinates);
    };

    return { coordinates, updateCoordinates };
  }
};
</script>
<style>
.container{
  display: flex;
}

.map-placeholder{
  margin-left: 500px;
  width: 400px;
  height: 250px;
  border-radius: 15px;
}

</style>
