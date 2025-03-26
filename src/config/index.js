// src/config/index.js
import clima from './sections/clima';
import vegetacao from './sections/vegetacao';
import parques from './sections/parques';

// Mapa para converter categorias da UI para nomes de configuração internos
export const categoryToLayerMap = {
  'Clima': 'temperatura',
  'Vegetação': 'vegetação',
  'Parques e Praças': 'parques',
  'Censo': 'censo'
};

// Mapa inverso para converter de interno para categorias da UI
export const layerToCategoryMap = {
  'temperatura': 'Clima',
  'vegetação': 'Vegetação',
  'parques': 'Parques e Praças',
  'censo': 'Censo'
};

// Configurações de seções para cada tipo de camada
export const sectionConfigs = {
  temperatura: clima,
  vegetação: vegetacao,
  parques
  // Adicionar novas camadas aqui
};

// RESTRIÇÕES DE CAMADAS ESPECÍFICAS

export const layerYearConfig = {
  parques: {
    fixedYear: 2021,
    hasYearPicker: false
  }
  // Adicione configurações para outras camadas conforme necessário
};
