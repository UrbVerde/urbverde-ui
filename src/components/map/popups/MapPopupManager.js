import maplibregl from 'maplibre-gl';
import { getPopupContent, getRasterPopupContent } from './popupContent';

/**
 * Configura o popup para uma camada específica
 * @param {Object} map - Instância do mapa
 * @param {Object} config - Configuração da camada
 * @returns {Object} Objeto com handlers de interação
 */
export function setupLayerPopup(map, config) {
  if (!map) {return null;}

  const vectorPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    trackPointer: true,
    offset: { top: [0, 20], bottom: [0, -20] },
    className: 'hover-popup'
  });

  const pinnedPopup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: false,
    offset: { top: [0, 20], bottom: [0, -20] },
    className: 'pinned-popup'
  });

  let hoveredFeatureId = null;
  let pinnedFeatureId = null;

  const onMouseMove = (e) => {
    const layerOpacity = map.getPaintProperty('dynamic-layer', 'fill-opacity') || 0;
    if (layerOpacity <= 0) {
      if (hoveredFeatureId !== null) {
        map.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
        vectorPopup.remove();
      }
      map.getCanvas().style.cursor = '';

      return;
    }

    const features = map.queryRenderedFeatures(e.point, { layers: ['dynamic-layer'] });
    if (!features.length) {
      if (hoveredFeatureId !== null) {
        map.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
        vectorPopup.remove();
      }

      return;
    }

    const feat = features[0];
    const featId = feat.id;

    if (featId !== hoveredFeatureId) {
      if (hoveredFeatureId !== null) {
        map.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
      }
      hoveredFeatureId = featId;
      map.setFeatureState(
        { source: 'dynamic-source', id: featId },
        { hover: true }
      );
    }

    const offset = e.point.y < 50 ? [0, 20] : [0, -10];
    vectorPopup
      .setLngLat(e.lngLat)
      .setOffset(offset)
      .setHTML(getPopupContent(feat, config))
      .addTo(map);

    map.getCanvas().style.cursor = 'pointer';
  };

  const onMouseLeave = () => {
    if (hoveredFeatureId !== null) {
      map.setFeatureState(
        { source: 'dynamic-source', id: hoveredFeatureId },
        { hover: false }
      );
      hoveredFeatureId = null;
    }
    vectorPopup.remove();
    map.getCanvas().style.cursor = '';
  };

  const onClick = (e) => {
    if (!e.features?.length) {return;}
    const feat = e.features[0];
    const featId = feat.id;

    if (e.originalEvent.ctrlKey) {
      if (pinnedFeatureId !== null) {
        map.setFeatureState(
          { source: 'dynamic-source', id: pinnedFeatureId },
          { pinned: false }
        );
      }
      pinnedFeatureId = featId;
      map.setFeatureState(
        { source: 'dynamic-source', id: featId },
        { pinned: true }
      );
      pinnedPopup
        .setLngLat(e.lngLat)
        .setHTML(getPopupContent(feat, config))
        .addTo(map);
    }
  };

  // Anexar os handlers diretamente ao mapa
  map.on('mousemove', 'dynamic-layer', onMouseMove);
  map.on('mouseleave', 'dynamic-layer', onMouseLeave);
  map.on('click', 'dynamic-layer', onClick);

  return {
    vectorPopup,
    pinnedPopup,
    onMouseMove,
    onMouseLeave,
    onClick,
    hoveredFeatureId,
    pinnedFeatureId
  };
}

/**
 * Remove os handlers de interação do popup
 * @param {Object} map - Instância do mapa
 * @param {Object} handlers - Handlers de interação
 */
export function removePopupHandlers(map, handlers) {
  if (!map || !handlers) {return;}

  map.off('mousemove', 'dynamic-layer', handlers.onMouseMove);
  map.off('mouseleave', 'dynamic-layer', handlers.onMouseLeave);
  map.off('click', 'dynamic-layer', handlers.onClick);

  if (handlers.vectorPopup) {handlers.vectorPopup.remove();}
  if (handlers.pinnedPopup) {handlers.pinnedPopup.remove();}
}

/**
 * Configura os handlers de interação para camadas raster
 * @param {Object} map - Instância do mapa
 * @param {Object} config - Configuração da camada
 * @param {Function} fetchRasterValue - Função para buscar valor raster
 * @returns {Object} Objeto com handlers de interação
 */
export function setupRasterPopupHandlers(map, config, fetchRasterValue) {
  if (!map) { return null; }

  const rasterPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: [0, -20],
    className: 'hover-popup',
    trackPointer: true
  });

  const pinnedPopup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: false,
    offset: { top: [0, 20], bottom: [0, -20] },
    className: 'pinned-popup'
  });

  let currentRequest = null;
  let debounceTimeout;
  const debounceDelay = 50;
  let globalLastRasterValue = null;

  const onRasterMouseMove = (e) => {
    // Verificar se a camada raster está ativa e visível
    const dynamicLayer = map.getLayer('dynamic-layer');
    if (!dynamicLayer || dynamicLayer.type !== 'raster') {
      rasterPopup.remove();
      map.getCanvas().style.cursor = '';

      return;
    }

    const layerOpacity = map.getPaintProperty('dynamic-layer', 'raster-opacity') || 0;
    if (layerOpacity <= 0) {
      rasterPopup.remove();
      map.getCanvas().style.cursor = '';

      return;
    }

    // Removida verificação de município para permitir popups em qualquer lugar

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (currentRequest) {
        currentRequest.abort();
        currentRequest = null;
      }
      const controller = new AbortController();
      currentRequest = controller;

      fetchRasterValue(e.lngLat.lng, e.lngLat.lat, controller)
        .then((value) => {
          if (value !== null) {
            // Aplicar multiplier se configurado
            let processedValue = value;
            if (config.popup && config.popup.multiplier) {
              processedValue = Number(value) * config.popup.multiplier;
            }

            if (config.popup && typeof config.popup.format === 'function') {
              globalLastRasterValue = config.popup.format(processedValue);
            } else {
              globalLastRasterValue = processedValue.toFixed(2) + (config.popup?.unit || '');
            }
          }
          rasterPopup
            .setLngLat(e.lngLat)
            .setHTML(getRasterPopupContent(value, config))
            .addTo(map);
        })
        .catch(err => {
          if (err.name !== 'AbortError') { console.error(err); }
        });
    }, debounceDelay);
  };

  const onRasterMouseClick = (e) => {
    if (!e.originalEvent.ctrlKey) { return; }
    e.preventDefault();
    pinnedPopup
      .setLngLat(e.lngLat)
      .setHTML(getRasterPopupContent(globalLastRasterValue, config))
      .addTo(map);
  };

  // Anexar os handlers ao mapa
  map.on('mousemove', onRasterMouseMove);
  map.on('click', onRasterMouseClick);

  return {
    rasterPopup,
    pinnedPopup,
    onRasterMouseMove,
    onRasterMouseClick,
    globalLastRasterValue
  };
}

/**
 * Remove os handlers de interação do popup raster
 * @param {Object} map - Instância do mapa
 * @param {Object} handlers - Handlers de interação
 */
export function removeRasterPopupHandlers(map, handlers) {
  if (!map || !handlers) { return; }

  map.off('mousemove', handlers.onRasterMouseMove);
  map.off('click', handlers.onRasterMouseClick);

  if (handlers.rasterPopup) { handlers.rasterPopup.remove(); }
  if (handlers.pinnedPopup) { handlers.pinnedPopup.remove(); }
}
