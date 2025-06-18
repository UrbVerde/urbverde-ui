// urbverde-ui/src/utils/dynamicLayersOrder.js
import { LAYER_CONFIGS } from '@/constants/layers';

/**
 * Atualiza a camada principal atual
 * @param {Array} layers - Array atual de camadas
 * @param {string} newMainLayer - A nova camada principal
 * @param {boolean} isAlreadyActive - Se a nova camada já está ativa
 * @returns {Array} Novo array de camadas
 */
export function updateCurrentMainLayer(layers, newMainLayer, isAlreadyActive) {
  const newLayers = [...layers];
  const currentMainIndex = newLayers.findIndex(layer => layer.currentMain);

  if (isAlreadyActive) {
    // Se a camada já está ativa, troca com a camada que tem currentMain
    const newLayerIndex = newLayers.findIndex(layer => layer.id === newMainLayer);
    const currentMainLayer = newLayers[currentMainIndex];

    // Troca as posições
    newLayers[currentMainIndex] = newLayers[newLayerIndex];
    newLayers[newLayerIndex] = currentMainLayer;

    // Atualiza o currentMain
    newLayers[currentMainIndex].currentMain = true;
    newLayers[newLayerIndex].currentMain = false;
  } else {
    // Se a camada não está ativa, insere na posição do currentMain
    const newLayerConfig = getLayerConfig(newMainLayer);
    const newLayer = {
      id: newMainLayer,
      currentMain: true,
      source: newLayerConfig?.source
    };

    // Remove a camada antiga e insere a nova
    newLayers.splice(currentMainIndex, 1, newLayer);
  }

  return newLayers;
}

/**
 * Verifica se uma camada específica está ativa
 * @param {Array} layers - Array de camadas
 * @param {string} layerId - ID da camada a ser verificada
 * @returns {boolean} Se a camada está ativa
 */
export function isLayerActive(layers, layerId) {
  return layers.some(layer => layer.id === layerId);
}

/**
 * Obtém a camada principal atual
 * @param {Array} layers - Array de camadas
 * @returns {Object|null} A camada principal ou null se não houver
 */
export function getCurrentMainLayer(layers) {
  return layers.find(layer => layer.currentMain) || null;
}

/**
 * Obtém a configuração de uma camada específica
 * @param {string} layerId - ID da camada
 * @param {string} year - Ano dos dados
 * @param {string} scale - Escala atual
 * @param {string} codmun - Código do município
 * @returns {Object} Configuração da camada
 */
export function getLayerConfig(layerId, year, scale, codmun) {
  const base = LAYER_CONFIGS[layerId];
  if (!base) {
    console.error(`Configuração base não encontrada para a camada: ${layerId}`);

    return null;
  }

  // Validar tipo da camada
  if (!base.type || !['raster', 'vector'].includes(base.type)) {
    console.error(`Tipo inválido para a camada ${layerId}: ${base.type}`);

    return null;
  }

  // Se base.source é uma função, chama ela com os parâmetros
  let source;
  try {
    source = typeof base.source === 'function'
      ? base.source(year, scale, codmun)
      : base.source;
  } catch (error) {
    console.error(`Erro ao obter source para a camada ${layerId}:`, error);

    return null;
  }

  if (!source) {
    console.error(`Source não encontrado para a camada ${layerId}`);

    return null;
  }

  return { ...base, source };
}

/**
 * Limpa todas as camadas ativas
 * @returns {Array} Array vazio
 */
export function clearLayers() {
  return [];
}
