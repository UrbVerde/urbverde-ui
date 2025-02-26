<!-- src/components/map/MapStyleSwitcher.vue -->
<template>
  <div class="style-switcher">
    <div
      v-for="style in availableStyles"
      :key="style.id"
      class="style-item"
      :class="{ 'style-item--active': selectedStyle === style.id }"
      @click="selectStyle(style)"
    >
      <div class="style-thumbnail" :style="{ backgroundImage: `url(${style.thumbnail})` }"></div>
      <div class="style-label">{{ style.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, defineProps } from 'vue';

const props = defineProps({
  initialStyleId: {
    type: String,
    default: 'streets'
  },
  terrainEnabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['style-change']);

const selectedStyle = ref(props.initialStyleId);

// Define available map styles
const availableStyles = ref([
  {
    id: 'streets',
    label: 'Mapa',
    url: 'https://api.maptiler.com/maps/streets-v2/style.json?key=YOUR_MAPTILER_KEY',
    urlTerrain: 'https://api.maptiler.com/maps/streets-v2/style.json?key=YOUR_MAPTILER_KEY',
    thumbnail: '/assets/images/style-streets.png'
  },
  {
    id: 'satellite',
    label: 'Satélite',
    url: 'https://api.maptiler.com/maps/hybrid/style.json?key=YOUR_MAPTILER_KEY',
    urlTerrain: 'https://api.maptiler.com/maps/hybrid/style.json?key=YOUR_MAPTILER_KEY',
    thumbnail: '/assets/images/style-satellite.png'
  },
  {
    id: 'topo',
    label: 'Topo',
    url: 'https://api.maptiler.com/maps/outdoor-v2/style.json?key=YOUR_MAPTILER_KEY',
    urlTerrain: 'https://api.maptiler.com/maps/outdoor-v2/style.json?key=YOUR_MAPTILER_KEY',
    thumbnail: '/assets/images/style-topo.png'
  }
]);

// Function to handle style selection
const selectStyle = (style) => {
  selectedStyle.value = style.id;
  const styleUrl = props.terrainEnabled ? style.urlTerrain : style.url;
  emit('style-change', { id: style.id, url: styleUrl });
};

// Watch for terrain changes to update style URL if needed
watch(() => props.terrainEnabled, (isEnabled) => {
  const currentStyle = availableStyles.value.find(style => style.id === selectedStyle.value);
  if (currentStyle) {
    const styleUrl = isEnabled ? currentStyle.urlTerrain : currentStyle.url;
    emit('style-change', { id: currentStyle.id, url: styleUrl });
  }
});

// Initialize with the selected style
onMounted(() => {
  const initialStyle = availableStyles.value.find(style => style.id === props.initialStyleId) || availableStyles.value[0];
  selectStyle(initialStyle);
});
</script>

  <style scoped>
  .style-switcher {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 6px;
  }

  .style-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .style-item:hover {
    background-color: #f5f5f5;
  }

  .style-item--active {
    background-color: #e6f7ff;
  }

  .style-thumbnail {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background-size: cover;
    background-position: center;
    border: 1px solid #ddd;
  }

  .style-label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }
  </style>
