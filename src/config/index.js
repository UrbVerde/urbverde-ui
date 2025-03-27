// src/config/index.js

import clima from './sections/clima';
import vegetacao from './sections/vegetacao';
import parques from './sections/parques';

// Mapa para converter categorias da UI para nomes de configuração internos
export const categoryToLayerMap = {
  'Clima': 'temperatura',
  'Vegetação': 'vegetação',
  'Parques e Praças': 'parques',
};

// Mapa inverso para converter de interno para categorias da UI
export const layerToCategoryMap = {
  'temperatura': 'Clima',
  'vegetação': 'Vegetação',
  'parques': 'Parques e Praças',
};

// Configurações de seções para cada tipo de camada
export const sectionConfigs = {
  // Sections de categorias
  temperatura: clima,
  vegetação: vegetacao,
  parques,

  // Section de camadas específicas
  //layers : {
  //  'avg_distance_to_squares': distanceSquareConfig
  //}
};

// RESTRIÇÕES DE CAMADAS ESPECÍFICAS
export const layerYearConfig = {
  parques: {
    fixedYear: 2021,
    hasYearPicker: false
  },
  // Adicione configurações para outras camadas conforme necessário
};

// Mapeamento de IDs para labels amigáveis nas abas
export const tabIdToLabelMap = {
  'map': 'Mapa',
  'stats': 'Estatísticas',
  'ranking': 'Ranking',
  'seeMore': 'Veja Mais'
  // Adicione mais mapeamentos conforme necessário
};
