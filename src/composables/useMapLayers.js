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

      // Buscar o ID correto da camada no arquivo de configuração
      const layerConfig = LAYER_CONFIGS[layerId_config];
      console.log('Configuração encontrada:', layerConfig);

      if (!layerConfig) {
        console.error(`Configuração não encontrada para a camada: ${layerId_config}`);

        return false;
      }

      // Obter o ID real da camada
      const layerId = layerConfig.id;
      console.log('ID real da camada:', layerId);

      if (!layerId) {
        console.error(`ID não encontrado na configuração da camada: ${layerId_config}`);

        return false;
      }

      // Inicializar o LayerOrderManager se ainda não existir
      if (!layerOrderManager.value) {
        console.log('Inicializando LayerOrderManager');
        initializeLayerOrderManager();
      }

      // Validar se a camada pode ser adicionada
      if (!layerOrderManager.value.validateLayer(layerId)) {
        console.error('Camada não validada pelo LayerOrderManager');

        return false;
      }

      // Registrar a camada como ativa
      activeLayers.value.add(layerId);
      layerConfigs.value.set(layerId, layerConfig);
      console.log('Camada registrada como ativa');

      // Configurar a camada usando o LayerOrderManager
      console.log('Chamando setupDynamicLayers com:', layerId_config);
      const success = await setupDynamicLayers(
        map.value,
        layerId_config
      );
      console.log('Resultado do setupDynamicLayers:', success);

      if (success) {
        // Adicionar ao grupo correto e atualizar ordem
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

      // Remover camadas relacionadas
      const layerIds = [layerId];
      if (config.type === 'vector') {
        layerIds.push(`${layerId}-outline`);
      }

      layerIds.forEach(id => {
        if (map.value.getLayer(id)) {
          map.value.removeLayer(id);
        }
      });

      // Remover source
      if (map.value.getSource(config.source.id)) {
        map.value.removeSource(config.source.id);
      }

      // Limpar estado
      activeLayers.value.delete(layerId);
      layerConfigs.value.delete(layerId);

      // Remover do grupo e reordenar
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
