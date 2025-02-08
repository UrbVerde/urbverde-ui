// urbverde-ui/src/utils/LayerManager.js

// export class LayerManager {
//     constructor(map) {
//       this.map = map;
//       this.layers = new Map();
//       this.sources = new Map();
//       this.legends = new Map();
//     }

//     generateSourceId(layerId, scale, year) {
//       return `${layerId}-${scale}-${year}`;
//     }

//     processSourceUrl(url, params) {
//       let processedUrl = url;
//       Object.entries(params).forEach(([key, value]) => {
//         processedUrl = processedUrl.replace(`{${key}}`, value);
//       });
//       return processedUrl;
//     }

//     async addLayer(layerConfig, scale, year, municipalCode) {
//       const { id, sources, paint, rasterSource } = layerConfig;

//       // Store legend configuration
//       if (layerConfig.legendConfig) {
//         this.legends.set(id, layerConfig.legendConfig);
//       }

//       // Remove any existing layers/sources first
//       this.removeLayer(id);

//       // Get scale-specific configurations
//       const sourceConfig = sources[scale];
//       if (!sourceConfig) {
//         console.warn(`No source config found for scale: ${scale}`);
//         return;
//       }

//       const paintConfig = paint[scale];
//       if (!paintConfig) {
//         console.warn(`No paint config found for scale: ${scale}`);
//         return;
//       }

//       // Process source with parameters
//       const sourceId = this.generateSourceId(id, scale, year);
//       const processedSource = {
//         ...sourceConfig,
//         tiles: sourceConfig.tiles.map(url =>
//           this.processSourceUrl(url, { year })
//         )
//       };

//       // Add vector source and layer
//       if (!this.map.getSource(sourceId)) {
//         this.map.addSource(sourceId, processedSource);
//         this.sources.set(sourceId, processedSource);
//       }

//       // Process paint configuration
//       let finalPaint = { ...paintConfig };
//       if (scale === 'intraurbana' && municipalCode) {
//         // Replace municipal_code placeholder in paint rules if present
//         finalPaint = this.processPaintRules(paintConfig, { municipal_code: municipalCode });
//       }

//       // Add vector layer
//       const vectorLayer = {
//         id,
//         type: 'fill',
//         source: sourceId,
//         'source-layer': this.processSourceUrl(sourceConfig.sourceLayer, { year }),
//         paint: finalPaint
//       };

//       this.map.addLayer(vectorLayer);
//       this.layers.set(id, vectorLayer);

//       // Add raster layer if configured
//       if (rasterSource) {
//         const rasterId = `${id}-raster`;
//         const rasterSourceId = `${rasterId}-source`;

//         if (!this.map.getSource(rasterSourceId)) {
//           const processedRasterSource = {
//             ...rasterSource,
//             tiles: rasterSource.tiles.map(url =>
//               this.processSourceUrl(url, { year })
//             )
//           };
//           this.map.addSource(rasterSourceId, processedRasterSource);
//         }

//         const rasterLayer = {
//           id: rasterId,
//           type: 'raster',
//           source: rasterSourceId,
//           paint: {
//             'raster-opacity': 0.7
//           }
//         };

//         this.map.addLayer(rasterLayer);
//         this.layers.set(rasterId, rasterLayer);
//       }
//     }

//     processPaintRules(paint, params) {
//       const processValue = (value) => {
//         if (Array.isArray(value)) {
//           return value.map(item => {
//             if (JSON.stringify(item) === JSON.stringify(['get', 'municipal_code'])) {
//               return params.municipal_code;
//             }
//             if (Array.isArray(item)) {
//               return processValue(item);
//             }
//             return item;
//           });
//         }
//         return value;
//       };

//       return Object.entries(paint).reduce((acc, [key, value]) => {
//         acc[key] = processValue(value);
//         return acc;
//       }, {});
//     }

//     removeLayer(layerId) {
//       // Remove vector layer
//       if (this.map.getLayer(layerId)) {
//         this.map.removeLayer(layerId);
//       }

//       // Remove raster layer
//       const rasterId = `${layerId}-raster`;
//       if (this.map.getLayer(rasterId)) {
//         this.map.removeLayer(rasterId);
//       }

//       // Remove sources
//       const vectorSourceId = Array.from(this.sources.keys())
//         .find(id => id.startsWith(layerId));
//       if (vectorSourceId && this.map.getSource(vectorSourceId)) {
//         this.map.removeSource(vectorSourceId);
//         this.sources.delete(vectorSourceId);
//       }

//       const rasterSourceId = `${layerId}-raster-source`;
//       if (this.map.getSource(rasterSourceId)) {
//         this.map.removeSource(rasterSourceId);
//       }

//       this.layers.delete(layerId);
//       this.layers.delete(rasterId);
//       this.legends.delete(layerId);
//     }

//     updateLayerVisibility(layerId, visible) {
//       const visibility = visible ? 'visible' : 'none';

//       // Update vector layer
//       if (this.map.getLayer(layerId)) {
//         this.map.setLayoutProperty(layerId, 'visibility', visibility);
//       }

//       // Update raster layer
//       const rasterId = `${layerId}-raster`;
//       if (this.map.getLayer(rasterId)) {
//         this.map.setLayoutProperty(rasterId, 'visibility', visibility);
//       }
//     }

//     updateLayerOpacity(layerId, opacity) {
//       // Update vector layer opacity properties
//       if (this.map.getLayer(layerId)) {
//         const layer = this.layers.get(layerId);
//         if (layer?.paint) {
//           Object.keys(layer.paint).forEach(prop => {
//             if (prop.includes('opacity')) {
//               this.map.setPaintProperty(layerId, prop, opacity);
//             }
//           });
//         }
//       }

//       // Update raster layer opacity
//       const rasterId = `${layerId}-raster`;
//       if (this.map.getLayer(rasterId)) {
//         this.map.setPaintProperty(rasterId, 'raster-opacity', opacity);
//       }
//     }

//     getLegendConfig(layerId) {
//       return this.legends.get(layerId);
//     }

//     getAllLegends() {
//       return Array.from(this.legends.entries()).map(([id, config]) => ({
//         id,
//         ...config
//       }));
//     }
//   }
