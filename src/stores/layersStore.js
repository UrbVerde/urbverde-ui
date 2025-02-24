// urbverde-ui/src/stores/layersStore.js
import { defineStore } from 'pinia';
import { getLayerConfig, getLayerPaint } from '@/constants/layers.js';

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
    error: null
  }),

  getters: {
    isIntraurbanScale: (state) => state.currentScale === 'intraurbana',
    hasSetores: (state) => state.setoresVisible && state.isIntraurbanScale
  },

  actions: {
    /**
     * Removes all previously-added dynamic layers from the map
     * (including their sources) and also removes any "setores" layers.
     */
    removeExistingLayers() {
      if (!this.mapRef) {return;}

      // For every layer in activeLayers, remove its main/outline layers & source
      this.activeLayers.forEach(({ id }) => {
        const mainId = `${id}-main`;
        const outlineId = `${id}-outline`;
        const sourceId = `${id}-source`;

        if (this.mapRef.getLayer(mainId)) {
          this.mapRef.removeLayer(mainId);
        }
        if (this.mapRef.getLayer(outlineId)) {
          this.mapRef.removeLayer(outlineId);
        }
        if (this.mapRef.getSource(sourceId)) {
          this.mapRef.removeSource(sourceId);
        }
      });

      // Also remove any "setores" layers
      ['setores-layer', 'setores-outline'].forEach((id) => {
        if (this.mapRef.getLayer(id)) {
          this.mapRef.removeLayer(id);
        }
      });
      if (this.mapRef.getSource('setores-source')) {
        this.mapRef.removeSource('setores-source');
      }

      // Clear out activeLayers in store
      this.activeLayers = [];
    },

    /**
     * Add or replace the active layer, with the given ID/year/scale.
     * It removes any previous dynamic layers before adding.
     */
    async setActiveLayer({ layerId, year, scale }) {
      if (!this.mapRef) {return;}

      try {
        // Get the layer config from layers.js
        const config = getLayerConfig(layerId, year, scale);
        if (!config) {
          throw new Error(`No config found for layer: ${layerId}`);
        }

        // Remove any previous dynamic layers
        this.removeExistingLayers();

        // Decide an initial or existing opacity for this layer
        //  - If we already have an entry for this layer in activeLayers, reuse its opacity.
        //  - Otherwise, default to store.layerOpacity or 1.0
        const existing = this.activeLayers.find((l) => l.id === layerId);
        const layerOpacity = existing
          ? existing.opacity
          : this.layerOpacity; // or 1.0 if you prefer

        // Build unique IDs for the map
        const sourceId = `${layerId}-source`;
        const mainId = `${layerId}-main`;
        const outlineId = `${layerId}-outline`;

        // Possibly filter the tile source by municipality
        const sourceUrl = config.source.tiles[0];
        const filteredUrl =
          scale === 'intraurbana'
            ? `${sourceUrl}?cql_filter=cd_mun=${this.currentMunicipioId}`
            : sourceUrl;

        // Add the map source
        this.mapRef.addSource(sourceId, {
          ...config.source,
          tiles: [filteredUrl]
        });

        // Get base paint from config + dynamic stats
        const paintProps = getLayerPaint(config, {
          scale,
          municipioId: this.currentMunicipioId,
          statistics: this.currentStatistics
        });

        // Add the main data layer
        const isRaster = config.type === 'raster';
        const opacityProp = isRaster ? 'raster-opacity' : 'fill-opacity';

        this.mapRef.addLayer({
          id: mainId,
          type: isRaster ? 'raster' : 'fill',
          source: sourceId,
          // For vectors, you need the actual 'source-layer'
          ...(isRaster ? {} : { 'source-layer': config.source.sourceLayer }),
          paint: {
            ...paintProps,
            [opacityProp]: layerOpacity
          }
        });

        // If vector, add an outline layer
        if (!isRaster && config.source.sourceLayer) {
          this.mapRef.addLayer({
            id: outlineId,
            type: 'line',
            source: sourceId,
            'source-layer': config.source.sourceLayer,
            paint: {
              'line-color': [
                'case',
                ['boolean', ['feature-state', 'pinned'], false],
                '#2c46f4',
                ['boolean', ['feature-state', 'hover'], false],
                '#7c99f4',
                '#666666'
              ],
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'pinned'], false],
                4,
                ['boolean', ['feature-state', 'hover'], false],
                3,
                1.5
              ],
              'line-opacity': layerOpacity
            }
          });
        }

        // Add setores if needed
        if (scale === 'intraurbana' && this.setoresVisible) {
          await this.addSetoresLayer(year);
        }

        // Track this in our activeLayers
        this.activeLayers.push({
          id: layerId,
          year,
          scale,
          opacity: layerOpacity
        });

        // If we need to fetch dynamic stats for intraurbana scale
        if (scale === 'intraurbana') {
          const stats = await this.fetchMunicipalityStats(
            this.currentMunicipioId,
            year,
            config.property
          );
          if (stats) {
            this.currentStatistics = stats;

            // Recompute paint and update color (but keep same opacity)
            const updatedPaint = getLayerPaint(config, {
              scale,
              municipioId: this.currentMunicipioId,
              statistics: stats
            });
            const mainLayerProperty = isRaster ? 'raster-color' : 'fill-color';

            // only update color if it changed
            if (updatedPaint[mainLayerProperty]) {
              this.mapRef.setPaintProperty(mainId, mainLayerProperty, updatedPaint[mainLayerProperty]);
            }
          }
        }

        // Keep labels on top
        this.bringLabelsToFront();
      } catch (error) {
        console.error('Error setting active layer:', error);
        this.error = error.message;
      }
    },

    /**
     * Sets the opacity for *one* of the currently active layers
     * (identified by layerId).
     */
    setLayerOpacity(layerId, newOpacity) {
      // For backward compatibility, we also update store.layerOpacity
      this.layerOpacity = newOpacity;

      if (!this.mapRef) {return;}

      // Find the store record for that layer
      const layerIndex = this.activeLayers.findIndex((l) => l.id === layerId);
      if (layerIndex < 0) {return;} // not found

      // Update our store’s record
      this.activeLayers[layerIndex].opacity = newOpacity;

      // Figure out the MapLibre layer IDs
      const mainId = `${layerId}-main`;
      const outlineId = `${layerId}-outline`;

      // Check if the main layer is present
      const mainLayer = this.mapRef.getLayer(mainId);
      if (!mainLayer) {return;}

      // Decide if it’s raster or vector
      const isRaster = mainLayer.type === 'raster';
      const opacityProp = isRaster ? 'raster-opacity' : 'fill-opacity';

      // Update main layer’s opacity
      this.mapRef.setPaintProperty(mainId, opacityProp, newOpacity);

      // If vector, also update the outline
      if (!isRaster && this.mapRef.getLayer(outlineId)) {
        this.mapRef.setPaintProperty(outlineId, 'line-opacity', newOpacity);
      }
      console.log(`[LayersStore] Opacity updated for ${layerId} -> ${newOpacity}`);
    },

    /**
     * Optional: if you still want a single method that sets the
     * *currently active* layer’s opacity by ignoring layerId,
     * you can keep a short helper like this, but in your
     * Vue components you’d do:
     *   layersStore.setLayerOpacity(currentLayerId, op)
     * instead.
     */
    // setLayerOpacitySingle(opacity) {
    //   if (this.activeLayers.length) {
    //     const { id } = this.activeLayers[this.activeLayers.length - 1];
    //     this.setLayerOpacity(id, opacity);
    //   }
    // },

    /**
     * Adds the setores layer (vector) at intraurbana scale.
     */
    async addSetoresLayer(year) {
      console.log('Adding setores layer for year:', year);
      if (!this.mapRef || !this.currentMunicipioId) {return;}

      const setoresConfig = {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geom_setores/{z}/{x}/{y}.pbf?cql_filter=cd_mun=${this.currentMunicipioId}`
        ],
        minzoom: 0,
        maxzoom: 22,
        sourceLayer: 'public.geom_setores'
      };

      try {
        // Add "setores-source"
        this.mapRef.addSource('setores-source', {
          type: 'vector',
          ...setoresConfig
        });

        // Fill layer
        this.mapRef.addLayer({
          id: 'setores-layer',
          type: 'fill',
          source: 'setores-source',
          'source-layer': setoresConfig.sourceLayer,
          paint: {
            'fill-color': 'transparent',
            'fill-outline-color': '#7c99f4',
            'fill-opacity': 0.3
          }
        });

        // Outline
        this.mapRef.addLayer({
          id: 'setores-outline',
          type: 'line',
          source: 'setores-source',
          'source-layer': setoresConfig.sourceLayer,
          paint: {
            'line-color': '#7c99f4',
            'line-width': 1
          }
        });
      } catch (error) {
        console.error('Error adding setores layer:', error);
        this.error = error.message;
      }
    },

    /**
     * Toggle the Setores layer on/off if at intraurbana scale.
     */
    toggleSetoresLayer() {
      this.setoresVisible = !this.setoresVisible;
      if (!this.mapRef) {return;}

      if (!this.setoresVisible) {
        // Remove any setores layers
        ['setores-layer', 'setores-outline'].forEach((id) => {
          if (this.mapRef.getLayer(id)) {
            this.mapRef.removeLayer(id);
          }
        });
        if (this.mapRef.getSource('setores-source')) {
          this.mapRef.removeSource('setores-source');
        }
      } else if (this.currentScale === 'intraurbana') {
        const currentLayer = this.activeLayers[this.activeLayers.length - 1];
        if (currentLayer) {
          this.addSetoresLayer(currentLayer.year);
        }
      }
    },

    /**
     * Fetches dynamic stats for a given municipality, year, and property.
     */
    async fetchMunicipalityStats(municipioId, year, property) {
      try {
        const response = await fetch(
          `https://api.urbverde.com.br/v1/stats/${municipioId}/${year}/${property}`
        );

        return await response.json();
      } catch (error) {
        console.error('Error fetching municipality stats:', error);

        return null;
      }
    },

    /**
     * Move all symbol layers to the front so they’re above polygons.
     */
    bringLabelsToFront() {
      if (!this.mapRef) {return;}
      const layers = this.mapRef.getStyle().layers || [];
      layers.forEach((layer) => {
        if (layer.type === 'symbol') {
          this.mapRef.moveLayer(layer.id);
        }
      });
    },

    /**
     * Reset everything: remove layers, clear activeLayers, stats, error
     */
    reset() {
      this.removeExistingLayers();
      this.activeLayers = [];
      this.currentStatistics = null;
      this.error = null;
    }
  }
});
