<!-- src/components/map/controls/BasemapSwitcher.vue -->
<template>
  <div class="map-style-switcher" @click="toggleStyle">
    <div class="map-style-wrapper">
      <img
        :src="getAlternativeStyle().img"
        class="style-thumbnail"
      />
      <div class="gradient-overlay"></div>
      <div class="style-label body-caption-medium">{{ getAlternativeStyle().label }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  map: {
    type: Object,
    required: true
  },
  currentStyle: {
    type: String,
    default: 'streets'
  }
});

const emit = defineEmits(['style-change']);

// Define available styles
const styles = [
  {
    id: 'streets',
    label: 'Mapa',
    img: 'https://cloud.maptiler.com/static/img/maps/streets.png',
    url: 'https://api.maptiler.com/maps/streets-v2/style.json?key=eizpVHFsrBDeO6HGwWvQ'
  },
  {
    id: 'satellite',
    label: 'Satélite',
    img: 'https://cloud.maptiler.com/static/img/maps/hybrid.png',
    url: 'https://api.maptiler.com/maps/hybrid/style.json?key=eizpVHFsrBDeO6HGwWvQ'
  }
];

// Get the alternative style (the one that's not currently selected)
function getAlternativeStyle() {
  return styles.find(style => style.id !== props.currentStyle) || styles[0];
}

// Toggle between styles with all functionality included
function toggleStyle() {
  const nextStyle = getAlternativeStyle();

  if (!props.map) {return;}

  // Save current state
  const center = props.map.getCenter();
  const zoom = props.map.getZoom();
  const bearing = props.map.getBearing();
  const pitch = props.map.getPitch();

  // Store visible layers
  const visibleLayers = [];
  const layers = props.map.getStyle().layers || [];
  for (const layer of layers) {
    const visibility = props.map.getLayoutProperty(layer.id, 'visibility');
    if (visibility !== 'none') {
      visibleLayers.push(layer.id);
    }
  }

  // Apply new style
  props.map.setStyle(nextStyle.url);

  // Restore state when style loads
  props.map.once('style.load', () => {
    // Restore camera position
    props.map.setCenter(center);
    props.map.setZoom(zoom);
    props.map.setBearing(bearing);
    props.map.setPitch(pitch);

    // Notify parent component
    emit('style-change', { id: nextStyle.id, url: nextStyle.url, visibleLayers });
  });
}
</script>

<style scoped lang="scss">
.map-style-switcher {
  background: map-get($gray, 100);
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  border-radius: 8px;
  border: 2px solid map-get($gray, 100);
  bottom: 16px;
  left: 16px;
  height: 80px;
  width: 80px;
  position: absolute;
  overflow: hidden;
  z-index: 7;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.map-style-wrapper {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 53.91%, rgba(0, 0, 0, 0.80) 93.18%);
  z-index: 1;
  pointer-events: none;
  transition: 0.3s;
}

.map-style-switcher:hover .gradient-overlay {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 30%, rgba(0, 0, 0, 0.80) 80%);
}

.map-style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.style-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.style-label {
  position: absolute;
  bottom: 8px;
  color: map-get($gray, white);
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
