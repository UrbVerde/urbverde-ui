<!-- urbverde-ui/src/components/map/mapGenerator.vue -->
<template>
  <div ref="mapContainer" class="map-container">
    <!-- Loading State -->
    <div v-if="isLoadingCoordinates" class="map-loading">
      <p>Carregando mapa...</p>
    </div>

    <!-- Main map -->
    <div class="map-wrapper"></div>

    <!-- All map controls in one component -->
    <MapControls
      v-if="mapLoaded && map"
      :map="map"
      :current-style="currentStyle"
      :terrain-enabled="terrainEnabled"
      @style-change="handleStyleChange"
      @terrain-toggle="handleTerrainToggle"
      @location-found="handleLocationFound"
    />

    <!-- Custom Attribution Bar -->
    <AttributionBar
      v-if="mapLoaded"
      :scale-metric="computedScaleMetric"
      :scale-proportion="computedScaleProportion"
      :coordinates="currentCoordinates"
      :altitude="computedAltitude"
      :map="map"
    />

    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';
import { useRoute, useRouter } from 'vue-router';
import CustomHash from './customHash';
import { getLayerConfig, getLayerPaint } from '@/constants/layers.js';
import MapControls from './controls/MapControls.vue';
import AttributionBar from './AttributionBar.vue';
import CustomTerrainControl from './controls/customTerrainControl';
import { reorderAllLayers } from '@/utils/layersOrder';

const locationStore = useLocationStore();
const layersStore = useLayersStore();
const route = useRoute();
const router = useRouter();

const mapContainer = ref(null);
const map = ref(null);
const customHash = ref(null);

const coordinates = ref(null);
const isLoadingCoordinates = ref(false);
const mapLoaded = ref(false);

// Map style state
const currentStyle = ref('streets');
const terrainEnabled = ref(false);

// Handler functions
function handleStyleChange(isSatellite) {
  console.log('Satellite toggled:', isSatellite);

  // Se o satélite foi ativado, apenas reordena as camadas
  if (isSatellite) {
    reorderAllLayers(map.value);
  }
}

function handleTerrainToggle(enabled) {
  terrainEnabled.value = enabled;
}

function handleLocationFound(coords) {
  // Maybe store the location or update some UI state
  console.log('User location found:', coords);
}

const globalLastRasterValue = ref(null);
const isMouseWithinMunicipality = ref(false);
const isHandlingScaleChange = ref(false);
let globalRasterMouseMove = null;
let globalRasterMouseClick = null;

// Standard popups
const hoverPopup = ref(null);
const pinnedPopup = ref(null);
const rasterPopup = ref(null);

// For managing feature state on vector layers
let hoveredFeatureId = null;
let pinnedFeatureId = null;
let hoveredSetorId = null;

// Map constants
const MAP_ZOOM_START = 12;
const MAP_ZOOM_FINAL = 17;
const MAP_ANIMATION_DURATION = 8000;

// Get current layer id, scale and year from the URL query.
const currentLayer = computed(() => route.query.layer);
const currentScale = computed(() => route.query.scale);
const currentYear = computed(() => route.query.year || '2021');
const currentCode = computed(() => route.query.code);
console.log('currentCode', currentCode);
const initialCode = ref(route.query.code);

watch(
  [
    () => locationStore.cd_mun,
    () => currentLayer.value,
    () => currentScale.value,
    () => currentYear.value, // Add year to the watch array
    () => route.query.code
  ],
  async([newCdMun], [oldCdMun]) => {
    // Only load coordinates if cd_mun changes AND it's a new municipality
    if (newCdMun && newCdMun !== oldCdMun) {
      initialCode.value = route.query.code;
      await loadCoordinates(newCdMun);
    }

    if (mapLoaded.value) {
      removeDynamicLayer();
      await setupDynamicLayer(); // Make this async
    }

    if (map.value.getLayer('selected-municipality-fill')) {
      map.value.setFilter('selected-municipality-fill', ['==', 'cd_mun', locationStore.cd_mun]);
    }
  }
);

