// urbverde-ui/src/config/helperCreateSection.js
import { computed, h } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import Panel from '@/components/cards-new/panel-config/base/SectionCards.vue';

// Importação centralizada dos componentes comuns entre os .js
import CardData from '@/components/cards-new/components-cards/cardData.vue';
import CardInfo from '@/components/cards-new/components-cards/cardInfo.vue';
import CardRanking from '@/components/cards-new/components-cards/cardRanking.vue';
import CardDownload from '@/components/cards-new/components-cards/cardDownload.vue';

// Mapa de componentes para facilitar o acesso
const COMMON_COMPONENTS = {
  CardData,
  CardInfo,
  CardRanking,
  CardDownload
};

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

function getComponent(component) {
  // Se for uma string, tenta pegar do mapa de componentes comuns
  if (typeof component === 'string') {
    const commonComponent = COMMON_COMPONENTS[component];
    if (commonComponent) {
      return commonComponent;
    }
    console.warn(`Common component not found: ${component}`);

    return null;
  }

  // Se não for string, tenta usar o componente diretamente
  if (typeof component === 'function' || (typeof component === 'object' && component.render)) {
    return component;
  }

  console.warn('Invalid component:', component);

  return null;
}

function renderCard(cardConfig) {
  // Se for um componente direto (sem props)
  if (typeof cardConfig === 'function' || (typeof cardConfig === 'object' && !cardConfig.component)) {
    const component = getComponent(cardConfig);
    if (!component) {return null;}

    return h(component);
  }

  // Se tiver component com props
  if (cardConfig.component) {
    const component = getComponent(cardConfig.component);
    if (!component) {return null;}

    return h(component, cardConfig.props || {});
  }

  return null;
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
 * @param {string} [config.subtitle=false] - Subtítulo da seção
 * @param {Component|string} [config.component] - Componente Vue a ser renderizado ou nome do componente comum
 * @param {Object} [config.props] - Props para o componente
 * @param {boolean} [config.showYearPicker=true] - Indica se a seção deve mostrar o seletor de ano
 * @param {Object} [config.panel] - Configuração do painel
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
          const component = getComponent(config.component);
          if (!component) {return null;}

          return h(component, config.props);
        }
      }
    };
  }

  // Caso contrário, mantém o formato com componentes
  return config;
};
