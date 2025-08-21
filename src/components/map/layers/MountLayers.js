import { getLayerConfig, getLayerPaint } from '@/constants/layers.js';
import { useLayersStore } from '@/stores/layersStore';
import { useLocationStore } from '@/stores/locationStore';
import { createHoverManager } from './HoverManager.js';
// import { reorderLayerSetup } from './ReorderLayers.js';

/**
 * Função de conveniência para criar uma instância do MountLayers
 * @returns {MountLayers} Instância do MountLayers
 */
export function createMountLayers() {
  const layersStore = useLayersStore();
  const locationStore = useLocationStore();

  return new MountLayers(layersStore, locationStore);
}

/**
 * Classe para controlar a criação e adição de layers no mapa
 */
export class MountLayers {
  // Constante para camada padrão de referência
  static defaultTopLayer = 'highlight_selected-layer';

  constructor(layersStore, locationStore) {
    this.layersStore = layersStore;
    this.locationStore = locationStore;
    this.hoverManager = createHoverManager(layersStore);
  }

  /**
   * Cria/insere a camada (e subcamadas) no mapa
   * @param {Object} layerConfig - Configuração da camada
   * @param {Array} activeLayers - Lista de camadas ativas
   * @returns {boolean} Sucesso da operação
   */
  addLayerToMap(layerConfig) {
    if (!this.layersStore.mapRef) {
      console.warn('[MountLayers] Map reference not available');

      return false;
    }

    const layerId = layerConfig.id;

    // Configura a fonte da camada
    const source = typeof layerConfig.source === 'function'
      ? layerConfig.source(this.locationStore.year, this.locationStore.scale, this.locationStore.currentMunicipioId)
      : layerConfig.source;

    // Determina onde a camada será inserida
    const activeLayers = this.layersStore.getActiveLayers;
    const topLayer = activeLayers[0];
    const beforeId = (topLayer && topLayer.id === 'parks') ? 'parks' : MountLayers.defaultTopLayer;

    console.log('[MountLayers] Adicionando camada ao mapa:', {
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

      console.log('[MountLayers] Adicionando camada vetorial ao mapa:', {
        id: layerId,
        sourceLayer: source.sourceLayer,
        beforeId
      });
      //   alert(beforeId);

      this.layersStore.mapRef.addLayer(layerObject, beforeId);
    }

    console.log('[MountLayers] Camada adicionada ao mapa com sucesso:', layerId);

    // Reordena todas as camadas após adicionar a nova
    // reorderLayerSetup(this.layersStore.mapRef, activeLayers);

    // Adiciona subcamadas para camadas vetoriais
    if (layerConfig.type === 'vector' || layerConfig.dataType === 'vector') {
      this.mountSubLayer(layerConfig);
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
      console.log('[MountLayers] Camada já existe no store:', layerId);

      return true;
    }

    // Configura a fonte da camada
    const source = typeof layerConfig.source === 'function'
      ? layerConfig.source(this.locationStore.year, this.locationStore.scale, this.locationStore.currentMunicipioId)
      : layerConfig.source;

    // Adiciona ao store usando a função renomeada
    this.layersStore.addLayer({
      id: layerId,
      year: this.locationStore.year,
      scale: this.locationStore.scale,
      opacity,
      source
    });

    console.log('[MountLayers] Camada registrada no store com sucesso:', layerId);

    return true;
  }

  /**
   * Facade que chama addLayerToMap e addLayerToStore em sequência (idempotente)
   * @param {string} layerId - ID da camada a ser montada
   * @returns {boolean} Sucesso da operação
   */
  mountLayer(layerId) {
    console.log('[MountLayers] Iniciando montagem da camada:', layerId);

    // Obtém configuração da camada
    const layerConfig = getLayerConfig(layerId, this.locationStore.year, this.locationStore.scale);
    if (!layerConfig) {
      console.warn('[MountLayers] Configuração da camada não encontrada:', layerId);

      return false;
    }

    // Verifica se a camada já está no mapa
    if (this.layersStore.mapRef.getLayer(layerId)) {
      console.log('[MountLayers] Camada já existe no mapa:', layerId);

      return true;
    }

    // Adiciona ao store primeiro
    const storeSuccess = this.addLayerToStore(layerConfig, this.layersStore.defaultOpacity);

    if (!storeSuccess) {
      console.error('[MountLayers] Falha ao adicionar camada ao store:', layerId);

      return false;
    }

    // Adiciona ao mapa
    const mapSuccess = this.addLayerToMap(layerConfig);

    if (!mapSuccess) {
      console.error('[MountLayers] Falha ao adicionar camada ao mapa:', layerId);

      return false;
    }

    console.log('[MountLayers] Camada montada com sucesso:', layerId);

    return true;
  }

  /**
   * Cria/insere subcamadas no mapa
   * @param {Object} layerConfig - Configuração da camada principal
   * @returns {boolean} Sucesso da operação
   */
  addSubLayerToMap(layerConfig) {
    const layerId = layerConfig.id;

    // Verifica se a camada existe e é vetorial
    if (!layerConfig || (layerConfig.type !== 'vector' && layerConfig.dataType !== 'vector')) {
      console.warn(`[MountLayers] Cannot add sublayers for non-vector layer: ${layerId}`);

      return false;
    }

    // Encontra a camada principal no activeLayers
    const mainLayerIndex = this.layersStore.getActiveLayers.findIndex(l => l.id === layerId);
    if (mainLayerIndex === -1) {
      console.warn(`[MountLayers] Main layer not found in activeLayers: ${layerId}`);

      return false;
    }

    const mainLayer = this.layersStore.getActiveLayers[mainLayerIndex];

    // Verifica se as subcamadas já existem no mapa
    const fillLayerId = `${layerId}_fill`;
    const outlineLayerId = `${layerId}_outline`;

    if (this.layersStore.mapRef.getLayer(fillLayerId) && this.layersStore.mapRef.getLayer(outlineLayerId)) {
      console.log(`[MountLayers] Sublayers already exist in map for layer: ${layerId}`);

      return true;
    }

    // Cria as duas subcamadas
    const outlineSubLayer = {
      id: outlineLayerId,
      type: 'line',
      source: layerId, // Usa o mesmo source da camada principal
      'source-layer': mainLayer.source?.sourceLayer,
      layout: {
        visibility: 'visible'
      },
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#ffffff', // Branco no hover
          '#666666'  // Cinza escuro normal
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          3,
          1
        ],
        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.7
        ]
      }
    };

    const fillSubLayer = {
      id: fillLayerId,
      type: 'fill',
      source: layerId, // Usa o mesmo source da camada principal
      'source-layer': mainLayer.source?.sourceLayer,
      layout: {
        visibility: 'visible'
      },
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(255, 255, 255, 0.2)', // Branco semi-transparente no hover
          'transparent'
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.5,
          0.1
        ]
      }
    };

    // Adiciona as subcamadas ao mapa
    if (this.layersStore.mapRef) {
      // Determina o beforeID baseado na posição da camada principal
      let beforeID;
      if (mainLayerIndex === 0) {
        beforeID = MountLayers.defaultTopLayer;
      } else {
        beforeID = this.layersStore.getActiveLayers[mainLayerIndex - 1].id;
      }

      // Adiciona a primeira subcamada (fill) - deve ficar por baixo
      this.layersStore.mapRef.addLayer(fillSubLayer, beforeID);
      console.log(`[MountLayers] Added sublayer ${fillSubLayer.id} with beforeID: ${beforeID}`);

      // Adiciona a segunda subcamada (outline) - deve ficar por cima
      this.layersStore.mapRef.addLayer(outlineSubLayer, fillSubLayer.id);
      console.log(`[MountLayers] Added sublayer ${outlineSubLayer.id} with beforeID: ${fillSubLayer.id}`);

      // Configura eventos de hover para as subcamadas
      this.hoverManager.setupSubLayerHoverEvents(layerId, outlineLayerId, fillLayerId);
    }

    console.log(`[MountLayers] Sublayers added to map for layer ${layerId}`);

    return true;
  }

  /**
   * Registra as subcamadas no activeLayers (se ainda não existir)
   * @param {Object} layerMeta - Metadados da camada principal
   * @returns {boolean} Sucesso da operação
   */
  addSubLayerToStore(layerMeta) {
    const layerId = layerMeta.id;

    // Encontra a camada principal no activeLayers
    const mainLayerIndex = this.layersStore.getActiveLayers.findIndex(l => l.id === layerId);
    if (mainLayerIndex === -1) {
      console.warn(`[MountLayers] Main layer not found in activeLayers: ${layerId}`);

      return false;
    }

    const mainLayer = this.layersStore.getActiveLayers[mainLayerIndex];

    // Inicializa subcamadas se não existir
    if (!mainLayer.subLayers) {
      mainLayer.subLayers = [];
    }

    // Verifica se as subcamadas já existem no store
    const fillLayerId = `${layerId}_fill`;
    const outlineLayerId = `${layerId}_outline`;

    const existingFill = mainLayer.subLayers.find(sub => sub.id === fillLayerId);
    const existingOutline = mainLayer.subLayers.find(sub => sub.id === outlineLayerId);

    if (existingFill && existingOutline) {
      console.log(`[MountLayers] Sublayers already exist in store for layer: ${layerId}`);

      return true;
    }

    // Cria as duas subcamadas para o store
    const outlineSubLayer = {
      id: outlineLayerId,
      type: 'line',
      source: layerId,
      'source-layer': mainLayer.source?.sourceLayer
    };

    const fillSubLayer = {
      id: fillLayerId,
      type: 'fill',
      source: layerId,
      'source-layer': mainLayer.source?.sourceLayer
    };

    // Adiciona as subcamadas ao array de subcamadas da camada principal
    if (!existingFill) {
      mainLayer.subLayers.push(fillSubLayer);
    }
    if (!existingOutline) {
      mainLayer.subLayers.push(outlineSubLayer);
    }

    console.log(`[MountLayers] Sublayers registered in store for layer ${layerId}:`, mainLayer.subLayers);

    return true;
  }

  /**
   * Facade que chama addSubLayerToStore e addSubLayerToMap em sequência (idempotente)
   * @param {Object} layerConfig - Configuração da camada principal
   * @returns {boolean} Sucesso da operação
   */
  mountSubLayer(layerConfig) {
    const layerId = layerConfig.id;
    console.log(`[MountLayers] Mounting sublayers for layer: ${layerId}`);

    // Adiciona ao store primeiro
    const storeSuccess = this.addSubLayerToStore(layerConfig);
    if (!storeSuccess) {
      console.error(`[MountLayers] Failed to add sublayers to store for layer: ${layerId}`);

      return false;
    }

    // Adiciona ao mapa
    const mapSuccess = this.addSubLayerToMap(layerConfig);
    if (!mapSuccess) {
      console.error(`[MountLayers] Failed to add sublayers to map for layer: ${layerId}`);

      return false;
    }

    console.log(`[MountLayers] Sublayers mounted successfully for layer: ${layerId}`);

    return true;
  }

  /**
   * @deprecated Use mountSubLayer instead
   * Adiciona subcamadas para camadas vetoriais (outline e fill)
   * @param {string} layerId - ID da camada principal
   */
  addSubLayer(layerId) {
    console.warn('[MountLayers] addSubLayer is deprecated. Use mountSubLayer instead.');

    // Obtém configuração da camada
    const layerConfig = getLayerConfig(layerId, this.locationStore.year, this.locationStore.scale);
    if (!layerConfig) {
      console.warn(`[MountLayers] Layer configuration not found: ${layerId}`);

      return;
    }

    return this.mountSubLayer(layerConfig);
  }

}
