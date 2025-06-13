// urbverde-ui/src/stores/layersStore.js
import { defineStore } from 'pinia';
import { setDefaultLayers, updateCurrentMainLayer, getCurrentMainLayer, clearLayers, getLayerConfig } from '@/utils/dynamicLayersOrder';
import { LAYER_CONFIGS } from '@/constants/layers';

export const useLayersStore = defineStore('layersStore', {
  state: () => ({
    mapRef: null,
    currentMunicipioId: null,
    currentScale: null,
    currentYear: null,
    currentStatistics: null,
    activeLayers: [], // Array de objetos com {id, order, currentMain, opacity}
    setoresVisible: false,
    error: null,
    defaultOpacity: 0.7,
  }),

  getters: {
    isIntraurbanScale: (state) => state.currentScale === 'intraurbana',
    hasSetores: (state) => state.setoresVisible && state.isIntraurbanScale,
    getActiveLayers: (state) => state.activeLayers,
    getCurrentMainLayer: (state) => getCurrentMainLayer(state.activeLayers),
    getLayerOpacity: (state) => (layerId) => {
      const layerConfig = LAYER_CONFIGS[layerId];

      return layerConfig?.paint?.['raster-opacity'] || state.defaultOpacity;
    }
  },

  actions: {
    removeLayerFromMap(layerId) {
      const map = this.mapRef;
      if (!map) {return;}

      // Tenta remover a camada principal e a de contorno
      const layersToRemove = [layerId, `${layerId}-outline`];
      layersToRemove.forEach(id => {
        if (map.getLayer(id)) {
          map.removeLayer(id);
          console.log(`[Map] Removed layer: ${id}`);
        }
      });

      // Tenta remover a fonte se não for usada por outra camada ativa
      const otherLayersUsingSource = this.activeLayers
        .filter(l => l.id !== layerId)
        .some(l => {
          const conf = getLayerConfig(l.id, this.currentYear, this.currentScale);
          const thisConf = getLayerConfig(layerId, this.currentYear, this.currentScale);

          return conf?.sourceLayer === thisConf?.sourceLayer;
        });

      const sourceId = layerId; // Adapte aqui se você usa IDs diferentes entre layer e source
      if (!otherLayersUsingSource && map.getSource(sourceId)) {
        map.removeSource(sourceId);
        console.log(`[Map] Removed source: ${sourceId}`);
      }

      // Remove do estado
      this.removeLayer(layerId);
    },

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
      console.log('[LayersStore] Map reference:', this.mapRef);
      console.log('[LayersStore] Active layers:', this.activeLayers);

      if (!this.mapRef) {
        console.warn('[LayersStore] Map reference is not available, cannot update opacity');

        return;
      }

      // Verifica se a layer existe no mapa
      if (!this.mapRef.getLayer(layerId)) {
        console.warn(`[LayersStore] Layer ${layerId} not found in map`);

        return;
      }

      // Atualiza opacidade do layer principal
      this.updateMapLayerOpacity(layerId, newOpacity);

      // Se existir camada de contorno (outline), atualiza também
      const outlineLayerId = `${layerId}-outline`;
      if (this.mapRef.getLayer(outlineLayerId)) {
        this.updateMapLayerOpacity(outlineLayerId, newOpacity, true);
      }

      // Atualiza visibilidade com base na opacidade
      const visibility = newOpacity === 0 ? 'none' : 'visible';

      if (this.mapRef.getLayer(layerId)) {
        this.mapRef.setLayoutProperty(layerId, 'visibility', visibility);
        console.log(`[LayersStore] Set ${layerId} visibility to ${visibility}`);
      }

      if (this.mapRef.getLayer(outlineLayerId)) {
        this.mapRef.setLayoutProperty(outlineLayerId, 'visibility', visibility);
        console.log(`[LayersStore] Set ${outlineLayerId} visibility to ${visibility}`);
      }
    },

    updateMapLayerOpacity(layerId, newOpacity, isOutline = false) {
      console.log(`[LayersStore] Updating map layer opacity for ${layerId} to ${newOpacity}`);
      console.log(`[LayersStore] Is outline: ${isOutline}`);
      console.log(`[LayersStore] Map reference available: ${!!this.mapRef}`);

      if (!this.mapRef) {
        console.warn('[LayersStore] Cannot update opacity - map reference not available');

        return;
      }

      const layer = this.mapRef.getLayer(layerId);
      console.log(`[LayersStore] Layer found: ${!!layer}`);
      console.log(`[LayersStore] Layer type: ${layer?.type}`);

      if (!layer) {
        console.warn(`[LayersStore] Cannot update opacity - layer not found: ${layerId}`);

        return;
      }

      // For outline layers, we always use 'line-opacity'
      // For other layers, check the type
      let opacityProp;
      if (isOutline) {
        opacityProp = 'line-opacity';
      } else {
        const isRaster = layer.type === 'raster';
        opacityProp = isRaster ? 'raster-opacity' : 'fill-opacity';
      }

      console.log(`[LayersStore] Using opacity property: ${opacityProp}`);

      // Update layer opacity
      this.mapRef.setPaintProperty(layerId, opacityProp, newOpacity);

      console.log(`[LayersStore] Updated map layer ${layerId} opacity to ${newOpacity} (property: ${opacityProp})`);
    },

    /**
     * Reordena as camadas ativas
     * @param {string} layerId - ID da camada a ser movida
     * @param {number} newIndex - Nova posição da camada
     */
    reorderLayer(layerId, newIndex) {
      const currentIndex = this.activeLayers.findIndex(layer => layer.id === layerId);
      if (currentIndex === -1) {return;}

      const layer = this.activeLayers[currentIndex];
      const newLayers = [...this.activeLayers];
      newLayers.splice(currentIndex, 1);
      newLayers.splice(newIndex, 0, layer);

      this.activeLayers = newLayers;

      // Atualiza a ordem das camadas no mapa
      if (this.mapRef) {
        this.activeLayers.forEach(layer => {
          if (this.mapRef.getLayer(layer.id)) {
            this.mapRef.moveLayer(layer.id);
          }
        });
      }
    },

    /**
     * Adiciona uma nova camada à lista de camadas ativas
     * @param {Object} layer - Objeto da camada a ser adicionada
     */
    addLayer(layer) {
      if (!this.activeLayers.some(l => l.id === layer.id)) {
        const newLayer = {
          id: layer.id,
          currentMain: false,
          opacity: layer.opacity || this.defaultOpacity
        };
        this.activeLayers.push(newLayer);
        console.log(`[LayersStore] Added new layer ${layer.id}`);
      }
    },

    /**
     * Remove uma camada da lista de camadas ativas
     * @param {string} layerId - ID da camada a ser removida
     */
    removeLayer(layerId) {
      const layerIndex = this.activeLayers.findIndex(layer => layer.id === layerId);
      if (layerIndex === -1) {return;}

      this.activeLayers.splice(layerIndex, 1);
      console.log(`[LayersStore] Removed layer ${layerId}`);
    },

    /**
     * Clear all active layers
     */
    clearActiveLayers() {
      this.activeLayers = clearLayers();
      console.log('[LayersStore] Cleared all active layers');
    },

    /**
     * Updates the current year for all layers
     */
    setCurrentYear(year) {
      this.currentYear = year;
      // Atualiza as camadas ativas com o novo ano
      this.activeLayers.forEach(layer => {
        const layerConfig = getLayerConfig(layer.id, year, this.currentScale);
        if (layerConfig && layerConfig.allowedYears.includes(year)) {
          // Atualiza a fonte da camada se necessário
          if (this.mapRef && this.mapRef.getSource(layer.id)) {
            const source = layerConfig.source(year, this.currentScale, this.currentMunicipioId);
            if (source) {
              this.mapRef.getSource(layer.id).setTiles(source.tiles);
            }
          }
        }
      });
    },

    /**
     * Updates the current scale for all layers
     */
    setCurrentScale(scale) {
      this.currentScale = scale;
      // Atualiza as camadas ativas com a nova escala
      this.activeLayers.forEach(layer => {
        const layerConfig = getLayerConfig(layer.id, this.currentYear, scale);
        if (layerConfig) {
          // Atualiza a fonte da camada se necessário
          if (this.mapRef && this.mapRef.getSource(layer.id)) {
            const source = layerConfig.source(this.currentYear, scale, this.currentMunicipioId);
            if (source) {
              this.mapRef.getSource(layer.id).setTiles(source.tiles);
            }
          }
        }
      });
    }
  },
});
