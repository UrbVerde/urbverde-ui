import { ref } from 'vue';
// import { useLocationStore } from '@/stores/locationStore';
import {
  setupDynamicLayers,
} from '@/components/map/layers/MapLayerController';
import { LayerOrderManager } from '@/components/map/layers/layerOrderManager';
import { LAYER_CONFIGS } from '@/constants/layers';

export function useMapLayers(map) {
//   const locationStore = useLocationStore();
  const activeLayers = ref(new Set());
  const layerConfigs = ref(new Map());
  const layerOrderManager = ref(null);

  const initializeLayerOrderManager = () => {
    if (map.value) {
      layerOrderManager.value = new LayerOrderManager(map.value);
    }
  };

  const addLayer = async(layerId_config) => {
    if (!map.value || !layerId_config) {
      console.error('Mapa ou layerId_config não definidos');

      return false;
    }

    try {
      console.log('Iniciando addLayer com:', layerId_config);

      const layerConfig = LAYER_CONFIGS[layerId_config];
      console.log('Configuração encontrada:', layerConfig);

      if (!layerConfig) {
        console.error(`Configuração não encontrada para a camada: ${layerId_config}`);

        return false;
      }

      const layerId = layerConfig.id;
      console.log('ID real da camada:', layerId);

      if (!layerId) {
        console.error(`ID não encontrado na configuração da camada: ${layerId_config}`);

        return false;
      }

      if (!layerOrderManager.value) {
        console.log('Inicializando LayerOrderManager');
        initializeLayerOrderManager();
      }

      if (!layerOrderManager.value.validateLayer(layerId)) {
        console.error('Camada não validada pelo LayerOrderManager');

        return false;
      }

      // Registrar a camada como ativa com o novo formato
      activeLayers.value.add({
        id: layerId,
        currentMain: false,
        opacity: layerConfig.defaultOpacity || 0.7
      });

      layerConfigs.value.set(layerId, layerConfig);
      console.log('Camada registrada como ativa');

      const success = await setupDynamicLayers(
        map.value,
        layerId_config
      );
      console.log('Resultado do setupDynamicLayers:', success);

      if (success) {
        layerOrderManager.value.addLayerToGroup(layerId, layerConfig.group || 'dynamic');
        layerOrderManager.value.updateLayerOrder();
        console.log('Camada adicionada ao grupo e ordem atualizada');
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
      const config = layerConfigs.value.get(layerId);
      if (!config) {return;}

      const layerIds = [layerId];
      if (config.type === 'vector') {
        layerIds.push(`${layerId}-outline`);
      }

      layerIds.forEach(id => {
        if (map.value.getLayer(id)) {
          map.value.removeLayer(id);
        }
      });

      if (map.value.getSource(config.source.id)) {
        map.value.removeSource(config.source.id);
      }

      activeLayers.value.delete(layerId);
      layerConfigs.value.delete(layerId);

      if (layerOrderManager.value) {
        layerOrderManager.value.removeLayerFromGroup(layerId, config.group || 'dynamic');
        layerOrderManager.value.updateLayerOrder();
      }
    } catch (error) {
      console.error('Erro ao remover camada:', error);
    }
  };

  const updateLayer = async(layerId, newConfig) => {
    if (!map.value || !layerId) {return false;}

    try {
      removeLayer(layerId);

      return await addLayer(layerId, newConfig);
    } catch (error) {
      console.error('Erro ao atualizar camada:', error);

      return false;
    }
  };

  const getActiveLayers = () => Array.from(activeLayers.value);

  const getLayerConfig = (layerId) => layerConfigs.value.get(layerId);

  const hasLayer = (layerId) => {
    if (!map.value) {return false;}

    return map.value.getLayer(layerId) !== undefined;
  };

  const getLayerOpacity = (layerId) => {
    if (!map.value || !hasLayer(layerId)) {return 0;}
    const layer = map.value.getLayer(layerId);
    const opacityProp = layer.type === 'raster' ? 'raster-opacity' : 'fill-opacity';

    return map.value.getPaintProperty(layerId, opacityProp) || 0;
  };

  const setLayerOpacity = (layerId, opacity) => {
    if (!map.value || !hasLayer(layerId)) {return;}
    const layer = map.value.getLayer(layerId);
    const opacityProp = layer.type === 'raster' ? 'raster-opacity' : 'fill-opacity';
    map.value.setPaintProperty(layerId, opacityProp, opacity);
  };

  return {
    addLayer,
    removeLayer,
    updateLayer,
    getActiveLayers,
    getLayerConfig,
    hasLayer,
    getLayerOpacity,
    setLayerOpacity
  };
}
