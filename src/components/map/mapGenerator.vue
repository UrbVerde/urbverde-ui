<!-- urbverde-ui/src/components/map/mapGenerator.vue -->
<template>
  <div ref="mapContainer" class="map-container">
    <!-- Error Placeholder -->
    <div v-if="showError" class="error-placeholder">
      <div class="error-content">
        <span class="error-icon">🗺️</span>
        <p class="error-text">Selecione uma cidade para visualizar no mapa</p>
      </div>
    </div>
    <slot v-else></slot> <!-- This allows child components to render inside MapBox -->
  </div>
</template>

<script>
import maplibregl from 'maplibre-gl';

export default {
  props: {
    coordinates: {
      type: Object,
      required: true,
      default: () => ({ lat: 0, lng: 0 }), // Avoid undefined errors
      validator: (value) => {
        return typeof value.lat === 'number' && typeof value.lng === 'number';
      },
    },
  },
  data() {
    return {
      map: null,
      mapLoaded: false,
      showError: false
    };
  },
  mounted() {
    this.checkCoordinates();
    // this.initializeMap();
  },
  methods: {
    checkCoordinates() {
      // Check if coordinates are valid
      if (!this.coordinates || 
          !this.coordinates.lat || 
          !this.coordinates.lng || 
          this.coordinates.lat === 0 || 
          this.coordinates.lng === 0) {
        this.showError = true;
        return;
      }
      
      this.showError = false;
      this.initializeMap();
    },
    initializeMap() {
      if (this.showError) return;

      this.map = new maplibregl.Map({
        container: this.$refs.mapContainer,
        style: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
        center: [this.coordinates.lng, this.coordinates.lat],
        pitch: 20,
        zoom: 14,
        attributionControl: false,
        NavigationControl: true,
      });

      // Add listener for missing images
      this.map.on('styleimagemissing', (e) => {
        const id = e.id; // id of the missing image
        // Create a 1x1 transparent pixel as a placeholder
        const placeholder = new Image(1, 1);
        placeholder.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';
        
        placeholder.onload = () => {
          this.map.addImage(id, placeholder);
        };
      });
      
      this.map.on('load', () => {
        console.log('Map loaded successfully');
        this.mapLoaded = true;
      });
    },
    updateMapCenter() {
      if (!this.coordinates || !this.coordinates.lat || !this.coordinates.lng) {
        this.showError = true;
        if (this.map) {
          this.map.remove();
          this.map = null;
        }
        return;
      }

      if (this.showError) {
        this.showError = false;
        this.initializeMap();
        return;
      }

      if (this.map && this.mapLoaded) {
        this.map.flyTo({
          center: [this.coordinates.lng, this.coordinates.lat],
          zoom: 16,
          duration: 8000,
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
  position: relative; /* Make this container the reference for absolute positioning */
  width: calc(100% - 48px);
  height: calc(100vh - 35px - 144px);
  border-radius: 15px;
  margin: 0px 24px 0; 
  background: #F8F9FA;
}

.error-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F8F9FA;
  border-radius: 15px;
}

.error-content {
  text-align: center;
  color: #6C757D;
}

.error-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.error-text {
  font-size: 16px;
  margin: 0;
}

</style>