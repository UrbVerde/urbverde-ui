import { ref, onUnmounted } from 'vue';
import maplibregl from 'maplibre-gl';
import { getPopupContent, getRasterPopupContent } from '@/components/map/popups/popupContent';

export function useMapPopups() {
  const vectorPopup = ref(null);
  const rasterPopup = ref(null);
  const pinnedPopup = ref(null);
  const hoveredFeatureId = ref(null);
  const pinnedFeatureId = ref(null);
  const globalLastRasterValue = ref(null);

  const createPopups = () => {
    vectorPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, 20],
      className: 'hover-popup'
    });

    rasterPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20],
      className: 'hover-popup'
    });

    pinnedPopup.value = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: [0, 20],
      className: 'pinned-popup'
    });
  };

  const setupVectorPopupHandlers = (map, config) => {
    if (!map) return null;

    const onMouseMove = (e) => {
      const layerOpacity = map.getPaintProperty('dynamic-layer', 'fill-opacity') || 0;
      if (layerOpacity <= 0) {
        clearHoverState(map);
        return;
      }

      const features = map.queryRenderedFeatures(e.point, { layers: ['dynamic-layer'] });
      if (!features.length) {
        clearHoverState(map);
        return;
      }

      const feat = features[0];
      const featId = feat.id;

      if (featId !== hoveredFeatureId.value) {
        updateHoverState(map, featId);
      }

      const offset = e.point.y < 50 ? [0, 20] : [0, -10];
      vectorPopup.value
        .setLngLat(e.lngLat)
        .setOffset(offset)
        .setHTML(getPopupContent(feat, config))
        .addTo(map);

      map.getCanvas().style.cursor = 'pointer';
    };

    const onMouseLeave = () => {
      clearHoverState(map);
    };

    const onClick = (e) => {
      if (!e.features?.length) return;
      const feat = e.features[0];
      const featId = feat.id;

      if (e.originalEvent.ctrlKey) {
        updatePinnedState(map, featId, e.lngLat, feat, config);
      }
    };

    map.on('mousemove', 'dynamic-layer', onMouseMove);
    map.on('mouseleave', 'dynamic-layer', onMouseLeave);
    map.on('click', 'dynamic-layer', onClick);

    return { onMouseMove, onMouseLeave, onClick };
  };

  const setupRasterPopupHandlers = (map, config, fetchRasterValue) => {
    if (!map) return null;

    let currentRequest = null;
    let debounceTimeout;
    const debounceDelay = 50;

    const onRasterMouseMove = (e) => {
      if (!map.getLayer('dynamic-layer') || map.getLayer('dynamic-layer').type !== 'raster') {
        rasterPopup.value?.remove();
        map.getCanvas().style.cursor = '';
        return;
      }

      const layerOpacity = map.getPaintProperty('dynamic-layer', 'raster-opacity') || 0;
      if (layerOpacity <= 0) {
        rasterPopup.value?.remove();
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
              globalLastRasterValue.value = formatRasterValue(value, config);
            }
            rasterPopup.value
              .setLngLat(e.lngLat)
              .setHTML(getRasterPopupContent(value, config))
              .addTo(map);
          })
          .catch(err => {
            if (err.name !== 'AbortError') console.error(err);
          });
      }, debounceDelay);
    };

    const onRasterMouseClick = (e) => {
      if (!e.originalEvent.ctrlKey) return;
      e.preventDefault();
      pinnedPopup.value
        .setLngLat(e.lngLat)
        .setHTML(getRasterPopupContent(globalLastRasterValue.value, config))
        .addTo(map);
    };

    map.on('mousemove', onRasterMouseMove);
    map.on('click', onRasterMouseClick);

    return { onRasterMouseMove, onRasterMouseClick };
  };

  const removeHandlers = (map, handlers) => {
    if (!map || !handlers) return;

    if (handlers.onMouseMove) {
      map.off('mousemove', 'dynamic-layer', handlers.onMouseMove);
      map.off('mouseleave', 'dynamic-layer', handlers.onMouseLeave);
      map.off('click', 'dynamic-layer', handlers.onClick);
    }

    if (handlers.onRasterMouseMove) {
      map.off('mousemove', handlers.onRasterMouseMove);
      map.off('click', handlers.onRasterMouseClick);
    }

    vectorPopup.value?.remove();
    rasterPopup.value?.remove();
    pinnedPopup.value?.remove();
  };

  // Funções auxiliares
  const clearHoverState = (map) => {
    if (hoveredFeatureId.value !== null) {
      map.setFeatureState(
        { source: 'dynamic-source', id: hoveredFeatureId.value },
        { hover: false }
      );
      hoveredFeatureId.value = null;
    }
    vectorPopup.value?.remove();
    map.getCanvas().style.cursor = '';
  };

  const updateHoverState = (map, featId) => {
    if (hoveredFeatureId.value !== null) {
      map.setFeatureState(
        { source: 'dynamic-source', id: hoveredFeatureId.value },
        { hover: false }
      );
    }
    hoveredFeatureId.value = featId;
    map.setFeatureState(
      { source: 'dynamic-source', id: featId },
      { hover: true }
    );
  };

  const updatePinnedState = (map, featId, lngLat, feat, config) => {
    if (pinnedFeatureId.value !== null) {
      map.setFeatureState(
        { source: 'dynamic-source', id: pinnedFeatureId.value },
        { pinned: false }
      );
    }
    pinnedFeatureId.value = featId;
    map.setFeatureState(
      { source: 'dynamic-source', id: featId },
      { pinned: true }
    );
    pinnedPopup.value
      .setLngLat(lngLat)
      .setHTML(getPopupContent(feat, config))
      .addTo(map);
  };

  const formatRasterValue = (value, config) => {
    // Aplicar multiplier se configurado
    let processedValue = value;
    if (config.popup && config.popup.multiplier) {
      processedValue = Number(value) * config.popup.multiplier;
    }

    if (config.popup && typeof config.popup.format === 'function') {
      return config.popup.format(processedValue);
    }
    return processedValue.toFixed(2) + (config.popup?.unit || '');
  };

  onUnmounted(() => {
    vectorPopup.value?.remove();
    rasterPopup.value?.remove();
    pinnedPopup.value?.remove();
  });

  return {
    createPopups,
    setupVectorPopupHandlers,
    setupRasterPopupHandlers,
    removeHandlers,
    vectorPopup,
    rasterPopup,
    pinnedPopup,
    hoveredFeatureId,
    pinnedFeatureId,
    globalLastRasterValue
  };
} 