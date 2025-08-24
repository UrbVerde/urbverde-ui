import { getLayerConfig } from '@/constants/layers.js';
import { useLayersStore } from '@/stores/layersStore';
import { useLocationStore } from '@/stores/locationStore';

/**
 * Função de conveniência para criar uma instância do UnmountLayers
 * @returns {UnmountLayers} Instância do UnmountLayers
 */
export function createUnmountLayers() {
  console.log('[UnmountLayers] === INÍCIO createUnmountLayers ===');
  const layersStore = useLayersStore();
  const locationStore = useLocationStore();

  console.log('[UnmountLayers] Stores obtidos:', { layersStore, locationStore });
  console.log('[UnmountLayers] === FIM createUnmountLayers ===');

  return new UnmountLayers(layersStore, locationStore);
}

/**
 * Classe para controlar a remoção de layers no mapa
 */
export class UnmountLayers {
  constructor(layersStore, locationStore) {
    console.log('[UnmountLayers] === INÍCIO CONSTRUTOR ===');
    console.log('[UnmountLayers] Parâmetros:', { layersStore, locationStore });

    this.layersStore = layersStore;
    this.locationStore = locationStore;

    console.log('[UnmountLayers] === FIM CONSTRUTOR ===');
  }

  /**
   * Remove uma camada do mapa (física)
   * @param {string} layerId - ID da camada a ser removida
   * @returns {boolean} - true se a camada foi removida com sucesso
   */
  removeLayerFromMap(layerId) {
    console.log('[UnmountLayers] === INÍCIO removeLayerFromMap ===');
    console.log('[UnmountLayers] LayerId:', layerId);

    const layerExists = this.layersStore.mapRef.getLayer(layerId);
    console.log('[UnmountLayers] Camada existe no mapa:', !!layerExists);

    if (layerExists) {
      console.log('[UnmountLayers] Removendo camada do mapa...');
      this.layersStore.mapRef.removeLayer(layerId);
      console.log(`[UnmountLayers] Removed main layer from map: ${layerId}`);
      console.log('[UnmountLayers] === FIM removeLayerFromMap (SUCESSO) ===');

      return true;
    }

    console.log(`[UnmountLayers] Layer ${layerId} not found in map`);
    console.log('[UnmountLayers] === FIM removeLayerFromMap (NÃO ENCONTRADA) ===');

    return false;
  }

  /**
   * Remove uma camada do store (estado)
   * @param {string} layerId - ID da camada a ser removida
   * @returns {boolean} - true se a camada foi removida com sucesso
   */
  removeLayerFromStore(layerId) {
    console.log('[UnmountLayers] === INÍCIO removeLayerFromStore ===');
    console.log('[UnmountLayers] LayerId:', layerId);

    const result = this.layersStore.removeLayer(layerId);
    console.log('[UnmountLayers] Resultado da remoção do store:', result);
    console.log('[UnmountLayers] === FIM removeLayerFromStore ===');

    return result;
  }

  /**
   * Remove subcamadas do mapa (física)
   * @param {string} layerId - ID da camada principal
   * @returns {boolean} - true se as subcamadas foram removidas com sucesso
   */
  removeSubLayersFromMap(layerId) {
    console.log('[UnmountLayers] === INÍCIO removeSubLayersFromMap ===');
    console.log('[UnmountLayers] LayerId:', layerId);

    const layer = this.layersStore.getLayer(layerId);
    console.log('[UnmountLayers] Camada encontrada:', !!layer);

    if (!layer || !layer.subLayers || layer.subLayers.length === 0) {
      console.log(`[UnmountLayers] No sublayers found for layer: ${layerId}`);
      console.log('[UnmountLayers] === FIM removeSubLayersFromMap (SEM SUBCAMADAS) ===');

      return true;
    }

    console.log(`[UnmountLayers] Removing ${layer.subLayers.length} sublayers for layer ${layerId}`);
    console.log('[UnmountLayers] Subcamadas:', layer.subLayers.map(s => s.id));

    // Remove eventos de hover usando o HoverManager
    if (this.layersStore.hoverManager) {
      console.log('[UnmountLayers] Removendo eventos de hover...');
      this.layersStore.hoverManager.removeSubLayerHoverEvents(layerId);
    } else {
      console.log('[UnmountLayers] HoverManager não disponível');
    }

    layer.subLayers.forEach(subLayer => {
      console.log('[UnmountLayers] Verificando subcamada:', subLayer.id);
      const subLayerExists = this.layersStore.mapRef.getLayer(subLayer.id);
      console.log('[UnmountLayers] Subcamada existe no mapa:', !!subLayerExists);

      if (subLayerExists) {
        console.log('[UnmountLayers] Removendo subcamada do mapa:', subLayer.id);
        this.layersStore.mapRef.removeLayer(subLayer.id);
        console.log(`[UnmountLayers] Removed sublayer from map: ${subLayer.id}`);
      }
    });

    console.log('[UnmountLayers] === FIM removeSubLayersFromMap (SUCESSO) ===');

    return true;
  }