/* ---------------------------------------
   HELPER FUNCTIONS
---------------------------------------*/
function removeDynamicLayer() {
  if (!map.value) { return; }

  // Remove event handlers
  removeRasterInteractions();
  removeVectorInteractions();

  // Remove master interaction handler if exists
  if (map.value._masterInteractionHandler) {
    map.value.off('mousemove', map.value._masterInteractionHandler);
    map.value.off('mouseout', map.value._masterOutHandler);
    map.value._masterInteractionHandler = null;
    map.value._masterOutHandler = null;
  }

  // Remove popups
  if (hoverPopup.value) { hoverPopup.value.remove(); }
  if (rasterPopup.value) { rasterPopup.value.remove(); }
  if (pinnedPopup.value) { pinnedPopup.value.remove(); }

  // Reset hover state
  hoveredSetorId = null;

  // Remove event listeners específicos para dynamic-layer
  if (map.value.getLayer('dynamic-layer')) {
    map.value.off('mousemove', 'dynamic-layer');
    map.value.off('mouseleave', 'dynamic-layer');
  }

  // Remove layers
  ['dynamic-layer', 'dynamic-layer-outline', 'parks-layer', 'setores-layer-hover'].forEach(id => {
    if (map.value.getLayer(id)) {
      map.value.removeLayer(id);
    }
  });

  // Remove sources
  ['dynamic-source', 'parks-source', 'setores-source'].forEach(id => {
    if (map.value.getSource(id)) {
      map.value.removeSource(id);
    }
  });

  // Reset state
  hoveredFeatureId = null;
  pinnedFeatureId = null;
  hoveredSetorId = null;
  if (map.value._hoveredParkId) {
    map.value._hoveredParkId = null;
  }
}

function setupDynamicLayer() {
  if (!map.value || !currentLayer.value) { return; }

  // Remove existing layers and handlers
  removeDynamicLayer();

  // Reset hover states
  hoveredFeatureId = null;
  hoveredSetorId = null;
  pinnedFeatureId = null;

  const config = getLayerConfig(currentLayer.value, currentYear.value, currentScale.value);
  if (!config || !config.source) { return; }

  // Clear any existing popups
  if (hoverPopup.value) { hoverPopup.value.remove(); }
  if (rasterPopup.value) { rasterPopup.value.remove(); }
  if (pinnedPopup.value) { pinnedPopup.value.remove(); }

  try {
    const sourceUrl = config.source.tiles[0];
    const urlHasQuery = sourceUrl.includes('?');
    const isVector = config.type !== 'raster';
    const shouldFilter = currentScale.value === 'intraurbana' && locationStore.cd_mun && isVector;

    // Aplica filtro no URL: compara cd_mun como string e como número para clipar municípios
    const filteredUrl = shouldFilter
      ? `${sourceUrl}${urlHasQuery ? '&' : '?'}cql_filter=(cd_mun='${locationStore.cd_mun}' OR cd_mun=${locationStore.cd_mun})`
      : sourceUrl;

    map.value.addSource('dynamic-source', {
      ...config.source,
      tiles: [filteredUrl]
    });

    // Adiciona layer raster
    if (config.type === 'raster') {
      map.value.addLayer({
        id: 'dynamic-layer',
        type: 'raster',
        source: 'dynamic-source',
        paint: config.paint
      });

      if (currentScale.value === 'intraurbana' && currentCode.value) {
        addParksLayer();
      }

      setupRasterInteractions(config);
      reorderAllLayers(map.value);

    } else {
      // Adiciona layer vetorial
      map.value.addLayer({
        id: 'dynamic-layer',
        type: 'fill',
        source: 'dynamic-source',
        'source-layer': config.source.sourceLayer,
        paint: getLayerPaint(config)
      });

      // Filtro local como fallback
      if (shouldFilter) {
        map.value.setFilter('dynamic-layer', [
          'any',
          ['==', ['to-string', ['get', 'cd_mun']], String(locationStore.cd_mun)],
          ['==', ['get', 'cd_mun'], locationStore.cd_mun]
        ]);
      }

      // Adiciona camada de contorno base
      map.value.addLayer({
        id: 'dynamic-layer-outline',
        type: 'line',
        source: 'dynamic-source',
        'source-layer': config.source.sourceLayer,
        paint: {
          'line-color': '#666666',
          'line-width': 1,
          'line-opacity': 0.1
        }
      });

      // Aplicar filtro em ambas as camadas de contorno
      if (shouldFilter) {
        map.value.setFilter('dynamic-layer-outline', ['==', 'cd_mun', locationStore.cd_mun]);
      }

      // Adiciona camada de setores hover se estiver na escala intraurbana e se não for raster
      if (currentScale.value === 'intraurbana' && currentCode.value && config.type !== 'raster') {
        // Adiciona source dos setores
        map.value.addSource('setores-source', {
          type: 'vector',
          tiles: [
            'https://urbverde.iau.usp.br/dados/public.geom_setores/{z}/{x}/{y}.pbf'
          ],
          minzoom: 0,
          maxzoom: 22
        });

        // Adiciona camada de setores para hover
        map.value.addLayer({
          id: 'setores-layer-hover',
          type: 'line',
          source: 'setores-source',
          'source-layer': 'public.geom_setores',
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#495057',  // cor cinza no hover
              'transparent'  // transparente por padrão
            ],
            'line-width': 2,
            'line-opacity': 0.8
          }
        });

        if (shouldFilter) {
          map.value.setFilter('setores-layer-hover', ['==', 'cd_mun', locationStore.cd_mun]);
        }

        // Setup interações dos setores
        map.value.on('mousemove', 'dynamic-layer', (e) => {
          if (e.features.length > 0) {
            if (hoveredSetorId) {
              map.value.setFeatureState(
                { source: 'setores-source', id: hoveredSetorId, sourceLayer: 'public.geom_setores' },
                { hover: false }
              );
            }
            hoveredSetorId = e.features[0].id;
            map.value.setFeatureState(
              { source: 'setores-source', id: hoveredSetorId, sourceLayer: 'public.geom_setores' },
              { hover: true }
            );
          }
        });

        map.value.on('mouseleave', 'dynamic-layer', () => {
          if (hoveredSetorId) {
            map.value.setFeatureState(
              { source: 'setores-source', id: hoveredSetorId, sourceLayer: 'public.geom_setores' },
              { hover: false }
            );
            hoveredSetorId = null;
          }
        });

        // Adiciona camada de parques
        addParksLayer();
      }

      setupVectorInteractions(config);
      reorderAllLayers(map.value);
    }

    setupMasterInteractionHandler(config);
  } catch (error) {
    console.error('Error setting up dynamic layer:', error);
  }
}

