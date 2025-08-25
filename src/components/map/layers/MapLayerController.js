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
  console.log('[MapLayerController] === INÍCIO createRasterLayer ===');
  console.log('[MapLayerController] Configuração recebida:', config);

  const layerConfig = {
    id: config.id,
    type: 'raster',
    source: config.id,
    paint: config.paint
  };

  console.log('[MapLayerController] Layer raster criada:', layerConfig);
  console.log('[MapLayerController] === FIM createRasterLayer ===');

  return layerConfig;
}

/**
 * Cria uma layer vetorial
 * @param {Object} config - Configuração da layer
 * @returns {Object} Configuração da layer vetorial
 */
export function createVectorLayer(config) {
  console.log('[MapLayerController] === INÍCIO createVectorLayer ===');
  console.log('[MapLayerController] Configuração recebida:', config);

  const layerConfig = {
    id: config.id,
    type: 'fill',
    source: config.id,
    'source-layer': config.source.sourceLayer,
    paint: getLayerPaint(config)
  };

  console.log('[MapLayerController] Layer vetorial criada:', layerConfig);
  console.log('[MapLayerController] === FIM createVectorLayer ===');

  return layerConfig;
}

/**
 * Cria uma layer de contorno
 * @param {Object} config - Configuração da layer
 * @returns {Object} Configuração da layer de contorno
 */
