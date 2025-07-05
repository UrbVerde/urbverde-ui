// urbverde-ui/src/components/cards/panel-config/index.js

import clima from './sections/national/clima.js';
import vegetacao from './sections/national/vegetacao.js';
import parques from './sections/national/parques.js';
import overview from './sections/policies/sintese.js';
import policies_parks from './sections/policies/policies_parks.js';
import policies_vegetation from './sections/policies/policies_vegetation.js';
import policies_hidrology from './sections/policies/policies_hidrology.js';
import agriculture from './sections/policies/agriculture.js';
import policies_climate from './sections/policies/policies_climate.js';

// Category ID to section name
export const categoryToLayerMap = {
  'climate': 'temperatura',
  'vegetation': 'vegetação',
  'parks': 'parques',
  'overview': 'overview',
  'policies_parks': 'policies_parks',
  'policies_vegetation': 'policies_vegetation',
  'hidro': 'policies_hidrology',
  'agriculture': 'agriculture',
  'policies_climate': 'policies_climate',
};

// Inverse mapping to convert internal IDs to category IDs
export const layerToCategoryMap = {
  'temperatura': 'climate',
  'vegetação': 'vegetation',
  'parques': 'parks',
  'overview': 'overview',
  'policies_parks': 'policies_parks',
  'policies_vegetation': 'policies_vegetation',
  'policies_hidrology': 'hidro',
  'agriculture': 'agriculture',
  'policies_climate': 'policies_climate',
};

// Configurações de seções para cada tipo de camada
export const sectionConfigs = {
  // Sections de categorias
  temperatura: clima,
  vegetação: vegetacao,
  parques,
  overview,
  policies_parks,
  policies_vegetation,
  policies_hidrology,
  agriculture,
  policies_climate,

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