  /**
   * Remove subcamadas do store (estado)
   * @param {string} layerId - ID da camada principal
   * @returns {boolean} - true se as subcamadas foram removidas com sucesso
   */
  removeSubLayersFromStore(layerId) {
    console.log('[UnmountLayers] === INÍCIO removeSubLayersFromStore ===');
    console.log('[UnmountLayers] LayerId:', layerId);

    const layer = this.layersStore.getLayer(layerId);
    if (!layer) {
      console.warn(`[UnmountLayers] Layer ${layerId} not found in activeLayers`);
      console.log('[UnmountLayers] === FIM removeSubLayersFromStore (ERRO) ===');

      return false;
    }

    console.log('[UnmountLayers] Camada encontrada:', layer);
    console.log('[UnmountLayers] Subcamadas atuais:', layer.subLayers);

    if (layer.subLayers && layer.subLayers.length > 0) {
      console.log('[UnmountLayers] Removendo subcamadas do store...');
      layer.subLayers = [];
      console.log(`[UnmountLayers] Removed sublayers from store for layer: ${layerId}`);
    } else {
      console.log('[UnmountLayers] Nenhuma subcamada para remover');
    }

    console.log('[UnmountLayers] === FIM removeSubLayersFromStore (SUCESSO) ===');

    return true;
  }

  /**
   * Remove a fonte do mapa se não estiver sendo usada por outras camadas
   * @param {string} layerId - ID da camada (que também é o ID da fonte)
   * @returns {boolean} - true se a fonte foi removida ou não precisava ser removida
   */
  removeSourceIfUnused(layerId) {
    console.log('[UnmountLayers] === INÍCIO removeSourceIfUnused ===');
    console.log('[UnmountLayers] LayerId:', layerId);

    const sourceId = layerId;
    console.log('[UnmountLayers] SourceId:', sourceId);

    const otherLayersUsingSource = this.isSourceUsedByOtherLayers(sourceId, layerId);
    console.log('[UnmountLayers] Outras camadas usando a fonte:', otherLayersUsingSource);

    const sourceExists = this.layersStore.mapRef.getSource(sourceId);
    console.log('[UnmountLayers] Fonte existe no mapa:', !!sourceExists);

    if (!otherLayersUsingSource && sourceExists) {
      try {
        console.log('[UnmountLayers] Removendo fonte do mapa...');
        this.layersStore.mapRef.removeSource(sourceId);
        console.log(`[UnmountLayers] Removed source: ${sourceId}`);
        console.log('[UnmountLayers] === FIM removeSourceIfUnused (REMOVIDA) ===');

        return true;
      } catch (error) {
        console.warn(`[UnmountLayers] Error removing source ${sourceId}:`, error);
        console.log('[UnmountLayers] === FIM removeSourceIfUnused (ERRO) ===');

        return false;
      }
    } else if (otherLayersUsingSource) {
      console.log(`[UnmountLayers] Source ${sourceId} not removed - still in use by other layers`);
      console.log('[UnmountLayers] === FIM removeSourceIfUnused (EM USO) ===');

      return true;
    } else {
      console.log(`[UnmountLayers] Source ${sourceId} not found in map`);
      console.log('[UnmountLayers] === FIM removeSourceIfUnused (NÃO ENCONTRADA) ===');

      return true;
    }
  }

