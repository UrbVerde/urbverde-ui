// urbverde-ui/src/components/map/layers/layerRegistry.js

export class LayerRegistry {
  constructor() {
    this.layers = new Map();
    this.dependencies = new Map();
  }

  /**
   * Registra uma nova camada
   * @param {string} layerId - ID da camada
   * @param {Object} config - Configuração da camada
   */
  register(layerId, config) {
    this.layers.set(layerId, {
      ...config,
      dependencies: config.dependencies || []
    });
  }

  /**
   * Remove o registro de uma camada
   * @param {string} layerId - ID da camada
   */
  unregister(layerId) {
    this.layers.delete(layerId);
  }

  /**
   * Obtém as dependências de uma camada
   * @param {string} layerId - ID da camada
   * @returns {Array} Lista de dependências
   */
  getDependencies(layerId) {
    return this.layers.get(layerId)?.dependencies || [];
  }

  /**
   * Valida se todas as dependências de uma camada estão registradas
   * @param {string} layerId - ID da camada
   * @returns {boolean} Se todas as dependências estão registradas
   */
  validateDependencies(layerId) {
    const layer = this.layers.get(layerId);
    if (!layer) {return false;}

    return layer.dependencies.every(depId => this.layers.has(depId));
  }

  /**
   * Obtém a configuração de uma camada
   * @param {string} layerId - ID da camada
   * @returns {Object} Configuração da camada
   */
  getLayerConfig(layerId) {
    return this.layers.get(layerId);
  }

  /**
   * Lista todas as camadas registradas
   * @returns {Array} Lista de IDs das camadas
   */
  listLayers() {
    return Array.from(this.layers.keys());
  }

  /**
   * Verifica se uma camada está registrada
   * @param {string} layerId - ID da camada
   * @returns {boolean} Se a camada está registrada
   */
  hasLayer(layerId) {
    return this.layers.has(layerId);
  }
}
