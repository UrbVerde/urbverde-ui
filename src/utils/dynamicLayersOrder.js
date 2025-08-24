// urbverde-ui/src/utils/dynamicLayersOrder.js
import { LAYER_CONFIGS } from '@/constants/layers';

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
