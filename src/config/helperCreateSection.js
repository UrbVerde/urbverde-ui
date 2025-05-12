// urbverde-ui/src/config/helperCreateSection.js
import { computed, h } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import CardData from '@/components/cards-new/cardData.vue';
import CardTest from '@/components/cards-new/cardTest.vue';
import Panel from '@/components/cards-new/panel-config/SectionCards.vue';

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

function renderCard(cardConfig) {
  // Se for um componente direto (sem props)
  if (typeof cardConfig === 'function' || (typeof cardConfig === 'object' && !cardConfig.type && !cardConfig.component)) {
    return h(cardConfig);
  }

  // Se tiver component com props
  if (cardConfig.component) {
    return h(cardConfig.component, cardConfig.props || {});
  }

  // Caso contrário, usa o formato type/props
  const { type, props } = cardConfig;

  switch (type) {
  case 'cardData':
    return h(CardData, props);
  case 'cardTest':
    return h(CardTest, props);
  default:
    console.warn(`Unknown card type: ${type}`);

    return null;
  }
}

function renderPanel(panelConfig, isNested = false) {
  return h(Panel,
    { variant: panelConfig.variant, nested: isNested },
    () => panelConfig.items.map((item) => {
      if (item.type === 'panel') {
        // Renderiza um único Panel para o painel aninhado
        return renderPanel(item.props, true);
      }

      // Renderiza o card apropriado baseado no tipo ou componente
      return renderCard(item);
    })
  );
}

/**
 * Cria um objeto de configuração para uma seção
 * @param {Object} config - Configuração da seção
 * @param {string} config.id - ID da seção
 * @param {string} config.ref - Referência para o elemento
 * @param {string} config.title - Título da seção
 * @param {Component} [config.component] - Componente Vue a ser renderizado (formato antigo)
 * @param {Object} [config.props] - Props para o componente (formato antigo)
 * @param {boolean} [config.isSeeMore] - Indica se é uma seção "Veja mais"
 * @param {Object} [config.panel] - Configuração do painel (formato novo)
 * @param {string} config.panel.variant - Variante do painel (ex: "3-1")
 * @param {Array} config.panel.items - Array de configurações de itens (cards ou painéis)
 * @returns {Object} Configuração da seção
 */
export const createSection = (config) => {
  // Se tiver panel config não usa componentes
  if (config.panel) {
    return {
      ...config,
      component: {
        render() {
          return renderPanel(config.panel, false);
        }
      }
    };
  }

  // Se tiver component com props
  if (config.component && config.props) {
    return {
      ...config,
      component: {
        render() {
          return h(config.component, config.props);
        }
      }
    };
  }

  // Caso contrário, mantém o formato com componentes
  return config;
};
