<!-- urbverde-ui/src/components/map/controls/ZoomControl.vue -->
<template>
  <div class="zoom-controls">
    <button class="zoom-button zoom-in" @click="zoomIn" :disabled="atMaxZoom">+</button>
    <button class="zoom-button zoom-out" @click="zoomOut" :disabled="atMinZoom">−</button>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  map: {
    type: Object,
    required: true
  }
});

const atMaxZoom = ref(false);
const atMinZoom = ref(false);

// Check zoom constraints when map zoom changes
function updateZoomButtons() {
  if (!props.map) {return;}

  const currentZoom = props.map.getZoom();
  const maxZoom = props.map.getMaxZoom();
  const minZoom = props.map.getMinZoom();

  atMaxZoom.value = currentZoom >= maxZoom;
  atMinZoom.value = currentZoom <= minZoom;
}

// Zoom in by 1 level
function zoomIn() {
  if (!props.map || atMaxZoom.value) {return;}
  props.map.zoomIn();
}

// Zoom out by 1 level
function zoomOut() {
  if (!props.map || atMinZoom.value) {return;}
  props.map.zoomOut();
}

// Watch for map zoom changes to update button states
watch(() => props.map, (newMap) => {
  if (newMap) {
    updateZoomButtons();
    newMap.on('zoom', updateZoomButtons);
  }
}, { immediate: true });
</script>

  <style scoped>
  .zoom-controls {
    display: flex;
    flex-direction: column;
  }

  .zoom-button {
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    border-radius: 2px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    padding: 0;
    color: #333;
    transition: background-color 0.2s;
  }

  .zoom-button:hover:not(:disabled) {
    background-color: #f5f5f5;
  }

  .zoom-button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  </style>
