// src/stores/useLayersStore.js
import { defineStore } from 'pinia';
import { getLayerConfig, getLayerPaint } from '@/constants/layers.js';

export const useLayersStore = defineStore('layersStore', {
  state: () => ({
    mapRef: null,          // Will store the map instance
    activeLayers: [],      // Array of { id, type, sourceId, currentOpacity, ... }
    // If you only need one “active layer”, you could store just an object instead of array.
  }),

  actions: {
    /**
     * Set (or switch) the “current active layer” given a layerId, year, scale, etc.
     * This example removes the old layer (with fade) and adds the new one.
     */
    async setActiveLayer({ layerId, year, scale }) {
      if (!this.mapRef) {return;}

      // 1. Figure out the new layer config
      const config = getLayerConfig(layerId, year, scale);
      if (!config) {
        console.warn(`No config found for layer: ${layerId}`);

        return;
      }

      // 2. Identify the old layer (if any)
      //    For simplicity, assume we only track a single item in `activeLayers`.
      const oldLayer = this.activeLayers[0] || null;

      // 3. Add the new layer with zero opacity (so it doesn’t blink in).
      const newSourceId = 'active-layer-source';   // or something dynamic
      const newLayerId = 'active-layer';           // or something dynamic
      const newOutlineId = 'active-layer-outline'; // for vector outlines

      // Remove existing source/layer ID in case they’re duplicates.
      if (this.mapRef.getLayer(newLayerId)) {
        this.mapRef.removeLayer(newLayerId);
      }
      if (this.mapRef.getLayer(newOutlineId)) {
        this.mapRef.removeLayer(newOutlineId);
      }
      if (this.mapRef.getSource(newSourceId)) {
        this.mapRef.removeSource(newSourceId);
      }

      // Build the MapLibre “source” object from config
      this.mapRef.addSource(newSourceId, config.source);

      // Now add the new layer(s):
      if (config.type === 'raster') {
        this.mapRef.addLayer({
          id: newLayerId,
          type: 'raster',
          source: newSourceId,
          paint: {
            ...config.paint,
            'raster-opacity': 0, // start at 0 to fade in
          },
        });
      } else if (config.type === 'vector') {
        this.mapRef.addLayer({
          id: newLayerId,
          type: 'fill',
          source: newSourceId,
          'source-layer': config.source.sourceLayer,
          paint: {
            ...getLayerPaint(config),
            'fill-opacity': 0, // fade in from 0
          },
        });
        // Outline
        this.mapRef.addLayer({
          id: newOutlineId,
          type: 'line',
          source: newSourceId,
          'source-layer': config.source.sourceLayer,
          paint: {
            ...this.getOutlinePaint(config),
            'line-opacity': 0, // fade in from 0
          },
        });
      }

      // 4. Wait for the map to load data for the new layer
      await this.waitForMapIdle();

      // 5. Fade in the new layer (to, say, 1.0). If you want a different max or a slider, adjust as needed.
      this.fadeLayerOpacity(newLayerId, newOutlineId, config.type, 1, 400);

      // 6. Remove or hide the old layer (with fade out first if you like).
      if (oldLayer) {
        // Example: fade out the old layer
        await this.fadeLayerOpacity(
          oldLayer.layerId,
          oldLayer.outlineId,
          oldLayer.type,
          0,
          300
        );
        // then remove
        this.removeLayer(oldLayer.layerId, oldLayer.sourceId);
        if (oldLayer.outlineId) {
          this.removeLayer(oldLayer.outlineId);
        }
      }

      // 7. Update “activeLayers” in the store
      this.activeLayers = [{
        layerId: newLayerId,
        outlineId: config.type === 'vector' ? newOutlineId : null,
        sourceId: newSourceId,
        type: config.type,
        currentOpacity: 1,
        originalConfig: config,
      }];
    },

    removeLayer(layerId, sourceId) {
      if (this.mapRef.getLayer(layerId)) {
        this.mapRef.removeLayer(layerId);
      }
      if (sourceId && this.mapRef.getSource(sourceId)) {
        this.mapRef.removeSource(sourceId);
      }
    },

    /**
     * Gradually animate the opacity from its current value to a target value.
     */
    fadeLayerOpacity(layerId, outlineId, layerType, targetOpacity, durationMs = 300) {
      return new Promise((resolve) => {
        if (!this.mapRef.getLayer(layerId)) {
          resolve();

          return;
        }
        const startTime = performance.now();
        const initialOpacity = this.getCurrentOpacity(layerId, layerType);
        const animate = (time) => {
          const elapsed = time - startTime;
          const fraction = Math.min(elapsed / durationMs, 1);
          const newOpacity = initialOpacity + (targetOpacity - initialOpacity) * fraction;

          if (layerType === 'raster') {
            this.mapRef.setPaintProperty(layerId, 'raster-opacity', newOpacity);
          } else {
            this.mapRef.setPaintProperty(layerId, 'fill-opacity', newOpacity);
            if (outlineId && this.mapRef.getLayer(outlineId)) {
              this.mapRef.setPaintProperty(outlineId, 'line-opacity', newOpacity);
            }
          }

          if (fraction < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(animate);
      });
    },

    getCurrentOpacity(layerId, layerType) {
      if (layerType === 'raster') {
        return (
          this.mapRef.getPaintProperty(layerId, 'raster-opacity') ?? 1
        );
      } else {
        return (
          this.mapRef.getPaintProperty(layerId, 'fill-opacity') ?? 1
        );
      }
    },

    async waitForMapIdle() {
      // Wait until the map is idle so we know the layer’s data is loaded
      return new Promise((resolve) => {
        const onIdle = () => {
          this.mapRef.off('idle', onIdle);
          resolve();
        };
        this.mapRef.on('idle', onIdle);
      });
    },

    getOutlinePaint(config) {
      // Example from your existing code:
      return {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'pinned'], false],
          '#2c46f4',
          ['boolean', ['feature-state', 'hover'], false],
          '#7c99f4',
          [
            'interpolate',
            ['linear'],
            ['get', config.property],
            ...config.stops.flat()
          ]
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'pinned'], false],
          4,
          ['boolean', ['feature-state', 'hover'], false],
          3,
          1.5
        ]
      };
    },

    /**
     * Use this to set the map instance from inside `mapGenerator.vue`
     */
    setMap(mapInstance) {
      this.mapRef = mapInstance;
    },
  },
});
