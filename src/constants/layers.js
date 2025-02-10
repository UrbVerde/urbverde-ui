// src/constants/layers.js

/**
 * A single file that holds all layer definitions.
 * Each layer defines:
 * - type: either 'raster' or 'vector'
 * - label: human-readable name
 * - sourceFn or source: either a function that returns a dynamic vector source or a static source object (for raster layers)
 * - property: the feature property used for color interpolation (only for vector layers)
 * - stops: an array of value/color pairs for use in interpolations
 * - unit: any measurement unit for display in popups
 * - popup: a standard configuration for popups (the same for all layers)
 */
export const LAYER_CONFIGS = {
  // Climate layers
  surface_temp: {
    type: 'raster',
    label: 'Temperatura de Superfície',
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:tst-intraurbana-rel-30m-2021a2016&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.9,
      'raster-resampling': 'nearest'
    },
    popup: {
      label: 'Temperatura Relativa',
      unit: '°C'
    }
  },

  max_surface_temp: {
    type: 'vector',
    label: 'Temperatura Máxima de Superfície',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_temperatura_por_setor_${year}`
        : `public.geodata_temperatura_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        minzoom: 0,
        maxzoom: 22,
        sourceLayer
      };
    },
    property: 'c3',
    stops: [
      [27, '#3288bd'],
      [32, '#99d594'],
      [37, '#e6f598'],
      [42, '#fee08b'],
      [47, '#fc8d59'],
      [52, '#d53e4f']
    ],
    unit: '°C'
  },

  heat_island: {
    type: 'vector',
    label: 'Nível de exposição à ilha de calor',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_temperatura_por_setor_${year}`
        : `public.geodata_temperatura_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'c1',
    stops: [
      [0, '#3288bd'],
      [2.8, '#99d594'],
      [4.5, '#e6f598'],
      [19, '#fee08b'],
      [36, '#fc8d59'],
      [44, '#d53e4f']
    ],
    unit: ''
  },

  // Vegetation layers
  pcv: {
    type: 'vector',
    label: 'Percentual de Cobertura Vegetal',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_vegetacao_por_setor_${year}`
        : `public.geodata_vegetacao_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'b1',
    stops: [
      [0.04, '#ffffe5'],
      [0.14, '#f7fcb9'],
      [0.15, '#d9f0a3'],
      [0.18, '#addd8e'],
      [0.21, '#78c679'],
      [0.25, '#41ab5d'],
      [0.28, '#238443'],
      [0.31, '#006837'],
      [0.44, '#004529']
    ],
    unit: '%'
  },

  icv: {
    type: 'vector',
    label: 'Índice de Cobertura Vegetal',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_vegetacao_por_setor_${year}`
        : `public.geodata_vegetacao_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'b2',
    stops: [
      [730, '#ffffe5'],
      [1323, '#d9f0a3'],
      [2083, '#78c679'],
      [3385, '#238443'],
      [4033, '#004529']
    ],
    unit: ''
  },

  idsa: {
    type: 'vector',
    label: 'Índice de Desigualdade Socioambiental',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_vegetacao_por_setor_${year}`
        : `public.geodata_vegetacao_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'b3',
    stops: [
      [0.33, '#2b83ba'],
      [0.455, '#abdda4'],
      [0.555, '#fdae61'],
      [0.685, '#d7191c']
    ],
    unit: ''
  },

  cvp: {
    type: 'vector',
    label: 'Cobertura Vegetal por Pixel',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_vegetacao_por_setor_${year}`
        : `public.geodata_vegetacao_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'b1',
    stops: [
      [0.04, '#ffffe5'],
      [0.14, '#f7fcb9'],
      [0.15, '#d9f0a3'],
      [0.18, '#addd8e'],
      [0.21, '#78c679'],
      [0.25, '#41ab5d'],
      [0.28, '#238443'],
      [0.31, '#006837'],
      [0.44, '#004529']
    ],
    unit: '%'
  },

  ndvi: {
    type: 'raster',
    label: 'Vigor da Vegetação (NDVI)',
    source: (year) => ({
      type: 'raster',
      tiles: [
        `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:NDVI-10m-${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`
      ],
      tileSize: 256
    }),
    paint: {
      'raster-opacity': 0.7
    }
  },

  // Parks layers
  avg_distance_to_squares: {
    type: 'vector',
    label: 'Distância Média até as Praças',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_pracas_por_setor_${year}`
        : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a4',
    stops: [
      [1.23, '#1a9850'],
      [1.69, '#91cf60'],
      [2.83, '#d9ef8b'],
      [7.45, '#ffffbf'],
      [18.97, '#fee08b'],
      [35.07, '#fc8d59'],
      [46.76, '#d73027']
    ],
    unit: 'm'
  },

  square_area_per_capita: {
    type: 'vector',
    label: 'Área de Praças por Habitante',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_pracas_por_setor_${year}`
        : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a2',
    stops: [
      [0, '#d53e4f'],
      [40, '#f46d43'],
      [50, '#fdae61'],
      [60, '#fee08b'],
      [70, '#e6f598'],
      [85, '#abdda4']
    ],
    unit: 'm²/hab'
  },

  square_served_area: {
    type: 'vector',
    label: 'Área Atendida pelas Praças',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_pracas_por_setor_${year}`
        : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a9',
    stops: [
      [0, '#d53e4f'],
      [20, '#f46d43'],
      [40, '#fdae61'],
      [60, '#fee08b'],
      [80, '#e6f598'],
      [100, '#3288bd']
    ],
    unit: 'km²'
  },

  served_population: {
    type: 'vector',
    label: 'População Atendida pelas Praças',
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_pracas_por_setor_${year}`
        : `public.geodata_pracas_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'a1',
    stops: [
      [0, '#d53e4f'],
      [14.3, '#f46d43'],
      [28.6, '#fdae61'],
      [42.9, '#fee08b'],
      [57.9, '#e6f598'],
      [71.5, '#abdda4'],
      [85.8, '#66c2a5'],
      [100, '#3288bd']
    ],
    unit: '%'
  }
};

// Helper function to get layer config
export function getLayerConfig(layerId, year, scale) {
  const config = LAYER_CONFIGS[layerId];
  if (!config) {return null;}
  // For vector layers that require a dynamic source, call sourceFn; otherwise use source.
  const source = typeof config.sourceFn === 'function' ? config.sourceFn(year, scale) : config.source;

  return { ...config, source };
}

// Helper to get layer paint properties
export function getLayerPaint(config) {
  if (config.type === 'raster') {
    return config.paint;
  }

  return {
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'pinned'], false],
      1,
      ['boolean', ['feature-state', 'hover'], false],
      0.9,
      0.6
    ],
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', config.property],
      ...config.stops.flat()
    ]
  };
}
