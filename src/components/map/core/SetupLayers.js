import { getLayerConfig } from '@/constants/layers.js';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';
import { createMountLayers } from '@/components/map/layers/MountLayers.js';
import {
  setupRasterInteractions
} from '@/components/map/layers/MapLayerInteractionManager.js';
import { updateMunicipalityFilters } from '@/components/map/core/MunicipalityFilter.js';
import { moveSymbolLayersToTop } from '@/components/map/layers/ReorderLayers.js';
import { createMultiLayerPopup } from '@/components/map/popups/MultiLayerPopup.js';

/**
 * Função para adicionar camada de parques
 * @param {Object} map - Instância do mapa
 * @param {Object} locationStore - Store de localização
 * @param {string} currentScale - Escala atual
 */
export function addParksLayer(map, locationStore, currentScale) {
  // Usar o sistema MountLayers para adicionar a camada parks
  const mountLayers = createMountLayers();
  const success = mountLayers.mountLayer('parks');

  if (success) {
    console.log('[SetupLayers] Camada parks adicionada com sucesso usando MountLayers');
    console.log('[SetupLayers] Aplicando filtro de município na camada parks');

    // Aplicar filtro de município na camada parks se estiver na escala intraurbana
    if (currentScale === 'intraurbana' && locationStore.cd_mun) {
      if (map && map.getLayer('parks')) {
        console.log('[SetupLayers] Aplicando filtro na camada parks');
        map.setFilter('parks', ['==', 'cd_mun', String(locationStore.cd_mun)]);

        // Aplicar filtro nas subcamadas também
        const fillLayerId = 'parks_fill';
        const outlineLayerId = 'parks_outline';

        if (map.getLayer(fillLayerId)) {
          console.log('[SetupLayers] Aplicando filtro na subcamada parks_fill');
          map.setFilter(fillLayerId, ['==', 'cd_mun', String(locationStore.cd_mun)]);
        }

        if (map.getLayer(outlineLayerId)) {
          console.log('[SetupLayers] Aplicando filtro na subcamada parks_outline');
          map.setFilter(outlineLayerId, ['==', 'cd_mun', String(locationStore.cd_mun)]);
        }
      } else {
        console.log('[SetupLayers] Camada parks não encontrada no mapa');
      }
    } else {
      console.log('[SetupLayers] Condições não atendidas para aplicar filtro');
    }
  } else {
    console.error('[SetupLayers] Falha ao adicionar camada parks usando MountLayers');
  }
}

/**
 * Função para buscar o valor raster do WMS
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {Object} controller - Controller para abortar a requisição
 * @param {string} currentLayer - Camada atual
 * @param {string} currentYear - Ano atual
 * @returns {Promise<number|null>} Valor raster ou null
 */
export async function fetchRasterValue(lng, lat, controller, currentLayer, currentYear) {
  const bboxSize = 0.0001;
  const ts = Date.now();
  let url;

  if (currentLayer === 'ndvi') {
    url = 'https://urbverde.iau.usp.br/geoserver/urbverde/wms?' +
      'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&' +
      `LAYERS=urbverde:NDVI-10m-${currentYear}&` +
      `QUERY_LAYERS=urbverde:NDVI-10m-${currentYear}&` +
      'INFO_FORMAT=application/json&FEATURE_COUNT=1&X=50&Y=50&' +
      `SRS=EPSG:4326&WIDTH=101&HEIGHT=101&_ts=${ts}&` +
      `BBOX=${lng - bboxSize},${lat - bboxSize},${lng + bboxSize},${lat + bboxSize}`;
  } else if (currentLayer === 'cvp') {
    url = 'https://urbverde.iau.usp.br/geoserver/urbverde/wms?' +
      'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&' +
      `LAYERS=urbverde:PCV-30m-8bits-${currentYear}&` +
      `QUERY_LAYERS=urbverde:PCV-30m-8bits-${currentYear}&` +
      'INFO_FORMAT=application/json&FEATURE_COUNT=1&X=50&Y=50&' +
      `SRS=EPSG:4326&WIDTH=101&HEIGHT=101&_ts=${ts}&` +
      `BBOX=${lng - bboxSize},${lat - bboxSize},${lng + bboxSize},${lat + bboxSize}`;
  } else {
    url = 'https://urbverde.iau.usp.br/geoserver/urbverde/wms?' +
      'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&' +
      'LAYERS=urbverde:tst-intraurbana-rel-30m-2021a2016&' +
      'QUERY_LAYERS=urbverde:tst-intraurbana-rel-30m-2021a2016&' +
      'INFO_FORMAT=application/json&FEATURE_COUNT=1&X=50&Y=50&' +
      `SRS=EPSG:4326&WIDTH=101&HEIGHT=101&_ts=${ts}&` +
      `BBOX=${lng - bboxSize},${lat - bboxSize},${lng + bboxSize},${lat + bboxSize}`;
  }

  try {
    const response = await fetch(url, { signal: controller.signal });
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      console.error('Expected JSON but got:', contentType);
      console.error('URL:', url);

      // Se receber XML, tentar ler o conteúdo para debug
      if (contentType.includes('xml')) {
        const text = await response.text();
        console.error('XML Response:', text);
      }

      return null;
    }

    const data = await response.json();

    if (currentLayer === 'ndvi') {
      // Debug: log das propriedades para NDVI
      console.log('NDVI data:', data);
      if (data?.features?.[0]?.properties) {
        console.log('NDVI properties:', data.features[0].properties);
      }

      // Tentar diferentes propriedades possíveis para NDVI
      const properties = data?.features?.[0]?.properties;
      if (properties) {
        if (properties.NDVI !== undefined) {
          return properties.NDVI !== null ? Number(properties.NDVI) : null;
        } else if (properties.ndvi !== undefined) {
          return properties.ndvi !== null ? Number(properties.ndvi) : null;
        } else if (properties.GRAY_INDEX !== undefined) {
          return properties.GRAY_INDEX !== null ? Number(properties.GRAY_INDEX) : null;
        } else if (properties.gray_index !== undefined) {
          return properties.gray_index !== null ? Number(properties.gray_index) : null;
        }
      }
    } else if (currentLayer === 'cvp') {
      if (data?.features?.[0]?.properties?.GRAY_INDEX !== undefined) {
        const val = data.features[0].properties.GRAY_INDEX;

        return val !== null ? Number(val) : null;
      }
    } else {
      if (data?.features?.[0]?.properties?.GRAY_INDEX !== undefined) {
        const val = data.features[0].properties.GRAY_INDEX;

        return val !== null ? Number(val) : null;
      }
    }
  } catch (error) {
    console.error('Error in fetchRasterValue:', error);

    return null;
  }

  return null;
}

