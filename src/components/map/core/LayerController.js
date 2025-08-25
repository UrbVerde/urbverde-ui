// import { getLayerConfig } from '@/utils/dynamicLayersOrder';
import { createMountLayers } from '@/components/map/layers/MountLayers';
import { createUnmountLayers } from '@/components/map/layers/UnmountLayers';
import { reorderLayer } from '@/components/map/layers/ReorderLayers';

/**
 * Atualiza a camada principal atual usando métodos encapsulados do layersStore
 * @param {Object} layersStore - Instância do layersStore
 * @param {string} newMainLayer - A nova camada principal
 * @param {boolean} isAlreadyActive - Se a nova camada já está ativa
 * @param {string} [oldLayer] - A camada anterior (opcional)
 */
export async function updateCurrentMainLayer(layersStore, newMainLayer, isAlreadyActive, oldLayer) {
  console.log('[LayerController] Iniciando updateCurrentMainLayer');
  console.log('[LayerController] Parâmetros:', { newMainLayer, isAlreadyActive, oldLayer });
  console.log('[LayerController] Camadas ativas antes:', layersStore.activeLayers);

  const currentMainIndex = layersStore.activeLayers.findIndex(layer => layer.currentMain);
  console.log('[LayerController] Índice da camada principal atual:', currentMainIndex);

  if (isAlreadyActive) {
    console.log('[LayerController] Camada já está ativa - executando troca de posições');
    // Se a camada já está ativa, troca com a camada que tem currentMain
    const newLayerIndex = layersStore.activeLayers.findIndex(layer => layer.id === newMainLayer);
    console.log('[LayerController] Índice da nova camada:', newLayerIndex);

    console.log('[LayerController] Executando reordenação otimizada');
    console.log('[LayerController] Parâmetros:', { newMainLayer, currentMainIndex, newLayerIndex });

    // Move a nova camada para a posição da camada principal atual
    const result = reorderLayer(layersStore.activeLayers, newMainLayer, currentMainIndex, layersStore.mapRef);

    // Atualiza o store com o novo array
    layersStore.activeLayers = result.activeLayers;

    // Define a nova camada como principal
    layersStore.setLayerAsMain(newMainLayer, true);

    console.log('[LayerController] Reordenação concluída:', result.mapSuccess);
    console.log('[LayerController] Camadas após reordenação:', layersStore.activeLayers.map(l => ({ id: l.id, currentMain: l.currentMain })));

    // if (currentMainIndex !== -1 && newLayerIndex !== -1) {
    //   console.log('[LayerController] Executando swapLayerPositions');
    //   // Troca as posições usando método encapsulado
    //   layersStore.swapLayerPositions(currentMainIndex, newLayerIndex);

    //   // Atualiza as flags currentMain usando métodos encapsulados
    //   const currentMainLayer = layersStore.activeLayers[currentMainIndex];
    //   const newLayer = layersStore.activeLayers[newLayerIndex];
    //   console.log('[LayerController] Camadas após swap:', { currentMainLayer: currentMainLayer?.id, newLayer: newLayer?.id });

    //   console.log('[LayerController] Definindo camadas como main');
    //   layersStore.setLayerAsMain(currentMainLayer.id, false);
    //   layersStore.setLayerAsMain(newLayer.id, true);
    // } else {
    //   console.warn('[LayerController] Índices inválidos para troca:', { currentMainIndex, newLayerIndex });
    // }
  } else {
    console.log('[LayerController] Camada não está ativa - executando mountLayer');
    console.log('[LayerController] Chamando mountLayer com:', { newMainLayer, oldLayer });
    console.log('[LayerController] MapRef disponível:', !!layersStore.mapRef);

    // Verifica se o mapRef está disponível antes de montar a camada
    if (!layersStore.mapRef) {
      console.warn('[LayerController] MapRef não disponível, não é possível montar a camada');

      return;
    }

    // Se a camada não está ativa, monta a nova camada antes da oldLayer
    const mountLayers = createMountLayers();
    mountLayers.mountLayer(newMainLayer, oldLayer);

    // Remove a oldLayer se ela existir
    if (oldLayer) {
      console.log('[LayerController] Removendo oldLayer:', oldLayer);
      const unmountLayers = createUnmountLayers();
      unmountLayers.unmountLayer(oldLayer);
    }

    console.log('[LayerController] Chamando setLayerAsMain para nova camada');
    // Atualiza a nova camada como principal no store
    layersStore.setLayerAsMain(newMainLayer, true);
  }

  console.log('[LayerController] Camadas ativas após atualização:', layersStore.activeLayers);
  console.log('[LayerController] Camada principal final:', layersStore.activeLayers.find(layer => layer.currentMain)?.id);
}
