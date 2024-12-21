<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import maplibregl from 'maplibre-gl';

export default {
  props: {
    coordinates: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      map: null, // Adicionado para armazenar a instância do mapa
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      this.map = new maplibregl.Map({
        container: this.$refs.mapContainer,
        style: 'https://api.maptiler.com/maps/streets-v2-light/style.json?key=eizpVHFsrBDeO6HGwWvQ',
        center: [this.coordinates.lng, this.coordinates.lat],
        pitch: 20,
        zoom: 14,
      });

      this.map.on('load', () => {
        console.log('Mapa carregado completamente');
        this.mapLoaded = true;
        this.updateMapCenter(); // Atualiza o centro após o carregamento completo
      });

      // Adicione aqui quaisquer controles ou listeners que você queira

      // Exemplo: Adicionar controles de navegação
      this.map.addControl(new maplibregl.NavigationControl());

      console.log('Mapa inicializado com coordenadas:', this.coordinates);
    },
    updateMapCenter() {
      console.log('Tentando atualizar o centro do mapa');
      if (this.map) {
        console.log('Mapa existe, atualizando para:', this.coordinates);
        this.map.setCenter([this.coordinates.lng, this.coordinates.lat]);
      } else {
        console.log('Mapa não inicializado');
      }
    },
  },
  watch: {
    coordinates: {
      handler(newCoordinates) {
        this.updateMapCenter();
        console.log('mapGenerator.vue - Novas coordenadas recebidas:', newCoordinates);
      },
      deep: true,
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      console.log('Mapa removido');
    }
  },
};
</script>

  <style scoped>
  .map-container {
    margin-top: 140px;
    margin-left: 290px;
    width: 1200px;
    height: 550px;;
    border-radius: 15px;
  }
  </style>
