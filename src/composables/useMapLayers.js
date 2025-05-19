import { ref } from 'vue';
// import { useLocationStore } from '@/stores/locationStore';
import {
  setupDynamicLayers,
} from '@/components/map/layers/MapLayerController';
import { reorderAllLayers } from '@/components/map/layers/layersOrder';

export function useMapLayers(map) {
//   const locationStore = useLocationStore();
  const activeLayers = ref(new Set());
  const layerConfigs = ref(new Map());

  const addLayer = async(layerId, config) => {
    if (!map.value || !layerId) {return false;}

    try {
      // Registrar a camada
      activeLayers.value.add(layerId);
      layerConfigs.value.set(layerId, config);

      // Configurar a camada
      const success = await setupDynamicLayers(
        map.value,
        layerId
      );

      if (success) {
        reorderAllLayers(map.value);
      }

      return success;
    } catch (error) {
      console.error('Erro ao adicionar camada:', error);

      return false;
    }
  };

  const removeLayer = (layerId) => {
    if (!map.value || !layerId) {return;}

    try {
      // Remover camadas relacionadas
      ['dynamic-layer', 'dynamic-layer-outline'].forEach(id => {
        if (map.value.getLayer(id)) {
          map.value.removeLayer(id);
        }
      });

      // Remover source
      if (map.value.getSource('dynamic-source')) {
        map.value.removeSource('dynamic-source');
      }

      // Limpar estado
      activeLayers.value.delete(layerId);
      layerConfigs.value.delete(layerId);

      // Reordenar camadas restantes
      reorderAllLayers(map.value);
    } catch (error) {
      console.error('Erro ao remover camada:', error);
    }
  };

  const updateLayer = async(layerId, newConfig) => {
    if (!map.value || !layerId) {return false;}

    try {
      // Remover camada existente
      removeLayer(layerId);

      // Adicionar com nova configuração
      return await addLayer(layerId, newConfig);
    } catch (error) {
      console.error('Erro ao atualizar camada:', error);

      return false;
    }
  };

  const getActiveLayers = () => Array.from(activeLayers.value);

  const getLayerConfig = (layerId) => layerConfigs.value.get(layerId);

  return {
    addLayer,
    removeLayer,
    updateLayer,
    getActiveLayers,
    getLayerConfig
  };
}
