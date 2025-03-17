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
    error: null,
    layerOpacity: 0.7
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

        // Decide an initial or existing opacity for this layer:
        // 1. First check if we already have an entry for this layer in activeLayers
        // 2. Next check if the config has a default opacity
        // 3. Fall back to store.layerOpacity (default 0.7)
        const existing = this.activeLayers.find((l) => l.id === layerId);
        let layerOpacity;

        if (existing && existing.opacity !== undefined) {
          layerOpacity = existing.opacity;
        } else if (config.paint && config.paint[config.type === 'raster' ? 'raster-opacity' : 'fill-opacity'] !== undefined) {
          // Get opacity from the layer config
          layerOpacity = config.paint[config.type === 'raster' ? 'raster-opacity' : 'fill-opacity'];
          console.log(`[LayersStore] Using preset opacity from config: ${layerOpacity} for layer ${layerId}`);
        } else {
          layerOpacity = this.layerOpacity;
        }

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

        // Also track in dynamic-layer for compatibility with MapLegend
        this.activeLayers.push({
          id: 'dynamic-layer',
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
  },

  getLayerOpacity(layerId) {
    // Check if the layer exists in our activeLayers array
    const layer = this.activeLayers.find(l => l.id === layerId);
    if (layer && layer.opacity !== undefined) {
      return layer.opacity;
    }

    // For direct layer access (dynamic-layer, parks-layer)
    if (this.mapRef) {
      if (layerId === 'dynamic-layer' && this.mapRef.getLayer('dynamic-layer')) {
        try {
          return this.mapRef.getPaintProperty('dynamic-layer', 'fill-opacity');
        } catch {
          console.warn('[LayersStore] Could not get dynamic-layer opacity');
        }
      }

      if (layerId === 'parks-layer' && this.mapRef.getLayer('parks-layer')) {
        try {
          return this.mapRef.getPaintProperty('parks-layer', 'fill-opacity');
        } catch {
          console.warn('[LayersStore] Could not get parks-layer opacity');
        }
      }
    }

    // Default fallback
    return this.layerOpacity;
  },

});
