import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMapStore = defineStore('map', () => {
  // Estado
  const layers = ref({
    'parks-layer': {
      id: 'parks-layer',
      title: 'Áreas Verdes Urbanas',
      icon: 'bi-tree',
      showOpacity: true,
      showColorScale: false,
      showLegendLines: false,
      showLayerCut: false,
      opacity: 100,
      visible: true,
      order: 0
    },
    'ndvi-layer': {
      id: 'ndvi-layer',
      title: 'NDVI',
      icon: 'bi-graph-up',
      showOpacity: true,
      showColorScale: true,
      showLegendLines: true,
      showLayerCut: true,
      opacity: 100,
      visible: true,
      order: 1,
      year: 2020,
      scale: 'intraurbana',
      stops: [
        { value: 0, color: '#FF0000' },
        { value: 0.5, color: '#FFFF00' },
        { value: 1, color: '#00FF00' }
      ],
      unit: 'NDVI'
    }
  });

  // Getters
  const orderedLayers = computed(() => Object.values(layers.value).sort((a, b) => a.order - b.order));

  // Actions
  const updateLayerOpacity = (layerId, opacity) => {
    if (layers.value[layerId]) {
      layers.value[layerId].opacity = opacity;
    }
  };

  const toggleColorbar = (layerId) => {
    if (layers.value[layerId]) {
      layers.value[layerId].showColorScale = !layers.value[layerId].showColorScale;
    }
  };

  const reorderLayers = (newOrder) => {
    newOrder.forEach((layerId, index) => {
      if (layers.value[layerId]) {
        layers.value[layerId].order = index;
      }
    });
  };

  return {
    layers,
    orderedLayers,
    updateLayerOpacity,
    toggleColorbar,
    reorderLayers
  };
});
