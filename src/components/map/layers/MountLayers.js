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
  console.log('[MountLayers] === INÍCIO createMountLayers ===');
  const layersStore = useLayersStore();
  const locationStore = useLocationStore();

  console.log('[MountLayers] Stores obtidos:', { layersStore, locationStore });
  console.log('[MountLayers] === FIM createMountLayers ===');

  return new MountLayers(layersStore, locationStore);
}

/**
 * Classe para controlar a criação e adição de layers no mapa
 */
export class MountLayers {
  // Constante para camada padrão de referência
  static defaultTopLayer = 'highlight_selected-layer';

  constructor(layersStore, locationStore) {
    console.log('[MountLayers] === INÍCIO CONSTRUTOR ===');
    console.log('[MountLayers] Parâmetros:', { layersStore, locationStore });

    this.layersStore = layersStore;
    this.locationStore = locationStore;
    this.hoverManager = createHoverManager(layersStore);

    console.log('[MountLayers] HoverManager criado:', this.hoverManager);
    console.log('[MountLayers] === FIM CONSTRUTOR ===');
  }

  /**
   * Cria/insere a camada (e subcamadas) no mapa
   * @param {Object} layerConfig - Configuração da camada
   * @param {string} beforeID - ID da camada antes da qual inserir (opcional)
   * @returns {boolean} Sucesso da operação
   */
  addLayerToMap(layerConfig, beforeID = null) {
    console.log('[MountLayers] === INÍCIO addLayerToMap ===');
    console.log('[MountLayers] Parâmetros:', { layerConfig, beforeID });

    if (!this.layersStore.mapRef) {
      console.warn('[MountLayers] Map reference not available');
      console.log('[MountLayers] === FIM addLayerToMap (ERRO) ===');

      return false;
    }

    const layerId = layerConfig.id;
    console.log('[MountLayers] LayerId:', layerId);

    // Configura a fonte da camada
    console.log('[MountLayers] Configurando fonte da camada...');
    const source = typeof layerConfig.source === 'function'
      ? layerConfig.source(this.locationStore.year, this.locationStore.scale, this.locationStore.cd_mun)
      : layerConfig.source;

    console.log('[MountLayers] Fonte configurada:', source);

    // Determina onde a camada será inserida
    console.log('[MountLayers] Determinando posição de inserção...');
    let beforeId;
    const activeLayers = this.layersStore.getActiveLayers;
    console.log('[MountLayers] Camadas ativas:', activeLayers.map(l => l.id));

    if (beforeID) {
      // Se beforeID foi fornecido externamente, usa ele
      beforeId = beforeID;
      console.log('[MountLayers] Usando beforeID fornecido:', beforeId);
    } else {
      // Comportamento original
      const topLayer = activeLayers[0];
      console.log('[MountLayers] Top layer:', topLayer);

      // Se a camada sendo adicionada é parks, sempre usar o defaultTopLayer
      // Se não, verificar se parks está no topo para posicionar corretamente
      beforeId = (layerId === 'parks')
        ? MountLayers.defaultTopLayer
        : (topLayer && topLayer.id === 'parks') ? 'parks' : MountLayers.defaultTopLayer;

      console.log('[MountLayers] beforeId calculado:', beforeId);
    }

    console.log('[MountLayers] Adicionando camada ao mapa:', {
      camada: layerId,
      antesDe: beforeId,
      totalCamadas: activeLayers.length
    });

    // Adiciona a fonte ao mapa
    if (source) {
      console.log('[MountLayers] Adicionando fonte ao mapa:', layerId);
      this.layersStore.mapRef.addSource(layerId, source);
      console.log('[MountLayers] Fonte adicionada com sucesso');
    }

    // Adiciona a camada ao mapa
    if (layerConfig.type === 'raster') {
      console.log('[MountLayers] Adicionando camada raster...');
      const rasterLayer = {
        id: layerId,
        type: 'raster',
        source: layerId,
        paint: layerConfig.paint
      };
      console.log('[MountLayers] Configuração da camada raster:', rasterLayer);
      this.layersStore.mapRef.addLayer(rasterLayer, beforeId);
      console.log('[MountLayers] Camada raster adicionada com sucesso');
    } else {
      console.log('[MountLayers] Adicionando camada vetorial...');
      const layerObject = {
        id: layerId,
        type: 'fill',
        source: layerId,
        'source-layer': source.sourceLayer,
        paint: getLayerPaint(layerConfig, {
          scale: this.locationStore.scale,
          municipioId: this.locationStore.cd_mun,
          statistics: this.layersStore.currentStatistics
        })
      };

      console.log('[MountLayers] Adicionando camada vetorial ao mapa:', {
        id: layerId,
        sourceLayer: source.sourceLayer,
        beforeId,
        paint: layerObject.paint
      });

      this.layersStore.mapRef.addLayer(layerObject, beforeId);
      console.log('[MountLayers] Camada vetorial adicionada com sucesso');
    }

    console.log('[MountLayers] Camada adicionada ao mapa com sucesso:', layerId);

    // Reordena todas as camadas após adicionar a nova
    // reorderLayerSetup(this.layersStore.mapRef, activeLayers);

    // Adiciona subcamadas para camadas vetoriais
    if (layerConfig.type === 'vector' || layerConfig.dataType === 'vector') {
      console.log('[MountLayers] Adicionando subcamadas para camada vetorial...');
      this.mountSubLayer(layerConfig);
    }

    console.log('[MountLayers] === FIM addLayerToMap (SUCESSO) ===');

    return true;
  }

