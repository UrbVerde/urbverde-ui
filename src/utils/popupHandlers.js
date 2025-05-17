import maplibregl from 'maplibre-gl';
import { getPopupContent } from './popupContent';

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
