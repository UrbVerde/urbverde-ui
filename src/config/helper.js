// src/config/sections/helpers.js
import { computed } from 'vue';
import { useLocationStore } from '@/stores/locationStore';

/**
 * Cria uma configuração de seções com documentação padronizada
 * que usa automaticamente os valores do LocationStore
 * @param {function} configFn - Função que recebe nm_mun e uf e retorna um array de configurações
 * @returns {function} Função computada que gera configurações de seção baseadas no LocationStore
 */
export const createSectionConfig = (configFn) =>
  /**
   * Retorna um computed que busca valores atualizados do LocationStore
   * @returns {import('vue').ComputedRef} Configurações de seção computadas
   */
  () => {
    const locationStore = useLocationStore();

    // Usar computed direto para acessar os valores do store
    return computed(() => {
      const nm_mun = locationStore.nm_mun || '?';
      const uf = locationStore.uf || '?';

      return configFn(nm_mun, uf);
    });
  }
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