// Helper function to add parks layer
function addParksLayer() {
  const parksConfig = getLayerConfig('parks', currentYear.value, currentScale.value, locationStore.cd_mun);
  if (!parksConfig) {return;}

  // Adiciona o source, se ainda não existir
  if (!map.value.getSource('parks-source')) {
    map.value.addSource('parks-source', parksConfig.source);
  }

  // Adiciona a layer, se ainda não existir
  if (!map.value.getLayer('parks-layer')) {
    map.value.addLayer({
      id: 'parks-layer',
      type: 'fill',
      source: 'parks-source',
      'source-layer': parksConfig.source.sourceLayer,
      paint: parksConfig.paint
    });
  }

  // Filtrar pois ainda não funciona cql diretamente no tile
  map.value.setFilter('parks-layer', ['==', 'cd_mun', String(locationStore.cd_mun)]);

  // Reordena Layers
  reorderAllLayers(map.value);
}

// This function sets up a master event handler for interaction priority
function setupMasterInteractionHandler(config) {
  // Remove previous master handler if it exists
  if (map.value._masterInteractionHandler) {
    map.value.off('mousemove', map.value._masterInteractionHandler);
    map.value._masterInteractionHandler = null;
  }

  // Let's create a single handler for mousemove that decides which layer should respond
  const masterHandler = (e) => {
    // First check if we're hovering over parks
    const parksFeatures = map.value.queryRenderedFeatures(e.point, { layers: ['parks-layer'] });

    // Get parks layer opacity
    const parksOpacity = map.value.getPaintProperty('parks-layer', 'fill-opacity') || 0;

    // If we're over parks and parks layer has opacity > 0, show parks popup
    if (parksFeatures.length > 0 && parksOpacity > 0) {
      // Disable other layers hover states
      if (hoveredFeatureId) {
        map.value.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
      }

      // Handle parks hover specifically
      const feat = parksFeatures[0];
      const featId = feat.id;

      // Set hover state on parks feature
      const hoveredParkId = map.value._hoveredParkId;

      if (hoveredParkId !== featId) {
        if (hoveredParkId) {
          map.value.setFeatureState(
            { source: 'parks-source', id: hoveredParkId, sourceLayer: 'public.geom_pracas' },
            { hover: false }
          );
        }

        map.value.setFeatureState(
          { source: 'parks-source', id: featId, sourceLayer: 'public.geom_pracas' },
          { hover: true }
        );

        map.value._hoveredParkId = featId;
      }

      // Show parks popup
      hoverPopup.value
        .setLngLat(e.lngLat)
        .setHTML(`<div style="font-family: system-ui; padding: 8px;">
        <strong>${feat.properties.nm_praca || 'Área sem nome'}</strong>
        <br>
        Área: ${(feat.properties.aream2 || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²
      </div>`)
        .addTo(map.value);

      map.value.getCanvas().style.cursor = 'pointer';

      // Stop propagation - don't let other handlers run
      return;
    }

    // If we're not over parks or parks opacity is 0, check dynamic layer
    const dynamicLayerId = config.type === 'raster' ? 'dynamic-layer' : 'dynamic-layer';
    const dynamicOpacityProp = config.type === 'raster' ? 'raster-opacity' : 'fill-opacity';
    const dynamicOpacity = map.value.getPaintProperty(dynamicLayerId, dynamicOpacityProp) || 0;

    // Remove parks hover if it was active
    if (map.value._hoveredParkId) {
      map.value.setFeatureState(
        { source: 'parks-source', id: map.value._hoveredParkId, sourceLayer: 'public.geom_pracas' },
        { hover: false }
      );
      map.value._hoveredParkId = null;
    }

    // If dynamic layer has opacity <= 0, remove all hover effects
    if (dynamicOpacity <= 0) {
      if (hoveredFeatureId) {
        map.value.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
      }

      hoverPopup.value.remove();
      map.value.getCanvas().style.cursor = '';

      return;
    }

    // Default to the original handlers for the layer type
    if (config.type === 'raster') {
      // Call the existing raster mousemove handler directly
      if (globalRasterMouseMove) {
        globalRasterMouseMove(e);
      }
    } else {
      // For vector layers, check features and handle hover
      const features = map.value.queryRenderedFeatures(e.point, { layers: ['dynamic-layer'] });

      if (!features.length) {
        if (hoveredFeatureId !== null) {
          map.value.setFeatureState(
            { source: 'dynamic-source', id: hoveredFeatureId },
            { hover: false }
          );
          hoveredFeatureId = null;
          hoverPopup.value.remove();
          map.value.getCanvas().style.cursor = '';
        }

        return;
      }

      const feat = features[0];
      const featId = feat.id;

      if (featId !== hoveredFeatureId) {
        if (hoveredFeatureId !== null) {
          map.value.setFeatureState(
            { source: 'dynamic-source', id: hoveredFeatureId },
            { hover: false }
          );
        }
        hoveredFeatureId = featId;
        map.value.setFeatureState(
          { source: 'dynamic-source', id: featId },
          { hover: true }
        );
      }

      const offset = e.point.y < 50 ? [0, 20] : [0, -10];
      hoverPopup.value
        .setLngLat(e.lngLat)
        .setOffset(offset)
        .setHTML(getPopupContent(feat, config))
        .addTo(map.value);

      map.value.getCanvas().style.cursor = 'pointer';
    }
  };

  // Store the handler so we can remove it later
  map.value._masterInteractionHandler = masterHandler;

  // Add the master handler
  map.value.on('mousemove', masterHandler);

  // Handle mouseleave for the entire map
  const masterOutHandler = () => {
    // Clear all hover states
    if (hoveredFeatureId) {
      map.value.setFeatureState(
        { source: 'dynamic-source', id: hoveredFeatureId },
        { hover: false }
      );
      hoveredFeatureId = null;
    }

    if (map.value._hoveredParkId) {
      map.value.setFeatureState(
        { source: 'parks-source', id: map.value._hoveredParkId, sourceLayer: 'public.geom_pracas' },
        { hover: false }
      );
      map.value._hoveredParkId = null;
    }

    hoverPopup.value.remove();
    if (rasterPopup.value) {
      rasterPopup.value.remove();
    }
    map.value.getCanvas().style.cursor = '';
  };

  map.value._masterOutHandler = masterOutHandler;
  map.value.on('mouseout', masterOutHandler);
}

