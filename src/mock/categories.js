// // src/mock/categories.js

// export const categories = [
//     {
//       id: "climate",
//       name: "Clima",
//       icon: "temperature", // You'll need to map this to your actual icon
//       description: "Análise de temperatura e clima",
//       layers: [
//         {
//           id: "surface_temp",
//           name: "Temperatura de superfície",
//           displayName: "Temperatura de Superfície",
//           isActive: false,
//           isNew: true,
//           description: "Temperatura média de superfície medida por satélite",
//           legendConfig: {
//             type: "gradient",
//             title: "Temperatura (°C)",
//             min: 18,
//             max: 34,
//             stops: [
//               { value: 18, color: "#2b83ba", label: "18°C" },
//               { value: 22, color: "#abdda4", label: "22°C" },
//               { value: 26, color: "#ffffbf", label: "26°C" },
//               { value: 30, color: "#fdae61", label: "30°C" },
//               { value: 34, color: "#d7191c", label: "34°C" }
//             ]
//           },
//           sources: {
//             estadual: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_municipio_{year}"
//             },
//             municipal: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_municipio_{year}"
//             },
//             intraurbana: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_setor_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_setor_{year}"
//             }
//           },
//           paint: {
//             estadual: {
//               "fill-color": [
//                 "interpolate",
//                 ["linear"],
//                 ["get", "c2"],
//                 18, "#2b83ba",
//                 22, "#abdda4",
//                 26, "#ffffbf",
//                 30, "#fdae61",
//                 34, "#d7191c"
//               ],
//               "fill-opacity": 0.7
//             },
//             municipal: {
//               "fill-color": [
//                 "interpolate",
//                 ["linear"],
//                 ["get", "c2"],
//                 18, "#2b83ba",
//                 22, "#abdda4",
//                 26, "#ffffbf",
//                 30, "#fdae61",
//                 34, "#d7191c"
//               ],
//               "fill-opacity": 0.7
//             },
//             intraurbana: {
//               "fill-color": [
//                 "match",
//                 ["get", "cd_mun"],
//                 ["get", "municipal_code"],
//                 [
//                   "interpolate",
//                   ["linear"],
//                   ["get", "c2"],
//                   ["get", "c2_min"], "#2b83ba",
//                   ["get", "c2_mean"], "#ffffbf",
//                   ["get", "c2_max"], "#d7191c"
//                 ],
//                 "transparent"
//               ],
//               "fill-opacity": 0.7
//             }
//           },
//           rasterSource: {
//             type: "raster",
//             tiles: [
//               "https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3ATST-30m-8bits-{year}&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng"
//             ],
//             tileSize: 256
//           }
//         },
//         {
//           id: "max_surface_temp",
//           name: "Temperatura máxima de superfície",
//           displayName: "Temperatura Máxima de Superfície",
//           isActive: false,
//           description: "Temperatura máxima de superfície registrada no período",
//           legendConfig: {
//             type: "gradient",
//             title: "Temperatura Máxima (°C)",
//             min: 27,
//             max: 52,
//             stops: [
//               { value: 27, color: "#3288bd", label: "27°C" },
//               { value: 32, color: "#99d594", label: "32°C" },
//               { value: 37, color: "#e6f598", label: "37°C" },
//               { value: 42, color: "#fee08b", label: "42°C" },
//               { value: 47, color: "#fc8d59", label: "47°C" },
//               { value: 52, color: "#d53e4f", label: "52°C" }
//             ]
//           },
//           sources: {
//             estadual: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_municipio_{year}"
//             },
//             municipal: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_municipio_{year}"
//             },
//             intraurbana: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_setor_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_setor_{year}"
//             }
//           },
//           paint: {
//             estadual: {
//               "fill-color": [
//                 "interpolate",
//                 ["linear"],
//                 ["get", "c3"],
//                 27, "#3288bd",
//                 32, "#99d594",
//                 37, "#e6f598",
//                 42, "#fee08b",
//                 47, "#fc8d59",
//                 52, "#d53e4f"
//               ],
//               "fill-opacity": 0.7
//             },
//             municipal: {
//               "fill-color": [
//                 "interpolate",
//                 ["linear"],
//                 ["get", "c3"],
//                 27, "#3288bd",
//                 32, "#99d594",
//                 37, "#e6f598",
//                 42, "#fee08b",
//                 47, "#fc8d59",
//                 52, "#d53e4f"
//               ],
//               "fill-opacity": 0.7
//             },
//             intraurbana: {
//               "fill-color": [
//                 "match",
//                 ["get", "cd_mun"],
//                 ["get", "municipal_code"],
//                 [
//                   "interpolate",
//                   ["linear"],
//                   ["get", "c3"],
//                   ["get", "c3_min"], "#3288bd",
//                   ["get", "c3_mean"], "#fee08b",
//                   ["get", "c3_max"], "#d53e4f"
//                 ],
//                 "transparent"
//               ],
//               "fill-opacity": 0.7
//             }
//           }
//         },
//         {
//           id: "heat_island",
//           name: "Coeficiente de Ilha de Calor",
//           displayName: "Coeficiente de Ilha de Calor",
//           isActive: false,
//           description: "Intensidade do efeito de ilha de calor urbano",
//           legendConfig: {
//             type: "gradient",
//             title: "Intensidade",
//             min: 0,
//             max: 44,
//             stops: [
//               { value: 0, color: "#3288bd", label: "Baixa" },
//               { value: 15, color: "#99d594", label: "" },
//               { value: 25, color: "#e6f598", label: "Média" },
//               { value: 35, color: "#fc8d59", label: "" },
//               { value: 44, color: "#d53e4f", label: "Alta" }
//             ]
//           },
//           sources: {
//             estadual: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_municipio_{year}"
//             },
//             municipal: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_municipio_{year}"
//             },
//             intraurbana: {
//               type: "vector",
//               tiles: [
//                 "https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_setor_{year}/{z}/{x}/{y}.pbf?"
//               ],
//               minzoom: 0,
//               maxzoom: 22,
//               sourceLayer: "public.geodata_temperatura_por_setor_{year}"
//             }
//           },
//           paint: {
//             estadual: {
//               "fill-color": [
//                 "interpolate",
//                 ["linear"],
//                 ["get", "c1"],
//                 0, "#3288bd",
//                 2.8, "#99d594",
//                 4.5, "#e6f598",
//                 19, "#fee08b",
//                 36, "#fc8d59",
//                 44, "#d53e4f"
//               ],
//               "fill-opacity": 0.7
//             },
//             municipal: {
//               "fill-color": [
//                 "interpolate",
//                 ["linear"],
//                 ["get", "c1"],
//                 0, "#3288bd",
//                 2.8, "#99d594",
//                 4.5, "#e6f598",
//                 19, "#fee08b",
//                 36, "#fc8d59",
//                 44, "#d53e4f"
//               ],
//               "fill-opacity": 0.7
//             },
//             intraurbana: {
//               "fill-color": [
//                 "match",
//                 ["get", "cd_mun"],
//                 ["get", "municipal_code"],
//                 [
//                   "interpolate",
//                   ["linear"],
//                   ["get", "c1"],
//                   ["get", "c1_min"], "#3288bd",
//                   ["get", "c1_mean"], "#fee08b",
//                   ["get", "c1_max"], "#d53e4f"
//                 ],
//                 "transparent"
//               ],
//               "fill-opacity": 0.7
//             }
//           }
//         }
//       ]
//     }
//     // Additional categories (vegetation, parks, etc.) would follow the same pattern...
//   ];

// //   // Helper types/interfaces for TypeScript (if using TS)
// //   export interface Layer {
// //     id: string;
// //     name: string;
// //     displayName: string;
// //     isActive: boolean;
// //     isNew?: boolean;
// //     description: string;
// //     legendConfig: LegendConfig;
// //     sources: Record<string, LayerSource>;
// //     paint: Record<string, LayerPaint>;
// //     rasterSource?: RasterSource;
// //   }

// //   export interface Category {
// //     id: string;
// //     name: string;
// //     icon: string;
// //     description: string;
// //     layers: Layer[];
// //   }

// //   export interface LegendConfig {
// //     type: 'gradient' | 'discrete';
// //     title: string;
// //     min?: number;
// //     max?: number;
// //     stops: Array<{
// //       value: number;
// //       color: string;
// //       label: string;
// //     }>;
// //   }

// //   export interface LayerSource {
// //     type: string;
// //     tiles: string[];
// //     minzoom: number;
// //     maxzoom: number;
// //     sourceLayer: string;
// //   }

// //   export interface LayerPaint {
// //     'fill-color': any[];
// //     'fill-opacity': number;
// //   }

// //   export interface RasterSource {
// //     type: string;
// //     tiles: string[];
// //     tileSize: number;
// //   }
