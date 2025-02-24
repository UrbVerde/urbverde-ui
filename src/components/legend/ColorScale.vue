<!-- urbverde-ui/src/components/legend/ColorScale.vue -->
<!-- src/components/legend/LegendColorScale.vue -->
<template>
  <div class="colorbar-container" @click="openColorOptions">
    <div class="gradient-bar" :style="{ background: computedGradient }"></div>
    <div class="label-container">
      <span class="min-label">{{ minStop }}{{ unit || '' }}</span>
      <span class="center-label">{{ centerStop }}{{ unit || '' }}</span>
      <span class="max-label">{{ maxStop }}{{ unit || '' }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getLayerConfig } from '@/constants/layers.js';

const props = defineProps({
  currentLayerId: { type: String, required: true },
  currentYear: { type: Number, required: true },
  scale: { type: String, required: true }
});

const emit = defineEmits(['colorbar-click']);

// Compute the configuration for the current layer with null safety
const config = computed(() => {
  try {
    return getLayerConfig(props.currentLayerId, props.currentYear, props.scale) || {};
  } catch (error) {
    console.warn('Error getting layer config:', error);

    return {};
  }
});

const getFormattedValue = (value) => {
  if (!value) {return '0';}
  const multiplier = config.value?.popup?.multiplier || 1;
  const formatted = value * multiplier;

  return formatted.toFixed(formatted % 1 === 0 ? 0 : 2);
};

const minStop = computed(() => {
  if (!config.value?.stops?.length) {return '0';}

  return getFormattedValue(config.value.stops[0][0]);
});

const maxStop = computed(() => {
  if (!config.value?.stops?.length) {return '100';}
  const lastIndex = config.value.stops.length - 1;

  return getFormattedValue(config.value.stops[lastIndex][0]);
});

const centerStop = computed(() => {
  if (!config.value?.stops?.length) {return '50';}
  const midIndex = Math.floor(config.value.stops.length / 2);

  return getFormattedValue(config.value.stops[midIndex][0]);
});

const unit = computed(() => config.value?.unit || '');

const computedGradient = computed(() => {
  if (!config.value?.stops?.length) {
    return 'linear-gradient(to right, #ccc, #ccc)';
  }
  const stops = config.value.stops;
  const count = stops.length - 1;
  const gradientPieces = stops.map((pair, idx) => {
    const color = pair[1];
    const percentage = (idx / count) * 100;

    return `${color} ${percentage}%`;
  });

  return `linear-gradient(to right, ${gradientPieces.join(', ')})`;
});

function openColorOptions() {
  emit('colorbar-click');
}
</script>

<style scoped>
.colorbar-container {
  /* cursor: pointer;  */
  width: 100%;
  padding: 0 8px;
}

.gradient-bar {
  height: 16px;
  border-radius: 2px;
}

.label-container {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 4px;
  color: #6C757D;
}

.min-label, .max-label, .center-label {
  font-family: Inter, sans-serif;
}
</style>