function getPopupContent(feat, config) {
  let rawValue = feat.properties[config.property];
  if (rawValue === undefined || rawValue === null) {
    rawValue = 'N/A';
  } else {
    // If a multiplier is defined, multiply the raw value
    if (config.popup && config.popup.multiplier) {
      rawValue = Number(rawValue) * config.popup.multiplier;
    }
    // If a custom format function is provided, use it
    if (config.popup && typeof config.popup.format === 'function') {
      rawValue = config.popup.format(rawValue);
    } else {
      rawValue = Number(rawValue).toFixed(2);
    }
  }
  // For "escala estadual" add the municipality name (if available)
  let prefix = '';
  if ((currentScale.value === 'estadual' || currentScale.value === 'municipal') && feat.properties.nm_mun) {
    prefix = `<span style="font-size: 1.2em; font-weight: bold;">${feat.properties.nm_mun}</span><br>`;
  }

  return `
    <div style="font-family: system-ui; padding: 8px;">
      <p>${prefix}${config.label}:<br><strong>${rawValue} ${config.unit || ''}</strong></p>
    </div>
  `;
}

function setupRasterInteractions(config) {
  if (!map.value) { return; }

  if (!rasterPopup.value) {
    rasterPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20],
      className: 'hover-popup',
      trackPointer: true
    });
  }

  let currentRequest = null;
  let debounceTimeout;
  const debounceDelay = 50;

  const onRasterMouseMove = (e) => {
    // First check if the layer is visible and has opacity > 0
    const layerOpacity = map.value.getPaintProperty('dynamic-layer', 'raster-opacity') || 0;
    if (layerOpacity <= 0) {
      // If opacity is 0, don't show popup or cursor change
      if (rasterPopup.value) {
        rasterPopup.value.remove();
      }
      map.value.getCanvas().style.cursor = '';

      return;
    }
    // Query for municipality features if desired
    const features = map.value.queryRenderedFeatures(e.point, { layers: ['municipalities-base'] });
    isMouseWithinMunicipality.value = features.length > 0;
    if (!isMouseWithinMunicipality.value) {
      // Optionally hide the popup if not over a municipality:
      return;
    }

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
            // Use the format function if available; update our ref.
            if (config.popup && typeof config.popup.format === 'function') {
              globalLastRasterValue.value = config.popup.format(value);
            } else {
              globalLastRasterValue.value = value.toFixed(2) + (config.popup?.unit || '');
            }
          }
          rasterPopup.value
            .setLngLat(e.lngLat)
            .setHTML(
              `<div class="popup-content">${config.popup?.label || 'Valor'}:<br><strong>${globalLastRasterValue.value || 'N/A'}</strong></div>`
            )
            .addTo(map.value);
        })
        .catch(err => {
          if (err.name !== 'AbortError') { console.error(err); }
        });
    }, debounceDelay);
  };

  const onRasterMouseClick = (e) => {
    if (!e.originalEvent.ctrlKey) { return; }
    e.preventDefault();
    pinnedPopup.value
      .setLngLat(e.lngLat)
      .setHTML(
        `<div class="popup-content">${config.popup?.label || 'Valor'}:<br><strong>${globalLastRasterValue.value || 'N/A'}</strong></div>`
      )
      .addTo(map.value);
  };

  // Store these handlers in global variables for later removal
  globalRasterMouseMove = onRasterMouseMove;
  globalRasterMouseClick = onRasterMouseClick;

  map.value.on('mousemove', onRasterMouseMove);
  map.value.on('click', onRasterMouseClick);
}

