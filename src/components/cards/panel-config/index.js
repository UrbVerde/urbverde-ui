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
import risks_heat_wave from './sections/policies/risks_heat_wave.js';
import risks_alimentar_insecurity from './sections/policies/risks_alimentar_insecurity.js';
import risks_flood from './sections/policies/risks_flood.js';
import risks_arboviruses from './sections/policies/risks_arboviruses.js';
import risks_idesh from './sections/policies/risks_idesh.js';
import emissions from './sections/policies/emissions.js';

// Category ID to section name
export const categoryToLayerMap = {
  'climate': 'temperatura',
  'vegetation': 'vegetação',
  'parks': 'parques',
  'overview': 'overview',
  'policies_parks': 'policies_parks',
  'policies_vegetation': 'policies_vegetation',
  'policies_hidro': 'policies_hidrology',
  'agriculture': 'agriculture',
  'policies_climate': 'policies_climate',
  'emissions': 'emissions',
};

// Inverse mapping to convert internal IDs to category IDs
export const layerToCategoryMap = {
  'temperatura': 'climate',
  'vegetação': 'vegetation',
  'parques': 'parks',
  'overview': 'overview',
  'policies_parks': 'policies_parks',
  'policies_vegetation': 'policies_vegetation',
  'policies_hidrology': 'policies_hidro',
  'agriculture': 'agriculture',
  'policies_climate': 'policies_climate',
  'emissions': 'emissions',
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
  emissions,

  layers : {
    'heat_wave_risks': risks_heat_wave,
    'nutrition_vulnerability': risks_alimentar_insecurity,
    'flood_risks': risks_flood,
    'arbovirus_risks': risks_arboviruses,
    'desh_risks': risks_idesh,
  }
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
  'parks': 'Parques e praças',
  'vegetation': 'Vegetação',
  'hidro': 'Hidrologia',
  'agriculture': 'Agricultura Urbana',
  'climate': 'Clima',
};

// IDs de categorias ou camadas que não devem mostrar a aba "Mapa"
export const NO_MAP_TAB_IDS = [
  'overview',
];
