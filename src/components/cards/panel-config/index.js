// urbverde-ui/src/components/cards/panel-config/index.js

import clima from './sections/national/clima.js';
import vegetacao from './sections/national/vegetacao.js';
import parques from './sections/national/parques.js';
import overview from './sections/policies/sintese.js';
import policies_parks from './sections/policies/policies_parks.js';

// Mapa para converter IDs de categorias para nomes de configuração internos
export const categoryToLayerMap = {
  'climate': 'temperatura',
  'vegetation': 'vegetação',
  'parks': 'parques',
  'overview': 'overview',
  'policies_parks': 'policies_parks',
};

// Mapa inverso para converter de interno para IDs de categorias
export const layerToCategoryMap = {
  'temperatura': 'climate',
  'vegetação': 'vegetation',
  'parques': 'parks',
  'overview': 'overview',
  'policies_parks': 'policies_parks',
};

// Configurações de seções para cada tipo de camada
export const sectionConfigs = {
  // Sections de categorias
  temperatura: clima,
  vegetação: vegetacao,
  parques,
  overview,
  policies_parks,

  // layers : {
  //  'id_da_layer': teste
  //}
};

// Mapeamento de IDs para labels amigáveis nas abas
export const tabIdToLabelMap = {
  'map': 'Mapa',
  'stats': 'Estatísticas',
  'ranking': 'Ranking',
  'seeMore': 'Veja Mais',
  'metas': 'Metas',
  'indicadores': 'Indicadores',
  'planejamento': 'Planejamento climático',
  // Adicione mais mapeamentos conforme necessário
};
