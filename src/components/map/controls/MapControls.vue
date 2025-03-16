<!-- src/components/map/controls/MapControls.vue -->
<template>
  <div>
    <BasemapSwitcher
      :map="map"
      :current-style="currentStyle"
      @style-change="onStyleChange"
    />

    <!--
    <TerrainControl
      :map="map"
      :enabled="terrainEnabled"
      @toggle="onTerrainToggle"
    />
    -->

    <LocationControl
      :map="map"
      @location-found="onLocationFound"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import BasemapSwitcher from './BasemapSwitcher.vue';
import LocationControl from './LocationControl.vue';

defineProps({
  map: {
    type: Object,
    required: true
  },
  currentStyle: {
    type: String,
    default: 'streets'
  },
  terrainEnabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['style-change', 'terrain-toggle', 'location-found']);

// Pass events up to parent
function onStyleChange(data) {
  emit('style-change', data);
}

function onLocationFound(coords) {
  emit('location-found', coords);
}
</script>
