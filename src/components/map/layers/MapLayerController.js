import { getLayerPaint, getLayerConfig } from '@/constants/layers.js';
import { useLocationStore } from '@/stores/locationStore';

/**
 * Funções para gerenciar as layers do mapa
 */

/**
 * Cria uma layer raster
 * @param {Object} config - Configuração da layer
 * @returns {Object} Configuração da layer raster
 */
export function createRasterLayer(config) {
  console.log('Criando layer raster:', config);

  return {
    id: config.id,
    type: 'raster',
    source: config.id,
    paint: config.paint
  };
}

/**
 * Cria uma layer vetorial
 * @param {Object} config - Configuração da layer
 * @returns {Object} Configuração da layer vetorial
 */
export function createVectorLayer(config) {
  console.log('Criando layer vetorial:', config);

  return {
    id: config.id,
    type: 'fill',
    source: config.id,
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
  console.log('Criando layer de contorno:', config);

  return {
    id: `${config.id}-outline`,
    type: 'line',
    source: config.id,
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
  console.log('Configurando source dinâmica:', { config, locationStore, currentScale });

  const sourceUrl = config.source.tiles[0];
  const urlHasQuery = sourceUrl.includes('?');
  const isVector = config.type !== 'raster';
  const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun && isVector;

  const filteredUrl = shouldFilter
    ? `${sourceUrl}${urlHasQuery ? '&' : '?'}cql_filter=(cd_mun='${locationStore.cd_mun}' OR cd_mun=${locationStore.cd_mun})`
    : sourceUrl;

  const sourceConfig = {
    ...config.source,
    tiles: [filteredUrl]
  };

  console.log('Source configurada:', sourceConfig);

  return sourceConfig;
}

/**
 * Aplica filtros nas layers
 * @param {Object} map - Instância do mapa
 * @param {Object} config - Configuração da layer
 * @param {Object} locationStore - Store de localização
 * @param {string} currentScale - Escala atual
 */
export function applyLayerFilters(map, config, locationStore, currentScale) {
  console.log('Aplicando filtros:', { config, locationStore, currentScale });

  const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun && config.type !== 'raster';

  if (shouldFilter) {
    map.setFilter(config.id, [
      'any',
      ['==', ['to-string', ['get', 'cd_mun']], String(locationStore.cd_mun)],
      ['==', ['get', 'cd_mun'], locationStore.cd_mun]
    ]);

    map.setFilter(`${config.id}-outline`, ['==', 'cd_mun', locationStore.cd_mun]);
  }
}

/**
 * Configura as layers dinâmicas
 * @param {Object} map - Instância do mapa
 * @param {string} layerId - ID da configuração da layer
 * @returns {boolean} Sucesso da operação
 */
export function setupDynamicLayers(map, layerId) {
  const locationStore = useLocationStore();
  const { year, scale } = locationStore;

  console.log('[MapLayerController] Iniciando setupDynamicLayers:', { layerId, year, scale });

  try {
    // Obter configuração da layer
    const config = getLayerConfig(layerId, year, scale);
    console.log('[MapLayerController] Configuração obtida:', config);

    if (!config || !config.source) {
      console.error('[MapLayerController] Configuração inválida para a layer:', layerId);

      return false;
    }

    // Validar tipo da camada
    if (!config.type || !['raster', 'vector'].includes(config.type)) {
      console.error('[MapLayerController] Tipo de camada inválido:', config.type);

      return false;
    }

    // Configurar source
    const sourceConfig = setupDynamicSource(config, locationStore, scale);
    console.log('[MapLayerController] Source configurado:', sourceConfig);

    if (!sourceConfig) {
      console.error('[MapLayerController] Falha ao configurar source para a layer:', layerId);

      return false;
    }

    // Adicionar source ao mapa
    console.log('[MapLayerController] Adicionando source ao mapa:', config.id);
    map.addSource(config.id, sourceConfig);

    // Criar e adicionar layer principal
    let mainLayer;
    if (config.type === 'raster') {
      mainLayer = createRasterLayer(config);
    } else if (config.type === 'vector') {
      mainLayer = createVectorLayer(config);
    }

    if (!mainLayer) {
      console.error('[MapLayerController] Falha ao criar layer principal:', config.id);

      return false;
    }

    console.log('[MapLayerController] Layer principal criada:', mainLayer);
    map.addLayer(mainLayer);
    console.log('[MapLayerController] Layer principal adicionada ao mapa');

    // Se for vector, adicionar outline
    if (config.type === 'vector') {
      const outlineLayer = createOutlineLayer(config);
      if (outlineLayer) {
        console.log('[MapLayerController] Layer de outline criada:', outlineLayer);
        map.addLayer(outlineLayer);
        console.log('[MapLayerController] Layer de outline adicionada ao mapa');
      }
    }

    // Aplicar filtros se necessário
    applyLayerFilters(map, config, locationStore, scale);
    console.log('[MapLayerController] Filtros aplicados');

    return true;
  } catch (error) {
    console.error('[MapLayerController] Erro ao configurar layers dinâmicas:', error);

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

/**
 * Atualiza os filtros de município em todas as camadas dinâmicas
 * @param {Object} map - Instância do mapa
 * @param {string} cd_mun - Código do município
 */
export function updateMunicipalityFilters(map, cd_mun) {
  console.log('Atualizando filtros de município:', cd_mun);

  // Obter todas as camadas do mapa
  const layers = map.getStyle().layers;

  // Filtrar apenas as camadas dinâmicas (que não são outline)
  const dynamicLayers = layers.filter(layer => {
    const isDynamic = layer.id.includes('-layer') && !layer.id.includes('-outline');

    return isDynamic;
  });

  console.log('Camadas dinâmicas encontradas:', dynamicLayers.map(l => l.id));

  // Atualizar filtros para cada camada
  dynamicLayers.forEach(layer => {
    try {
      // Verificar se a camada tem source-layer (é vetorial)
      if (layer['source-layer']) {
        // Aplicar filtro para camadas vetoriais
        map.setFilter(layer.id, [
          'any',
          ['==', ['to-string', ['get', 'cd_mun']], String(cd_mun)],
          ['==', ['get', 'cd_mun'], cd_mun]
        ]);

        // Atualizar também a camada de outline se existir
        const outlineLayerId = `${layer.id}-outline`;
        if (map.getLayer(outlineLayerId)) {
          map.setFilter(outlineLayerId, ['==', 'cd_mun', cd_mun]);
        }
      } else {
        // Para camadas raster, atualizar a URL do source
        const source = map.getSource(layer.source);
        if (source && source.tiles) {
          const currentUrl = source.tiles[0];
          const urlHasQuery = currentUrl.includes('?');
          const newUrl = `${currentUrl}${urlHasQuery ? '&' : '?'}cql_filter=cd_mun=${cd_mun}`;

          source.setTiles([newUrl]);
        }
      }
    } catch (error) {
      console.error(`Erro ao atualizar filtros para a camada ${layer.id}:`, error);
    }
  });

  console.log('Filtros de município atualizados com sucesso');
}
