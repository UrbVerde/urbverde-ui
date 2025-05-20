/**
 * Tipos de dados das camadas
 */
export const LAYER_DATA_TYPES = {
  VECTOR: 'vector',
  RASTER: 'raster',
  SYMBOL: 'symbol'
};

/**
 * Grupos de camadas e suas ordens
 */
export const LAYER_GROUPS = {
  BASEMAP: 'basemap',      // Camadas do MapTiler
  BASE_LAYERS: 'base',     // Camadas base do sistema
  DYNAMIC: 'dynamic',      // Camadas dinâmicas
  SYMBOLS: 'symbols'       // Símbolos e labels
};

/**
 * Ordem das camadas em cada grupo
 */
export const LAYER_ORDER = {
  [LAYER_GROUPS.BASEMAP]: [
    // Camadas do MapTiler (não precisamos listar, pois são gerenciadas pelo próprio MapTiler)
  ],
  [LAYER_GROUPS.BASE_LAYERS]: [
    'base-municipalities',
    'selected-municipality-fill',
    'municipalities-base-outline'
  ],
  [LAYER_GROUPS.DYNAMIC]: [
    // Será preenchido dinamicamente
  ],
  [LAYER_GROUPS.SYMBOLS]: [
    // Será preenchido dinamicamente com camadas do tipo 'symbol'
  ]
};

/**
 * Classe para gerenciar a ordem das camadas
 */
export class LayerOrderManager {
  constructor(map) {
    this.map = map;
    this.dynamicLayers = new Set();
    this.symbolLayers = new Set();
  }

  /**
   * Adiciona uma camada dinâmica
   * @param {Object} config - Configuração da camada
   * @param {string} config.id - ID único da camada
   * @param {string} config.group - Grupo da camada (LAYER_GROUPS)
   * @param {string} config.dataType - Tipo de dados (LAYER_DATA_TYPES)
   * @param {Object} config.source - Configuração da fonte
   * @param {Object} config.paint - Configuração de pintura
   * @param {Object} config.layout - Configuração de layout
   */
  addDynamicLayer(config) {
    if (!this.map || !config.id) {return;}

    const {
      id,
      group = LAYER_GROUPS.DYNAMIC,
      dataType = LAYER_DATA_TYPES.VECTOR,
      source,
      paint,
      layout
    } = config;

    // Criar configuração da camada
    const layerConfig = {
      id,
      type: dataType,
      source: source.id,
      'source-layer': source.sourceLayer,
      paint,
      layout
    };

    // Adicionar source se não existir
    if (!this.map.getSource(source.id)) {
      this.map.addSource(source.id, source);
    }

    // Encontrar a primeira camada do grupo para usar como referência
    const firstLayerInGroup = this.findFirstLayerInGroup(group);

    // Adiciona a camada ao mapa, posicionando-a acima da primeira camada do grupo
    if (firstLayerInGroup) {
      this.map.addLayer(layerConfig, firstLayerInGroup);
    } else {
      this.map.addLayer(layerConfig);
    }

    // Registra a camada como dinâmica
    this.dynamicLayers.add(id);

    // Atualiza a ordem
    this.updateLayerOrder();
  }

  /**
   * Encontra a primeira camada de um grupo específico
   * @param {string} group - Grupo da camada
   * @returns {string|null} ID da primeira camada do grupo ou null
   */
  findFirstLayerInGroup(group) {
    if (!this.map) {return null;}

    const layers = this.map.getStyle().layers;

    // Para camadas base, retorna a primeira camada da lista
    if (group === LAYER_GROUPS.BASE_LAYERS) {
      return LAYER_ORDER[group][0];
    }

    // Para camadas dinâmicas, retorna a primeira camada dinâmica encontrada
    if (group === LAYER_GROUPS.DYNAMIC) {
      for (const layer of layers) {
        if (this.dynamicLayers.has(layer.id)) {
          return layer.id;
        }
      }
    }

    // Para símbolos, retorna a primeira camada do tipo symbol
    if (group === LAYER_GROUPS.SYMBOLS) {
      for (const layer of layers) {
        if (layer.type === LAYER_DATA_TYPES.SYMBOL) {
          return layer.id;
        }
      }
    }

    return null;
  }

  /**
   * Remove uma camada dinâmica
   * @param {string} layerId - ID da camada
   */
  removeDynamicLayer(layerId) {
    if (!this.map || !layerId) {return;}

    // Remove a camada do mapa
    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }

    // Remove do registro de camadas dinâmicas
    this.dynamicLayers.delete(layerId);

    // Atualiza a ordem
    this.updateLayerOrder();
  }

  /**
   * Atualiza a ordem de todas as camadas
   */
  updateLayerOrder() {
    if (!this.map) {return;}

    // 1. Mover camadas base para suas posições
    LAYER_ORDER[LAYER_GROUPS.BASE_LAYERS].forEach(layerId => {
      if (this.map.getLayer(layerId)) {
        this.map.moveLayer(layerId);
      }
    });

    // 2. Mover camadas dinâmicas
    Array.from(this.dynamicLayers).forEach(layerId => {
      if (this.map.getLayer(layerId)) {
        this.map.moveLayer(layerId);
      }
    });

    // 3. Mover símbolos para o topo
    this.bringSymbolsToFront();
  }

  /**
   * Move todas as camadas do tipo 'symbol' para o topo
   */
  bringSymbolsToFront() {
    if (!this.map) {return;}

    const layers = this.map.getStyle().layers || [];
    layers.forEach(layer => {
      if (layer.type === LAYER_DATA_TYPES.SYMBOL) {
        this.map.moveLayer(layer.id);
        this.symbolLayers.add(layer.id);
      }
    });
  }

  /**
   * Obtém a ordem atual das camadas
   * @returns {Array} Lista de IDs das camadas em ordem
   */
  getCurrentLayerOrder() {
    if (!this.map) {return [];}

    return this.map.getStyle().layers.map(layer => layer.id);
  }

  /**
   * Verifica se uma camada está presente
   * @param {string} layerId - ID da camada
   * @returns {boolean} True se a camada existe
   */
  hasLayer(layerId) {
    return this.map && this.map.getLayer(layerId);
  }

  /**
   * Limpa todas as camadas dinâmicas
   */
  clearDynamicLayers() {
    if (!this.map) {return;}

    this.dynamicLayers.forEach(layerId => {
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }
    });

    this.dynamicLayers.clear();
    this.updateLayerOrder();
  }
}

// Exemplo de uso:
/*
const layerManager = new LayerOrderManager(map);

// Adicionar uma camada dinâmica
layerManager.addDynamicLayer({
  id: 'dynamic-layer',
  group: LAYER_GROUPS.DYNAMIC,
  dataType: LAYER_DATA_TYPES.VECTOR,
  source: {
    id: 'dynamic-source',
    type: 'vector',
    tiles: ['https://...'],
    sourceLayer: 'layer-name'
  },
  paint: {
    'fill-color': '#ff0000',
    'fill-opacity': 0.7
  }
});

// Adicionar uma camada raster
layerManager.addDynamicLayer({
  id: 'raster-layer',
  group: LAYER_GROUPS.DYNAMIC,
  dataType: LAYER_DATA_TYPES.RASTER,
  source: {
    id: 'raster-source',
    type: 'raster',
    tiles: ['https://...']
  },
  paint: {
    'raster-opacity': 0.7
  }
});
*/
