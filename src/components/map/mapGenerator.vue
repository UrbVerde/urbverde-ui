<!-- urbverde-ui/src/components/map/mapGenerator.vue -->
<template>
  <div ref="mapContainer" class="map-container">
    <!-- Loading State -->
    <div v-if="isLoadingCoordinates" class="map-loading">
      <div class="loading-spinner"></div>
      <p>Carregando mapa...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="showError" class="error-placeholder">
      <div class="error-content">
        <span class="error-icon">🗺️</span>
        <p class="error-text">{{ errorMessage }}</p>
        <p class="error-text">Selecione uma cidade para visualizar no mapa</p>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, onBeforeUnmount, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import { useLocationStore } from '@/stores/locationStore';
import { useRoute, useRouter } from 'vue-router';
import CustomHash from './customHash';

// Store and Router
const locationStore = useLocationStore();
const route = useRoute();
const router = useRouter();

// Refs
const mapContainer = ref(null);
const map = ref(null);
const customHash = ref(null);
const coordinates = ref(null);
const isLoadingCoordinates = ref(false);
const errorMessage = ref('Selecione uma cidade para visualizar no mapa');
const mapLoaded = ref(false);
const mapVisible = ref(false);
const showError = ref(false);

// Constants
const MAP_ZOOM_START = 12;
const MAP_ZOOM_FINAL = 17;
const MAP_ANIMATION_DURATION = 8000;

// Handle coordinate fetching
watchEffect(() => {
  if (locationStore.cd_mun) {
    loadCoordinates(locationStore.cd_mun);
  }
});

async function loadCoordinates(code) {
  console.log('Loading coordinates for code:', code);
  isLoadingCoordinates.value = true;

  try {
    const coords = await locationStore.fetchCoordinatesByCode(code);
    console.log('Received coordinates:', coords);

    if (coords?.lat && coords?.lng) {
      coordinates.value = coords;
      showError.value = false;

      if (map.value) {
        console.log('Updating map position to:', coords);
        map.value.flyTo({
          center: [coords.lng, coords.lat],
          zoom: MAP_ZOOM_FINAL,
          duration: MAP_ANIMATION_DURATION,
          essential: true
        });
      } else {
        console.log('Initializing new map');
        initializeMap();
      }
    } else {
      console.warn('Invalid coordinates received');
      showError.value = true;
    }
  } catch (error) {
    console.error('Error loading coordinates:', error);
    showError.value = true;
  } finally {
    isLoadingCoordinates.value = false;
  }
}

function handleMissingImage(e) {
  const imageId = e.id ? e.id.trim() : null;
  if (!imageId || imageId === '') {return;}

  if (!map.value.hasImage(imageId)) {
    const placeholder = {
      width: 1,
      height: 1,
      data: new Uint8Array(4).fill(0),
    };
    map.value.addImage(imageId, placeholder);
  }
}

function checkCoordinates() {
  if (!coordinates.value?.lat || !coordinates.value?.lng ||
      coordinates.value.lat === 0 || coordinates.value.lng === 0) {
    showError.value = true;

    return;
  }
  showError.value = false;
  initializeMap();
}

// Add computed properties
const layerSource = computed(() => ({
  type: 'raster',
  generateId: true,
  tiles: [
    'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3Atst-intraurbana-rel-30m-2021a2016&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng',
  ],
}));

// Add layer management functions
function addMapLayers() {
  if (!map.value) {return;}

  // Remove existing layer if it exists
  if (map.value.getLayer('wms-layer')) {
    map.value.removeLayer('wms-layer');
  }
  if (map.value.getSource('wms-source')) {
    map.value.removeSource('wms-source');
  }

  // Add WMS layer
  map.value.addSource('wms-source', layerSource.value);
  map.value.addLayer({
    id: 'wms-layer',
    type: 'raster',
    source: 'wms-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
}

// Update initializeMap function
function initializeMap() {
  if (showError.value || !coordinates.value) {return;}

  // Check for hash coordinates first
  let initialState = {
    center: [coordinates.value.lng, coordinates.value.lat],
    zoom: MAP_ZOOM_START,
    pitch: 20
  };

  // Parse hash if it exists
  const hash = window.location.hash.slice(1);
  if (hash) {
    const match = hash.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z(?:,(\d+)b,(\d+)p)?/);
    if (match) {
      initialState = {
        center: [parseFloat(match[2]), parseFloat(match[1])],
        zoom: parseFloat(match[3]),
        pitch: match[5] ? parseInt(match[5]) : 20,
        bearing: match[4] ? parseInt(match[4]) : 0
      };
    }
  }

  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
    ...initialState,
    attributionControl: false,
  });

  customHash.value = new CustomHash();
  customHash.value.addTo(map.value);

  map.value.on('styleimagemissing', handleMissingImage);
  map.value.on('zoomend', () => {
    const zoom = map.value.getZoom();
    updateScaleBasedOnZoom(zoom);
  });

  map.value.on('load', () => {
    mapVisible.value = true;
    mapLoaded.value = true;
    isLoadingCoordinates.value = false;

    // Add WMS layers after map is loaded
    addMapLayers();

    updateScaleBasedOnZoom(map.value.getZoom());

    if (!hash) {
      map.value.flyTo({
        center: [coordinates.value.lng, coordinates.value.lat],
        zoom: MAP_ZOOM_FINAL,
        duration: MAP_ANIMATION_DURATION,
        essential: true
      });
    }
  });
}

function updateScaleBasedOnZoom(zoom) {
  let newScale;
  if (zoom >= 12) {
    newScale = 'intraurbana';
  } else if (zoom >= 6) {
    newScale = 'municipal';
  } else if (zoom > 3) {
    newScale = 'estadual';
  } else {
    newScale = 'nacional';
  }

  if (locationStore.scale !== newScale) {
    // Get current hash before update
    const currentHash = window.location.hash;

    // Update location store with new scale
    locationStore.setLocation({ scale: newScale });

    // Update URL query params
    const newQuery = {
      ...route.query,
      scale: newScale
    };

    // Keep the hash during URL update
    router.replace({
      query: newQuery,
      hash: currentHash.slice(1) // Remove the # from the hash
    });
  }
}

// Add cleanup for layers in the cleanupMap function
// function cleanupMap() {
//   if (map.value) {
//     if (map.value.getLayer('wms-layer')) {
//       map.value.removeLayer('wms-layer');
//     }
//     if (map.value.getSource('wms-source')) {
//       map.value.removeSource('wms-source');
//     }

//     mapVisible.value = false;
//     if (customHash.value) {
//       customHash.value.remove();
//       customHash.value = null;
//     }
//     map.value.remove();
//     map.value = null;
//   }
// }

// Add watch effect for layer updates based on store changes
watchEffect(() => {
  if (map.value && mapLoaded.value) {
    addMapLayers();
  }
});

// Lifecycle hooks
onMounted(() => {
  checkCoordinates();
});

onBeforeUnmount(() => {
  if (map.value) {
    mapVisible.value = false;
    if (customHash.value) {
      customHash.value.remove();
    }
    setTimeout(() => {
      map.value.remove();
    }, 300);
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: calc(100% - 48px);
  height: calc(100vh - 35px - 144px);
  border-radius: 15px;
  margin: 0px 24px 0;
  background: #F8F9FA;
  cursor: pointer !important; /* Always show pointer cursor */
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
