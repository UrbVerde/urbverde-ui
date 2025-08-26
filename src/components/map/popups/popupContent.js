import { useLayersStore } from '@/stores/layersStore';

/**
 * Gera o conteúdo HTML do popup baseado no feature e configuração
 * @param {Object} feat - O feature do mapa contendo as propriedades
 * @param {Object} config - Configuração da camada
 * @returns {string} HTML formatado do popup
 */
export function getPopupContent(feat, config) {
  const layersStore = useLayersStore();
  let rawValue = feat.properties[config.property];

  if (rawValue === undefined || rawValue === null) {
    rawValue = 'N/A';
  } else {
    if (config.popup && config.popup.multiplier) {
      rawValue = Number(rawValue) * config.popup.multiplier;
    }

    if (config.popup && typeof config.popup.format === 'function') {
      rawValue = config.popup.format(rawValue);
    } else {
      rawValue = Number(rawValue).toFixed(2);
    }
  }

  let prefix = '';
  if (layersStore.currentScale === 'estadual' && feat.properties.nm_mun) {
    prefix = `<span style="font-size: 1.2em; font-weight: bold;">${feat.properties.nm_mun}</span><br>`;
  }

  return `
    <div style="font-family: system-ui; padding: 8px;">
      <p>${prefix}${config.label}:<br><strong>${rawValue} ${config.unit || ''}</strong></p>
    </div>
  `;
}

/**
 * Gera o conteúdo HTML do popup para camadas raster
 * @param {number|null} value - O valor raster a ser exibido
 * @param {Object} config - Configuração da camada
 * @returns {string} HTML formatado do popup
 */
export function getRasterPopupContent(value, config) {
  let formattedValue;
  if (value !== null) {
    // Aplicar multiplier se configurado
    let processedValue = value;
    if (config.popup && config.popup.multiplier) {
      processedValue = Number(value) * config.popup.multiplier;
    }

    if (config.popup && typeof config.popup.format === 'function') {
      formattedValue = config.popup.format(processedValue);
    } else {
      formattedValue = processedValue.toFixed(2) + (config.popup?.unit || '');
    }
  } else {
    formattedValue = 'N/A';
  }

  return `<div class="popup-content">${config.popup?.label || 'Valor'}:<br><strong>${formattedValue}</strong></div>`;
}
