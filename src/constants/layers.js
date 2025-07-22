// urbverde-ui/src/constants/layers.js

// Declare allowed years
const VECTOR_YEARS = [2016, 2017, 2018, 2019, 2020, 2021];
const RASTER_YEARS = [2016, 2017, 2018, 2019, 2020, 2021];
const VEGETATION_YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const PARKS_YEARS = [2021, 2024];
const PARKS_YEARS_2024 = [2024];
const PARKS_POLIGON_YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const CENSUS_YEARS = [2022];
const RISKS_YEARS = [2024];
const AGRICULTURE_YEARS_2022 = [2022];
const AGRICULTURE_YEARS_2023 = [2023];
const AGRICULTURE_YEARS_2025 = [2025];

/**
 * A single file that holds all layer definitions.
 * Each layer defines:
 * - type: either 'raster' or 'vector'
 * - label: human-readable name
 * - source or source: either a function that returns a dynamic vector source or a static source object (for raster layers)
 * - property: the feature property used for color interpolation (only for vector layers)
 * - stops: an array of value/color pairs for use in interpolations
 * - unit: any measurement unit for display in popups
 * - popup: a standard configuration for popups (the same for all layers)
 */

export const LAYER_CONFIGS = {

  // ===============================
  // Painel nacional
  // ===============================

  // ------- População -------
  population: {
    type: 'vector',
    label: 'População',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'v0001',
    stops: [
      [0, '#440154'],
      [100, '#482576'],
      [200, '#414387'],
      [300, '#345f8d'],
      [400, '#2a788e'],
      [500, '#21908d'],
      [600, '#23a884'],
      [700, '#43bf70'],
      [800, '#7ad151'],
      [1000, '#bcdf27']
    ],
    unit: 'hab',
    popup: {
      label: 'População',
      unit: 'habitantes',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Densidade demográfica -------
  density: {
    type: 'vector',
    label: 'Densidade demográfica',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'densidade',
    stops: [
      [0, '#ffffff'],
      [1000, '#ffe6e6'],
      [2000, '#ffcccc'],
      [3000, '#ffb3b3'],
      [4000, '#ff9999'],
      [5000, '#ff8080'],
      [6000, '#ff6666'],
      [7000, '#ff4d4d'],
      [8000, '#ff3333'],
      [10000, '#ff1919']
    ],
    unit: 'hab/km²',
    popup: {
      label: 'Densidade demográfica',
      unit: 'habitantes/km²',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Taxa de alfabetização -------
  literacy: {
    type: 'vector',
    label: 'Taxa de alfabetização (acima de 15 anos)',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'alfab%',
    stops: [
      [85, '#f1eef6'],
      [90, '#74a9cf'],
      [95, '#045a8d']
    ],
    unit: '%',
    popup: {
      label: 'Taxa de alfabetização (acima de 15 anos)',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de crianças (0 a 9 anos) -------
  children_percentage: {
    type: 'vector',
    label: 'Percentual de crianças (0 a 9 anos)',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'criancas_pct',
    stops: [
      [5, '#feebe2'],
      [10, '#c51b8a'],
      [15, '#7a0177']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de crianças (0 a 9 anos)',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de idosos (acima de 60 anos) -------
  elderly_percentage: {
    type: 'vector',
    label: 'Percentual de idosos (acima de 60 anos)',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'idosos%',
    stops: [
      [20, '#feebe2'],
      [30, '#c51b8a'],
      [40, '#7a0177']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de crianças (0 a 9 anos)',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de mulheres -------
  woman_percentage: {
    type: 'vector',
    label: 'Percentual de mulheres',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'mulher (%)',
    stops: [
      [45, '#ffffcc'],
      [50, '#ffb84d'],
      [55, '#e34a33']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de mulheres',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de homens -------
  boy_percentage: {
    type: 'vector',
    label: 'Percentual de homens',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'homens (%)',
    stops: [
      [45, '#ffffcc'],
      [50, '#ffb84d'],
      [55, '#e34a33']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de homens',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de pessoas brancas -------
  percentual_brancas: {
    type: 'vector',
    label: 'Percentual de pessoas brancas',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'branca%',
    stops: [
      [40, '#ffffcc'],
      [60, '#ffb84d'],
      [80, '#e34a33']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de pessoas brancas',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de pessoas pretas -------
  percentual_pretas: {
    type: 'vector',
    label: 'Percentual de pessoas pretas',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'preta%',
    stops: [
      [0, '#ffffcc'],
      [10, '#ffb84d'],
      [20, '#e34a33']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de pessoas pretas',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de pessoas pardas -------
  percentual_pardos: {
    type: 'vector',
    label: 'Percentual de pessoas pardas',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'parda%',
    stops: [
      [10, '#ffffcc'],
      [30, '#ffb84d'],
      [50, '#e34a33']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de pessoas pardas',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de pessoas amarelas -------
  percentual_amarelas: {
    type: 'vector',
    label: 'Percentual de pessoas amarelas',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'amarela%',
    stops: [
      [0, '#ffffcc'],
      [10, '#ffb84d'],
      [20, '#e34a33']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de pessoas amarelas',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Percentual de pessoas indigenas -------
  percentual_indigenas: {
    type: 'vector',
    label: 'Percentual de pessoas indigenas',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'indigena%',
    stops: [
      [0, '#ffffcc'],
      [2.5, '#ffb84d'],
      [5, '#e34a33']
    ],
    unit: '%',
    popup: {
      label: 'Percentual de pessoas indigenas',
      unit: '%',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Renda média do responsável da casa -------
  average_income: {
    type: 'vector',
    label: 'Renda média do responsável da casa',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_censo_por_setoresurbanosdesp_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_censo_por_setoresurbanosdesp_2022'
    }),
    property: 'v06004',
    stops: [
      [1518, '#ca0020'],
      [3036, '#db4247'],
      [4554, '#ec846e'],
      [6072, '#f5b599'],
      [7590, '#f6d6c8'],
      [9108, '#f7f7f7'],
      [10626, '#cfe3ed'],
      [12144, '#a6cfe3'],
      [15180, '#76b4d5'],
    ],
    unit: 'R$',
    popup: {
      label: 'Renda média do responsável da casa',
      unit: 'R$',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- População fora de São Paulo -------
  population_outside_SP: {
    type: 'vector',
    label: 'População',
    allowedYears: CENSUS_YEARS,
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_setores_2022/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geodata_setores_2022'
    }),
    property: 'v0001',
    stops: [
      [0, '#440154'],
      [100, '#482576'],
      [200, '#414387'],
      [300, '#345f8d'],
      [400, '#2a788e'],
      [500, '#21908d'],
      [600, '#23a884'],
      [700, '#43bf70'],
      [800, '#7ad151'],
      [900, '#bcdf27']
    ],
    unit: 'hab',
    popup: {
      label: 'População',
      unit: 'habitantes',
      format: (v) => parseInt(v).toLocaleString()
    }
  },

  // ------- Geometria dos setores censitários -------
  setores: {
    type: 'vector',
    label: 'Setores Censitários',
    allowedYears: VECTOR_YEARS,
    source: (year, scale, municipioId) => {
      if (scale !== 'intraurbana' || !municipioId) {
        return null;
      }

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geom_setores/{z}/{x}/{y}.pbf?cql_filter=cd_mun=${municipioId}`
        ],
        minzoom: 0,
        maxzoom: 22,
        sourceLayer: 'public.geom_setores'
      };
    },
    paint: {
      'fill-color': 'transparent',
      'fill-outline-color': '#7c99f4',
      'fill-opacity': 0.3
    }
  },

  // ------- Temperatura de superfície -------
  surface_temp: {
    type: 'raster',
    label: 'Temperatura de Superfície',
    allowedYears: RASTER_YEARS,

    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? 'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:tst-intraurbana-rel-30m-2021a2016&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
        : `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:tst-intraurbana-rel-30m-${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`;

      return {
        type: 'raster',
        tiles: [
          `${sourceLayer}`
        ],
        tileSize: 256,
      };
    },

    paint: {
      'raster-opacity': 0.65,
      'raster-resampling': 'nearest'
    },
    stops: [
      [-8, '#3288bd'],
      [0, '#fee08b'],
      [8, '#d53e4f']
    ],
    unit: '°C',
    popup: {
      label: 'Temperatura Relativa',
      unit: '°C',
      format: (v) => (v >= 0 ? '+' : '') + Number(v).toFixed(2)
    }
  },

  // ------- Temperatura máxima de superfície -------
  max_surface_temp: {
    type: 'vector',
    label: 'Temperatura Máxima de Superfície',
    allowedYears: VECTOR_YEARS,
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

  // ------- Nível de exposição à ilha de calor -------
  heat_island: {
    type: 'vector',
    label: 'Nível de exposição à ilha de calor',
    allowedYears: VECTOR_YEARS,
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

  // ------- Percentual de cobertura vegetal -------
  pcv: {
    type: 'vector',
    label: 'Percentual de Cobertura Vegetal',
    allowedYears: VEGETATION_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_icv_pcv_pop_psi_por_setor_${year}`
        : `public.geodata_icv_pcv_pop_psi_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'pcv',
    stops: [
      [0, '#ffffcc'],
      [20, '#78c679'],
      [40, '#006837']
    ],
    unit: '%',
    popup: {
      label: 'PCV',
      unit: '%',
    }
  },

  // ------- Índice de Cobertura Vegetal -------
  icv: {
    type: 'vector',
    label: 'Índice de Cobertura Vegetal',
    allowedYears: VEGETATION_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_icv_pcv_pop_psi_por_setor_${year}`
        : `public.geodata_icv_pcv_pop_psi_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'icv',
    stops: [
      [0, '#ffffcc'],
      [40, '#78c679'],
      [80, '#006837']
    ],
    unit: 'm²/hab'
  },

  // ------- Impermeabilização do solo (PSI) -------
  psi: {
    type: 'vector',
    label: 'Impermeabilização do solo (PSI)',
    allowedYears: VEGETATION_YEARS,
    source: (year, scale) => {
      const sourceLayer = scale === 'intraurbana'
        ? `public.geodata_icv_pcv_pop_psi_por_setor_${year}`
        : `public.geodata_icv_pcv_pop_psi_por_municipio_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'psi',
    stops: [
      [20, '#d9f0d3'],
      [50, '#ffffbf'],
      [80, '#e34a33']
    ],
    unit: '%'
  },

  // ------- Índice de Desigualdade Socioambiental -------
  idsa: {
    type: 'vector',
    label: 'Índice de Desigualdade Socioambiental',
    allowedYears: VECTOR_YEARS,
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

  // ------- Cobertura Vegetal por Pixel -------
  cvp: {
    type: 'raster',
    label: 'Cobertura Vegetal por Pixel',
    allowedYears: RASTER_YEARS,
    source: (year) => ({
      type: 'raster',
      tiles: [
        `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:PCV-30m-8bits-${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`
      ],
      tileSize: 256
    }),
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [0, '#FFFFCC'],
      [50, '#78C679'],
      [100, '#058B1C']
    ],
    popup: {
      label: 'Cobertura Vegetal por Pixel',
      unit: '',
    },
    unit: '%'
  },

  // ------- Vigor da Vegetação (NDVI) -------
  ndvi: {
    type: 'raster',
    label: 'Vigor da Vegetação (NDVI)',
    allowedYears: RASTER_YEARS,
    source: (year) => ({
      type: 'raster',
      tiles: [
        `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:NDVI-10m-${year}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`
      ],
      tileSize: 256
    }),
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [0, '#FF0004'],
      [50, '#FFDE00'],
      [100, '#00891D']
    ],
    unit: '%',
    popup: {
      label: 'NDVI',
      unit: '%',
      format: (v) => Number(v).toFixed(4)
    }
  },

  // ------- Geometria de praças nacional -------
  parks: {
    type: 'vector',
    label: 'Praças',
    source: (year, scale, municipioId) => ({
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geom_pracas/{z}/{x}/{y}.pbf${municipioId ? `?cql_filter=cd_mun=${municipioId}` : ''}`
      ],
      minzoom: 0,
      maxzoom: 22,
      sourceLayer: 'public.geom_pracas'
    }),
    paint: {
      'fill-color': '#40826D',
      'fill-opacity': 0.7,
      'fill-outline-color': '#40826D'
    }
  },

  // ------- Distância média até as praças -------
  avg_distance_to_squares: {
    type: 'vector',
    label: 'Distância Média até as Praças',
    allowedYears: PARKS_YEARS,
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
      [0, '#1a9850'],
      [400, '#ffffbf'],
      [800, '#d73027']
    ],
    unit: 'm',
    popup: {
      label: 'Distância Média até as Praças',
      unit: 'm',
      format: (v) => v.toFixed(0)
    }
  },

  // ------- Distância média até as praças (acima de 5000m) -------
  avg_distance_to_squares_5000: {
    type: 'vector',
    label: 'Distância Média até as Praças',
    allowedYears: PARKS_YEARS_2024,
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
    property: 'a4>5000m',
    stops: [
      [0, '#1a9850'],
      [400, '#ffffbf'],
      [800, '#d73027']
    ],
    unit: 'm',
    popup: {
      label: 'Distância Média até as Praças',
      unit: 'm',
      format: (v) => v.toFixed(0)
    }
  },

  // ------- Área de praças por habitante -------
  square_area_per_capita: {
    type: 'vector',
    label: 'Área de Praças por Habitante',
    allowedYears: PARKS_YEARS,
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
      [2, '#f46d43'],
      [3, '#fdae61'],
      [7, '#fee08b'],
      [10, '#e6f598'],
      [15, '#abdda4']
    ],
    unit: 'm²/hab',
    popup: {
      label: 'Área de Praças por Habitante',
      unit: 'm²/hab',
      format: (v) => v.toFixed(0)
    }
  },

  // ------- Área atendida pelas praças -------
  square_served_area: {
    type: 'vector',
    label: 'Área Atendida pelas Praças',
    allowedYears: PARKS_YEARS,
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
    property: 'a3',
    stops: [
      [0, '#d73027'],
      [50, '#ffffbf'],
      [100, '#1a9850']
    ],
    unit: '%',
    popup: {
      label: 'Área Atendida',
      unit: '%',
      format: (v) => v.toFixed(0)
    }
  },

  // ------- População atendida pelas praças (%) -------
  perc_served_population: {
    type: 'vector',
    label: 'População Atendida pelas Praças (%)',
    allowedYears: PARKS_YEARS_2024,
    source: (year, scale) => {
      // pick the correct tile url for scale
      const sourceLayer =
        scale === 'intraurbana'
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
    property: 'a1_perc',
    stops: [
      [0, '#d73027'],
      [50, '#ffffbf'],
      [100, '#1a9850']
    ],
    unit: '%',

    popup: {
      label: 'População Atendida',
      unit: '%',
      format: (v) => v.toFixed(0)
    }
  },

  // ------- Cobertura Vegetal em Parques e Praças -------
  square_pcv: {
    type: 'vector',
    label: 'Cobertura Vegetal em Parques e Praças',
    allowedYears: PARKS_POLIGON_YEARS,
    source: (year) => {
      const sourceLayer = `public.geodata_praca_poligono_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'pcv',
    stops: [
      [0, '#ff4903'],
      [25, '#dadb00'],
      [50, '#10901b']
    ],
    unit: '%',

    popup: {
      label: 'Cobertura Vegetal',
      unit: '%',
      format: (v) => v.toFixed(0)
    }
  },

  // ------- Impermeabilização do Solo em Parques e Praças -------
  square_psi: {
    type: 'vector',
    label: 'Impermeabilização do Solo em Parques e Praças',
    allowedYears: PARKS_POLIGON_YEARS,
    source: (year) => {
      const sourceLayer = `public.geodata_praca_poligono_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'psi',
    stops: [
      [0, '#10901b'],
      [25, '#dadb00'],
      [50, '#ff4903']
    ],
    unit: '%',

    popup: {
      label: 'Impermeabilização do Solo',
      unit: '%',
      format: (v) => v.toFixed(0)
    }
  },
  // ------- Perigo de inundação Diadema -------
  flood_diadema_classes: {
    type: 'raster',
    label: 'Perigo de inundação em Diadema (classes)',
    allowedYears: [2025],
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:mapa_hidrologia_perigo_inundacao_6classes_diadema_2025&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [1, '#006100'],
      [2, '#559100'],
      [3, '#A4C400'],
      [4, '#FFFF00'],
      [5, '#FFBB00'],
      [6, '#FF7700'],
      [7, '#FF2600']
    ],
    popup: {
      label: 'Perigo de inundação em Diadema (classes)',
      unit: '',
    },
    unit: '',
  },

  // ------- Perigo de inundação Estado (classes) -------
  flood_state_classes: {
    type: 'raster',
    label: 'Perigo de inundação (classes)',
    allowedYears: [2025],
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:mapa_hidrologia_perigo_inundacao_7classes_estadosp_2025&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [1, '#006100'],
      [2, '#559100'],
      [3, '#A4C400'],
      [4, '#FFFF00'],
      [5, '#FFBB00'],
      [6, '#FF7700'],
      [7, '#FF2600']
    ],
    popup: {
      label: 'Perigo de inundação (classes)',
      unit: '',
    },
    unit: '',
  },
  // ------- Perigo de inundação Diadema (porcentagem) -------
  flood_diadema_percentage: {
    type: 'raster',
    label: 'Perigo de inundação em Diadema (porcentagem)',
    allowedYears: [2025],
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:mapa_hidrologia_perigo_inundacao_porcentagem_diadema_2025&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [30, '#006100'],
      [65, '#FFFF00'],
      [100, '#FF2600']
    ],
    popup: {
      label: 'Perigo de inundação em Diadema (%)',
      unit: '',
    },
    unit: '%',
  },
  // ------- Perigo de inundação Estado (porcentagem) -------
  flood_state_percentage: {
    type: 'raster',
    label: 'Perigo de inundação (porcentagem)',
    allowedYears: [2025],
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:mapa_hidrologia_perigo_inundacao_porcentagem_estadosp_2025&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [30, '#006100'],
      [65, '#FFFF00'],
      [100, '#FF2600']
    ],
    popup: {
      label: 'Perigo de inundação (%)',
      unit: '',
    },
    unit: '%',
  },
  // ------- Massas de água do Estado -------
  water_bodies_state: {
    type: 'raster',
    label: 'Massas da água do Estado',
    allowedYears: [2020],
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:raster_hidrologia_massas_dagua_ana_estadosp_2020&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [1, '#4169E1'],
      [1, '#4169E1']
    ],
    popup: {
      label: 'Massas de água em Diadema',
      unit: '',
    },
    unit: '',
  },
  // ------- Massas de água em Diadema -------
  water_bodies_diadema: {
    type: 'raster',
    label: 'Massas de água em Diadema',
    allowedYears: [2002],
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:raster_hidrologia_massas_dagua_diadema_2002&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [1, '#4169E1'],
      [1, '#4169E1']
    ],
    popup: {
      label: 'Massas de água em Diadema',
      unit: '',
    },
    unit: '',
  },

  // ------- Rios do Estado -------
  rivers_state: {
    type: 'raster',
    label: 'Rios',
    allowedYears: [2008],
    source: {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:raster_hidrologia_rios_estadosp_2008&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    },
    paint: {
      'raster-opacity': 0.7
    },
    stops: [
      [1, '#4169E1'],
      [1, '#4169E1']
    ],
    popup: {
      label: 'Massas de água em Diadema',
      unit: '',
    },
    unit: '',
  },

  // ===============================
  // Exclusivo para o painel políticas públicas
  // ===============================

  // ------- Riscos a ondas de calor -------
  heat_wave_risks: {
    type: 'vector',
    label: 'Riscos a ondas de calor',
    allowedYears: RISKS_YEARS,
    source: (year) => {
      const sourceLayer = `public.geodata_riscos_climaticos_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'rcalor',
    stops: [
      [0, '#2b83ba'],
      [0.353, '#ffffbf'],
      [0.639, '#d7191c']
    ],
    unit: '',

    popup: {
      label: 'Riscos a ondas de calor',
      unit: '',
    }
  },

  // ------- Risco climático a arboviroses -------
  arbovirus_risks: {
    type: 'vector',
    label: 'Risco climático a arboviroses',
    allowedYears: RISKS_YEARS,
    source: (year) => {
      const sourceLayer = `public.geodata_riscos_climaticos_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'rarbovirose',
    stops: [
      [0, '#2b83ba'],
      [0.238, '#ffffbf'],
      [0.448, '#d7191c']
    ],
    unit: '',

    popup: {
      label: 'Risco climático a arboviroses',
      unit: '',
    }
  },

  // ------- Vulnerabilidade social do risco climático a arboviroses -------
  nutrition_vulnerability: {
    type: 'vector',
    label: 'Vulnerabilidade alimentar e nutricional',
    allowedYears: RISKS_YEARS,
    source: (year) => {
      const sourceLayer = `public.geodata_riscos_climaticos_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'vulnerabsan',
    stops: [
      [0, '#2b83ba'],
      [0.425, '#ffffbf'],
      [0.704, '#d7191c']
    ],
    unit: '',

    popup: {
      label: 'Vulnerabilidade alimentar e nutricional',
      unit: '',
    }
  },

  // ------- Indicador de risco climático a inundações -------
  flood_risks: {
    type: 'vector',
    label: 'Indicador de risco climático a inundações',
    allowedYears: RISKS_YEARS,
    source: (year) => {
      const sourceLayer = `public.geodata_riscos_climaticos_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'rinunda',
    stops: [
      [0, '#2b83ba'],
      [0.238, '#ffffbf'],
      [0.448, '#d7191c']
    ],
    unit: '',

    popup: {
      label: 'Indicador de risco climático a inundações',
      unit: '',
    }
  },

  // ------- Desenvolvimento social do habitat para favelas -------
  desh_risks: {
    type: 'vector',
    label: 'Desenvolvimento social do habitat para favelas',
    allowedYears: RISKS_YEARS,
    source: (year) => {
      const sourceLayer = `public.geodata_idesh_por_setor_fcu_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'idesh',
    stops: [
      [0, '#2b83ba'],
      [0.219, '#ffffbf'],
      [0.483, '#d7191c']
    ],
    unit: '',

    popup: {
      label: 'Desenvolvimento social do habitat para favelas',
      unit: '',
    }
  },

  // ------- Áreas prioritárias para implantação de agricultura urbana (nivel 1) -------
  urban_agriculture_priorit_1: {
    type: 'vector',
    label: 'Áreas prioritárias para implantação de agricultura urbana (nivel 1)',
    allowedYears: AGRICULTURE_YEARS_2022,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'au_pot_1',
    stops: [
      [0, '#d0d1d3'],
      [1, '#ffff00'],
    ],
    unit: '',

    popup: {
      label: 'Áreas prioritárias para implantação de agricultura urbana (nivel 1)',
      unit: '',
    }
  },

  // ------- Áreas prioritárias para implantação de agricultura urbana (Nível 2) -------
  urban_agriculture_priorit_2: {
    type: 'vector',
    label: 'Áreas prioritárias para implantação de agricultura urbana (Nível 2)',
    allowedYears: AGRICULTURE_YEARS_2022,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'au_pot_2',
    stops: [
      [0, '#d0d1d3'],
      [2, '#ffff00'],
    ],
    unit: '',

    popup: {
      label: 'Áreas prioritárias para implantação de agricultura urbana (Nível 2)',
      unit: '',
    }
  },

  // ------- Desertos alimentares -------
  desert_food_areas: {
    type: 'vector',
    label: 'Desertos alimentares',
    allowedYears: AGRICULTURE_YEARS_2025,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'desertos*',
    stops: [
      [0, '#d0d1d3'],
      [1, '#d7191c'],
    ],
    unit: '',

    popup: {
      label: 'Desertos alimentares',
      unit: '',
    }
  },

  // ------- Pântanos alimentares -------
  wetland_food_areas: {
    type: 'vector',
    label: 'Pântanos alimentares',
    allowedYears: AGRICULTURE_YEARS_2025,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'pantanos*',
    stops: [
      [0, '#d0d1d3'],
      [1, '#ad4413'],
    ],
    unit: '',

    popup: {
      label: 'Pântanos alimentares',
      unit: '',
    }
  },

  // ------- Distancia média até pontos de agricultura urbana -------
  urban_agriculture_distance: {
    type: 'vector',
    label: 'Distancia média até pontos de agricultura urbana',
    allowedYears: AGRICULTURE_YEARS_2023,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'au_dist(m)',
    stops: [
      [20, '#fff5eb'],
      [142, '#fee4ca'],
      [209, '#fdc997'],
      [270, '#fda45d'],
      [320, '#f87f2c'],
      [393, '#e5590a'],
      [450, '#b83c02'],
      [539, '#7f2704'],
    ],
    unit: 'm',

    popup: {
      label: 'Distancia média até pontos de agricultura urbana',
      unit: 'm',
    }
  },

  // ------- Distância média até restaurantes populares -------
  popular_restaurants_distance: {
    type: 'vector',
    label: 'Distância média até restaurantes populares',
    allowedYears: AGRICULTURE_YEARS_2023,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'san_distr',
    stops: [
      [72, '#fff5eb'],
      [596, '#fee4ca'],
      [871, '#fdc997'],
      [1152, '#fda45d'],
      [1394, '#f87f2c'],
      [1640, '#e5590a'],
      [1951, '#b83c02'],
      [2374, '#7f2704'],
    ],
    unit: 'm',

    popup: {
      label: 'Distância média até restaurantes populares',
      unit: 'm',
    }
  },

  // ------- Distância média até feiras livres -------
  markets_distance: {
    type: 'vector',
    label: 'Distância média até feiras livres',
    allowedYears: AGRICULTURE_YEARS_2023,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'san_distf',
    stops: [
      [19, '#fff5eb'],
      [192, '#fee4ca'],
      [292, '#fdc997'],
      [381, '#fda45d'],
      [457, '#f87f2c'],
      [525, '#e5590a'],
      [642, '#b83c02'],
      [823, '#7f2704'],
    ],
    unit: 'm',

    popup: {
      label: 'Distância média até feiras livres',
      unit: 'm',
    }
  },

  // ------- Densidade de estabelecimentos comerciais de produtos in natura -------
  natura_density: {
    type: 'vector',
    label: 'Densidade de estabelecimentos comerciais de produtos in natura',
    allowedYears: AGRICULTURE_YEARS_2025,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'dens_eq_n',
    stops: [
      [0, '#d7191c'],
      [15, '#c4e687'],
      [44, '#1a9641']
    ],
    unit: '',

    popup: {
      label: 'Densidade de estabelecimentos comerciais de produtos in natura',
      unit: '',
    }
  },

  // ------- Densidade de Estabelecimentos comerciais de produtos ultraprocessados -------
  ultra_density: {
    type: 'vector',
    label: 'Densidade de Estabelecimentos comerciais de produtos ultraprocessados',
    allowedYears: AGRICULTURE_YEARS_2025,
    source: (year) => {
      const sourceLayer = `public.geodata_ausan_por_setor_${year}`;

      return {
        type: 'vector',
        tiles: [
          `https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`
        ],
        sourceLayer
      };
    },
    property: 'dens_eq_u',
    stops: [
      [0, '#ffffff'],
      [15, '#ff5555'],
      [61, '#ff0000']
    ],
    unit: '',

    popup: {
      label: 'Densidade de Estabelecimentos comerciais de produtos ultraprocessados',
      unit: '',
    }
  },
};

// Helper function to get layer config
export function getLayerConfig(layerId, year, scale) {
  const base = LAYER_CONFIGS[layerId];
  if (!base) { return null; }

  // If base.source is a function, call it
  const source = typeof base.source === 'function'
    ? base.source(year, scale)
    : base.source;

  return { ...base, source };
}

// Helper to get layer paint properties
export function getLayerPaint(config, { scale, municipioId, statistics } = {}) {
  if (config.type === 'raster') {
    return config.paint;
  }

  // Handle vector layers
  const property = config.property;

  // If we're in intraurbana scale and have stats
  if (scale === 'intraurbana' && statistics && municipioId) {
    // Get min/mean/max for the property (e.g. a1_min, a1_mean, a1_max)
    const min = statistics[`${property}_min`];
    const mean = statistics[`${property}_mean`];
    const max = statistics[`${property}_max`];

    if (min !== undefined && mean !== undefined && max !== undefined) {
      return {
        'fill-opacity': 0.7,
        'fill-color': [
          'case',
          ['==', ['get', 'cd_mun'], municipioId],
          [
            'interpolate',
            ['linear'],
            ['get', property],
            min, '#d53e4f',
            mean, '#fee08b',
            max, '#3288bd'
          ],
          'transparent'  // All other features become transparent
        ]
      };
    }
  }

  // Default estadual scale paint or fallback
  return {
    'fill-opacity': 0.7,
    'fill-color': [
      'interpolate',
      ['linear'],
      ['to-number', ['get', property]],
      ...config.stops.flat()
    ]
  };
}