/**
 * Função para configurar as camadas do mapa
 * @param {Object} map - Instância do mapa
 * @param {string} currentLayer - Camada atual
 * @param {string} currentYear - Ano atual
 * @param {string} currentScale - Escala atual
 * @param {string} currentCode - Código do município atual
 */
export function setupLayers(map, currentLayer, currentYear, currentScale, currentCode) {
  if (!map || !currentLayer) { return; }

  const locationStore = useLocationStore();
  // Log do conteúdo do vetor activeLayers antes do mount
  const layersStore = useLayersStore();
  console.log('[SetupLayers] Conteúdo do activeLayers antes do mount:', JSON.stringify(layersStore.activeLayers, null, 2));

  // Usar o sistema MountLayers para adicionar camadas
  const mountLayers = createMountLayers();

  try {
    // Adicionar camada de parques usando a função existente
    addParksLayer(map, locationStore, currentScale);

    // Obter configuração da camada principal
    const config = getLayerConfig(currentLayer, currentYear, currentScale);

    if (!config) {
      console.error('[SetupLayers] Configuração da camada não encontrada:', currentLayer);

      return;
    }

    // Adicionar a camada principal usando MountLayers
    const success = mountLayers.mountLayer(currentLayer);

    if (success) {
      console.log('[SetupLayers] Camada principal adicionada com sucesso usando MountLayers:', currentLayer);

      // Definir a camada principal como currentMain = true
      layersStore.setLayerAsMain(currentLayer, true);
      console.log('[SetupLayers] Camada definida como principal:', currentLayer);

      // Adicionar interações adicionais se necessário
      if (config.type === 'raster') {
        // Configurar popups raster para todas as escalas
        setupRasterInteractions(map, config, (lng, lat, controller) =>
          fetchRasterValue(lng, lat, controller, currentLayer, currentYear)
        );
      } else if (currentScale === 'intraurbana' && currentCode) {
        // setupSetoresLayer(map, locationStore);
        // setupSetoresInteractions(map, hoveredSetorId);
        // setupVectorInteractions(map, config);
      }
    } else {
      console.error('[SetupLayers] Falha ao adicionar camada principal usando MountLayers:', currentLayer);
    }

    // Atualizar filtros de município após o setup das camadas
    if (currentCode) {
      console.log('[SetupLayers] Atualizando filtros de município após setup das camadas');
      updateMunicipalityFilters(map, currentCode);
    }

    const success2 = moveSymbolLayersToTop(map);
    if (success2) {
      console.log('Camadas symbol movidas para o topo com sucesso!');
    } else {
      console.error('Erro ao mover camadas symbol');
    }

    // Inicializar o popup multi-camada após o setup das camadas
    const multiLayerPopup = createMultiLayerPopup(map);
    if (multiLayerPopup) {
      multiLayerPopup.initialize();
      console.log('[SetupLayers] Popup multi-camada inicializado com sucesso');
    } else {
      console.error('[SetupLayers] Falha ao inicializar popup multi-camada');
    }
  } catch (error) {
    console.error('Erro ao configurar layers:', error);
  }
}
