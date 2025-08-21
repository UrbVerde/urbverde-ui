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
   * Remove uma camada da lista de camadas ativas
   * @param {string} layerId - ID da camada a ser removida
   */
  removeLayer(layerId) {
    const layerIndex = this.layersStore.activeLayers.findIndex(layer => layer.id === layerId);
    if (layerIndex === -1) {
      console.warn(`[UnmountLayers] Layer ${layerId} not found in activeLayers`);

      return;
    }

    this.layersStore.activeLayers.splice(layerIndex, 1);
    console.log(`[UnmountLayers] Removed layer ${layerId} from activeLayers`);
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
   * Remove uma camada e suas subcamadas do mapa e do store
   * @param {string} layerId - ID da camada a ser removida
   *
   * Esta função é responsável por remover completamente uma camada do mapa,
   * incluindo suas subcamadas (outline e fill) e todos os eventos associados.
   *
   * Processo de remoção:
   * 1. Verifica se a camada possui subcamadas e as remove primeiro
   * 2. Remove eventos de hover de todas as camadas relacionadas
   * 3. Remove a camada principal do mapa
   * 4. Remove a camada do estado interno do store (activeLayers)
   * 5. Verifica se a fonte pode ser removida (se não for usada por outras camadas)
   *
   * Uso recomendado:
   * - Para remover camadas quando desativadas no modal compare layers
   * - Para limpeza completa de camadas com subcamadas
   * - Quando você precisa garantir que todas as partes da camada sejam removidas
   *
   * Exemplo de uso:
   * unmountLayers.removeLayerWithSubLayers('temperatura');
   */
  removeLayerWithSubLayers(layerId) {
    console.log(`[UnmountLayers] Removing layer with sublayers: ${layerId}`);

    if (!this.layersStore.mapRef) {
      console.warn('[UnmountLayers] Map reference not available');

      return;
    }

    // Encontra a camada no activeLayers
    const layerIndex = this.layersStore.activeLayers.findIndex(layer => layer.id === layerId);
    if (layerIndex === -1) {
      console.warn(`[UnmountLayers] Layer ${layerId} not found in activeLayers`);

      return;
    }

    const layer = this.layersStore.activeLayers[layerIndex];

    // 1. Remove as subcamadas primeiro (se existirem)
    if (layer.subLayers && layer.subLayers.length > 0) {
      console.log(`[UnmountLayers] Removing ${layer.subLayers.length} sublayers for layer ${layerId}`);

      layer.subLayers.forEach(subLayer => {
        if (this.layersStore.mapRef.getLayer(subLayer.id)) {
          // Remove eventos de hover das subcamadas
          this.layersStore.mapRef.off('mousemove', subLayer.id);
          this.layersStore.mapRef.off('mouseleave', subLayer.id);

          // Remove a subcamada do mapa
          this.layersStore.mapRef.removeLayer(subLayer.id);
          console.log(`[UnmountLayers] Removed sublayer: ${subLayer.id}`);
        }
      });

      // Remove eventos de hover da camada principal
      if (this.layersStore.hoverManager) {
        this.layersStore.hoverManager.removeSubLayerHoverEvents(layerId);
      }
    }

    // 2. Remove a camada principal
    if (this.layersStore.mapRef.getLayer(layerId)) {
      // Remove eventos de hover da camada principal
      this.layersStore.mapRef.off('mousemove', layerId);
      this.layersStore.mapRef.off('mouseleave', layerId);

      // Remove a camada do mapa
      this.layersStore.mapRef.removeLayer(layerId);
      console.log(`[UnmountLayers] Removed main layer: ${layerId}`);
    }

    // 3. Remove a camada do estado ANTES de verificar a source
    this.layersStore.activeLayers.splice(layerIndex, 1);
    console.log(`[UnmountLayers] Removed layer ${layerId} from activeLayers`);

    // 4. Verifica se a fonte pode ser removida (se não for usada por outras camadas)
    const sourceId = layerId;
    const otherLayersUsingSource = this.isSourceUsedByOtherLayers(sourceId, layerId);

    if (!otherLayersUsingSource && this.layersStore.mapRef.getSource(sourceId)) {
      try {
        this.layersStore.mapRef.removeSource(sourceId);
        console.log(`[UnmountLayers] Removed source: ${sourceId}`);
      } catch (error) {
        console.warn(`[UnmountLayers] Error removing source ${sourceId}:`, error);
      }
    } else if (otherLayersUsingSource) {
      console.log(`[UnmountLayers] Source ${sourceId} not removed - still in use by other layers`);
    } else {
      console.log(`[UnmountLayers] Source ${sourceId} not found in map`);
    }

    // 5. Log das camadas restantes
    console.log('[UnmountLayers] Remaining active layers:', this.layersStore.activeLayers.map(l => l.id));
  }

  /**
   * Facade que chama removeLayerWithSubLayers com verificações adicionais
   * @param {string} layerId - ID da camada a ser removida
   * @returns {boolean} - true se a camada foi removida com sucesso
   */
  unmountLayer(layerId) {
    console.log(`[UnmountLayers] Unmounting layer: ${layerId}`);

    // Verifica se a camada existe antes de tentar removê-la
    const layerExists = this.layersStore.activeLayers.some(layer => layer.id === layerId);

    if (!layerExists) {
      console.warn(`[UnmountLayers] Layer ${layerId} not found in active layers`);

      return false;
    }

    // Remove a camada e suas subcamadas
    this.removeLayerWithSubLayers(layerId);

    console.log(`[UnmountLayers] Successfully unmounted layer ${layerId} with all sublayers`);

    return true;
  }
}
