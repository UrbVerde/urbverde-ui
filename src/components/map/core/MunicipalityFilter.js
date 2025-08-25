import { LAYER_CONFIGS } from '@/constants/layers.js';
import { useLayersStore } from '@/stores/layersStore';
// import { createMountLayers } from '@/components/map/layers/MountLayers.js';
// import { createUnmountLayers } from '@/components/map/layers/UnmountLayers.js';
import { useLocationStore } from '@/stores/locationStore';
// import { useLocationStore } from '@/stores/locationStore';

/**
 * Atualiza os filtros da camada de parques baseado na escala e município
 * @param {Object} mapInstance - Instância do mapa
 * @param {string} newCdMun - Código do novo município
 * @param {string} scale - Escala atual (intraurbana ou outra)
 */
function updateParksLayerFilter(mapInstance, newCdMun, scale) {
  console.log('[MunicipalityFilter] Camada parks detectada - aplicando filtro de município');

  if (scale === 'intraurbana' && newCdMun) {
    if (mapInstance && mapInstance.getLayer('parks')) {
      mapInstance.setFilter('parks', ['==', 'cd_mun', String(newCdMun)]);

      // Aplicar filtro nas subcamadas também
      const fillLayerId = 'parks_fill';
      const outlineLayerId = 'parks_outline';

      if (mapInstance.getLayer(fillLayerId)) {
        mapInstance.setFilter(fillLayerId, ['==', 'cd_mun', String(newCdMun)]);
      }

      if (mapInstance.getLayer(outlineLayerId)) {
        mapInstance.setFilter(outlineLayerId, ['==', 'cd_mun', String(newCdMun)]);
      }
    }
  } else {
    // Se não estiver na escala intraurbana ou não houver município, remover filtros
    console.log('[MunicipalityFilter] Removendo filtros da camada parks');
    if (mapInstance && mapInstance.getLayer('parks')) {
      mapInstance.setFilter('parks', null);

      const fillLayerId = 'parks_fill';
      const outlineLayerId = 'parks_outline';

      if (mapInstance.getLayer(fillLayerId)) {
        mapInstance.setFilter(fillLayerId, null);
      }

      if (mapInstance.getLayer(outlineLayerId)) {
        mapInstance.setFilter(outlineLayerId, null);
      }
    }
  }
}

/**
 * Atualiza os filtros de município em todas as camadas do mapa
 * @param {Object} mapInstance - Instância do mapa
 * @param {string} newCdMun - Código do novo município
 */
export function updateMunicipalityFilters(mapInstance, newCdMun) {
  if (!mapInstance) { return; }

  const layersStore = useLayersStore();
  //   const mountLayers = createMountLayers();
  //   const unmountLayers = createUnmountLayers();
  const locationStore = useLocationStore();

  // Atualizar o filtro do out_selected_clickable_fill
  if (mapInstance.getLayer('out_selected_clickable_fill-layer')) {
    mapInstance.setFilter('out_selected_clickable_fill-layer', ['!=', 'cd_mun', newCdMun]);
  }

  // Obter camadas ativas do store
  const activeLayers = layersStore.getActiveLayers;

  // Percorrer cada camada ativa
  activeLayers.forEach(layer => {
    // Se a camada for 'parks', aplicar filtro de município se estiver na escala intraurbana
    if (layer.id === 'parks') {
      updateParksLayerFilter(mapInstance, newCdMun, locationStore.scale);
    } else {
      // Verificar se a camada existe no mapa
      if (mapInstance.getLayer(layer.id)) {
        // Verificar se existe uma configuração correspondente em LAYER_CONFIGS
        const layerConfig = Object.values(LAYER_CONFIGS).find(config => config.id === layer.id);

        // Se encontrou uma configuração correspondente, aplicar o filtro
        if (layerConfig) {
          console.log(`[MunicipalityFilter] Aplicando filtro para camada: ${layer.id}`);
          mapInstance.setFilter(layer.id, ['==', 'cd_mun', newCdMun]);

          // Aplicar filtro nas subcamadas também (fill e outline)
          const fillLayerId = `${layer.id}_fill`;
          const outlineLayerId = `${layer.id}_outline`;

          if (mapInstance.getLayer(fillLayerId)) {
            mapInstance.setFilter(fillLayerId, ['==', 'cd_mun', newCdMun]);
          }

          if (mapInstance.getLayer(outlineLayerId)) {
            mapInstance.setFilter(outlineLayerId, ['==', 'cd_mun', newCdMun]);
          }
        }
      }
    }
  });

  // Atualizar o filtro do highlight_selected
  if (mapInstance.getLayer('highlight_selected-layer')) {
    mapInstance.setFilter('highlight_selected-layer', ['==', 'cd_mun', newCdMun]);
  }
}

/**
 * Atualiza a localização do mapa para o novo município
 * @param {Object} locationStore - Store de localização
 * @param {Object} map - Instância do mapa
 * @param {string} newCdMun - Código do novo município
 */
export async function updateMapLocation(locationStore, map, newCdMun) {
  try {
    console.log('[MunicipalityFilter] Atualizando localização do mapa para município:', newCdMun);

    // Buscar coordenadas do novo município
    const coords = await locationStore.fetchCoordinatesByCode(newCdMun);

    if (coords?.lat && coords?.lng) {
      // Atualizar localização no store
      await locationStore.setLocation({
        lng: coords.lng,
        lat: coords.lat
      });

      // Mover o mapa para a nova localização
      map.jumpTo({
        center: [coords.lng, coords.lat],
        zoom: 14, // Zoom padrão para escala intraurbana
        essential: true
      });

      console.log('[MunicipalityFilter] Mapa movido para:', coords);
    } else {
      console.warn('[MunicipalityFilter] Não foi possível obter coordenadas para o município:', newCdMun);
    }
  } catch (error) {
    console.error('[MunicipalityFilter] Erro ao atualizar localização do mapa:', error);
  }
}