function removeRasterInteractions() {
  if (!map.value) { return; }
  if (globalRasterMouseMove) {
    map.value.off('mousemove', globalRasterMouseMove);
    globalRasterMouseMove = null;
  }
  if (globalRasterMouseClick) {
    map.value.off('click', globalRasterMouseClick);
    globalRasterMouseClick = null;
  }
}

function removeVectorInteractions() {
  if (!map.value) { return; }
  map.value.off('mousemove', 'dynamic-layer');
  map.value.off('mouseleave', 'dynamic-layer');
  map.value.off('click', 'dynamic-layer');
}

function setupVectorInteractions(config) {
  if (!map.value) { return; }
  map.value.on('mousemove', 'dynamic-layer', onVectorMouseMove);
  map.value.on('mouseleave', 'dynamic-layer', onVectorMouseLeave);
  map.value.on('click', 'dynamic-layer', onVectorClick);

  function onVectorMouseMove(e) {
    // First check if the layer is visible and has opacity > 0
    const layerOpacity = map.value.getPaintProperty('dynamic-layer', 'fill-opacity') || 0;
    if (layerOpacity <= 0) {
      // If opacity is 0, don't show popup or cursor change
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
        hoverPopup.value.remove();
      }
      map.value.getCanvas().style.cursor = '';

      return;
    }
    if (!e.features?.length) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
        hoverPopup.value.remove();
      }

      return;
    }
    const feat = e.features[0];
    const featId = feat.id;
    if (featId !== hoveredFeatureId) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'dynamic-source', id: hoveredFeatureId },
          { hover: false }
        );
      }
      hoveredFeatureId = featId;
      map.value.setFeatureState(
        { source: 'dynamic-source', id: featId },
        { hover: true }
      );
    }
    const offset = e.point.y < 50 ? [0, 20] : [0, -10];
    hoverPopup.value
      .setLngLat(e.lngLat)
      .setOffset(offset)
      .setHTML(getPopupContent(feat, config))
      .addTo(map.value);
    map.value.getCanvas().style.cursor = 'pointer';
  }

  function onVectorMouseLeave() {
    if (hoveredFeatureId !== null) {
      map.value.setFeatureState(
        { source: 'dynamic-source', id: hoveredFeatureId },
        { hover: false }
      );
      hoveredFeatureId = null;
    }
    hoverPopup.value.remove();
    map.value.getCanvas().style.cursor = '';
  }

  function onVectorClick(e) {
    if (!e.features?.length) { return; }
    const feat = e.features[0];
    const featId = feat.id;
    if (e.originalEvent.ctrlKey) {
      if (pinnedFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'dynamic-source', id: pinnedFeatureId },
          { pinned: false }
        );
      }
      pinnedFeatureId = featId;
      map.value.setFeatureState(
        { source: 'dynamic-source', id: featId },
        { pinned: true }
      );
      pinnedPopup.value
        .setLngLat(e.lngLat)
        .setHTML(getPopupContent(feat, config))
        .addTo(map.value);
    } else {
      // (Optionally) you might change the locationStore or trigger other behavior here.
    }
  }
}

