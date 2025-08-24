import { watch } from 'vue';
import { useLayersStore } from '@/stores/layersStore';
import { updateCurrentMainLayer } from '@/components/map/core/LayerController.js';

/**
 * Configura o watcher para monitorar mudanças na activeMainLayer
 * @param {Object} locationStore - Instância do locationStore
 */
export function setupMapWatcher(locationStore) {
  const layersStore = useLayersStore();

  // Watcher para monitorar mudanças entre lastMainLayer e activeMainLayer
  watch(() => locationStore.activeMainLayer, (newLayer, oldLayer) => {
    if (newLayer !== oldLayer) {
      if (locationStore.lastMainLayer === null) {
        // // Caso 1: Primeira mudança de camada
        // locationStore.lastMainLayer = newLayer;

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
        // Caso 2: Mudança subsequente
        const isAlreadyActive = layersStore.getActiveLayers.some(layer => layer.id === newLayer);
        updateCurrentMainLayer(layersStore, newLayer, isAlreadyActive);
        locationStore.lastMainLayer = oldLayer;
      }
      console.log('MapWatcher: MainLayer mudou de', oldLayer, 'para', newLayer);
    }
  });
}
