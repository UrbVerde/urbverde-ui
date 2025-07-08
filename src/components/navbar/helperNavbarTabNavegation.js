// urbverde-ui/src/components/navbar/helperNavbarTabNavegation.js
import { categoryToLayerMap, NO_MAP_TAB_IDS } from '@/components/cards/panel-config/index.js';

// IDs que devem ser excluídos das abas de navegação
const EXCLUDED_TAB_IDS = ['seeMore'];

// ID que deve sempre estar presente como primeira aba (se não existir)
const DEFAULT_FIRST_TAB = 'map';

/**
 * Obtém as seções de configuração para uma camada específica
 */

export const getSectionsForLayer = (layer, sectionConfigs, locationStore) => {
  if (!layer || !sectionConfigs) {
    return null;
  }

  try {
    // Acesso direto ao locationStore para obter informações atualizadas
    const selectedLayer = locationStore ? locationStore.layer : layer;
    const selectedCategory = locationStore ? locationStore.category : null;

    // 1. Primeiro, verifica se existe configuração específica para a camada
    if (selectedLayer && sectionConfigs.layers && sectionConfigs.layers[selectedLayer]) {
      const layerSpecificConfig = sectionConfigs.layers[selectedLayer];
      const sectionsComputed = layerSpecificConfig();

      return sectionsComputed.value;
    }

    // 2. Tenta usar a camada diretamente em sectionConfigs (sem .layers)
    if (layer && sectionConfigs[layer]) {
      const configGetter = sectionConfigs[layer];
      const sectionsComputed = configGetter();

      return sectionsComputed.value;
    }

    // 3. Tenta usar a categoria obtida do locationStore
    if (selectedCategory) {
      // Converte categoria para chave de configuração
      const categoryKey = convertCategoryToKey(selectedCategory);

      if (categoryKey && sectionConfigs[categoryKey]) {
        const configGetter = sectionConfigs[categoryKey];
        const sectionsComputed = configGetter();

        return sectionsComputed.value;
      }
    }

    // 4. Se não encontrou nada, procura por similaridade nos nomes
    if (layer) {
      const possibleKeys = Object.keys(sectionConfigs).filter(key =>
        !key.startsWith('_') && key !== 'layers');

      for (const key of possibleKeys) {
        if (layer.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().includes(layer.toLowerCase())) {
          const configGetter = sectionConfigs[key];
          const sectionsComputed = configGetter();

          return sectionsComputed.value;
        }
      }
    }
  } catch (error) {
    console.error('Erro ao obter seções:', error);
  }

  return null;
};

/**
 * Converte uma categoria para o formato de chave usado no sectionConfigs
 */

const convertCategoryToKey = (category) => {
  if (!category) {return null;}

  // Usa o mapeamento diretamente do index.js
  if (categoryToLayerMap[category]) {
    return categoryToLayerMap[category];
  }

  // Normaliza a string para usar como chave se não encontrar no mapeamento
  return category.normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
};

/**
 * Gera abas de navegação com base nas seções disponíveis
 */
export const generateTabsFromSections = (sections, tabIdToLabelMap, currentCategory = null, currentLayer = null) => {
  // Se não houver seções, retorna apenas a aba padrão
  if (!sections || sections.length === 0) {
    return [{
      id: DEFAULT_FIRST_TAB,
      label: tabIdToLabelMap[DEFAULT_FIRST_TAB] || 'Mapa'
    }];
  }

  // Extrai IDs únicos, excluindo os IDs na lista de exclusão
  const uniqueIds = [...new Set(
    sections
      .filter(section => !EXCLUDED_TAB_IDS.includes(section.id))
      .map(section => section.id)
  )];

  // Verifica se deve incluir a aba "Mapa" baseado na categoria/camada atual
  const shouldIncludeMapTab = !NO_MAP_TAB_IDS.includes(currentCategory) &&
                             !NO_MAP_TAB_IDS.includes(currentLayer);

  // Adiciona 'map' como primeira aba se necessário e se não existir
  if (shouldIncludeMapTab && !uniqueIds.includes(DEFAULT_FIRST_TAB)) {
    uniqueIds.unshift(DEFAULT_FIRST_TAB);
  }

  // Transforma em objetos {id, label}
  return uniqueIds.map(id => ({
    id,
    label: tabIdToLabelMap[id] || id.charAt(0).toUpperCase() + id.slice(1)
  }));
};

/**
 * Função principal que obtém as abas de navegação para uma camada específica
 * Esta é a função que deve ser exportada e usada no NavbarMap
 */
export const getTabsForLayer = (layer, sectionConfigs, tabIdToLabelMap, locationStore) => {
  const sections = getSectionsForLayer(layer, sectionConfigs, locationStore);

  // Obtém a categoria e camada atual do locationStore
  const currentCategory = locationStore ? locationStore.category : null;
  const currentLayer = locationStore ? locationStore.layer : null;

  return generateTabsFromSections(sections, tabIdToLabelMap, currentCategory, currentLayer);
};

export default {
  getTabsForLayer,
  generateTabsFromSections,
  getSectionsForLayer
};
