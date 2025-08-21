/**
 * ReorderLayers.js
 * Componente responsável por gerenciar a reordenação de camadas no store e no mapa
 */

/**
 * Reordena as camadas ativas no store
 * @param {Array} activeLayers - Array de camadas ativas
 * @param {string} layerId - ID da camada a ser movida
 * @param {number} newIndex - Nova posição da camada
 * @returns {Array} Novo array de camadas reordenadas
 */
export function reorderLayerInStore(activeLayers, layerId, newIndex) {
  const currentIndex = activeLayers.findIndex(layer => layer.id === layerId);
  if (currentIndex === -1) {
    console.warn(`[ReorderLayers] Camada ${layerId} não encontrada no array de camadas ativas`);

    return activeLayers;
  }

  const layer = activeLayers[currentIndex];
  const newLayers = [...activeLayers];
  newLayers.splice(currentIndex, 1);
  newLayers.splice(newIndex, 0, layer);

  console.log(`[ReorderLayers] Camada ${layerId} reordenada de ${currentIndex} para ${newIndex}`);

  return newLayers;
}

/**
 * Reordena todas as camadas ativas no mapa
 * @param {Object} map - Instância do mapa
 * @param {Array} activeLayers - Array de camadas ativas (em ordem do topo para o fundo)
 * @returns {boolean} Sucesso da operação
 */
export function reorderLayerSetup(map, activeLayers) {
  console.log('\n[ReorderLayers] ===== INÍCIO DA REORDENAÇÃO GERAL =====');
  console.log('[ReorderLayers] Camadas ativas:', activeLayers.map(l => l.id));

  if (!map || !activeLayers || !Array.isArray(activeLayers)) {
    console.error('[ReorderLayers] Parâmetros inválidos para reorderLayerSetup');

    return false;
  }

  try {
    // Verificar se a camada highlight_selected-layer existe
    if (!map.getLayer('highlight_selected-layer')) {
      console.error('[ReorderLayers] Camada highlight_selected-layer não encontrada');

      return false;
    }

    // Reordenar cada camada ativa
    activeLayers.forEach((layer, index) => {
      const layerId = layer.id;

      // Verificar se a camada existe no mapa
      if (!map.getLayer(layerId)) {
        console.warn(`[ReorderLayers] Camada ${layerId} não encontrada no mapa`);

        return;
      }

      // Determinar o beforeId
      const beforeId = index === 0
        ? 'highlight_selected-layer'
        : activeLayers[index - 1].id;

      console.log(`[ReorderLayers] Movendo camada ${layerId} para antes de ${beforeId}`);

      // Mover a camada
      map.moveLayer(layerId, beforeId);

      // Se a camada tem subcamadas, reordená-las também
      if (layer.subLayers && layer.subLayers.length > 0) {
        // console.log(`[ReorderLayers] Reordenando subcamadas para ${layerId}`);

        // Reordenar as subcamadas na ordem correta: outline -> fill
        const outlineSubLayer = layer.subLayers[1]; // outline
        const fillSubLayer = layer.subLayers[0];    // fill

        if (outlineSubLayer && map.getLayer(outlineSubLayer.id)) {
          map.moveLayer(outlineSubLayer.id, beforeId);
          // console.log(`[ReorderLayers] Moved outline sublayer ${outlineSubLayer.id} with beforeId: ${beforeId}`);
        }

        if (fillSubLayer && map.getLayer(fillSubLayer.id)) {
          map.moveLayer(fillSubLayer.id, outlineSubLayer.id);
          // console.log(`[ReorderLayers] Moved fill sublayer ${fillSubLayer.id} with beforeId: ${outlineSubLayer.id}`);
        }
      }
    });

    console.log('[ReorderLayers] ===== FIM DA REORDENAÇÃO GERAL =====\n');

    const allLayers2 = map.getStyle().layers.map((l, i) => `${i}: ${l.id}`);
    console.log(`[MapLibre] Ordem completa das camadas após movimentação:\n${allLayers2.join('\n')}`);

    return true;
  } catch (error) {
    console.error('[ReorderLayers] Erro ao reordenar camadas:', error);

    return false;
  }
}

/**
 * Função completa que combina reordenação no store e no mapa
 * @param {Array} activeLayers - Array de camadas ativas
 * @param {string} layerId - ID da camada a ser movida
 * @param {number} newIndex - Nova posição da camada
 * @param {Object} mapRef - Referência do mapa
 * @returns {Object} Resultado com o novo array de camadas e status da operação
 */
export function reorderLayer(activeLayers, layerId, newIndex, mapRef) {
  // Reordena no store
  const newActiveLayers = reorderLayerInStore(activeLayers, layerId, newIndex);

  // Reordena no mapa se a referência estiver disponível
  let mapSuccess = true;
  if (mapRef) {
    // Primeiro, move a camada principal para a nova posição
    if (mapRef.getLayer(layerId)) {
      mapRef.moveLayer(layerId);
    }

    // Depois reordena todas as camadas
    mapSuccess = reorderLayerSetup(mapRef, newActiveLayers);
  }

  return {
    activeLayers: newActiveLayers,
    mapSuccess
  };
}
