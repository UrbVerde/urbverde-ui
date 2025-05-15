// urbverde-ui/src/stores/layersStore.js
import { defineStore } from 'pinia';

export const useLayersStore = defineStore('layersStore', {
  state: () => ({
    mapRef: null,
    currentMunicipioId: null,
    currentScale: null,
    currentStatistics: null,
    /**
     * We'll store an array of active layers, each an object:
     *   { id, year, scale, opacity }
     */
    activeLayers: [],
    setoresVisible: false,
    error: null,
    layerOpacity: 0.7,
  }),

  getters: {
    isIntraurbanScale: (state) => state.currentScale === 'intraurbana',
    hasSetores: (state) => state.setoresVisible && state.isIntraurbanScale
  },

  actions: {
    /**
     * Sets the opacity for *one* of the currently active layers
     * (identified by layerId).
     */
    setLayerOpacity(layerId, newOpacity) {
      console.log(`[LayersStore] Setting opacity for layer ${layerId} to ${newOpacity}`);

      if (!this.mapRef) {
        console.warn('[LayersStore] Map reference is not available, cannot update opacity');

        return;
      }

      // First check if this layer exists in activeLayers and update its opacity
      const layerIndex = this.activeLayers.findIndex((l) => l.id === layerId);

      if (layerIndex >= 0) {
        // Update our store's record for this specific layer
        this.activeLayers[layerIndex].opacity = newOpacity;
        console.log(`[LayersStore] Updated opacity for active layer ${layerId} to ${newOpacity}`);
      } else {
        // If not found in activeLayers, add it
        this.activeLayers.push({
          id: layerId,
          opacity: newOpacity
        });
        console.log(`[LayersStore] Added new layer ${layerId} with opacity ${newOpacity}`);
      }

      // Update the layer on the map
      this.updateMapLayerOpacity(layerId, newOpacity);

      // Handle special cases for dynamic-layer and parks-layer
      if (layerId === 'dynamic-layer' && this.mapRef.getLayer('dynamic-layer-outline')) {
        this.updateMapLayerOpacity('dynamic-layer-outline', newOpacity, true);
      }

      // Handle visibility based on opacity
      if (newOpacity === 0) {
        if (this.mapRef.getLayer(layerId)) {
          this.mapRef.setLayoutProperty(layerId, 'visibility', 'none');
          console.log(`[LayersStore] Disabled visibility for ${layerId} with 0 opacity`);
        }

        // Special case for dynamic-layer-outline
        if (layerId === 'dynamic-layer' && this.mapRef.getLayer('dynamic-layer-outline')) {
          this.mapRef.setLayoutProperty('dynamic-layer-outline', 'visibility', 'none');
        }
      } else {
        if (this.mapRef.getLayer(layerId)) {
          this.mapRef.setLayoutProperty(layerId, 'visibility', 'visible');
          console.log(`[LayersStore] Enabled visibility for ${layerId} with ${newOpacity} opacity`);
        }

        // Special case for dynamic-layer-outline
        if (layerId === 'dynamic-layer' && this.mapRef.getLayer('dynamic-layer-outline')) {
          this.mapRef.setLayoutProperty('dynamic-layer-outline', 'visibility', 'visible');
        }
      }
    },

    updateMapLayerOpacity(layerId, newOpacity, isOutline = false) {
      if (!this.mapRef || !this.mapRef.getLayer(layerId)) {
        return;
      }

      // Determine layer type to set the correct opacity property
      const layer = this.mapRef.getLayer(layerId);

      // For outline layers, we always use 'line-opacity'
      // For other layers, check the type
      let opacityProp;
      if (isOutline) {
        opacityProp = 'line-opacity';
      } else {
        const isRaster = layer.type === 'raster';
        opacityProp = isRaster ? 'raster-opacity' : 'fill-opacity';
      }

      // Update layer opacity
      this.mapRef.setPaintProperty(layerId, opacityProp, newOpacity);

      console.log(`[LayersStore] Updated map layer ${layerId} opacity to ${newOpacity} (property: ${opacityProp})`);
    },
  },
});
