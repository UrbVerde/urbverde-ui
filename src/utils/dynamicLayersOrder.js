// urbverde-ui/src/utils/dynamicLayersOrder.js
import { LAYER_CONFIGS } from '@/constants/layers';

/**
 * Configura o estado inicial das camadas
 * @param {string} activeMainLayer - A camada principal a ser definida
 * @returns {Array} Array com as camadas configuradas
 */
export function setDefaultLayers(activeMainLayer) {
  return [
    {
      id: 'parks',
      currentMain: false
    },
    {
      id: activeMainLayer,
      currentMain: true
    }
  ];
}

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
    const newLayer = {
      id: newMainLayer,
      currentMain: true
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
 * @returns {Object} Configuração da camada
 */
export function getLayerConfig(layerId) {
  return LAYER_CONFIGS[layerId];
}

/**
 * Limpa todas as camadas ativas
 * @returns {Array} Array vazio
 */
export function clearLayers() {
  return [];
}
