// urbverde-ui/src/stores/layersStore.js
import { defineStore } from 'pinia';
import { getLayerConfig } from '@/utils/dynamicLayersOrder';
import { LAYER_CONFIGS } from '@/constants/layers';
import { createHoverManager } from '@/components/map/layers/HoverManager.js';
import { createUnmountLayers } from '@/components/map/layers/UnmountLayers';

export const useLayersStore = defineStore('layersStore', {
  state: () => ({
    mapRef: null,
    currentMunicipioId: null,
    currentScale: null,
    currentYear: 2021, // Inicializa com um valor padrão
    currentStatistics: null,
    activeLayers: [], // Array de objetos com {id, order, currentMain, opacity}
    setoresVisible: false,
    error: null,
    defaultOpacity: 0.7,
    hoverManager: null,
  }),

  getters: {
    isIntraurbanScale: (state) => state.currentScale === 'intraurbana',
    hasSetores: (state) => state.setoresVisible && state.isIntraurbanScale,
    getActiveLayers: (state) => state.activeLayers,
    getCurrentMainLayer: (state) => state.activeLayers.find(layer => layer.currentMain) || null,
    getLayerOpacity: (state) => (layerId) => {
      const layerConfig = LAYER_CONFIGS[layerId];

      return layerConfig?.paint?.['raster-opacity'] || state.defaultOpacity;
    },
    // Getter para obter o ano atual sincronizado com locationStore
    getCurrentYear: (state) => state.currentYear || 2021,
    // Getter para buscar uma camada específica
    getLayer: (state) => (layerId) => state.activeLayers.find(layer => layer.id === layerId)
  },

  actions: {
    /**
     * Inicializa o HoverManager
     */
    initializeHoverManager() {
      if (!this.hoverManager) {
        this.hoverManager = createHoverManager(this);
        console.log('[LayersStore] HoverManager initialized');
      }
    },

    /**
     * Remove uma camada da lista de camadas ativas (estado interno)
     * @param {string} layerId - ID da camada a ser removida
     * @returns {boolean} - true se a camada foi removida com sucesso
     */
    removeLayer(layerId) {
      const layerIndex = this.activeLayers.findIndex(layer => layer.id === layerId);
      if (layerIndex === -1) {
        console.warn(`[LayersStore] Layer ${layerId} not found in activeLayers`);

        return false;
      }

      this.activeLayers.splice(layerIndex, 1);
      console.log(`[LayersStore] Removed layer ${layerId} from activeLayers`);

      return true;
    },

    /**
     * Atualiza a lista de camadas ativas
     * @param {Array} newLayers - Nova lista de camadas
     */
    updateActiveLayers(newLayers) {
      this.activeLayers = newLayers;
      console.log('[LayersStore] Updated active layers:', this.activeLayers);
    },

    /**
     * Troca a posição de duas camadas no array
     * @param {number} index1 - Índice da primeira camada
     * @param {number} index2 - Índice da segunda camada
     */
    swapLayerPositions(index1, index2) {
      if (index1 >= 0 && index2 >= 0 && index1 < this.activeLayers.length && index2 < this.activeLayers.length) {
        const temp = this.activeLayers[index1];
        this.activeLayers[index1] = this.activeLayers[index2];
        this.activeLayers[index2] = temp;
        console.log(`[LayersStore] Swapped layers at positions ${index1} and ${index2}`);
      }
    },

    /**
     * Substitui uma camada em uma posição específica
     * @param {number} index - Índice da posição
     * @param {Object} newLayer - Nova camada
     */
    replaceLayerAt(index, newLayer) {
      if (index >= 0 && index < this.activeLayers.length) {
        this.activeLayers.splice(index, 1, newLayer);
        console.log(`[LayersStore] Replaced layer at position ${index}:`, newLayer);
      }
    },

    /**
     * Atualiza a flag currentMain de uma camada específica
     * Garante que apenas uma camada tenha currentMain = true
     * @param {string} layerId - ID da camada
     * @param {boolean} isMain - Se deve ser a camada principal
     */
    setLayerAsMain(layerId, isMain) {
      if (isMain) {
        // Se está definindo como principal, limpa todas as outras flags first
        this.activeLayers.forEach(layer => {
          if (layer.currentMain) {
            console.log(`[LayersStore] Removendo flag currentMain de: ${layer.id}`);
            layer.currentMain = false;
          }
        });
      }

      const layer = this.activeLayers.find(l => l.id === layerId);
      if (layer) {
        layer.currentMain = isMain;
        console.log(`[LayersStore] Set layer ${layerId} as main: ${isMain}`);
      } else {
        console.warn(`[LayersStore] Layer ${layerId} não encontrada para definir como main`);
      }
    },

    /**
     * Sets the default layers configuration
     * @param {string} activeMainLayer - The main layer to be set as current
     */
    // setDefaultLayers(activeMainLayer) {
    //   const parksConfig = getLayerConfig('parks', this.currentYear, this.currentScale, this.currentMunicipioId);
    //   const mainLayerConfig = getLayerConfig(activeMainLayer, this.currentYear, this.currentScale, this.currentMunicipioId);

    //   this.activeLayers = [
    //     {
    //       id: 'parks',
    //       currentMain: false,
    //       source: parksConfig?.source,
    //       opacity: this.defaultOpacity
    //     },
    //     {
    //       id: activeMainLayer,
    //       currentMain: true,
    //       source: mainLayerConfig?.source,
    //       opacity: this.defaultOpacity
    //     }
    //   ];
    //   console.log('[LayersStore] Set default layers configuration:', this.activeLayers);
    // },

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
     * Adiciona uma nova camada à lista de camadas ativas
     * @param {Object} layer - Objeto da camada a ser adicionada
     * @param {string} beforeID - ID da camada antes da qual inserir (opcional)
     */
    addLayer(layer, beforeID = null) {
      if (!this.activeLayers.some(l => l.id === layer.id)) {
        const newLayer = {
          id: layer.id,
          year: layer.year,
          scale: layer.scale,
          currentMain: false,
          opacity: layer.opacity || this.defaultOpacity,
          source: layer.source
        };

        if (beforeID) {
          // Se beforeID foi fornecido, insere antes da camada especificada
          const beforeIndex = this.activeLayers.findIndex(l => l.id === beforeID);
          if (beforeIndex !== -1) {
            this.activeLayers.splice(beforeIndex, 0, newLayer);
          } else {
            // Se a camada beforeID não for encontrada, insere no topo
            this.activeLayers.unshift(newLayer);
          }
        } else {
          // Comportamento original
          // Verifica se parks está no topo
          const parksIndex = this.activeLayers.findIndex(l => l.id === 'parks');
          const isParksOnTop = parksIndex === 0;

          if (isParksOnTop) {
            // Se parks está no topo, insere na segunda posição
            this.activeLayers.splice(1, 0, newLayer);
          } else {
            // Se parks não está no topo, insere no topo
            this.activeLayers.unshift(newLayer);
          }
        }

        console.log(`[LayersStore] Added new layer ${layer.id}${beforeID ? ` before ${beforeID}` : ''}`);
      }
    },

    /**
     * Clear all active layers
     */
    clearActiveLayers() {
      this.activeLayers = [];
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
     * Sincroniza o ano com o locationStore
     */
    syncYearWithLocationStore(locationYear) {
      if (locationYear && locationYear !== this.currentYear) {
        this.setCurrentYear(locationYear);
      }
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
    },

    removeLayerFromMap(layerId) {
      // Usa o novo facade que remove camadas com subcamadas
      const unmountLayers = createUnmountLayers();
      unmountLayers.unmountLayer(layerId);
    }
  },
});
