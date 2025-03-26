// src/config/sections/helpers.js

/**
 * Cria uma configuração de seções com documentação padronizada
 * @param {function} configFn - Função que recebe nm_mun e uf e retorna um array de configurações
 * @returns {function} Função documentada que gera configurações de seção
 */
export const createSectionConfig = (configFn) =>
/**
     * Configuração das seções para uma camada específica
     * @param {string} nm_mun - Nome do município
     * @param {string} uf - Sigla do estado
     * @returns {Array} Array de configurações de seção
     */
  (nm_mun, uf) => configFn(nm_mun, uf)
  ;

/**
   * Cria um objeto de configuração para uma seção
   * @param {Object} config - Configuração da seção
   * @param {string} config.id - ID da seção
   * @param {string} config.ref - Referência para o elemento
   * @param {string} config.title - Título da seção
   * @param {Component} config.component - Componente Vue a ser renderizado
   * @param {boolean} [config.isSeeMore] - Indica se é uma seção "Veja mais"
   * @returns {Object} Configuração da seção
   */
export const createSection = (config) => config;
