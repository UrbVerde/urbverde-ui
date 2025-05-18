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

const props = defineProps({
  currentLayerId: { type: String, required: true },
  currentYear: { type: [Number, String], required: true },
  scale: { type: String, required: true },
  stops: { type: Array, default: () => [] },
  unit: { type: String, default: '' }
});

const emit = defineEmits(['colorbar-click']);

const getFormattedValue = (value) => {
  if (!value) {return '0';}

  return value.toFixed(value % 1 === 0 ? 0 : 2);
};

const minStop = computed(() => {
  if (!props.stops?.length) {return '0';}

  return getFormattedValue(props.stops[0][0]);
});

const maxStop = computed(() => {
  if (!props.stops?.length) {return '100';}
  const lastIndex = props.stops.length - 1;

  return getFormattedValue(props.stops[lastIndex][0]);
});

const centerStop = computed(() => {
  if (!props.stops?.length) {return '50';}
  const midIndex = Math.floor(props.stops.length / 2);

  return getFormattedValue(props.stops[midIndex][0]);
});

const computedGradient = computed(() => {
  if (!props.stops?.length) {
    return 'linear-gradient(to right, #ccc, #ccc)';
  }

  // Special case for population layer (viridis color scheme)
  if (props.currentLayerId === 'population') {
    return 'linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)';
  }

  const stops = props.stops;
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