/**
 * Fetches the raster value from the WMS.
 */
async function fetchRasterValue(lng, lat, controller) {
  const bboxSize = 0.0001;
  const ts = Date.now();
  let url;
  if (currentLayer.value === 'ndvi') {
    url = `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetFeatureInfo&layers=urbverde:NDVI-10m-${currentYear.value}&bbox=${lng - bboxSize},${lat - bboxSize},${lng + bboxSize},${lat + bboxSize}&width=101&height=101&srs=EPSG:4326&format=application/json&_ts=${ts}`;
  } else {
    url = 'https://urbverde.iau.usp.br/geoserver/urbverde/wms?' +
      'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&' +
      'LAYERS=urbverde:tst-intraurbana-rel-30m-2021a2016&' +
      'QUERY_LAYERS=urbverde:tst-intraurbana-rel-30m-2021a2016&' +
      'INFO_FORMAT=application/json&FEATURE_COUNT=1&X=50&Y=50&' +
      `SRS=EPSG:4326&WIDTH=101&HEIGHT=101&_ts=${ts}&` +
      `BBOX=${lng - bboxSize},${lat - bboxSize},${lng + bboxSize},${lat + bboxSize}`;
  }
  try {
    const response = await fetch(url, { signal: controller.signal });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error('Expected JSON but got:', contentType);

      return null;
    }
    const data = await response.json();
    if (currentLayer.value === 'ndvi') {
      if (data?.features?.[0]?.properties?.NDVI !== undefined) {
        const val = data.features[0].properties.NDVI;

        return val !== null ? Number(val) : null;
      }
    } else {
      if (data?.features?.[0]?.properties?.GRAY_INDEX !== undefined) {
        const val = data.features[0].properties.GRAY_INDEX;

        return val !== null ? Number(val) : null;
      }
    }
  } catch (error) {
    console.error('Error in fetchRasterValue:', error);

    return null;
  }

  return null;
}

/* ---------------------------------------
   CORE FUNCTIONS
---------------------------------------*/

