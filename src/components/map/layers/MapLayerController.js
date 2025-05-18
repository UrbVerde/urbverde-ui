import { getLayerPaint, getLayerConfig } from '@/constants/layers.js';

const logger = {
  debug: (message, ...args) => {
    // eslint-disable-next-line no-console
    console.debug(message, ...args);
  },
  error: (message, ...args) => {

    console.error(message, ...args);
  }
};

/**
 * Funções para gerenciar as layers do mapa
 */

/**
 * Cria uma layer raster
 * @param {Object} config - Configuração da layer
 * @returns {Object} Configuração da layer raster
 */
export function createRasterLayer(config) {
  return {
    id: 'dynamic-layer',
    type: 'raster',
    source: 'dynamic-source',
    paint: config.paint
  };
}

/**
 * Cria uma layer vetorial
 * @param {Object} config - Configuração da layer
 * @returns {Object} Configuração da layer vetorial
 */
export function createVectorLayer(config) {
  return {
    id: 'dynamic-layer',
    type: 'fill',
    source: 'dynamic-source',
    'source-layer': config.source.sourceLayer,
    paint: getLayerPaint(config)
  };
}

/**
 * Cria uma layer de contorno
 * @param {Object} config - Configuração da layer
 * @returns {Object} Configuração da layer de contorno
 */
export function createOutlineLayer(config) {
  return {
    id: 'dynamic-layer-outline',
    type: 'line',
    source: 'dynamic-source',
    'source-layer': config.source.sourceLayer,
    paint: {
      'line-color': '#666666',
      'line-width': 1,
      'line-opacity': 0.3
    }
  };
}

/**
 * Configura a fonte de dados dinâmica
 * @param {Object} config - Configuração da layer
 * @param {Object} locationStore - Store de localização
 * @param {string} currentScale - Escala atual
 * @returns {Object} Configuração da fonte
 */
export function setupDynamicSource(config, locationStore, currentScale) {
  const sourceUrl = config.source.tiles[0];
  const urlHasQuery = sourceUrl.includes('?');
  const isVector = config.type !== 'raster';
  const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun && isVector;

  const filteredUrl = shouldFilter
    ? `${sourceUrl}${urlHasQuery ? '&' : '?'}cql_filter=(cd_mun='${locationStore.cd_mun}' OR cd_mun=${locationStore.cd_mun})`
    : sourceUrl;

  return {
    ...config.source,
    tiles: [filteredUrl]
  };
}

/**
 * Aplica filtros nas layers
 * @param {Object} map - Instância do mapa
 * @param {Object} config - Configuração da layer
 * @param {Object} locationStore - Store de localização
 * @param {string} currentScale - Escala atual
 */
export function applyLayerFilters(map, config, locationStore, currentScale) {
  const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun && config.type !== 'raster';

  if (shouldFilter) {
    map.setFilter('dynamic-layer', [
      'any',
      ['==', ['to-string', ['get', 'cd_mun']], String(locationStore.cd_mun)],
      ['==', ['get', 'cd_mun'], locationStore.cd_mun]
    ]);

    map.setFilter('dynamic-layer-outline', ['==', 'cd_mun', locationStore.cd_mun]);
  }
}

/**
 * Configura as layers dinâmicas
 * @param {Object} map - Instância do mapa
 * @param {string} layerId - ID da layer
 * @param {string} year - Ano
 * @param {string} scale - Escala
 * @param {Object} locationStore - Store de localização
 * @param {Function} setupRasterInteractions - Função para configurar interações raster
 * @param {Function} setupVectorInteractions - Função para configurar interações vetoriais
 * @returns {boolean} Sucesso da operação
 */
export function setupDynamicLayers(map, layerId, year, scale, locationStore, setupRasterInteractions, setupVectorInteractions) {
  logger.debug('Configurando layers dinâmicas:', { layerId, year, scale });

  try {
    // Obter configuração da layer
    const config = getLayerConfig(layerId, year, scale);
    if (!config || !config.source) {
      logger.error('Configuração inválida para a layer:', layerId);

      return false;
    }

    // Configurar source
    const sourceConfig = setupDynamicSource(config, locationStore, scale);
    logger.debug('Source configurado:', sourceConfig);

    // Adicionar source ao mapa
    map.addSource('dynamic-source', sourceConfig);

    // Criar e adicionar layer principal
    const mainLayer = config.type === 'raster'
      ? createRasterLayer(config)
      : createVectorLayer(config);
    logger.debug('Layer principal criada:', mainLayer);

    map.addLayer(mainLayer);

    // Se for vector, adicionar outline
    if (config.type === 'vector') {
      const outlineLayer = createOutlineLayer(config);
      logger.debug('Layer de outline criada:', outlineLayer);
      map.addLayer(outlineLayer);
    }

    // Aplicar filtros se necessário
    applyLayerFilters(map, config, locationStore, scale);

    // Configurar interações
    if (config.type === 'raster') {
      setupRasterInteractions(config);
    } else {
      setupVectorInteractions(config);
    }

    return true;
  } catch (error) {
    logger.error('Erro ao configurar layers dinâmicas:', error);

    return false;
  }
}

/**
 * Limpa os popups do mapa
 * @param {Object} popups - Objeto contendo os popups
 */
export function clearPopups(popups) {
  if (popups.vector) { popups.vector.remove(); }
  if (popups.raster) { popups.raster.remove(); }
  if (popups.pinned) { popups.pinned.remove(); }
}

/**
 * Configura a layer de setores
 * @param {Object} map - Instância do mapa
 * @param {Object} locationStore - Store de localização
 */
export function setupSetoresLayer(map, locationStore) {
  // Adiciona source dos setores
  map.addSource('setores-source', {
    type: 'vector',
    tiles: [
      'https://urbverde.iau.usp.br/dados/public.geom_setores/{z}/{x}/{y}.pbf'
    ],
    minzoom: 0,
    maxzoom: 22
  });

  // Adiciona camada de setores para hover
  map.addLayer({
    id: 'setores-layer',
    type: 'fill',
    source: 'setores-source',
    'source-layer': 'public.geom_setores',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#666666',
        'transparent'
      ],
      'fill-opacity': 0.2
    }
  });

  if (locationStore.cd_mun) {
    map.setFilter('setores-layer', ['==', 'cd_mun', locationStore.cd_mun]);
  }
}
