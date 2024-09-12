<template>
  <div class="container">
      <Sidebar @update-coordinates="updateCoordinates" />

      <!-- Renderizando o componente MapBox -->
      <MapBox :coordinates="coordinates" />
    
  </div>
</template>


<script>
import { ref } from 'vue';
import Sidebar from './components/side_bar/SideBar.vue';
import MapBox from './components/map/mapGenaretor.vue'; // Certifique-se de que o caminho está correto

export default {
  components: {
    Sidebar,
    MapBox,
  },
  setup() {
    const coordinates = ref({ lat: -23.55052, lng: -46.633309 });

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

</style>
