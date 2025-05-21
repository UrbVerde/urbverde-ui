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
  MASK_LAYERS: 'mask',      // Camadas de recortes (hover, selected, interações)
  SYMBOLS: 'symbols'       // Símbolos e labels
};

/**
 * Ordem das camadas em cada grupo
 */
export const LAYER_ORDER = {
  [LAYER_GROUPS.BASEMAP]: [
    // Camadas do MapTiler (não precisamos listar, pois são gerenciadas pelo próprio MapTiler)
  ],

  [LAYER_GROUPS.DYNAMIC]: [
    'surface-temp-layer',
    'parks',

    // Será preenchido dinamicamente

  ],
  [LAYER_GROUPS.BASE_LAYERS]: [

    'out_selected_clickable_fill-layer',  // Área clicável (por baixo)
    'out_selected_outline-layer',         // Contorno (meio)
    'highlight_selected-layer',           // Destaque (por cima)
  ],
  [LAYER_GROUPS.MASK_LAYERS]: [
    // Camadas de texto nativas do MapTiler

  ],
  [LAYER_GROUPS.SYMBOLS]: [
    // Camadas de texto nativas do MapTiler

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
    this.layerGroups = new Map();
    this.initializeLayerGroups();
  }

  /**
   * Inicializa os grupos de camadas
   */
  initializeLayerGroups() {
    Object.values(LAYER_GROUPS).forEach(group => {
      this.layerGroups.set(group, new Set());
    });
  }

  /**
   * Adiciona uma camada ao seu grupo correspondente
   * @param {string} layerId - ID da camada
   * @param {string} group - Grupo da camada
   */
  addLayerToGroup(layerId, group = LAYER_GROUPS.DYNAMIC) {
    if (!this.layerGroups.has(group)) {
      this.layerGroups.set(group, new Set());
    }
    this.layerGroups.get(group).add(layerId);
  }

  /**
   * Remove uma camada do seu grupo
   * @param {string} layerId - ID da camada
   * @param {string} group - Grupo da camada
   */
  removeLayerFromGroup(layerId, group) {
    if (this.layerGroups.has(group)) {
      this.layerGroups.get(group).delete(layerId);
    }
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

    // Registra a camada no grupo correspondente
    this.addLayerToGroup(id, group);

    // Registra a camada como dinâmica se for do grupo DYNAMIC
    if (group === LAYER_GROUPS.DYNAMIC) {
      this.dynamicLayers.add(id);
    }

    // Registra a camada como símbolo se for do tipo SYMBOL
    if (dataType === LAYER_DATA_TYPES.SYMBOL) {
      this.symbolLayers.add(id);
    }

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
    const groupLayers = this.layerGroups.get(group);

    if (!groupLayers || groupLayers.size === 0) {
      return null;
    }

    // Para camadas base, retorna a primeira camada da lista
    if (group === LAYER_GROUPS.BASE_LAYERS) {
      return LAYER_ORDER[group][0];
    }

    // Para outros grupos, retorna a primeira camada encontrada
    for (const layer of layers) {
      if (groupLayers.has(layer.id)) {
        return layer.id;
      }
    }

    return null;
  }

  /**
   * Remove uma camada dinâmica
   * @param {string} layerId - ID da camada
   * @param {string} group - Grupo da camada
   */
  removeDynamicLayer(layerId, group = LAYER_GROUPS.DYNAMIC) {
    if (!this.map || !layerId) {return;}

    // Remove a camada do mapa
    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }

    // Remove do registro de camadas dinâmicas
    this.dynamicLayers.delete(layerId);
    this.symbolLayers.delete(layerId);
    this.removeLayerFromGroup(layerId, group);

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
    return this.map.getLayer(layerId) !== undefined;
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
    this.symbolLayers.clear();
    this.layerGroups.get(LAYER_GROUPS.DYNAMIC).clear();
    this.updateLayerOrder();
  }

  // Método para listar camadas ativas
  listLayers() {
    return Array.from(this.dynamicLayers);
  }

  // Método para obter configuração de uma camada
  getLayerConfig(layerId) {
    const layer = this.map.getLayer(layerId);
    if (!layer) {return null;}

    return {
      id: layer.id,
      type: layer.type,
      source: layer.source,
      'source-layer': layer['source-layer'],
      paint: layer.paint,
      layout: layer.layout
    };
  }

  /**
   * Valida se uma camada pode ser adicionada
   * @param {string} layerId - ID da camada
   * @returns {boolean} Se a camada pode ser adicionada
   */
  validateLayer(layerId) {
    if (!this.map) {return false;}

    // Verificar se a camada já existe
    if (this.map.getLayer(layerId)) {
      console.warn(`Camada ${layerId} já existe`);

      return false;
    }

    // Verificar se o ID é válido
    if (!layerId || typeof layerId !== 'string') {
      console.warn('ID de camada inválido');

      return false;
    }

    return true;
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
