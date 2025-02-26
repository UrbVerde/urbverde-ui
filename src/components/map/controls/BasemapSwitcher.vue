<!-- src/components/map/controls/BasemapSwitcher.vue -->
<template>
  <div class="map-style-switcher" @click="toggleStyle">
    <div class="map-style-option">
      <img
        :src="getAlternativeStyle().img"
        class="style-thumbnail"
      />
      <div class="style-label">{{ getAlternativeStyle().label }}</div>
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

<style scoped>
.map-style-switcher {
  background: #fff;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  border-radius: 8px;
  border: 2px solid #fff;
  bottom: 20px;
  left: 20px;
  height: 79px;
  width: 79px;
  position: absolute;
  overflow: hidden;
  z-index: 7;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.map-style-switcher:hover {
  transform: scale(1.05);
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
  width: 60px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.style-label {
  margin-top: 4px;
  font-family: Roboto, Arial, sans-serif;
  font-size: 12px;
  color: #3c4043;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.7);
}
</style>
