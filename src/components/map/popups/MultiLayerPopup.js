import maplibregl from 'maplibre-gl';
import { useLayersStore } from '@/stores/layersStore';
import { LAYER_CONFIGS } from '@/constants/layers';
import { LAYER_DATA_TYPES } from '@/components/map/layers/layerOrderManager';
import { fetchRasterValue } from '@/components/map/core/SetupLayers.js';

/**
 * Cria e configura o popup multi-camada
 * @param {Object} map - Instância do mapa
 * @returns {Object} Objeto com o popup e métodos de controle
 */
export function createMultiLayerPopup(map) {
  if (!map) {
    console.error('[MultiLayerPopup] Mapa não fornecido');

    return null;
  }

  const layersStore = useLayersStore();

  // Variáveis para debounce e cache
  let debounceTimeout;
  const debounceDelay = 100; // Aumentado para reduzir requisições
  let currentRequest = null;

  // Cache para valores raster (evita requisições repetidas)
  const rasterCache = new Map();
  const cacheTimeout = 3000; // 5 segundos de cache

  // Cria o popup com estilo simples e branco
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    trackPointer: true,
    offset: { top: [0, 20], bottom: [0, -20] },
    className: 'multi-layer-popup',
    maxWidth: '300px'
  });

  /**
   * Gera o conteúdo HTML do popup para múltiplas camadas
   * @param {Array} features - Array de features encontradas sob o mouse
   * @param {Object} rasterValues - Valores raster obtidos via WMS
   * @returns {string} HTML formatado
   */
  function generatePopupContent(features, rasterValues = {}) {
    if ((!features || features.length === 0) && Object.keys(rasterValues).length === 0) {
      return '<div class="popup-no-data">Nenhum dado disponível</div>';
    }

    // Ordena as features conforme a ordem em activeLayers
    const orderedFeatures = features.sort((a, b) => {
      const aIndex = layersStore.activeLayers.findIndex(layer => layer.id === a.layer.id);
      const bIndex = layersStore.activeLayers.findIndex(layer => layer.id === b.layer.id);

      // Se não encontrou na lista ativa, coloca no final
      if (aIndex === -1 && bIndex === -1) {return 0;}
      if (aIndex === -1) {return 1;}
      if (bIndex === -1) {return -1;}

      return aIndex - bIndex;
    });

    let html = '<div class="popup-content">';

    // Processa features vetoriais (incluindo parques)
    orderedFeatures.forEach(feature => {
      const layerConfig = LAYER_CONFIGS[feature.layer.id];
      if (!layerConfig) {return;}

      const properties = feature.properties;

      // Para camadas vetoriais, usa a propriedade configurada
      if (layerConfig.type === 'vector' || layerConfig.type === LAYER_DATA_TYPES.VECTOR) {
        let displayValue = '';
        let unit = '';

        // Se tem propriedade específica, usa ela
        if (layerConfig.property) {
          const propertyName = layerConfig.property;
          const value = properties[propertyName];

          if (value === undefined || value === null) {return;}

          // Formata o valor conforme configuração
          displayValue = value;
          if (layerConfig.popup && typeof layerConfig.popup.format === 'function') {
            displayValue = layerConfig.popup.format(value);
          } else if (typeof value === 'number') {
            displayValue = value.toFixed(2);
          }

          // Obtém a unidade de medida
          unit = layerConfig.popup?.unit || layerConfig.unit || '';
        } else {
          // Para camadas sem propriedade específica (como parks), tenta usar propriedades comuns
          if (feature.layer.id === 'parks') {
            // Para parques, usa nome e área conforme especificado
            const parkName = properties['nm_praca'] || properties['tipo'] || 'Praça';
            const parkArea = properties['aream2'];

            // Para parks, o título será o nome da praça e o valor será a área
            displayValue = parkName;

            // Formata a área se encontrada
            if (parkArea !== null && parkArea !== undefined) {
              const areaValue = parseFloat(parkArea);

              // Formata o número com separadores de milhares
              const formattedArea = areaValue.toLocaleString('pt-BR');

              unit = `Área: ${formattedArea} m²`;
            } else {
              unit = '';
            }
          } else {
            // Para outras camadas sem propriedade específica
            displayValue = 'Disponível';
            unit = '';
          }
        }

        html += `
          <div class="popup-layer-item">
            <div class="popup-layer-title">${feature.layer.id === 'parks' ? displayValue : (layerConfig.label || feature.layer.id)}</div>
            <div class="popup-layer-value">
              <strong>${feature.layer.id === 'parks' ? unit : (`${displayValue  } ${  unit}`)}</strong>
            </div>
          </div>
        `;
      }
    });

    // Processa valores raster
    Object.entries(rasterValues).forEach(([layerId, value]) => {
      const layerConfig = LAYER_CONFIGS[layerId];
      if (!layerConfig || (layerConfig.type !== 'raster' && layerConfig.type !== LAYER_DATA_TYPES.RASTER)) {return;}

      if (value === null || value === undefined) {return;}

      // Formata o valor raster
      let displayValue = value;
      if (layerConfig.popup && typeof layerConfig.popup.format === 'function') {
        displayValue = layerConfig.popup.format(value);
      } else if (typeof value === 'number') {
        displayValue = value.toFixed(2);
      }

      // Obtém a unidade de medida
      const unit = layerConfig.popup?.unit || layerConfig.unit || '';

      html += `
        <div class="popup-layer-item">
          <div class="popup-layer-title">${layerConfig.label || layerId}</div>
          <div class="popup-layer-value">
            <strong>${displayValue} ${unit}</strong>
          </div>
        </div>
      `;
    });

    html += '</div>';

    return html;
  }

  /**
   * Handler para o evento de movimento do mouse
   * @param {Object} e - Evento do mouse
   */
  function onMouseMove(e) {
    // Obtém todas as camadas ativas
    const activeLayerIds = layersStore.activeLayers.map(layer => layer.id);

    if (activeLayerIds.length === 0) {
      popup.remove();

      return;
    }

    // Verifica se há camadas raster ativas
    const hasRasterLayers = layersStore.activeLayers.some(layer => {
      const config = LAYER_CONFIGS[layer.id];

      return config && (config.type === 'raster' || config.type === LAYER_DATA_TYPES.RASTER);
    });

    // Se só há camadas vetoriais, processa imediatamente
    if (!hasRasterLayers) {
      processMouseMove(e);

      return;
    }

    // Se há camadas raster, aplica debounce
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      processMouseMove(e);
    }, debounceDelay);
  }

  /**
   * Processa o movimento do mouse (com ou sem debounce)
   * @param {Object} e - Evento do mouse
   */
  async function processMouseMove(e) {
    // Cancela requisições anteriores
    if (currentRequest) {
      currentRequest.abort();
      currentRequest = null;
    }

    // Obtém todas as camadas ativas
    const activeLayerIds = layersStore.activeLayers.map(layer => layer.id);

    if (activeLayerIds.length === 0) {
      popup.remove();

      return;
    }

    // Query todas as features sob o mouse nas camadas ativas
    const features = map.queryRenderedFeatures(e.point, {
      layers: activeLayerIds
    });

    // Filtra apenas features que têm configuração válida
    const validFeatures = features.filter(feature => {
      const layerConfig = LAYER_CONFIGS[feature.layer.id];
      if (!layerConfig) {return false;}

      // Para camadas vetoriais, verifica se tem propriedade válida
      if (layerConfig.type === 'vector' || layerConfig.type === LAYER_DATA_TYPES.VECTOR) {
        // Para camadas sem propriedade específica (como parks), sempre inclui
        if (!layerConfig.property) {
          return true; // Sempre inclui camadas vetoriais sem propriedade específica
        }

        const propertyName = layerConfig.property;
        const value = feature.properties[propertyName];

        return value !== undefined && value !== null;
      }

      // Para camadas raster, sempre inclui (valor será obtido via WMS)
      return layerConfig.type === 'raster' || layerConfig.type === LAYER_DATA_TYPES.RASTER;
    });

    // Busca valores raster para camadas raster ativas (com cache)
    const rasterValues = {};
    const rasterLayers = layersStore.activeLayers.filter(layer => {
      const config = LAYER_CONFIGS[layer.id];

      return config && (config.type === 'raster' || config.type === LAYER_DATA_TYPES.RASTER);
    });

    // Gera chave de cache baseada na posição e camadas
    const cacheKey = `${e.lngLat.lng.toFixed(4)}_${e.lngLat.lat.toFixed(4)}_${rasterLayers.map(l => l.id).join('_')}`;

    // Verifica se já temos os dados em cache
    const cachedData = rasterCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < cacheTimeout) {
      Object.assign(rasterValues, cachedData.values);
    } else if (rasterLayers.length > 0) {
      // Busca valores raster em paralelo
      const rasterPromises = rasterLayers.map(async(layer) => {
        try {
        //   const config = LAYER_CONFIGS[layer.id];
          const controller = new AbortController();
          const value = await fetchRasterValue(e.lngLat.lng, e.lngLat.lat, controller, layer.id, layersStore.currentYear);
          if (value !== null) {
            rasterValues[layer.id] = value;
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.warn(`Erro ao buscar valor raster para ${layer.id}:`, error);
          }
        }
      });

      await Promise.all(rasterPromises);

      // Salva no cache
      if (Object.keys(rasterValues).length > 0) {
        rasterCache.set(cacheKey, {
          values: { ...rasterValues },
          timestamp: Date.now()
        });

      }
    }

    // Mostra popup com todos os dados disponíveis
    if (validFeatures.length > 0 || Object.keys(rasterValues).length > 0) {
      const content = generatePopupContent(validFeatures, rasterValues);
      popup
        .setLngLat(e.lngLat)
        .setHTML(content)
        .addTo(map);
    } else {
      popup.remove();
    }
  }

  /**
   * Handler para quando o mouse sai da área do mapa
   */
  function onMouseLeave() {
    // Limpa timeouts pendentes
    clearTimeout(debounceTimeout);

    // Cancela requisições pendentes
    if (currentRequest) {
      currentRequest.abort();
      currentRequest = null;
    }

    // Remove o popup
    popup.remove();
  }

  /**
   * Inicializa os event listeners
   */
  function initialize() {
    map.on('mousemove', onMouseMove);
    map.on('mouseleave', onMouseLeave);
    map.on('mouseout', onMouseLeave);

    // Adiciona listener para quando o popup for fechado
    popup.on('close', () => {
      clearTimeout(debounceTimeout);
      if (currentRequest) {
        currentRequest.abort();
        currentRequest = null;
      }
    });

    // Adiciona listener para o container do mapa
    const mapContainer = map.getContainer();
    mapContainer.addEventListener('mouseleave', onMouseLeave);

    console.log('[MultiLayerPopup] Popup multi-camada inicializado');
  }

  /**
   * Remove os event listeners
   */
  function destroy() {
    map.off('mousemove', onMouseMove);
    map.off('mouseleave', onMouseLeave);
    map.off('mouseout', onMouseLeave);

    // Remove listener do container do mapa
    const mapContainer = map.getContainer();
    mapContainer.removeEventListener('mouseleave', onMouseLeave);

    // Limpa timeouts e requisições pendentes
    clearTimeout(debounceTimeout);
    if (currentRequest) {
      currentRequest.abort();
    }

    // Limpa cache
    rasterCache.clear();

    popup.remove();

    console.log('[MultiLayerPopup] Popup multi-camada destruído');
  }

  return {
    popup,
    initialize,
    destroy,
    onMouseMove,
    onMouseLeave
  };
}

// Adiciona estilos CSS para o popup
const style = document.createElement('style');
style.textContent = `
  .multi-layer-popup .maplibregl-popup-content {
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: 8px !important;
    padding: 12px !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
  }

  .popup-content {
    font-size: 13px;
    line-height: 1.4;
  }

  .popup-layer-item {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .popup-layer-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .popup-layer-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 2px;
  }

  .popup-layer-value {
    color: #666;
  }

  .popup-no-data {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 8px;
  }
`;

document.head.appendChild(style);
