import { getLayerConfig, getLayerPaint } from '@/constants/layers.js';
// import { reorderLayerSetup } from './MapLayerController.js';

/**
 * Classe para controlar a criação e adição de layers no mapa
 */
export class LayerController {
  // Constante para opacidade padrão das camadas
  static defaultOpacity = 0.7;

  constructor(layersStore, locationStore) {
    this.layersStore = layersStore;
    this.locationStore = locationStore;
  }

  /**
   * Cria/insere a camada (e subcamadas) no mapa
   * @param {Object} layerConfig - Configuração da camada
   * @param {Array} activeLayers - Lista de camadas ativas
   * @returns {boolean} Sucesso da operação
   */
  addLayerToMap(layerConfig, activeLayers) {
    if (!this.layersStore.mapRef) {
      console.warn('[LayerController] Map reference not available');

      return false;
    }

    const layerId = layerConfig.id;

    // Configura a fonte da camada
    const source = typeof layerConfig.source === 'function'
      ? layerConfig.source(this.locationStore.year, this.locationStore.scale, this.locationStore.currentMunicipioId)
      : layerConfig.source;

    // Determina onde a camada será inserida
    const topLayer = activeLayers[0];
    const beforeId = (topLayer && topLayer.id === 'parks') ? 'parks' : 'highlight_selected-layer';

    console.log('[LayerController] Adicionando camada ao mapa:', {
      camada: layerId,
      antesDe: beforeId,
      totalCamadas: activeLayers.length
    });

    // Adiciona a fonte ao mapa
    if (source) {
      this.layersStore.mapRef.addSource(layerId, source);
    }

    // Adiciona a camada ao mapa
    if (layerConfig.type === 'raster') {
      this.layersStore.mapRef.addLayer({
        id: layerId,
        type: 'raster',
        source: layerId,
        paint: layerConfig.paint
      }, beforeId);
    } else {
      const layerObject = {
        id: layerId,
        type: 'fill',
        source: layerId,
        'source-layer': source.sourceLayer,
        paint: getLayerPaint(layerConfig, {
          scale: this.locationStore.scale,
          municipioId: this.locationStore.currentMunicipioId,
          statistics: this.layersStore.currentStatistics
        })
      };

      console.log('[LayerController] Adicionando camada vetorial ao mapa:', {
        id: layerId,
        sourceLayer: source.sourceLayer,
        beforeId
      });

      this.layersStore.mapRef.addLayer(layerObject, beforeId);
    }

    console.log('[LayerController] Camada adicionada ao mapa com sucesso:', layerId);

    // Reordena todas as camadas após adicionar a nova
    // reorderLayerSetup(this.layersStore.mapRef, activeLayers);

    // Adiciona subcamadas para camadas vetoriais
    if (layerConfig.type === 'vector' || layerConfig.dataType === 'vector') {
      this.layersStore.addSubLayer(layerId);
    }

    return true;
  }

  /**
   * Registra a camada no activeLayers (se ainda não existir)
   * @param {Object} layerConfig - Configuração da camada
   * @param {number} opacity - Opacidade da camada
   * @returns {boolean} Sucesso da operação
   */
  addLayerToStore(layerConfig, opacity) {
    const layerId = layerConfig.id;

    // Verifica se a camada já existe no store
    if (this.layersStore.getActiveLayers.some(l => l.id === layerId)) {
      console.log('[LayerController] Camada já existe no store:', layerId);

      return true;
    }

    // Configura a fonte da camada
    const source = typeof layerConfig.source === 'function'
      ? layerConfig.source(this.locationStore.year, this.locationStore.scale, this.locationStore.currentMunicipioId)
      : layerConfig.source;

    // Adiciona ao store usando a função renomeada
    this.layersStore.addLayerToStore({
      id: layerId,
      year: this.locationStore.year,
      scale: this.locationStore.scale,
      opacity,
      source
    });

    console.log('[LayerController] Camada registrada no store com sucesso:', layerId);

    return true;
  }

  /**
   * Facade que chama addLayerToMap e addLayerToStore em sequência (idempotente)
   * @param {string} layerId - ID da camada a ser montada
   * @returns {boolean} Sucesso da operação
   */
  mountLayer(layerId) {
    console.log('[LayerController] Iniciando montagem da camada:', layerId);

    // Obtém configuração da camada
    const layerConfig = getLayerConfig(layerId, this.locationStore.year, this.locationStore.scale);
    if (!layerConfig) {
      console.warn('[LayerController] Configuração da camada não encontrada:', layerId);

      return false;
    }

    // Verifica se a camada já está no mapa
    if (this.layersStore.mapRef.getLayer(layerId)) {
      console.log('[LayerController] Camada já existe no mapa:', layerId);

      return true;
    }

    // Obtém lista atual de camadas ativas
    const activeLayers = [...this.layersStore.getActiveLayers];

    // Adiciona ao store primeiro
    const storeSuccess = this.addLayerToStore(layerConfig, LayerController.defaultOpacity);

    if (!storeSuccess) {
      console.error('[LayerController] Falha ao adicionar camada ao store:', layerId);

      return false;
    }

    // Adiciona ao mapa
    const mapSuccess = this.addLayerToMap(layerConfig, activeLayers);

    if (!mapSuccess) {
      console.error('[LayerController] Falha ao adicionar camada ao mapa:', layerId);

      return false;
    }

    console.log('[LayerController] Camada montada com sucesso:', layerId);

    return true;
  }
}

/**
 * Função de conveniência para criar uma instância do LayerController
 * @param {Object} layersStore - Store de layers
 * @param {Object} locationStore - Store de localização
 * @returns {LayerController} Instância do LayerController
 */
export function createLayerController(layersStore, locationStore) {
  return new LayerController(layersStore, locationStore);
}