/** Load city coordinates and initialize or fly the map. */
async function loadCoordinates(code) {
  isLoadingCoordinates.value = true;
  isHandlingScaleChange.value = true;

  try {
    const currentHash = window.location.hash;

    // Clear municipality hover state if it exists
    if (hoveredFeatureId) {
      map.value.setFeatureState(
        {
          source: 'base-municipalities',
          id: hoveredFeatureId,
          sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}`
        },
        { hover: false }
      );
      hoveredFeatureId = null;
    }

    // Remove any existing popups
    if (hoverPopup.value) { hoverPopup.value.remove(); }

    // Set scale and trigger layer setup
    await locationStore.setLocation({ scale: 'intraurbana' });
    if (mapLoaded.value) {
      removeDynamicLayer();
      await setupDynamicLayer();
    }

    const coords = await locationStore.fetchCoordinatesByCode(code);
    if (coords?.lat && coords?.lng) {
      coordinates.value = coords;

      router.replace({
        query: {
          ...route.query,
          scale: 'intraurbana',
          lng: coords.lng,
          lat: coords.lat
        },
        hash: currentHash
      });

      if (map.value) {
        map.value.flyTo({
          center: [coords.lng, coords.lat],
          zoom: MAP_ZOOM_FINAL,
          duration: MAP_ANIMATION_DURATION,
          essential: true
        });
      } else {
        initializeMap();
      }
    }
  } catch (err) {
    console.error('Error loading coords:', err);
  } finally {
    isLoadingCoordinates.value = false;
    setTimeout(() => {
      isHandlingScaleChange.value = false;
    }, MAP_ANIMATION_DURATION + 100);
  }
}

/* ---------------------------------------
   MAP INITIALIZATION
---------------------------------------*/
/** Initialize the map (if not already created). */
function initializeMap() {
  if (!coordinates.value) { return; }

  // Reset hover state
  hoveredSetorId = null;
  hoveredFeatureId = null;
  pinnedFeatureId = null;

  let initialState = {
    center: [coordinates.value.lng, coordinates.value.lat],
    zoom: MAP_ZOOM_START,
    pitch: 20
  };
  const hash = window.location.hash.slice(1);
  if (hash) {
    const match = hash.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
    if (match) {
      initialState = {
        center: [parseFloat(match[2]), parseFloat(match[1])],
        zoom: parseFloat(match[3]),
        pitch: 20
      };
    }
  }
  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
    ...initialState,
    attributionControl: false,
  });

  layersStore.mapRef = map.value;

  map.value.addControl(
    new maplibregl.NavigationControl({
      visualizePitch: true,
    }), 'top-left');

  map.value.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true
    }),
    'top-left'
  );

  map.value.addControl(
    new CustomTerrainControl({
      source: 'terrain',
      exaggeration: 3,
      highPerformance: false,
      lazyLoading: true
    }), 'top-left'
  );

  customHash.value = new CustomHash();
  customHash.value.addTo(map.value);
  map.value.on('styleimagemissing', handleMissingImage);
  map.value.on('zoomend', () => {
    isHandlingScaleChange.value = false;

    const newScale = getScaleFromZoom(map.value.getZoom());
    if (locationStore.scale !== newScale) {
      const currentHash = window.location.hash.slice(1); // Remove # symbol
      locationStore.setLocation({ scale: newScale });
      router.replace({
        query: { ...route.query, scale: newScale },
        hash: currentHash // Don't slice here
      });

    }
  });
  map.value.on('load', () => {
    mapLoaded.value = true;
    hoverPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      trackPointer: true,
      offset: { top: [0, 20], bottom: [0, -20] },
      className: 'hover-popup'
    });
    pinnedPopup.value = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: { top: [0, 20], bottom: [0, -20] },
      className: 'pinned-popup'
    });

    addBaseMunicipalitiesLayer();
    setupDynamicLayer();
    if (!hash) {
      map.value.flyTo({
        center: [coordinates.value.lng, coordinates.value.lat],
        zoom: MAP_ZOOM_FINAL,
        duration: MAP_ANIMATION_DURATION,
        essential: true
      });
    }
  });
}

/** Add municipality outline, click and move effects - ONLY SP STATE */
function addBaseMunicipalitiesLayer() {
  if (!map.value) { return; }

  map.value.addSource('base-municipalities', {
    type: 'vector',
    tiles: [
      `https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_${currentYear.value}/{z}/{x}/{y}.pbf`
    ],
    minzoom: 0,
    maxzoom: 22
  });

  // Camada de preenchimento do município selecionado
  map.value.addLayer({
    id: 'selected-municipality-fill',
    type: 'line',
    source: 'base-municipalities',
    'source-layer': `public.geodata_temperatura_por_municipio_${currentYear.value}`,
    paint: {
      'line-color': '#212529',
      'line-opacity': 1,
      'line-width' : 3
    },
    filter: ['==', 'cd_mun', locationStore.cd_mun]
  });

  // Camada de preenchimento estadual - sem efeito de hover
  map.value.addLayer({
    id: 'municipalities-base',
    type: 'fill',
    source: 'base-municipalities',
    'source-layer': `public.geodata_temperatura_por_municipio_${currentYear.value}`,
    paint: {
      'fill-color': 'transparent',  // Sempre transparente
      'fill-opacity': 1
    }
  });

  // Camada de contorno estadual - com efeito de hover
  map.value.addLayer({
    id: 'municipalities-base-outline',
    type: 'line',
    source: 'base-municipalities',
    'source-layer': `public.geodata_temperatura_por_municipio_${currentYear.value}`,
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#86919B',  // Cor cinza no hover
        '#ADB5BD'      // Cor cinza por padrão
      ],
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        3,         // Largura da linha durante o hover (3px)
        1           // Largura da linha padrão
      ]
    }
  })
  ;

  // Events
  map.value.on('mousemove', 'municipalities-base', handleMunicipalityMouseMove);
  map.value.on('mouseleave', 'municipalities-base', handleMunicipalityMouseLeave);
  map.value.on('click', 'municipalities-base', handleMunicipalityClick);
}

function handleMunicipalityMouseMove(e) {
  const features = e.features;
  if (!features?.length) {
    clearHoveredState();

    return;
  }

  const feat = features[0];
  const featId = feat.id || feat.properties.cd_mun;

  // Se estamos na escala intraurbana e este é o município atual, não fazemos nada
  if (currentScale.value === 'intraurbana' && feat.properties.cd_mun === locationStore.cd_mun) {
    clearHoveredState();

    return;
  }

  // Caso contrário, prossiga com o comportamento normal de hover
  if (featId !== hoveredFeatureId) {
    clearHoveredState();
    setHoveredState(featId);
  }

}

function clearHoveredState() {
  if (hoveredFeatureId !== null) {
    map.value.setFeatureState(
      {
        source: 'base-municipalities',
        id: hoveredFeatureId,
        sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}`
      },
      { hover: false }
    );
    hoveredFeatureId = null;
  }
}

