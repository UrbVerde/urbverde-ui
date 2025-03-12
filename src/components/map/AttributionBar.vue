<template>
  <div class="attribution-bar">
    <div class="scale-content">
      <div ref="scaleMount" class="scale-widget"></div>
    </div>
    <div class="attribution">
      <!--
      <div class="scale-proportion body-caption-regular">Escala {{ scaleProportion }}</div>
      -->
      <div class="coordinates body-caption-regular">
        <div class="coordinates-lat">
          {{ mouseCoordinates.lat }}
        </div>
        <div class="coordinates-lng">
          {{ mouseCoordinates.lng }}
        </div>
      </div>
      <div v-if="hasValidAltitude" class="altitude body-caption-regular">{{ mouseAltitude }}</div>
      <div class="sources">
        <span class="body-caption-medium">Fonte: {{ truncatedSource }}</span>
        <a href="#" class="more-link body-caption-medium" @click.prevent="openMapInfoModal">{{ moreButtonText }}</a>
      </div>
    </div>

    <!-- Modal component -->
    <modalMapInfo ref="mapInfoModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import modalMapInfo from '../modal/modalMapInfo.vue';
import { useLocationStore } from '@/stores/locationStore';

const props = defineProps({
  map: {
    type: Object,
    required: true
  },
  scaleProportion: {
    type: String,
    default: '1:100'
  },
  coordinates: {
    type: Object,
    default: () => ({
      lat: "23°33'34\"S",
      lng: "46°53'57\"W"
    })
  },
  altitude: {
    type: String,
    default: '- m'
  }
});

const locationStore = useLocationStore();
const mapInfoModal = ref(null);
const scaleMount = ref(null);
let scaleControl = null;

// Reactive variables to hold mouse position
const mouseCoordinates = reactive({
  lat: props.coordinates.lat,
  lng: props.coordinates.lng
});
const mouseAltitude = ref(props.altitude);

const hasValidAltitude = computed(() => mouseAltitude.value !== '- m' && mouseAltitude.value !== '');

// Get current layer from locationStore, for the modal
const currentLayer = computed(() => locationStore.currentLayerName || '');

const currentSource = computed(() => {
  if (!mapInfoModal.value || !currentLayer.value) {
    return '';
  }

  return mapInfoModal.value.layerSources[currentLayer.value] || '';
});

const truncatedSource = computed(() => {
  if (!currentSource.value) {
    return '';
  }

  // Truncate to 20 characters
  return `${currentSource.value.substring(0, 20)  }...`;
});

const moreButtonText = computed(() => currentSource.value ? 'Ver mais' : 'Ver fontes dos dados');

const openMapInfoModal = () => {
  if (mapInfoModal.value) {
    mapInfoModal.value.show();
  }
};

// Function to format coordinates to degrees, minutes, seconds
const formatDMS = (coordinate, isLat) => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  let cardinal = '';
  if (isLat) {
    cardinal = coordinate >= 0 ? 'N' : 'S';
  } else {
    cardinal = coordinate >= 0 ? 'E' : 'W';
  }

  return `${degrees}°${minutes}'${seconds}"${cardinal}`;
};

// Event handlers
const handleMouseMove = (e) => {
  // Update coordinates
  mouseCoordinates.lat = formatDMS(e.lngLat.lat, true);
  mouseCoordinates.lng = formatDMS(e.lngLat.lng, false);

  // If there's terrain data or a DEM source in the map, we can get the elevation
  if (props.map.getTerrain && props.map.queryTerrainElevation) {
    const elevation = props.map.queryTerrainElevation(e.lngLat);
    if (elevation !== null && elevation !== undefined) {
      mouseAltitude.value = `${Math.round(elevation)} m`;
    } else {
      mouseAltitude.value = '- m';
    }
  } else {
    // Se não houver dados de elevação disponíveis
    mouseAltitude.value = '- m';
  }
};

onMounted(() => {
  scaleControl = new maplibregl.ScaleControl({
    maxWidth: 88,
    unit: 'metric'
  });

  const scaleEl = scaleControl.onAdd(props.map);
  scaleMount.value.appendChild(scaleEl);
  props.map.on('mousemove', handleMouseMove);
});

onBeforeUnmount(() => {
  if (scaleControl && props.map) {
    scaleControl.onRemove(props.map);
  }

  if (props.map) {
    props.map.off('mousemove', handleMouseMove);
  }
});
</script>

<style scoped lang="scss">

.attribution-bar {
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  width: auto;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.attribution {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  padding: 0 8px 0 2px;
  background: rgba(248, 249, 250, 0.70);
  backdrop-filter: blur(20px);
  color: map-get($body-text, body-color);
  border-radius: 4px 0 0 0;
}

.scale-content {
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: end;
  border-radius: 4px 0 0 0;
  width: 88px;
  height: 24px;
}

.scale-widget {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 2px 0;
}

.scale-proportion, .coordinates, .altitude, .sources {
  display: flex;
  align-items: center;
  justify-content: right;
}

.sources{
  margin-left: 12px;
}

.coordinates{
  gap: 6px;
}

.coordinates-lat{
  display: flex;
  min-width: 72px;
  justify-content: right;
}
.coordinates-lng{
  display: flex;
  min-width: 72px;
  justify-content: right;
}

.altitude {
  margin-left: 4px;
  min-width: 48px;
}

.more-link {
  color: map-get($theme, primary);
  text-decoration: underline;
  text-decoration-color: map-get($theme, primary);
}

:deep(.maplibregl-ctrl) {
  margin: 0;
}

:deep(.maplibregl-ctrl-scale) {
  background-color: rgba(248, 249, 250, 0.70);
  border-color: map-get($body-text, body-color);
  color: map-get($body-text, body-color);
  margin: 0;
  font-size: 12px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  position: relative;
  text-align: center;
  width: 100%;
}

@media screen and (max-width: 700px) {
  .attribution-bar {
    display: none;
  }
}
</style>
