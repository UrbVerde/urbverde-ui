// urbverde-ui/src/utils/dynamicLayersOrder.js

/**
 * Configura o estado inicial das camadas
 * @param {string} activeMainLayer - A camada principal a ser definida
 * @returns {Array} Array com as camadas configuradas
 */
export function setDefaultLayers(activeMainLayer) {
  return [
    {
      id: 'parks',
      year: null,
      scale: null,
      opacity: 0.7,
      currentMain: false
    },
    {
      id: activeMainLayer,
      year: null,
      scale: null,
      opacity: 0.7,
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
      year: null,
      scale: null,
      opacity: 0.7,
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
 * Limpa todas as camadas ativas
 * @returns {Array} Array vazio
 */
export function clearLayers() {
  return [];
}
