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
    layerOpacity: 0.7
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

      // HANDLE DIFFERENT LAYER ID FORMATS
      // This is the critical part that's causing the issue

      // Case 1: Standard format used by layersStore (layerId-main)
      const standardMainId = `${layerId}-main`;
      const standardOutlineId = `${layerId}-outline`;

      if (this.mapRef.getLayer(standardMainId)) {
        this.updateMapLayerOpacity(standardMainId, newOpacity);
        if (this.mapRef.getLayer(standardOutlineId)) {
          this.updateMapLayerOpacity(standardOutlineId, newOpacity, true);
        }
      }
      // Case 2: Direct layer IDs (parks-layer, dynamic-layer)
      else if (this.mapRef.getLayer(layerId)) {
        this.updateMapLayerOpacity(layerId, newOpacity);

        // Check for corresponding outline layers
        if (layerId === 'dynamic-layer' && this.mapRef.getLayer('dynamic-layer-outline')) {
          this.updateMapLayerOpacity('dynamic-layer-outline', newOpacity, true);
        }
      }
      else {
        console.warn(`[LayersStore] Layer with ID "${layerId}" or "${standardMainId}" not found on map`);
      }

      // Handle interactions for 0 opacity
      if (newOpacity === 0) {
        // Disable interaction for this layer
        if (layerId === 'parks-layer' && this.mapRef.getLayer('parks-layer')) {
          this.mapRef.setLayoutProperty('parks-layer', 'visibility', 'none');
          console.log(`[LayersStore] Disabled visibility for ${layerId} with 0 opacity`);
        } else if (layerId === 'dynamic-layer' || this.mapRef.getLayer('dynamic-layer')) {
          this.mapRef.setLayoutProperty('dynamic-layer', 'visibility', 'none');
          if (this.mapRef.getLayer('dynamic-layer-outline')) {
            this.mapRef.setLayoutProperty('dynamic-layer-outline', 'visibility', 'none');
          }
          console.log('[LayersStore] Disabled visibility for dynamic layer with 0 opacity');
        }
      } else {
        // Enable interaction for this layer
        if (layerId === 'parks-layer' && this.mapRef.getLayer('parks-layer')) {
          this.mapRef.setLayoutProperty('parks-layer', 'visibility', 'visible');
          console.log(`[LayersStore] Enabled visibility for ${layerId} with ${newOpacity} opacity`);
        } else if (layerId === 'dynamic-layer' || this.mapRef.getLayer('dynamic-layer')) {
          this.mapRef.setLayoutProperty('dynamic-layer', 'visibility', 'visible');
          if (this.mapRef.getLayer('dynamic-layer-outline')) {
            this.mapRef.setLayoutProperty('dynamic-layer-outline', 'visibility', 'visible');
          }
          console.log(`[LayersStore] Enabled visibility for dynamic layer with ${newOpacity} opacity`);
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
