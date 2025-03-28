/**
 * Utilitário para gerenciamento de abas de navegação baseado nas seções disponíveis
 * Usa a mesma lógica do WidgetsSection para garantir consistência
 */

// IDs que devem ser excluídos das abas de navegação
const EXCLUDED_TAB_IDS = ['seeMore'];

// ID que deve sempre estar presente como primeira aba (se não existir)
const DEFAULT_FIRST_TAB = 'map';

/**
 * Obtém as seções de configuração para uma camada específica
 * Usa a mesma lógica do WidgetsSection para manter consistência
 */
export const getSectionsForLayer = (layer, sectionConfigs, locationStore) => {
  console.log('getSectionsForLayer chamada com layer:', layer);

  if (!layer || !sectionConfigs) {
    console.log('Layer ou sectionConfigs não definidos');

    return null;
  }

  try {
    // Acesso direto ao locationStore para obter informações atualizadas
    const selectedLayer = locationStore ? locationStore.layer : layer;
    const selectedCategory = locationStore ? locationStore.category : null;

    console.log(`Tentando obter seções com layer=${layer}, selectedLayer=${selectedLayer}, selectedCategory=${selectedCategory}`);

    // 1. Primeiro, verifica se existe configuração específica para a camada
    if (selectedLayer && sectionConfigs.layers && sectionConfigs.layers[selectedLayer]) {
      // Usa a configuração específica da camada
      console.log(`Usando configuração específica para a camada: ${selectedLayer}`);
      const layerSpecificConfig = sectionConfigs.layers[selectedLayer];
      const sectionsComputed = layerSpecificConfig();

      return sectionsComputed.value;
    }

    // 2. Tenta usar a camada diretamente em sectionConfigs (sem .layers)
    if (layer && sectionConfigs[layer]) {
      console.log(`Usando configuração direta para: ${layer}`);
      const configGetter = sectionConfigs[layer];
      const sectionsComputed = configGetter();

      return sectionsComputed.value;
    }

    // 3. Tenta usar a categoria obtida do locationStore
    if (selectedCategory) {
      // Converte categoria para chave de configuração
      const categoryKey = convertCategoryToKey(selectedCategory);

      if (categoryKey && sectionConfigs[categoryKey]) {
        console.log(`Usando configuração de categoria: ${categoryKey} (de ${selectedCategory})`);
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
          console.log(`Encontrada correspondência parcial: ${key} para ${layer}`);
          const configGetter = sectionConfigs[key];
          const sectionsComputed = configGetter();

          return sectionsComputed.value;
        }
      }
    }
  } catch (error) {
    console.error('Erro ao obter seções:', error);
    console.error('Detalhes do erro:', error.message);
    console.error('Stack:', error.stack);
  }

  console.log('Nenhuma configuração encontrada');

  return null;
};

/**
 * Converte uma categoria para o formato de chave usado no sectionConfigs
 */
const convertCategoryToKey = (category) => {
  if (!category) {return null;}

  // Mapeamento direto por nome de categoria
  const categoryMap = {
    'Clima': 'temperatura',
    'Vegetação': 'vegetação',
    'Parques e Praças': 'parques'
  };

  // Tenta o mapeamento direto
  if (categoryMap[category]) {
    return categoryMap[category];
  }

  // Normaliza a string para usar como chave
  return normalizeString(category);
};

/**
 * Normaliza uma string para uso como chave
 * Remove acentos, converte para minúsculas e remove espaços
 */
const normalizeString = (str) => {
  if (!str) {return '';}

  // Para remover acentos
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

/**
 * Gera abas de navegação com base nas seções disponíveis
 */
export const generateTabsFromSections = (sections, tabIdToLabelMap) => {
  console.log('generateTabsFromSections chamada com seções:', sections);

  // Se não houver seções, retorna apenas a aba padrão
  if (!sections || sections.length === 0) {
    console.log('Nenhuma seção encontrada, retornando apenas a aba padrão');

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

  console.log('IDs únicos encontrados:', uniqueIds);

  // Sempre adiciona 'map' como primeira aba se não existir
  if (!uniqueIds.includes(DEFAULT_FIRST_TAB)) {
    uniqueIds.unshift(DEFAULT_FIRST_TAB);
  }

  // Transforma em objetos {id, label}
  const tabs = uniqueIds.map(id => ({
    id,
    label: tabIdToLabelMap[id] || id.charAt(0).toUpperCase() + id.slice(1)
  }));

  console.log('Abas geradas:', tabs);

  return tabs;
};

/**
 * Função principal que obtém as abas de navegação para uma camada específica
 * Esta é a função que deve ser exportada e usada no NavbarMap
 */
export const getTabsForLayer = (layer, sectionConfigs, tabIdToLabelMap, locationStore) => {
  console.log('getTabsForLayer chamada para a camada:', layer);
  console.log('locationStore categoria:', locationStore?.category);
  console.log('locationStore layer:', locationStore?.layer);

  const sections = getSectionsForLayer(layer, sectionConfigs, locationStore);

  return generateTabsFromSections(sections, tabIdToLabelMap);
};

// Assegure-se de que a função getTabsForLayer está sendo exportada
export default {
  getTabsForLayer,
  generateTabsFromSections,
  getSectionsForLayer
};
