import { setupLayerPopup, removePopupHandlers, setupRasterPopupHandlers, removeRasterPopupHandlers } from '@/utils/popupHandlers';

/**
 * Funções para gerenciar as interações do mapa
 */

/**
 * Configura as interações para layers raster
 * @param {Object} map - Instância do mapa
 * @param {Object} config - Configuração da layer
 * @param {Function} fetchRasterValue - Função para buscar valor raster
 */
export function setupRasterInteractions(map, config, fetchRasterValue) {
  const handlers = setupRasterPopupHandlers(map, config, fetchRasterValue);
  map._rasterPopupHandlers = handlers;
}

/**
 * Remove as interações raster
 * @param {Object} map - Instância do mapa
 */
export function removeRasterInteractions(map) {
  if (!map) { return; }
  if (map._rasterPopupHandlers) {
    removeRasterPopupHandlers(map, map._rasterPopupHandlers);
    map._rasterPopupHandlers = null;
  }
}

/**
 * Configura as interações para layers vetoriais
 * @param {Object} map - Instância do mapa
 * @param {Object} config - Configuração da layer
 */
export function setupVectorInteractions(map, config) {
  if (!map) { return; }
  const handlers = setupLayerPopup(map, config);
  map._popupHandlers = handlers;
}

/**
 * Remove as interações vetoriais
 * @param {Object} map - Instância do mapa
 */
export function removeVectorInteractions(map) {
  if (!map) { return; }
  if (map._popupHandlers) {
    removePopupHandlers(map, map._popupHandlers);
    map._popupHandlers = null;
  }
}

/**
 * Configura as interações para setores
 * @param {Object} map - Instância do mapa
 * @param {Object} hoveredSetorId - ID do setor em hover
 */
export function setupSetoresInteractions(map, hoveredSetorId) {
  map.on('mousemove', 'setores-layer', (e) => {
    if (e.features.length > 0) {
      if (hoveredSetorId) {
        map.setFeatureState(
          { source: 'setores-source', id: hoveredSetorId, sourceLayer: 'public.geom_setores' },
          { hover: false }
        );
      }
      hoveredSetorId = e.features[0].id;
      map.setFeatureState(
        { source: 'setores-source', id: hoveredSetorId, sourceLayer: 'public.geom_setores' },
        { hover: true }
      );
    }
  });

  map.on('mouseleave', 'setores-layer', () => {
    if (hoveredSetorId) {
      map.setFeatureState(
        { source: 'setores-source', id: hoveredSetorId, sourceLayer: 'public.geom_setores' },
        { hover: false }
      );
      hoveredSetorId = null;
    }
  });
}
