export const LAYERS_DEFAULT = [
  {
    name: "Legenda",
    categoria: "base",
    type: "fill",
    visible: true,
    visibleUI: false,
    colorUI: "#d4ecd5",
    zIndex: 50,
    componentName: "MunicipiosVector",
    legends: [
      {
        color: "#7c99f4",
        contour: true,
        value: "Municípios",
      },
      {
        color: "black",
        contour: true,
        value: "Setores Censitários",
      },

    ],
    props: {
      source: {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geom_municipios/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      },
    },
    sourceLayer: "public.geom_municipios",
  },
  {
    name: "Setores Censitários",
    categoria: "base",
    type: "fill",
    visible: true,
    visibleUI: false,
    colorUI: "#d4ecd5",
    zIndex: 50, 
    componentName: "SetoresCensitariosVector",
    props: {
      source: {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geom_setores/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      },
    },
    sourceLayer: "public.geom_setores",
  },

  // Camadas Principais - ESTADUAL:VEGETACAO

  {
    name: "Percentual de Cobertura Vegetal (PCV)",
    categoria: "principal_vegetacao",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "PercentualCoberturaVegetal",
    opacity: 1,
  },
  {
    name: "Percentual de Cobertura Vegetal (PCV) por Mesorregião",
    categoria: "/Percentual de Cobertura Vegetal (PCV)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "VegetacaoMesorregiao",
    opacity: 1,
    legends: [
      {
        value: "0 - 0.4",
        range: true,
        color:
          "linear-gradient(to right top, #ffffe5, #f7fcb9, #d9f0a3, #addd8e, #78c679, #41ab5d, #238443, #006837, #004529)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "b1"],
        0.15,
        "#ffffe5",
        0.17,
        "#f7fcb9",
        0.18,
        "#d9f0a3",
        0.2,
        "#addd8e",
        0.22,
        "#78c679",
        0.24,
        "#41ab5d",
        0.27,
        "#238443",
        0.31,
        "#006837",
        0.33,
        "#004529",
      ],
    },
  },
  {
    name: "Percentual de Cobertura Vegetal (PCV) por Microrregião",
    categoria: "/Percentual de Cobertura Vegetal (PCV)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "VegetacaoMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "0 - 0.4",
        range: true,
        color:
          "linear-gradient(to right top, #ffffe5, #f7fcb9, #d9f0a3, #addd8e, #78c679, #41ab5d, #238443, #006837, #004529)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "b1"],
        0.12,
        "#ffffe5",
        0.15,
        "#f7fcb9",
        0.16,
        "#d9f0a3",
        0.18,
        "#addd8e",
        0.21,
        "#78c679",
        0.24,
        "#41ab5d",
        0.29,
        "#238443",
        0.31,
        "#006837",
        0.35,
        "#004529",
      ],
    },
  },

  {
    name: "Índice de Cobertura Vegetal (ICV)",
    categoria: "principal_vegetacao",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "IndiceCoberturaVegetal",
    opacity: 1,
    // essa propriedade precisa ser iniciada com o mesmo valor da propriedade 'visible'
    legends: [],
    paint: {},
  },
  {
    name: "Índice de Cobertura Vegetal (ICV) por Mesorregião",
    categoria: "/Índice de Cobertura Vegetal (ICV)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "VegetacaoMesorregiao",
    opacity: 1,
    legends: [
      {
        value: "730 - 4033",
        range: true,
        color:
          "linear-gradient(to right top, #ffffe5, #f7fcb9, #d9f0a3, #addd8e, #78c679, #41ab5d, #238443, #006837, #004529)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "b2"],
        730,
        "#ffffe5",
        818,
        "#f7fcb9",
        1323,
        "#d9f0a3",
        1638,
        "#addd8e",
        2083,
        "#78c679",
        2488,
        "#41ab5d",
        3385,
        "#238443",
        3723,
        "#006837",
        4033,
        "#004529",
      ],
    },
  },

  {
    name: "Índice de Cobertura Vegetal (ICV) por Microrregião",
    categoria: "/Índice de Cobertura Vegetal (ICV)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "VegetacaoMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "250 - 7100",
        range: true,
        color:
          "linear-gradient(to right top, #ffffe5, #f7fcb9, #d9f0a3, #addd8e, #78c679, #41ab5d, #238443, #006837, #004529)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "b2"],
        251,
        "#ffffe5",
        634,
        "#f7fcb9",
        973,
        "#d9f0a3",
        1164,
        "#addd8e",
        1718,
        "#78c679",
        2298,
        "#41ab5d",
        4215,
        "#238443",
        5131,
        "#006837",
        7177,
        "#004529",
      ],
    },
  },
  {
    name: "Índice de Desigualdade Socioambiental (IDSA)",
    categoria: "principal_vegetacao",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "IndiceDesenvolvimentoSocioambiental",
    opacity: 1,
  },
  {
    name: "ISs - Subindicador Social",
    categoria: "/Índice de Desigualdade Socioambiental (IDSA)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ISs",
    opacity: 1,
  },
  {
    name: "ISi - Subindicador de Infraestrutura",
    categoria: "/Índice de Desigualdade Socioambiental (IDSA)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ISi",
    opacity: 1,
  },
  {
    name: "ISd - Subindicador Demográfico",
    categoria: "/Índice de Desigualdade Socioambiental (IDSA)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ISd",
    opacity: 1,
  },
  {
    name: "IDSA por Mesorregião",
    categoria: "/Índice de Desigualdade Socioambiental (IDSA)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "VegetacaoMesorregiao",
    opacity: 1,
    legends: [
      {
        value: "0.6 - 0.7",
        range: true,
        color:
          "linear-gradient(to right,  #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027)",
      },
    ],

    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "b3"],
        0.61,
        "#4575b4",
        0.62,
        "#74add1",
        0.63,
        "#abd9e9",
        0.64,
        "#e0f3f8",
        0.65,
        "#ffffbf",
        0.66,
        "#fee090",
        0.68,
        "#fdae61",
        0.69,
        "#f46d43",
        0.71,
        "#d73027",
      ],
    },
  },
  {
    name: "IDSA por Microrregião",
    categoria: "/Índice de Desigualdade Socioambiental (IDSA)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "VegetacaoMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "0.5 - 0.8",
        range: true,
        color:
          "linear-gradient(to right,  #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027)",
      },
    ],

    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "b3"],
        0.59,
        "#4575b4",
        0.61,
        "#74add1",
        0.62,
        "#abd9e9",
        0.63,
        "#e0f3f8",
        0.64,
        "#ffffbf",
        0.66,
        "#fee090",
        0.68,
        "#fdae61",
        0.7,
        "#f46d43",
        0.74,
        "#d73027",
      ],
    },
  },
  
  // Camadas Principais - PRACAS
  {
    name: "População atendida pelas praças",
    categoria: "principal_pracas",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "AcessoPopulacaoAtendidasPelasPracas",
    opacity: 1,
    legends: [{}],
    paint: {},
  },
  {
    name: "Acesso - população atendida pelas praças por Mesorregião",
    categoria: "/Acesso população atendida pelas praças",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMesorregiao",
    opacity: 1,
    legends: [
      {
        range: true,
        color:
          "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4)",
        value: `30 - 76`,
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a1"],
        30,
        ["to-color", "#d53e4f"],
        40,
        ["to-color", "#f46d43"],
        50,
        ["to-color", "#fdae61"],
        60,
        ["to-color", "#fee08b"],
        70,
        ["to-color", "#e6f598"],
        76,
        ["to-color", "#abdda4"],
      ],
    },
  },
  {
    name: "Acesso - população atendida pelas praças por Microrregião",
    categoria: "/Acesso população atendida pelas praças",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMicrorregiao",
    opacity: 1,
    legends: [
      {
        range: true,
        color:
          "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4)",
        value: `15 - 85`,
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a1"],
        15,
        ["to-color", "#d53e4f"],
        30,
        ["to-color", "#f46d43"],
        45,
        ["to-color", "#fdae61"],
        60,
        ["to-color", "#fee08b"],
        75,
        ["to-color", "#e6f598"],
        85,
        ["to-color", "#abdda4"],
      ],
    },
  },

  {
    name: "Área de praças por Habitante",
    categoria: "principal_pracas",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "PracasPorHabitante",
    opacity: 1,
  },

  {
    name: "Área de praças por Habitante por Mesorregião",
    categoria: "/M² de praças por Habitante",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMesorregiao",
    opacity: 1,
    legends: [
      {
        value: "0.2 - 2.74 m²",
        range: true,
        color:
          "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4, #66c2a5, #3288bd)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a2"],
        0,
        ["to-color", "#d53e4f"],
        0.4,
        ["to-color", "#f46d43"],
        0.8,
        ["to-color", "#fdae61"],
        1.2,
        ["to-color", "#fee08b"],
        1.6,
        ["to-color", "#e6f598"],
        2,
        ["to-color", "#abdda4"],
        2.4,
        ["to-color", "#66c2a5"],
        2.8,
        ["to-color", "#3288bd"],
      ],
    },
  },
  {
    name: "Área de praças por Habitante por Microrregião",
    categoria: "/M² de praças por Habitante",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "0 - 14 m²",
        range: true,
        color:
          "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4, #66c2a5, #3288bd)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a2"],
        0,
        ["to-color", "#d53e4f"],
        2,
        ["to-color", "#f46d43"],
        4,
        ["to-color", "#fdae61"],
        6,
        ["to-color", "#fee08b"],
        8,
        ["to-color", "#e6f598"],
        10,
        ["to-color", "#abdda4"],
        12,
        ["to-color", "#66c2a5"],
        14,
        ["to-color", "#3288bd"],
      ],
    },
  },

  {
    name: "Área atendida pelas praças",
    categoria: "principal_pracas",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "AreasOcupadasBuffers",
    opacity: 1,
  },

  {
    name: "Cobertura da vizinhança das praças área ocupada pelos buffers por Mesorregião",
    categoria: "/% de área ocupada pelos buffers",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMesorregiao",
    opacity: 1,
    legends: [
      {
        value: "17 - 46",
        range: true,
        color:
          "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4, #66c2a5, #3288bd)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a3"],
        17,
        ["to-color", "#d53e4f"],
        21,
        ["to-color", "#f46d43"],
        25,
        ["to-color", "#fdae61"],
        29,
        ["to-color", "#fee08b"],
        34,
        ["to-color", "#e6f598"],
        38,
        ["to-color", "#abdda4"],
        42,
        ["to-color", "#66c2a5"],
        46,
        ["to-color", "#3288bd"],
      ],
    },
  },
  {
    name: "Cobertura - área ocupada pelos buffers por Microrregião",
    categoria: "/% de área ocupada pelos buffers",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "6 - 51",
        range: true,
        color:
          "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4, #66c2a5, #3288bd)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a3"],
        6,
        ["to-color", "#d53e4f"],
        15,
        ["to-color", "#f46d43"],
        21,
        ["to-color", "#fdae61"],
        27,
        ["to-color", "#fee08b"],
        33,
        ["to-color", "#e6f598"],
        39,
        ["to-color", "#abdda4"],
        45,
        ["to-color", "#66c2a5"],
        51,
        ["to-color", "#3288bd"],
      ],
    },
  },

  {
    name: "Distância Média até as praças",
    categoria: "principal_pracas",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "DistribuicaoEspacial",
    opacity: 1,
  },
  {
    name: "Distância Média até praça mais próxima por Mesorregião",
    categoria: "/Distância Média até praça mais próxima",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMesorregiao",
    opacity: 1,
    legends: [
      {
        value: "8 - 28",
        range: true,
        color:
          "linear-gradient(to right, #d73027, #fc8d59, #fee08b, #ffffbf, #d9ef8b, #91cf60, #1a9850)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a4"],
        0,
        "#d73027",
        5,
        "#fc8d59",
        10,
        "#fee08b",
        15,
        "#ffffbf",
        20,
        "#d9ef8b",
        25,
        "#91cf60",
        30,
        "#1a9850",
      ],
    },
  },
  {
    name: "Distância Média até praça mais próxima por Microrregião",
    categoria: "/Distância Média até praça mais próxima",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "ParquesMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "2 - 41",
        range: true,
        color:
          "linear-gradient(to right, #d73027, #fc8d59, #fee08b, #ffffbf, #d9ef8b, #91cf60, #1a9850)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "a4"],
        0,
        "#d73027",
        7,
        "#fc8d59",
        14,
        "#fee08b",
        21,
        "#ffffbf",
        28,
        "#d9ef8b",
        34,
        "#91cf60",
        41,
        "#1a9850",
      ],
    },
  },

  {
    name: "Produto Interno Bruto",
    categoria: "aux_pracas",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "Pib",
    opacity: 1,
  },

  {
    name: "Coeficiente de Gini",
    categoria: "aux_pracas",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "RegioesLayer",
    opacity: 1,
    sourceLayer: "public.geodata_pracas_por_municipio_2021",
    props: {
      source: {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geodata_pracas_por_municipio_2021/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      },
    },

    legends: [
      {
        value: "0.33 - 0.68",
        range: true,
        color: "linear-gradient(to right, #2b83ba, #abdda4, #fdae61, #d7191c)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "gini"],
        0.3339,
        "#2b83ba",
        0.4555,
        "#abdda4",
        0.5555,
        "#fdae61",
        0.6858,
        "#d7191c",
      ],
    },
  },
  {
    name: "IDH",
    categoria: "aux_pracas",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "RegioesLayer-IDH",
    opacity: 1,
    sourceLayer: "public.geodata_pracas_por_municipio_2021",
    props: {
      source: {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geodata_pracas_por_municipio_2021/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      },
    },

    legends: [
      {
        range: true,
        color: "linear-gradient(to right, #f63939, #6c3df2",
        value: "0.639 - 0.862",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "idh"],
        0.7,
        "#f63939",
        0.8,
        "#6c3df2",
      ],
    },
  },

  {
    name: "Mancha Urbana",
    categoria: "aux_pracas",
    type: "raster",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 52,
    componentName: "ManchaUrbana",
    opacity: 1,
    props: {
      source: {
        type: "raster",
        generateId: true,
        tiles: [
          `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3ANew-Mancha-Urbana&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng`,
        ],
      },
    },
  },

  {
    name: "Temperatura de Superfície (2016-2021)",
    categoria: "aux_pracas_intraurbano",
    type: "raster",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 52,
    opacity: 1,
    componentName: "AuxTempIntraurb",
    props: {
      source: {},
    },
  },

  {
    name: "Renda",
    categoria: "aux_pracas_intraurbano",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "Renda",
    opacity: 0.8,
    legends: [
      {
        range: true,
        value: "0 - 10 %",
        color:
          "linear-gradient(to right, #f63939, #fc3f74, #ee5aa7, #d177ce, #ad90e3, #9c91e9, #8792ed, #6d93f1, #6182f6, #5c6ff8, #6159f7, #6c3df2)",
      },
    ],
    paint: {},
  },

  {
    name: "Parques e Praças",
    categoria: "aux_pracas_intraurbano",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 100,
    componentName: "PracasParquesVector",
    legends: [
      {
        color: "#40826D",
        value: "Parques e Praças",
      },
    ],
    props: {
      source: {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geom_pracas/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      },
    },
    sourceLayer: "public.geom_pracas",
  },

  {
    name: "Buffer de 400m ao redor das praças",
    categoria: "aux_pracas_intraurbano",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 53,
    componentName: "Buffer400m",
    opacity: 0.5,
    legends: [
      {
        color: "#FF6F91",
        value: "Área do buffer",
      },
    ],
    props: {
      source: {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geom_buffer_400m_municipios/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      },
    },
    sourceLayer: "public.geom_buffer_400m_municipios",
  },

  {
    name: "Vegetação",
    categoria: "aux_veg",
    type: "raster",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 52,
    componentName: "VegetacaoRaster",
    props: {
      source: {},
    },
    legends: [
      {
        range: true,
        color:
          "linear-gradient(to right, #ff4903, #ff7100, #ff9300, #ffb200, #ffd000, #edd500, #dadb00, #c5df00, #9bcc05, #73b90f, #49a416, #10901b)",
        value: `0 - 100%`,
      },
    ],
  },

  {
    name: "Anual NDVI",
    categoria: "aux_veg",
    type: "raster",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 52,
    componentName: "NdviRaster",
    props: {
      source: {},
    },
    legends: [
      {
        range: true,
        color:
          "linear-gradient(to right, #addd8e, #78c679, #41ab5d, #238443, #006837, #004529)",
        value: `0 - 100%`,
      },
    ],
  },


  // Temperatura
  {
    name: "Coeficiente de Ilha de Calor",
    categoria: "principal_temperatura",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "CoeficienteIlhaCalor",
    opacity: 1,
  },
  // {
  //   name: "Coeficiente de Ilha de Calor por Microrregião",
  //   categoria: "/Coeficiente de Ilha de Calor",
  //   type: "fill",
  //   visible: false,
  //   visibleUI: true,
  //   colorUI: "#d4ecd5",
  //   zIndex: 51,
  //   componentName: "TemperaturaMicrorregiao",
  //   opacity: 1,
  //   legends: [
  //     {
  //       value: "0 - 15",
  //       range: true,
  //       color:
  //         "linear-gradient(to right, #3288bd, #99d594, #e6f598, #fee08b, #fc8d59, #d53e4f)",
  //     },
  //   ],
  //   paint: {
  //     "fill-color": [
  //       "interpolate",
  //       ["linear"],
  //       ["get", "c1"],
  //       0,
  //       "#3288bd",
  //       3,
  //       "#99d594",
  //       6,
  //       "#e6f598",
  //       9,
  //       "#fee08b",
  //       12,
  //       "#fc8d59",
  //       15,
  //       "#d53e4f",
  //     ],
  //   },
  // },
  // {
  //   name: "Coeficiente de Ilha de Calor por Mesorregião",
  //   categoria: "/Coeficiente de Ilha de Calor",
  //   type: "fill",
  //   visible: false,
  //   visibleUI: true,
  //   colorUI: "#d4ecd5",
  //   zIndex: 51,
  //   componentName: "TemperaturaMesorregiao",
  //   opacity: 1,
  //   sourceLayer: "public.geodata_vegetacao_por_mesorregiao_2016",
  //   legends: [
  //     {
  //       value: "0 - 5",
  //       range: true,
  //       color:
  //         "linear-gradient(to right, #3288bd, #99d594, #e6f598, #fee08b, #fc8d59, #d53e4f)",
  //     },
  //   ],
  //   paint: {
  //     "fill-color": [
  //       "interpolate",
  //       ["linear"],
  //       ["get", "c1"],
  //       0,
  //       "#3288bd",
  //       1,
  //       "#99d594",
  //       2,
  //       "#e6f598",
  //       3,
  //       "#fee08b",
  //       4,
  //       "#fc8d59",
  //       5,
  //       "#d53e4f",
  //     ],
  //   },
  // },
  // {
  //   name: "Temperatura Média de Superfície",
  //   categoria: "principal_temperatura",
  //   type: "fill",
  //   visible: false,
  //   visibleUI: true,
  //   colorUI: "#d4ecd5",
  //   zIndex: 51,
  //   componentName: "TemperaturaMediaSuperficie",
  //   opacity: 1,
  // },
  {
    name: "Temperatura Média de Superfície por Mesorregião",
    categoria: "/Temperatura Média de Superfície (TMS)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "TemperaturaMesorregiao",
    opacity: 1,
    legends: [
      {
        value: "22 - 33 ºC",
        range: true,
        color:
          "linear-gradient(to right, #2b83ba, #abdda4, #ffffbf, #fdae61, #d7191c)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "c2"],
        22,
        "#2b83ba",
        25,
        "#abdda4",
        28,
        "#ffffbf",
        31,
        "#fdae61",
        33,
        "#d7191c",
      ],
    },
  },
  {
    name: "Temperatura Média de Superfície por Microrregião",
    categoria: "/Temperatura Média de Superfície (TMS)",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "TemperaturaMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "20 - 33 ºC",
        range: true,
        color:
          "linear-gradient(to right, #2b83ba, #abdda4, #ffffbf, #fdae61, #d7191c)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "c2"],
        20,
        "#2b83ba",
        25,
        "#abdda4",
        28,
        "#ffffbf",
        31,
        "#fdae61",
        33,
        "#d7191c",
      ],
    },
  },
  {
    name: "Temperatura Máxima de Superfície",
    categoria: "principal_temperatura",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "TemperaturaMaximaSuperficie",
    opacity: 1,
  },
  {
    name: "TS máxima por Mesorregião",
    categoria: "/Temperatura Máxima de Superfície",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "TemperaturaMesorregiao",
    opacity: 1,

    legends: [
      {
        value: "33 - 41 ºC",
        range: true,
        color:
          "linear-gradient(to right, #3288bd, #99d594, #e6f598, #fee08b, #fc8d59, #d53e4f)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "c2"],
        33,
        "#3288bd",
        34,
        "#99d594",
        35,
        "#e6f598",
        37,
        "#fee08b",
        39,
        "#fc8d59",
        41,
        "#d53e4f",
      ],
    },
  },
  {
    name: "TS máxima por Microrregião",
    categoria: "/Temperatura Máxima de Superfície",
    type: "fill",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 51,
    componentName: "TemperaturaMicrorregiao",
    opacity: 1,
    legends: [
      {
        value: "30 - 45 ºC",
        range: true,
        color:
          "linear-gradient(to right, #3288bd, #99d594, #e6f598, #fee08b, #fc8d59, #d53e4f)",
      },
    ],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "c2"],
        30,
        "#3288bd",
        33,
        "#99d594",
        36,
        "#e6f598",
        39,
        "#fee08b",
        41,
        "#fc8d59",
        44,
        "#d53e4f",
      ],
    },
  },

  {
    name: "Temperatura de Superfície (2016-2021)",
    categoria: "aux_temperatura_intraurbano",
    type: "raster",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 52,
    componentName: "AuxTempIntraurban",
    opacity: 1,
    props: {
      source: {},
    },
  },

  {
    name: "Imagem de Temperatura Anual",
    categoria: "aux_temperatura",
    type: "raster",
    visible: false,
    visibleUI: true,
    colorUI: "#d4ecd5",
    zIndex: 52,
    componentName: "TemperaturaRaster",
    props: {
      source: {},
    },
    opacity: 0.8,
  },

  // {
  //   name: "Teste Martin",
  //   categoria: "",
  //   type: "circle",
  //   visible: true,
  //   visibleUI: false,
  //   colorUI: "#d4ecd5",
  //   zIndex: 51,
  //   componentName: "PracasParquesDataLayer",
  //   props: {
  //     source: {
  //       generateId: true,
  //       type: "vector",
  //       url: "http://localhost:3000/public.points2.json?limit=100",
  //     },
  //   },
  //   sourceLayer: "public.points2",
  //   paint: {
  //     "circle-color": "#8481ff",
  //   },
  // },
];