  /**
   * Registra a camada no activeLayers (se ainda não existir)
   * @param {Object} layerConfig - Configuração da camada
   * @param {number} opacity - Opacidade da camada
   * @param {string} beforeID - ID da camada antes da qual inserir (opcional)
   * @returns {boolean} Sucesso da operação
   */
  addLayerToStore(layerConfig, opacity, beforeID = null) {
    console.log('[MountLayers] === INÍCIO addLayerToStore ===');
    console.log('[MountLayers] Parâmetros:', { layerConfig, opacity, beforeID });

    const layerId = layerConfig.id;
    console.log('[MountLayers] LayerId:', layerId);

    // Verifica se a camada já existe no store
    const existingLayer = this.layersStore.getActiveLayers.find(l => l.id === layerId);
    if (existingLayer) {
      console.log('[MountLayers] Camada já existe no store:', layerId);
      console.log('[MountLayers] === FIM addLayerToStore (JÁ EXISTE) ===');

      return true;
    }

    // Configura a fonte da camada
    console.log('[MountLayers] Configurando fonte da camada...');
    const source = typeof layerConfig.source === 'function'
      ? layerConfig.source(this.locationStore.year, this.locationStore.scale, this.locationStore.cd_mun)
      : layerConfig.source;

    console.log('[MountLayers] Fonte configurada:', source);

    // Adiciona ao store usando a função renomeada
    console.log('[MountLayers] Adicionando camada ao store...');
    this.layersStore.addLayer({
      id: layerId,
      year: this.locationStore.year,
      scale: this.locationStore.scale,
      opacity,
      source
    }, beforeID);

    console.log('[MountLayers] Camada registrada no store com sucesso:', layerId);
    console.log('[MountLayers] === FIM addLayerToStore (SUCESSO) ===');

    return true;
  }

  /**
   * Facade que chama addLayerToMap e addLayerToStore em sequência (idempotente)
   * @param {string} layerId - ID da camada a ser montada
   * @param {string} beforeID - ID da camada antes da qual inserir (opcional)
   * @returns {boolean} Sucesso da operação
   *
   * @example
   * // Uso básico (comportamento original)
   * mountLayers.mountLayer('vegetacao');
   *
   * // Uso com beforeID para controlar posicionamento
   * mountLayers.mountLayer('clima', 'parks'); // Insere 'clima' antes de 'parks'
   * mountLayers.mountLayer('temperatura', 'vegetacao'); // Insere 'temperatura' antes de 'vegetacao'
   */
  mountLayer(layerId, beforeID = null) {
    console.log('[MountLayers] === INÍCIO mountLayer ===');
    console.log('[MountLayers] Parâmetros:', { layerId, beforeID });
    console.log('[MountLayers] Estado atual:', {
      year: this.locationStore.year,
      scale: this.locationStore.scale,
      cd_mun: this.locationStore.cd_mun
    });

    // Obtém configuração da camada
    console.log('[MountLayers] Obtendo configuração da camada...');
    const layerConfig = getLayerConfig(layerId, this.locationStore.year, this.locationStore.scale);
    if (!layerConfig) {
      console.warn('[MountLayers] Configuração da camada não encontrada:', layerId);
      console.log('[MountLayers] === FIM mountLayer (ERRO) ===');

      return false;
    }
    console.log('[MountLayers] Configuração obtida:', layerConfig);

    // Verifica se a camada já está no mapa
    const existingMapLayer = this.layersStore.mapRef.getLayer(layerId);
    if (existingMapLayer) {
      console.log('[MountLayers] Camada já existe no mapa:', layerId);
      console.log('[MountLayers] === FIM mountLayer (JÁ EXISTE) ===');

      return true;
    }

    // Adiciona ao store primeiro
    console.log('[MountLayers] Adicionando camada ao store...');
    const storeSuccess = this.addLayerToStore(layerConfig, this.layersStore.defaultOpacity, beforeID);

    if (!storeSuccess) {
      console.error('[MountLayers] Falha ao adicionar camada ao store:', layerId);
      console.log('[MountLayers] === FIM mountLayer (ERRO) ===');

      return false;
    }

    // Adiciona ao mapa
    console.log('[MountLayers] Adicionando camada ao mapa...');
    const mapSuccess = this.addLayerToMap(layerConfig, beforeID);

    if (!mapSuccess) {
      console.error('[MountLayers] Falha ao adicionar camada ao mapa:', layerId);
      console.log('[MountLayers] === FIM mountLayer (ERRO) ===');

      return false;
    }

    console.log('[MountLayers] Camada montada com sucesso:', layerId);
    console.log('[MountLayers] === FIM mountLayer (SUCESSO) ===');

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
