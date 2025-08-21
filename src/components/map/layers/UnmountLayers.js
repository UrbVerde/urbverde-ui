import { getLayerConfig } from '@/constants/layers.js';
import { useLayersStore } from '@/stores/layersStore';
import { useLocationStore } from '@/stores/locationStore';

/**
 * Função de conveniência para criar uma instância do UnmountLayers
 * @returns {UnmountLayers} Instância do UnmountLayers
 */
export function createUnmountLayers() {
  const layersStore = useLayersStore();
  const locationStore = useLocationStore();

  return new UnmountLayers(layersStore, locationStore);
}

/**
 * Classe para controlar a remoção de layers no mapa
 */
export class UnmountLayers {
  constructor(layersStore, locationStore) {
    this.layersStore = layersStore;
    this.locationStore = locationStore;
  }

  /**
   * Remove uma camada do mapa (física)
   * @param {string} layerId - ID da camada a ser removida
   * @returns {boolean} - true se a camada foi removida com sucesso
   */
  removeLayerFromMap(layerId) {
    if (this.layersStore.mapRef.getLayer(layerId)) {
      this.layersStore.mapRef.removeLayer(layerId);
      console.log(`[UnmountLayers] Removed main layer from map: ${layerId}`);

      return true;
    }

    console.log(`[UnmountLayers] Layer ${layerId} not found in map`);

    return false;
  }

  /**
   * Remove uma camada do store (estado)
   * @param {string} layerId - ID da camada a ser removida
   * @returns {boolean} - true se a camada foi removida com sucesso
   */
  removeLayerFromStore(layerId) {
    return this.layersStore.removeLayer(layerId);
  }

  /**
   * Remove subcamadas do mapa (física)
   * @param {string} layerId - ID da camada principal
   * @returns {boolean} - true se as subcamadas foram removidas com sucesso
   */
  removeSubLayersFromMap(layerId) {
    const layer = this.layersStore.getLayer(layerId);
    if (!layer || !layer.subLayers || layer.subLayers.length === 0) {
      console.log(`[UnmountLayers] No sublayers found for layer: ${layerId}`);

      return true;
    }

    console.log(`[UnmountLayers] Removing ${layer.subLayers.length} sublayers for layer ${layerId}`);

    // Remove eventos de hover usando o HoverManager
    if (this.layersStore.hoverManager) {
      this.layersStore.hoverManager.removeSubLayerHoverEvents(layerId);
    }

    layer.subLayers.forEach(subLayer => {
      if (this.layersStore.mapRef.getLayer(subLayer.id)) {
        this.layersStore.mapRef.removeLayer(subLayer.id);
        console.log(`[UnmountLayers] Removed sublayer from map: ${subLayer.id}`);
      }
    });

    return true;
  }

  /**
   * Remove subcamadas do store (estado)
   * @param {string} layerId - ID da camada principal
   * @returns {boolean} - true se as subcamadas foram removidas com sucesso
   */
  removeSubLayersFromStore(layerId) {
    const layer = this.layersStore.getLayer(layerId);
    if (!layer) {
      console.warn(`[UnmountLayers] Layer ${layerId} not found in activeLayers`);

      return false;
    }

    if (layer.subLayers && layer.subLayers.length > 0) {
      layer.subLayers = [];
      console.log(`[UnmountLayers] Removed sublayers from store for layer: ${layerId}`);
    }

    return true;
  }

  /**
   * Remove a fonte do mapa se não estiver sendo usada por outras camadas
   * @param {string} layerId - ID da camada (que também é o ID da fonte)
   * @returns {boolean} - true se a fonte foi removida ou não precisava ser removida
   */
  removeSourceIfUnused(layerId) {
    const sourceId = layerId;
    const otherLayersUsingSource = this.isSourceUsedByOtherLayers(sourceId, layerId);

    if (!otherLayersUsingSource && this.layersStore.mapRef.getSource(sourceId)) {
      try {
        this.layersStore.mapRef.removeSource(sourceId);
        console.log(`[UnmountLayers] Removed source: ${sourceId}`);

        return true;
      } catch (error) {
        console.warn(`[UnmountLayers] Error removing source ${sourceId}:`, error);

        return false;
      }
    } else if (otherLayersUsingSource) {
      console.log(`[UnmountLayers] Source ${sourceId} not removed - still in use by other layers`);

      return true;
    } else {
      console.log(`[UnmountLayers] Source ${sourceId} not found in map`);

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
    const thisConf = getLayerConfig(excludeLayerId, this.layersStore.currentYear, this.layersStore.currentScale);
    if (!thisConf?.sourceLayer) {
      return false;
    }

    return this.layersStore.activeLayers
      .filter(l => l.id !== excludeLayerId)
      .some(l => {
        const conf = getLayerConfig(l.id, this.layersStore.currentYear, this.layersStore.currentScale);

        return conf?.sourceLayer === thisConf.sourceLayer;
      });
  }

  /**
   * Facade que remove completamente uma camada e suas subcamadas
   * @param {string} layerId - ID da camada a ser removida
   * @returns {boolean} - true se a camada foi removida com sucesso
   */
  unmountLayer(layerId) {
    console.log(`[UnmountLayers] Unmounting layer: ${layerId}`);

    // Verificação de pré-condição: mapRef deve estar disponível
    if (!this.layersStore.mapRef) {
      console.warn('[UnmountLayers] Map reference not available');

      return false;
    }

    // Verifica se a camada existe antes de tentar removê-la
    const layer = this.layersStore.getLayer(layerId);
    if (!layer) {
      console.warn(`[UnmountLayers] Layer ${layerId} not found in active layers`);

      return false;
    }

    // 1. Remove as subcamadas primeiro (se existirem)
    this.removeSubLayersFromMap(layerId);
    this.removeSubLayersFromStore(layerId);

    // 2. Remove a camada principal
    this.removeLayerFromMap(layerId);

    // 3. Remove a camada do estado
    this.removeLayerFromStore(layerId);

    // 4. Verifica se a fonte pode ser removida
    this.removeSourceIfUnused(layerId);

    // 5. Log das camadas restantes
    console.log('[UnmountLayers] Remaining active layers:', this.layersStore.activeLayers.map(l => l.id));
    console.log(`[UnmountLayers] Successfully unmounted layer ${layerId} with all sublayers`);

    return true;
  }
}
