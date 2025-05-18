// urbverde-ui/src/stores/layersStore.js
import { defineStore } from 'pinia';
import { setDefaultLayers, updateCurrentMainLayer, getCurrentMainLayer, clearLayers } from '@/utils/dynamicLayersOrder';

export const useLayersStore = defineStore('layersStore', {
  state: () => ({
    mapRef: null,
    currentMunicipioId: null,
    currentScale: null,
    currentStatistics: null,
    activeLayers: [],
    setoresVisible: false,
    error: null,
    layerOpacity: 0.7,
  }),

  getters: {
    isIntraurbanScale: (state) => state.currentScale === 'intraurbana',
    hasSetores: (state) => state.setoresVisible && state.isIntraurbanScale,
    getActiveLayers: (state) => state.activeLayers,
    getCurrentMainLayer: (state) => getCurrentMainLayer(state.activeLayers)
  },

  actions: {
    /**
     * Sets the default layers configuration
     * @param {string} activeMainLayer - The main layer to be set as current
     */
    setDefaultLayers(activeMainLayer) {
      this.activeLayers = setDefaultLayers(activeMainLayer);
      console.log('[LayersStore] Set default layers configuration:', this.activeLayers);
    },

    /**
     * Updates the current main layer
     * @param {string} newMainLayer - The new main layer
     * @param {boolean} isAlreadyActive - Whether the new layer is already active
     */
    updateCurrentMainLayer(newMainLayer, isAlreadyActive) {
      this.activeLayers = updateCurrentMainLayer(this.activeLayers, newMainLayer, isAlreadyActive);
      console.log('[LayersStore] Updated current main layer:', this.activeLayers);
    },

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

    /**
     * Add a new layer to the active layers list
     */
    addLayer(layer) {
      if (!this.activeLayers.some(l => l.id === layer.id)) {
        this.activeLayers.push(layer);
        console.log(`[LayersStore] Added new layer ${layer.id}`);
      }
    },

    /**
     * Remove a layer from the active layers list
     */
    removeLayer(layerId) {
      this.activeLayers = this.activeLayers.filter(layer => layer.id !== layerId);
      console.log(`[LayersStore] Removed layer ${layerId}`);
    },

    /**
     * Clear all active layers
     */
    clearActiveLayers() {
      this.activeLayers = clearLayers();
      console.log('[LayersStore] Cleared all active layers');
    },
  },
});
