import { watch } from 'vue';
import { useLayersStore } from '@/stores/layersStore';
import { updateCurrentMainLayer } from '@/components/map/core/LayerController.js';

/**
 * Configura o watcher para monitorar mudanças na activeMainLayer
 * @param {Object} locationStore - Instância do locationStore
 */
export function setupMapWatcher(locationStore) {
  console.log('[MapWatcher] === INÍCIO setupMapWatcher ===');
  console.log('[MapWatcher] locationStore recebido:', locationStore);

  const layersStore = useLayersStore();
  console.log('[MapWatcher] layersStore obtido:', layersStore);
  console.log('[MapWatcher] Estado inicial - activeMainLayer:', locationStore.activeMainLayer);
  console.log('[MapWatcher] Estado inicial - lastMainLayer:', locationStore.lastMainLayer);
  console.log('[MapWatcher] Estado inicial - camadas ativas:', layersStore.activeLayers.map(l => ({ id: l.id, currentMain: l.currentMain })));

  // Watcher para monitorar mudanças entre lastMainLayer e activeMainLayer
  watch(() => locationStore.activeMainLayer, async(newLayer, oldLayer) => {
    console.log('[MapWatcher] === WATCHER TRIGGERED ===');
    console.log('[MapWatcher] newLayer:', newLayer);
    console.log('[MapWatcher] oldLayer:', oldLayer);
    console.log('[MapWatcher] lastMainLayer atual:', locationStore.lastMainLayer);
    console.log('[MapWatcher] Comparação newLayer !== oldLayer:', newLayer !== oldLayer);

    if (newLayer !== oldLayer) {
      console.log('[MapWatcher] Mudança detectada! Processando...');

      if (locationStore.lastMainLayer === null) {
        console.log('[MapWatcher] === CASO 1: Primeira mudança de camada ===');
        console.log('[MapWatcher] lastMainLayer é null, definindo como:', newLayer);
        locationStore.lastMainLayer = newLayer;
        console.log('[MapWatcher] lastMainLayer atualizado para:', locationStore.lastMainLayer);

        // // Caso 1: Primeira mudança de camada
        //  locationStore.lastMainLayer = newLayer;

        // // Usar MountLayers ao invés de setDefaultLayers
        // const mountLayers = createMountLayers();

        // // Montar camada parks primeiro
        // const parksSuccess = mountLayers.mountLayer('parks');
        // if (parksSuccess) {
        //   console.log('[MapWatcher] Camada parks montada com sucesso via MountLayers');
        // } else {
        //   console.error('[MapWatcher] Falha ao montar camada parks via MountLayers');
        // }

        // // Montar camada principal
        // const mainLayerSuccess = mountLayers.mountLayer(newLayer);
        // if (mainLayerSuccess) {
        //   console.log('[MapWatcher] Camada principal montada com sucesso via MountLayers:', newLayer);
        // } else {
        //   console.error('[MapWatcher] Falha ao montar camada principal via MountLayers:', newLayer);
        // }
      } else {
        console.log('[MapWatcher] === CASO 2: Mudança subsequente ===');
        console.log('[MapWatcher] Verificando se a nova camada já está ativa...');

        const activeLayers = layersStore.getActiveLayers;
        console.log('[MapWatcher] Camadas ativas atuais:', activeLayers.map(l => ({ id: l.id, currentMain: l.currentMain })));

        const isAlreadyActive = activeLayers.some(layer => layer.id === newLayer);
        console.log('[MapWatcher] isAlreadyActive:', isAlreadyActive);
        console.log('[MapWatcher] Chamando updateCurrentMainLayer...');

        await updateCurrentMainLayer(layersStore, newLayer, isAlreadyActive, oldLayer);

        console.log('[MapWatcher] updateCurrentMainLayer concluído');
        console.log('[MapWatcher] Atualizando lastMainLayer de', locationStore.lastMainLayer, 'para', newLayer);
        locationStore.lastMainLayer = newLayer;
        console.log('[MapWatcher] lastMainLayer atualizado para:', locationStore.lastMainLayer);
      }
      console.log('[MapWatcher] MainLayer mudou de', oldLayer, 'para', newLayer);
      console.log('[MapWatcher] Estado final - camadas ativas:', layersStore.activeLayers.map(l => ({ id: l.id, currentMain: l.currentMain })));
    } else {
      console.log('[MapWatcher] Nenhuma mudança detectada (newLayer === oldLayer)');
    }
    console.log('[MapWatcher] === FIM WATCHER ===');
  }, { immediate: false });

  console.log('[MapWatcher] Watcher configurado com sucesso');
  console.log('[MapWatcher] === FIM setupMapWatcher ===');
}
