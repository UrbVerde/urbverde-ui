// IDs que devem ser excluídos das abas de navegação
const EXCLUDED_TAB_IDS = ['seeMore'];

// ID que deve sempre estar presente como primeira aba (se não existir)
const DEFAULT_FIRST_TAB = 'map';

/**
 * Gera abas de navegação com base nas seções disponíveis para uma camada
 *
 * @param {Array|null} sections - Array de configurações de seção ou null
 * @param {Object} tabIdToLabelMap - Mapeamento de IDs para labels amigáveis
 * @returns {Array} Array de objetos {id, label} para usar nas abas
 */
export const generateTabsFromSections = (sections, tabIdToLabelMap) => {
  // Se não houver seções, retorna apenas a aba padrão
  if (!sections || sections.length === 0) {
    return [{
      id: DEFAULT_FIRST_TAB,
      label: tabIdToLabelMap[DEFAULT_FIRST_TAB] || 'Mapa'
    }];
  }

  // Extrai IDs únicos (excluindo os IDs na lista de exclusão)
  const uniqueIds = [...new Set(
    sections
      .filter(section => !EXCLUDED_TAB_IDS.includes(section.id))
      .map(section => section.id)
  )];

  // Sempre adiciona o tab padrão como primeira aba se não existir
  if (!uniqueIds.includes(DEFAULT_FIRST_TAB)) {
    uniqueIds.unshift(DEFAULT_FIRST_TAB);
  }

  // Transforma em objetos {id, label}
  return uniqueIds.map(id => ({
    id,
    label: tabIdToLabelMap[id] || id.charAt(0).toUpperCase() + id.slice(1)
  }));
};

/**
 * Obtém as seções de configuração para uma camada específica
 *
 * @param {string} layer - Nome da camada
 * @param {Object} sectionConfigs - Configuração de seções de todas as camadas
 * @returns {Array|null} Array de seções ou null se não encontrado
 */
export const getSectionsForLayer = (layer, sectionConfigs) => {
  if (!layer || !sectionConfigs) {
    return null;
  }

  // Verifica se existe uma configuração específica para essa camada
  if (sectionConfigs.layers && sectionConfigs.layers[layer]) {
    return sectionConfigs.layers[layer]().value;
  }

  // Se não, verifica configuração por categoria
  if (sectionConfigs[layer]) {
    return sectionConfigs[layer]().value;
  }

  // Nenhuma configuração encontrada
  return null;
};

/**
 * Obtém as abas de navegação para uma camada específica
 *
 * @param {string} layer - Nome da camada
 * @param {Object} sectionConfigs - Configuração de seções de todas as camadas
 * @param {Object} tabIdToLabelMap - Mapeamento de IDs para labels amigáveis
 * @returns {Array} Array de objetos {id, label} para usar nas abas
 */
export const getTabsForLayer = (layer, sectionConfigs, tabIdToLabelMap) => {
  const sections = getSectionsForLayer(layer, sectionConfigs);

  return generateTabsFromSections(sections, tabIdToLabelMap);
};
