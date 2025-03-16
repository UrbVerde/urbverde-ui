<!-- urbverde-ui/src/components/map/controls/TerrainControl.vue -->

<!-- Este componente NÃO ESTÁ SENDO UTILIZADO, foi substituido pelo
 customTerrainControl.js
-->

<template>
  <div class="terrain-control" @click="toggleTerrain">
    <div class="terrain-icon">3D</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  map: {
    type: Object,
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

// Toggle terrain and handle all terrain-related functionality
function toggleTerrain() {
  if (!props.map) {return;}

  const newState = !props.enabled;

  if (newState) {
    // Setup terrain source if it doesn't exist
    if (!props.map.getSource('terrain')) {
      props.map.addSource('terrain', {
        'type': 'raster-dem',
        'url': 'https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=eizpVHFsrBDeO6HGwWvQ',
        'tileSize': 256
      });
    }

    // Enable terrain
    props.map.setTerrain({ 'source': 'terrain', 'exaggeration': 1.5 });

    // Hide building layers
    toggleBuildingLayers(false);
  } else {
    // Disable terrain
    props.map.setTerrain(null);

    // Show building layers
    toggleBuildingLayers(true);
  }

  // Notify parent component
  emit('toggle', newState);
}

// Helper function to toggle building layers
function toggleBuildingLayers(visible) {
  if (!props.map) {return;}

  const layers = props.map.getStyle().layers;
  for (const layer of layers) {
    if (layer.type === 'fill-extrusion' && layer.id.toLowerCase().includes('building')) {
      props.map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
    }
  }
}
</script>

  <style scoped lang="scss">
  .terrain-control {
    background: map-get($gray, white);
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    border-radius: 8px;
    border: 2px solid map-get($gray, white);
    position: absolute;
    bottom: 16px;
    left: 110px; /* Position to the right of style switcher */
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 7;
    transition: transform 0.2s ease;
  }

  .terrain-control:hover {
    background: map-get($gray, 200);
  }

  .terrain-icon {
    font-family: Roboto, Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: map-get($gray, 800);
  }
  </style>
