// urbverde-ui/src/components/map/layers/layersOrder.js
/**
 * Ordem principal das camadas
 */
export const LAYER_TYPES = {
  BASE: 'base',
  OVERLAY: 'overlay',
  LABEL: 'label'
};

export const LAYER_GROUPS = {
  MUNICIPALITIES: 'municipalities',
  PARKS: 'parks',
  DYNAMIC: 'dynamic',
  SATELLITE: 'satellite'
};

export const LAYER_ORDER = {
  [LAYER_TYPES.BASE]: [
    'base-municipalities',
    'selected-municipality-fill',
    'municipalities-base-outline'
  ],
  [LAYER_GROUPS.PARKS]: [
    'parks-layer'
  ],
  [LAYER_GROUPS.DYNAMIC]: [
    'dynamic-layer-outline',
    'setores-layer',
    'dynamic-layer'
  ],
  [LAYER_TYPES.LABEL]: [
    'satellite-layer'
  ]
};

/**
 * Move uma camada para uma posição específica
 * @param {Object} map - Instância do mapa
 * @param {string} layerId - ID da camada
 * @param {string} beforeId - ID da camada que deve vir antes
 */
export function moveLayerBefore(map, layerId, beforeId) {
  if (!map || !map.getLayer(layerId)) {return;}

  if (beforeId && map.getLayer(beforeId)) {
    map.moveLayer(layerId, beforeId);
  } else {
    map.moveLayer(layerId);
  }
}

/**
 * Reordena as camadas de acordo com a ordem definida
 * @param {Object} map - Instância do mapa
 */
export function reorderLayers(map) {
  if (!map) {return;}

  // Ordenar por grupos
  Object.values(LAYER_ORDER).flat()
    .forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.moveLayer(layerId);
      }
    });
}

/**
 * Move todas as camadas do tipo 'symbol' (labels) para o topo
 * @param {Object} map - Instância do mapa
 */
export function bringBasemapLabelsToFront(map) {
  if (!map) {return;}

  const layers = map.getStyle().layers || [];
  layers.forEach(layer => {
    if (layer.type === 'symbol') {
      map.moveLayer(layer.id);
    }
  });
}

/**
 * Reordena todas as camadas e move os labels para o topo
 * @param {Object} map - Instância do mapa
 */
export function reorderAllLayers(map) {
  if (!map) {
    console.warn('reorderAllLayers: Mapa não definido');

    return;
  }

  try {
    // 1. Primeiro, mover todas as camadas base para o fundo
    LAYER_ORDER[LAYER_TYPES.BASE].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.moveLayer(layerId);
      }
    });

    // 2. Em seguida, mover as camadas de parques
    LAYER_ORDER[LAYER_GROUPS.PARKS].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.moveLayer(layerId);
      }
    });

    // 3. Depois, mover as camadas dinâmicas
    LAYER_ORDER[LAYER_GROUPS.DYNAMIC].forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.moveLayer(layerId);
      }
    });

    // 4. Por fim, mover os labels para o topo
    bringBasemapLabelsToFront(map);

    // Log para debug
    const layers = map.getStyle().layers;
    console.debug('Ordem final das camadas:', layers.map(l => l.id));
  } catch (error) {
    console.error('Erro ao reordenar camadas:', error);
  }
}

/**
 * Adiciona uma nova camada em uma posição específica
 * @param {Object} map - Instância do mapa
 * @param {string} layerId - ID da nova camada
 * @param {string} group - Grupo da camada
 * @param {Object} layerConfig - Configuração da camada
 */
export function addLayerToGroup(map, layerId, group, layerConfig) {
  if (!map || !layerId || !group || !LAYER_ORDER[group]) {return;}

  // Adicionar a camada ao grupo
  LAYER_ORDER[group].push(layerId);

  // Adicionar a camada ao mapa
  map.addLayer(layerConfig);

  // Reordenar todas as camadas
  reorderAllLayers(map);
}
