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
    <div v-else :class="['map-wrapper', { 'visible': mapVisible }]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import maplibregl from 'maplibre-gl';

export default {
  props: {
    coordinates: {
      type: Object,
      required: true,
      default: () => ({ lat: 0, lng: 0 }),
      validator: (value) => typeof value.lat === 'number' && typeof value.lng === 'number',
    },
  },
  data() {
    return {
      map: null,
      mapLoaded: false,
      mapVisible: false,
      showError: false,
      // Standardized map settings
      MAP_ZOOM_START: 12,
      MAP_ZOOM_FINAL: 17,
      MAP_ANIMATION_DURATION: 8000,
    };
  },
  mounted() {
    this.checkCoordinates();
  },
  methods: {
    checkCoordinates() {
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
    handleMissingImage(e) {
      const imageId = e.id ? e.id.trim() : null;
      if (!imageId || imageId === '') {
        // console.warn('Imagem ausente detectada, mas sem ID válido ou ID vazio.');
        return;
      }

      if (!this.map.hasImage(imageId)) {
        console.warn(`Adicionando imagem de placeholder para: ${imageId}`);
        const placeholder = {
          width: 1,
          height: 1,
          data: new Uint8Array(4).fill(0), // RGBA transparente
        };
        this.map.addImage(imageId, placeholder);
      } else {
        return;
        // console.warn(`Imagem com ID ${imageId} já existe.`);
      }
    },
    initializeMap() {
      if (this.showError) {return;}

      this.mapLoaded = false;
      this.mapVisible = false;

      this.map = new maplibregl.Map({
        container: this.$refs.mapContainer,
        style: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
        center: [this.coordinates.lng, this.coordinates.lat],
        pitch: 20,
        zoom: this.MAP_ZOOM_START,
        attributionControl: false,
        fadeDuration: 0,
      });

      // Listener para imagens ausentes
      this.map.on('styleimagemissing', this.handleMissingImage);

      this.map.on('load', () => {
        this.mapVisible = true;

        setTimeout(() => {
          this.map.flyTo({
            center: [this.coordinates.lng, this.coordinates.lat],
            zoom: this.MAP_ZOOM_FINAL,
            duration: this.MAP_ANIMATION_DURATION,
            essential: true,
          });
          this.mapLoaded = true;
        }, 300);
      });
    },
    updateMapCenter() {
      if (!this.coordinates || !this.coordinates.lat || !this.coordinates.lng) {
        this.showError = true;
        if (this.map) {
          this.mapVisible = false;
          setTimeout(() => {
            this.map.remove();
            this.map = null;
          }, 300);
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
          zoom: this.MAP_ZOOM_FINAL,
          duration: this.MAP_ANIMATION_DURATION,
          essential: true,
        });
      }
    },
  },
  watch: {
    coordinates: {
      handler() {
        this.updateMapCenter();
      },
      deep: true
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.mapVisible = false;
      setTimeout(() => {
        this.map.remove();
      }, 300);
    }
  }
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: calc(100% - 48px);
  height: calc(100vh - 35px - 144px);
  border-radius: 15px;
  margin: 0px 24px 0;
  background: #F8F9FA;
  cursor: pointer; /* Change cursor to hand */
}

.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none; /* Make it clickable through */
}

.map-wrapper.visible {
  opacity: 1;
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
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
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