  /**
   * Verifica se uma source está sendo usada por outras camadas
   * @param {string} sourceId - ID da source a ser verificada
   * @param {string} excludeLayerId - ID da camada a ser excluída da verificação
   * @returns {boolean} - true se a source está sendo usada por outras camadas
   */
  isSourceUsedByOtherLayers(sourceId, excludeLayerId) {
    console.log('[UnmountLayers] === INÍCIO isSourceUsedByOtherLayers ===');
    console.log('[UnmountLayers] Parâmetros:', { sourceId, excludeLayerId });

    const thisConf = getLayerConfig(excludeLayerId, this.layersStore.currentYear, this.layersStore.currentScale);
    console.log('[UnmountLayers] Configuração da camada atual:', thisConf);

    if (!thisConf?.sourceLayer) {
      console.log('[UnmountLayers] Sem sourceLayer na configuração');
      console.log('[UnmountLayers] === FIM isSourceUsedByOtherLayers (SEM SOURCE) ===');

      return false;
    }

    const otherLayers = this.layersStore.activeLayers.filter(l => l.id !== excludeLayerId);
    console.log('[UnmountLayers] Outras camadas ativas:', otherLayers.map(l => l.id));

    const result = otherLayers.some(l => {
      const conf = getLayerConfig(l.id, this.layersStore.currentYear, this.layersStore.currentScale);
      const usesSameSource = conf?.sourceLayer === thisConf.sourceLayer;
      console.log('[UnmountLayers] Verificando camada:', l.id, 'usa mesma fonte:', usesSameSource);

      return usesSameSource;
    });

    console.log('[UnmountLayers] Resultado final:', result);
    console.log('[UnmountLayers] === FIM isSourceUsedByOtherLayers ===');

    return result;
  }

  /**
   * Facade que remove completamente uma camada e suas subcamadas
   * @param {string} layerId - ID da camada a ser removida
   * @returns {boolean} - true se a camada foi removida com sucesso
   */
  unmountLayer(layerId) {
    console.log('[UnmountLayers] === INÍCIO unmountLayer ===');
    console.log('[UnmountLayers] LayerId:', layerId);
    console.log('[UnmountLayers] Estado inicial - camadas ativas:', this.layersStore.activeLayers.map(l => l.id));

    // Verificação de pré-condição: mapRef deve estar disponível
    if (!this.layersStore.mapRef) {
      console.warn('[UnmountLayers] Map reference not available');
      console.log('[UnmountLayers] === FIM unmountLayer (ERRO) ===');

      return false;
    }

    // Verifica se a camada existe antes de tentar removê-la
    const layer = this.layersStore.getLayer(layerId);
    if (!layer) {
      console.warn(`[UnmountLayers] Layer ${layerId} not found in active layers`);
      console.log('[UnmountLayers] === FIM unmountLayer (NÃO ENCONTRADA) ===');

      return false;
    }

    console.log('[UnmountLayers] Camada encontrada:', layer);

    // 1. Remove as subcamadas primeiro (se existirem)
    console.log('[UnmountLayers] Passo 1: Removendo subcamadas...');
    this.removeSubLayersFromMap(layerId);
    this.removeSubLayersFromStore(layerId);

    // 2. Remove a camada principal
    console.log('[UnmountLayers] Passo 2: Removendo camada principal...');
    this.removeLayerFromMap(layerId);

    // 3. Remove a camada do estado
    console.log('[UnmountLayers] Passo 3: Removendo camada do estado...');
    this.removeLayerFromStore(layerId);

    // 4. Verifica se a fonte pode ser removida
    console.log('[UnmountLayers] Passo 4: Verificando remoção da fonte...');
    this.removeSourceIfUnused(layerId);

    // 5. Log das camadas restantes
    console.log('[UnmountLayers] Estado final - camadas ativas:', this.layersStore.activeLayers.map(l => l.id));
    console.log(`[UnmountLayers] Successfully unmounted layer ${layerId} with all sublayers`);
    console.log('[UnmountLayers] === FIM unmountLayer (SUCESSO) ===');

    return true;
  }
}