export function createOutlineLayer(config) {
  console.log('[MapLayerController] === INÍCIO createOutlineLayer ===');
  console.log('[MapLayerController] Configuração recebida:', config);

  const layerConfig = {
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

  console.log('[MapLayerController] Layer de contorno criada:', layerConfig);
  console.log('[MapLayerController] === FIM createOutlineLayer ===');

  return layerConfig;
}

/**
 * Configura a fonte de dados dinâmica
 * @param {Object} config - Configuração da layer
 * @param {Object} locationStore - Store de localização
 * @param {string} currentScale - Escala atual
 * @returns {Object} Configuração da fonte
 */
export function setupDynamicSource(config, locationStore, currentScale) {
  console.log('[MapLayerController] === INÍCIO setupDynamicSource ===');
  console.log('[MapLayerController] Parâmetros:', { config, locationStore, currentScale });

  // Aplicar filtros para a camada de parques se estiver na escala intraurbana
  if (config.id === 'parks') {
    console.log('[MapLayerController] Camada parks detectada - aplicando filtros na URL');
    const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun;

    if (shouldFilter) {
      const sourceUrl = config.source.tiles[0];
      const urlHasQuery = sourceUrl.includes('?');
      const filteredUrl = `${sourceUrl}${urlHasQuery ? '&' : '?'}cql_filter=cd_mun=${locationStore.cd_mun}`;

      const sourceConfig = {
        ...config.source,
        tiles: [filteredUrl]
      };
      console.log('[MapLayerController] Source configurada para parks com filtro:', sourceConfig);
      console.log('[MapLayerController] === FIM setupDynamicSource (PARKS COM FILTRO) ===');

      return sourceConfig;
    } else {
      const sourceConfig = {
        ...config.source,
        tiles: [config.source.tiles[0]]
      };
      console.log('[MapLayerController] Source configurada para parks sem filtro:', sourceConfig);
      console.log('[MapLayerController] === FIM setupDynamicSource (PARKS SEM FILTRO) ===');

      return sourceConfig;
    }
  }

  const sourceUrl = config.source.tiles[0];
  const urlHasQuery = sourceUrl.includes('?');
  const isVector = config.type !== 'raster';
  const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun && isVector;

  console.log('[MapLayerController] Análise da URL:', { sourceUrl, urlHasQuery, isVector, shouldFilter });

  const filteredUrl = shouldFilter
    ? `${sourceUrl}${urlHasQuery ? '&' : '?'}cql_filter=(cd_mun='${locationStore.cd_mun}' OR cd_mun=${locationStore.cd_mun})`
    : sourceUrl;

  const sourceConfig = {
    ...config.source,
    tiles: [filteredUrl]
  };

  console.log('[MapLayerController] URL final:', filteredUrl);
  console.log('[MapLayerController] Source configurada:', sourceConfig);
  console.log('[MapLayerController] === FIM setupDynamicSource ===');

  return sourceConfig;
}

/**
 * Aplica filtros nas layers
 * @param {Object} map - Instância do mapa
 * @param {Object} config - Configuração da layer
 * @param {Object} locationStore - Store de localização
 * @param {string} currentScale - Escala atual
 */
// export function applyLayerFilters(map, config, locationStore, currentScale) {
//   console.log('[MapLayerController] === INÍCIO applyLayerFilters ===');
//   console.log('[MapLayerController] Parâmetros:', { config, locationStore, currentScale });

//   // Aplicar filtros para a camada de parques se estiver na escala intraurbana
//   if (config.id === 'parks') {
//     console.log('[MapLayerController] Camada parks detectada - aplicando filtros de município');
//     const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun;

//     if (shouldFilter) {
//       console.log('[MapLayerController] Aplicando filtros para camada parks');
//       if (map.getLayer(config.id)) {
//         map.setFilter(config.id, ['==', 'cd_mun', locationStore.cd_mun]);
//       }
//       if (map.getLayer(`${config.id}-outline`)) {
//         map.setFilter(`${config.id}-outline`, ['==', 'cd_mun', locationStore.cd_mun]);
//       }
//     } else {
//       console.log('[MapLayerController] Removendo filtros para camada parks');
//       if (map.getLayer(config.id)) {
//         map.setFilter(config.id, null);
//       }
//       if (map.getLayer(`${config.id}-outline`)) {
//         map.setFilter(`${config.id}-outline`, null);
//       }
//     }
//     console.log('[MapLayerController] === FIM applyLayerFilters (PARKS) ===');
//     return;
//   }

//   const shouldFilter = currentScale === 'intraurbana' && locationStore.cd_mun && config.type !== 'raster';
//   console.log('[MapLayerController] shouldFilter:', shouldFilter);

//   if (shouldFilter) {
//     console.log('[MapLayerController] Aplicando filtros para camada:', config.id);

//     const filter = [
//       'any',
//       ['==', ['to-string', ['get', 'cd_mun']], String(locationStore.cd_mun)],
//       ['==', ['get', 'cd_mun'], locationStore.cd_mun]
//     ];

//     console.log('[MapLayerController] Filtro principal:', filter);
//     map.setFilter(config.id, filter);

//     const outlineFilter = ['==', 'cd_mun', locationStore.cd_mun];
//     console.log('[MapLayerController] Filtro outline:', outlineFilter);
//     map.setFilter(`${config.id}-outline`, outlineFilter);

//     console.log('[MapLayerController] Filtros aplicados com sucesso');
//   } else {
//     console.log('[MapLayerController] Filtros não aplicados (shouldFilter = false)');
//   }

//   console.log('[MapLayerController] === FIM applyLayerFilters ===');
// }

/**
 * Configura as layers dinâmicas
 * @param {Object} map - Instância do mapa
 * @param {string} layerId - ID da configuração da layer
 * @returns {boolean} Sucesso da operação
 */

export function setupDynamicLayers(map, layerId) {
  console.log('[MapLayerController] === INÍCIO setupDynamicLayers ===');
  console.log('[MapLayerController] Parâmetros:', { map, layerId });

  const locationStore = useLocationStore();
  const { year, scale } = locationStore;

  console.log('[MapLayerController] Estado do locationStore:', { year, scale, cd_mun: locationStore.cd_mun });

  try {
    // Obter configuração da layer
    console.log('[MapLayerController] Obtendo configuração para layerId:', layerId);
    const config = getLayerConfig(layerId, year, scale, locationStore.cd_mun);
    console.log('[MapLayerController] Configuração obtida:', config);

    if (!config || !config.source) {
      console.error('[MapLayerController] Configuração inválida para a layer:', layerId);
      console.log('[MapLayerController] === FIM setupDynamicLayers (ERRO) ===');

      return false;
    }

    // Validar tipo da camada
    console.log('[MapLayerController] Validando tipo da camada:', config.type);
    if (!config.type || !['raster', 'vector'].includes(config.type)) {
      console.error('[MapLayerController] Tipo de camada inválido:', config.type);
      console.log('[MapLayerController] === FIM setupDynamicLayers (ERRO) ===');

      return false;
    }

    // Configurar source
    console.log('[MapLayerController] Configurando source...');
    const sourceConfig = setupDynamicSource(config, locationStore, scale);
    console.log('[MapLayerController] Source configurado:', sourceConfig);

    if (!sourceConfig) {
      console.error('[MapLayerController] Falha ao configurar source para a layer:', layerId);
      console.log('[MapLayerController] === FIM setupDynamicLayers (ERRO) ===');

      return false;
    }

    // Adicionar source ao mapa
    console.log('[MapLayerController] Adicionando source ao mapa:', config.id);
    map.addSource(config.id, sourceConfig);
    console.log('[MapLayerController] Source adicionado com sucesso');

    // Criar e adicionar layer principal
    console.log('[MapLayerController] Criando layer principal...');
    let mainLayer;
    if (config.type === 'raster') {
      console.log('[MapLayerController] Criando layer raster...');
      mainLayer = createRasterLayer(config);
    } else if (config.type === 'vector') {
      console.log('[MapLayerController] Criando layer vetorial...');
      mainLayer = createVectorLayer(config);
    }

    if (!mainLayer) {
      console.error('[MapLayerController] Falha ao criar layer principal:', config.id);
      console.log('[MapLayerController] === FIM setupDynamicLayers (ERRO) ===');

      return false;
    }

    console.log('[MapLayerController] Layer principal criada:', mainLayer);
    map.addLayer(mainLayer);
    console.log('[MapLayerController] Layer principal adicionada ao mapa');

    // Se for vector, adicionar outline
    // if (config.type === 'vector') {
    //   const outlineLayer = createOutlineLayer(config);
    //   if (outlineLayer) {
    //     console.log('[MapLayerController] Layer de outline criada:', outlineLayer);
    //     map.addLayer(outlineLayer);
    //     console.log('[MapLayerController] Layer de outline adicionada ao mapa');
    //   }
    // }

    // Aplicar filtros se necessário
    console.log('[MapLayerController] Aplicando filtros...');
    // applyLayerFilters(map, config, locationStore, scale);
    console.log('[MapLayerController] Filtros aplicados');

    console.log('[MapLayerController] === FIM setupDynamicLayers (SUCESSO) ===');

    return true;
  } catch (error) {
    console.error('[MapLayerController] Erro ao configurar layers dinâmicas:', error);
    console.log('[MapLayerController] === FIM setupDynamicLayers (ERRO) ===');

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
      // Aplicar filtros para a camada de parques se estiver na escala intraurbana
      if (layer.id === 'parks' || layer.id.includes('parks')) {
        console.log(`[MapLayerController] Camada ${layer.id} detectada - aplicando filtros de município`);
        const shouldFilter = cd_mun;

        if (shouldFilter) {
          console.log(`[MapLayerController] Aplicando filtros para camada ${layer.id}`);
          map.setFilter(layer.id, ['==', 'cd_mun', cd_mun]);

          // Aplicar filtro na camada de outline se existir
          const outlineLayerId = `${layer.id}-outline`;
          if (map.getLayer(outlineLayerId)) {
            map.setFilter(outlineLayerId, ['==', 'cd_mun', cd_mun]);
          }
        } else {
          console.log(`[MapLayerController] Removendo filtros para camada ${layer.id}`);
          map.setFilter(layer.id, null);

          // Remover filtro da camada de outline se existir
          const outlineLayerId = `${layer.id}-outline`;
          if (map.getLayer(outlineLayerId)) {
            map.setFilter(outlineLayerId, null);
          }
        }

        return;
      }

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