function setHoveredState(featureId) {
  hoveredFeatureId = featureId;
  map.value.setFeatureState(
    {
      source: 'base-municipalities',
      id: featureId,
      sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}`
    },
    { hover: true }
  );
}

function handleMunicipalityMouseLeave() {
  if (!map.value) { return; }
  clearHoveredState();
}

function handleMunicipalityClick(e) {
  if (!map.value || !e.features?.length) { return; }

  const feat = e.features[0];

  if (feat.properties.cd_mun !== locationStore.cd_mun) {
    // Atualiza o locationStore com o novo município e define a escala como 'intraurbana'
    locationStore.setLocation({
      cd_mun: feat.properties.cd_mun,
      scale: 'intraurbana'
    });
  }
}

function handleMissingImage(e) {
  const imageId = e.id?.trim();
  if (!imageId) { return; }
  if (!map.value.hasImage(imageId)) {
    const placeholder = { width: 1, height: 1, data: new Uint8Array(4).fill(0) };
    map.value.addImage(imageId, placeholder);
  }
}

/**
 * Update the "scale" based on zoom.
 */
function getScaleFromZoom(zoom) {
  if (zoom >= 12) { return 'intraurbana'; }
  else if (zoom >= 6) { return 'municipal'; }
  else if (zoom > 3) { return 'estadual'; }
  else { return 'nacional'; }
}

/* ---------------------------------------
   LIFECYCLE
---------------------------------------*/
onMounted(() => {
  if (locationStore.cd_mun) {
    loadCoordinates(locationStore.cd_mun);
  }
  // Set map reference in store
  layersStore.mapRef = map.value;
});
onBeforeUnmount(() => {
  if (map.value) {
    if (customHash.value) { customHash.value.remove(); }
    setTimeout(() => { map.value.remove(); }, 300);
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  border-radius: 15px;
  background: #F8F9FA;
  cursor: pointer;
  height: 100%;
}

.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
}

.maplibregl-popup {
  z-index: 999999 !important;
}

/* Enforce popup background color */
.maplibregl-popup .maplibregl-popup-content {
  background: #E6F1F2 !important;
  border-radius: 4px;
  padding: 8px;
  font-family: system-ui, -apple-system, sans-serif;
}

.maplibregl-ctrl-geolocate button.active {
  background-color: blue !important;
  color: white;
}

.popup-content {
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
}
</style>
