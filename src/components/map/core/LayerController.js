import { getLayerConfig } from '@/utils/dynamicLayersOrder';

/**
 * Atualiza a camada principal atual usando métodos encapsulados do layersStore
 * @param {Object} layersStore - Instância do layersStore
 * @param {string} newMainLayer - A nova camada principal
 * @param {boolean} isAlreadyActive - Se a nova camada já está ativa
 */
export function updateCurrentMainLayer(layersStore, newMainLayer, isAlreadyActive) {
  const currentMainIndex = layersStore.activeLayers.findIndex(layer => layer.currentMain);

  if (isAlreadyActive) {
    // Se a camada já está ativa, troca com a camada que tem currentMain
    const newLayerIndex = layersStore.activeLayers.findIndex(layer => layer.id === newMainLayer);

    if (currentMainIndex !== -1 && newLayerIndex !== -1) {
      // Troca as posições usando método encapsulado
      layersStore.swapLayerPositions(currentMainIndex, newLayerIndex);

      // Atualiza as flags currentMain usando métodos encapsulados
      const currentMainLayer = layersStore.activeLayers[currentMainIndex];
      const newLayer = layersStore.activeLayers[newLayerIndex];

      layersStore.setLayerAsMain(currentMainLayer.id, false);
      layersStore.setLayerAsMain(newLayer.id, true);
    }
  } else {
    // Se a camada não está ativa, insere na posição do currentMain
    const newLayerConfig = getLayerConfig(newMainLayer);
    const newLayer = {
      id: newMainLayer,
      currentMain: true,
      source: newLayerConfig?.source
    };

    // Substitui a camada usando método encapsulado
    if (currentMainIndex !== -1) {
      layersStore.replaceLayerAt(currentMainIndex, newLayer);
    }
  }

  console.log('[LayerController] Updated current main layer:', layersStore.activeLayers);
}
