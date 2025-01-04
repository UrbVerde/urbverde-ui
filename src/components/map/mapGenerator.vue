<!-- urbverde-ui/src/components/map/mapGenerator.vue -->
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
      validator: (value) => {
        return value.lat !== null && value.lng !== null;
      }
    }
  },
  data() {
    return {
      map: null,
      mapLoaded: false
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      if (!this.coordinates.lat || !this.coordinates.lng) {
        console.warn('Invalid coordinates for map initialization');
        return;
      }

      this.map = new maplibregl.Map({
        container: this.$refs.mapContainer,
        style: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ', //!CHAVE EXPOSTA
        center: [this.coordinates.lng, this.coordinates.lat],
        pitch: 20,
        zoom: 14
      });

      this.map.on('load', () => {
        console.log('Map loaded successfully');
        this.mapLoaded = true;
      });

      this.map.addControl(new maplibregl.NavigationControl());
    },
    updateMapCenter() {
      if (this.map && this.mapLoaded && this.coordinates.lat && this.coordinates.lng) {
        console.log('Updating map center to:', this.coordinates);
        this.map.flyTo({
          center: [this.coordinates.lng, this.coordinates.lat],
          zoom: 14,
          duration: 10000,
          essential: true
        });
      }
    }
  },
  watch: {
    coordinates: {
      handler(newCoordinates) {
        console.log('MapBox received new coordinates:', newCoordinates);
        this.updateMapCenter();
      },
      deep: true
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      console.log('Map removed');
    }
  }
};
</script>

<style scoped>
.map-container {
  margin-top: 140px;
  margin-left: 290px;
  width: 1200px;
  height: 550px;
  border-radius: 15px;
}
</style>