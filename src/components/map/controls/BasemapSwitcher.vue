<!-- urbverde-ui/src/components/map/controls/BasemapSwitcher.vue -->
<template>
  <div class="map-style-switcher" @click="toggleSatellite">
    <div class="map-style-wrapper">
      <img
        :src="isSatellite ? satelliteOffImg : satelliteOnImg"
        class="style-thumbnail"
      />
      <div class="gradient-overlay"></div>
      <div class="style-label body-caption-medium">{{ isSatellite ? 'Mapa' : 'Satélite' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  map: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['satellite-toggle']);

const isSatellite = ref(false);
const satelliteOnImg = 'https://cloud.maptiler.com/static/img/maps/hybrid.png';
const satelliteOffImg = 'https://cloud.maptiler.com/static/img/maps/streets.png';

function toggleSatellite() {
  if (!props.map) {return;}

  isSatellite.value = !isSatellite.value;

  if (isSatellite.value) {
    props.map.setStyle('https://api.maptiler.com/maps/hybrid/style.json?key=eizpVHFsrBDeO6HGwWvQ');
  } else {
    props.map.setStyle('https://api.maptiler.com/maps/basic-v2/style.json?key=eizpVHFsrBDeO6HGwWvQ');
  }

  emit('satellite-toggle', isSatellite.value);
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
