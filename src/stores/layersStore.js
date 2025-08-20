// urbverde-ui/src/stores/layersStore.js
import { defineStore } from 'pinia';
import { updateCurrentMainLayer, getCurrentMainLayer, clearLayers, getLayerConfig } from '@/utils/dynamicLayersOrder';
import { LAYER_CONFIGS } from '@/constants/layers';

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
  }),

  getters: {
    isIntraurbanScale: (state) => state.currentScale === 'intraurbana',
    hasSetores: (state) => state.setoresVisible && state.isIntraurbanScale,
    getActiveLayers: (state) => state.activeLayers,
    getCurrentMainLayer: (state) => getCurrentMainLayer(state.activeLayers),
    getLayerOpacity: (state) => (layerId) => {
      const layerConfig = LAYER_CONFIGS[layerId];

      return layerConfig?.paint?.['raster-opacity'] || state.defaultOpacity;
    },
    // Getter para obter o ano atual sincronizado com locationStore
    getCurrentYear: (state) => state.currentYear || 2021
  },

  actions: {
    removeLayerFromMap(layerId) {
      const map = this.mapRef;
      if (!map) {return;}

      // Remove as subcamadas primeiro
      const subLayersToRemove = [`${layerId}_outline`, `${layerId}_fill`];
      subLayersToRemove.forEach(id => {
        if (map.getLayer(id)) {
          map.removeLayer(id);
          console.log(`[Map] Removed sublayer: ${id}`);
        }
      });

      // Remove eventos de hover das subcamadas
      this.removeSubLayerHoverEvents(layerId);

      // Tenta remover a camada principal
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        console.log(`[Map] Removed layer: ${layerId}`);
      }

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
      const parksConfig = getLayerConfig('parks', this.currentYear, this.currentScale, this.currentMunicipioId);
      const mainLayerConfig = getLayerConfig(activeMainLayer, this.currentYear, this.currentScale, this.currentMunicipioId);

      this.activeLayers = [
        {
          id: 'parks',
          currentMain: false,
          source: parksConfig?.source,
          opacity: this.defaultOpacity
        },
        {
          id: activeMainLayer,
          currentMain: true,
          source: mainLayerConfig?.source,
          opacity: this.defaultOpacity
        }
      ];
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
        // Primeiro, move a camada principal para a nova posição
        if (this.mapRef.getLayer(layerId)) {
          this.mapRef.moveLayer(layerId);
        }

        // A reordenação das subcamadas será tratada pelo MapLayerController
        // que é chamado após este método

        // Logs de debug comentados para manter o código limpo
        // console.log(`[LayersStore] Reordering sublayers for layer ${layerId}`);
        // console.log(`[LayersStore] Sublayers to reorder:`, layer.subLayers.map(sl => sl.id));
        // console.log(`[LayersStore] All layers in map:`, allLayers);
        // console.log(`[LayersStore] Main layer index: ${mainLayerIndex}, Parks index: ${parksIndex}`);
        // console.log(`[LayersStore] Final beforeId for sublayers: ${beforeId}`);
        // console.log(`[LayersStore] Final layer order after reordering:`, finalLayers);
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
          year: layer.year,
          scale: layer.scale,
          currentMain: false,
          opacity: layer.opacity || this.defaultOpacity,
          source: layer.source
        };

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

        console.log(`[LayersStore] Added new layer ${layer.id}`);
      }
    },
    /**
     * Adiciona subcamadas para camadas vetoriais (outline e fill)
     * @param {string} layerId - ID da camada principal
     */
    addSubLayer(layerId) {
      // Verifica se a camada existe e é vetorial
      const layerConfig = LAYER_CONFIGS[layerId];
      if (!layerConfig || (layerConfig.type !== 'vector' && layerConfig.dataType !== 'vector')) {
        console.warn(`[LayersStore] Cannot add sublayers for non-vector layer: ${layerId}`);

        return;
      }

      // Encontra a camada principal no activeLayers
      const mainLayerIndex = this.activeLayers.findIndex(l => l.id === layerId);
      if (mainLayerIndex === -1) {
        console.warn(`[LayersStore] Main layer not found in activeLayers: ${layerId}`);

        return;
      }

      const mainLayer = this.activeLayers[mainLayerIndex];

      // Inicializa subcamadas se não existir
      if (!mainLayer.subLayers) {
        mainLayer.subLayers = [];
      }

      // Cria as duas subcamadas
      const outlineSubLayer = {
        id: `${layerId}_outline`,
        type: 'line',
        source: layerId, // Usa o mesmo source da camada principal
        'source-layer': mainLayer.source?.sourceLayer,
        layout: {
          visibility: 'visible'
        },
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#ffffff', // Branco no hover
            '#666666'  // Cinza escuro normal
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            1
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.7
          ]
        }
      };

      const fillSubLayer = {
        id: `${layerId}_fill`,
        type: 'fill',
        source: layerId, // Usa o mesmo source da camada principal
        'source-layer': mainLayer.source?.sourceLayer,
        layout: {
          visibility: 'visible'
        },
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'rgba(255, 255, 255, 0.2)', // Branco semi-transparente no hover
            'transparent'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0.1
          ]
        }
      };

      // Adiciona as subcamadas ao array de subcamadas da camada principal
      mainLayer.subLayers.push(fillSubLayer, outlineSubLayer);

      // Adiciona as subcamadas ao mapa
      if (this.mapRef) {
        // Determina o beforeID baseado na posição da camada principal
        let beforeID;
        if (mainLayerIndex === 0) {
          beforeID = 'highlight_selected-layer';
        } else {
          beforeID = this.activeLayers[mainLayerIndex - 1].id;
        }

        // Adiciona a primeira subcamada (fill) - deve ficar por baixo
        this.mapRef.addLayer(fillSubLayer, beforeID);
        console.log(`[LayersStore] Added sublayer ${fillSubLayer.id} with beforeID: ${beforeID}`);

        // Adiciona a segunda subcamada (outline) - deve ficar por cima
        this.mapRef.addLayer(outlineSubLayer, fillSubLayer.id);
        console.log(`[LayersStore] Added sublayer ${outlineSubLayer.id} with beforeID: ${fillSubLayer.id}`);

        // Configura eventos de hover para as subcamadas
        this.setupSubLayerHoverEvents(layerId, outlineSubLayer.id, fillSubLayer.id);
      }

      console.log(`[LayersStore] Added sublayers for layer ${layerId}:`, mainLayer.subLayers);

      // Debug: mostra todas as camadas no mapa
      if (this.mapRef) {
        const allLayers = this.mapRef.getStyle().layers.map(l => l.id);
        console.log('[LayersStore] All layers in map after adding sublayers:', allLayers);
      }
    },

    /**
     * Configura eventos de hover para as subcamadas
     * @param {string} mainLayerId - ID da camada principal
     * @param {string} outlineLayerId - ID da camada de contorno
     * @param {string} fillLayerId - ID da camada de preenchimento
     */
    setupSubLayerHoverEvents(mainLayerId, outlineLayerId, fillLayerId) {
      if (!this.mapRef) {return;}

      const mainLayer = this.activeLayers.find(l => l.id === mainLayerId);
      if (!mainLayer || !mainLayer.source?.sourceLayer) {return;}

      const sourceLayer = mainLayer.source.sourceLayer;
      let hoveredFeatureId = null;

      // Evento de mousemove na camada principal
      this.mapRef.on('mousemove', mainLayerId, (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const featureId = feature.id || feature.properties.cd_mun;

          if (hoveredFeatureId !== featureId) {
            // Remove hover anterior
            if (hoveredFeatureId !== null) {
              this.mapRef.setFeatureState(
                {
                  source: mainLayerId,
                  sourceLayer,
                  id: hoveredFeatureId
                },
                { hover: false }
              );
            }

            // Define novo hover
            hoveredFeatureId = featureId;
            this.mapRef.setFeatureState(
              {
                source: mainLayerId,
                sourceLayer,
                id: featureId
              },
              { hover: true }
            );
          }
        }
      });

      // Evento de mouseleave na camada principal
      this.mapRef.on('mouseleave', mainLayerId, () => {
        if (hoveredFeatureId !== null) {
          this.mapRef.setFeatureState(
            {
              source: mainLayerId,
              sourceLayer,
              id: hoveredFeatureId
            },
            { hover: false }
          );
          hoveredFeatureId = null;
        }
      });

      // Eventos de hover também nas subcamadas para melhor responsividade
      [outlineLayerId, fillLayerId].forEach(subLayerId => {
        this.mapRef.on('mousemove', subLayerId, (e) => {
          if (e.features.length > 0) {
            const feature = e.features[0];
            const featureId = feature.id || feature.properties.cd_mun;

            if (hoveredFeatureId !== featureId) {
              // Remove hover anterior
              if (hoveredFeatureId !== null) {
                this.mapRef.setFeatureState(
                  {
                    source: mainLayerId,
                    sourceLayer,
                    id: hoveredFeatureId
                  },
                  { hover: false }
                );
              }

              // Define novo hover
              hoveredFeatureId = featureId;
              this.mapRef.setFeatureState(
                {
                  source: mainLayerId,
                  sourceLayer,
                  id: featureId
                },
                { hover: true }
              );
            }
          }
        });

        this.mapRef.on('mouseleave', subLayerId, () => {
          if (hoveredFeatureId !== null) {
            this.mapRef.setFeatureState(
              {
                source: mainLayerId,
                sourceLayer,
                id: hoveredFeatureId
              },
              { hover: false }
            );
            hoveredFeatureId = null;
          }
        });
      });

      console.log(`[LayersStore] Hover events configured for sublayers of ${mainLayerId}`);
    },

    /**
     * Remove eventos de hover das subcamadas
     * @param {string} mainLayerId - ID da camada principal
     */
    removeSubLayerHoverEvents(mainLayerId) {
      if (!this.mapRef) {return;}

      const outlineLayerId = `${mainLayerId}_outline`;
      const fillLayerId = `${mainLayerId}_fill`;

      // Remove eventos de todas as camadas relacionadas
      [mainLayerId, outlineLayerId, fillLayerId].forEach(layerId => {
        if (this.mapRef.getLayer(layerId)) {
          this.mapRef.off('mousemove', layerId);
          this.mapRef.off('mouseleave', layerId);
        }
      });

      console.log(`[LayersStore] Hover events removed for sublayers of ${mainLayerId}`);
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
    }
  },
});
