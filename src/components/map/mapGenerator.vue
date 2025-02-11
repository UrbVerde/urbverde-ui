<!-- urbverde-ui/src/components/map/mapGenerator.vue -->
<template>
  <div ref="mapContainer" class="map-container">
    <!-- Loading State -->
    <div v-if="isLoadingCoordinates" class="map-loading">
      <p>Carregando mapa...</p>
    </div>
    <!-- Main map -->
    <div class="map-wrapper"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import { useLocationStore } from '@/stores/locationStore';
import { useRoute, useRouter } from 'vue-router';
import CustomHash from './customHash';
import { getLayerConfig, getLayerPaint } from '@/constants/layers.js';

const locationStore = useLocationStore();
const route = useRoute();
const router = useRouter();

const mapContainer = ref(null);
const map = ref(null);
const customHash = ref(null);

const coordinates = ref(null);
const isLoadingCoordinates = ref(false);
const mapLoaded = ref(false);

const globalLastRasterValue = ref(null);
const isMouseWithinMunicipality = ref(false);

let globalRasterMouseMove = null;
let globalRasterMouseClick = null;

// Standard popups
const hoverPopup = ref(null);
const pinnedPopup = ref(null);
const rasterPopup = ref(null);

// For managing feature state on vector layers
let hoveredFeatureId = null;
let pinnedFeatureId = null;

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
  () => locationStore.cd_mun, (newVal) => {
    if (newVal) {
      initialCode.value = route.query.code;
      loadCoordinates(newVal);
    }
  });

watch(
  () => [currentLayer.value, route.query.code],
  () => {
    if (mapLoaded.value) {
      removeDynamicLayer();
      setupDynamicLayer();
    }
  }
);

/* ---------------------------------------
   HELPER FUNCTIONS
---------------------------------------*/
function removeDynamicLayer() {
  const dynamicLayerIds = ['dynamic-layer', 'dynamic-layer-outline'];
  dynamicLayerIds.forEach(id => {
    if (map.value.getLayer(id)) {
      map.value.removeLayer(id);
    }
  });
  if (map.value.getSource('dynamic-source')) {
    map.value.removeSource('dynamic-source');
  }
  removeRasterInteractions();
  removeVectorInteractions();
}

function setupDynamicLayer() {
  const layerId = currentLayer.value;
  // Get the configuration from layers.js (this function will call the source function if needed)
  const config = getLayerConfig(layerId, currentYear.value, currentScale.value);
  console.log('Layer config:', config);
  if (!config) {return;}

  // For a raster layer, simply add the source and layer using the provided config.
  if (config.type === 'raster') {
    map.value.addSource('dynamic-source', config.source);
    map.value.addLayer({
      id: 'dynamic-layer',
      type: 'raster',
      source: 'dynamic-source',
      paint: config.paint
    });
    setupRasterInteractions(config);
  }
  // For vector layers, add a fill layer (with interactive styling) and an outline layer.
  else if (config.type === 'vector') {
    if (config && config.source && config.source.type) {
      map.value.addSource('dynamic-source', config.source);
    } else {
      console.error('Invalid layer config:', config);

      return;
    }
    map.value.addLayer({
      id: 'dynamic-layer',
      type: 'fill',
      source: 'dynamic-source',
      'source-layer': config.source.sourceLayer,
      paint: getLayerPaint(config)
    });
    map.value.addLayer({
      id: 'dynamic-layer-outline',
      type: 'line',
      source: 'dynamic-source',
      'source-layer': config.source.sourceLayer,
      paint: getOutlinePaint(config)
    });
    setupVectorInteractions(config);
  }
  bringBasemapLabelsToFront();
}

function getOutlinePaint(config) {
  return {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'pinned'], false],
      '#2c46f4',
      ['boolean', ['feature-state', 'hover'], false],
      '#7c99f4',
      ['interpolate', ['linear'], ['get', config.property], ...config.stops.flat()]
    ],
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'pinned'], false],
      4,
      ['boolean', ['feature-state', 'hover'], false],
      3,
      1.5
    ]
  };
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
  if (!map.value) {return;}

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
          if (err.name !== 'AbortError') {console.error(err);}
        });
    }, debounceDelay);
  };

  const onRasterMouseClick = (e) => {
    if (!e.originalEvent.ctrlKey) {return;}
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
  if (!map.value) {return;}
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
  map.value.off('mousemove', 'dynamic-layer');
  map.value.off('mouseleave', 'dynamic-layer');
  map.value.off('click', 'dynamic-layer');
}

function setupVectorInteractions(config) {
  if (!map.value) {return;}
  map.value.on('mousemove', 'dynamic-layer', onVectorMouseMove);
  map.value.on('mouseleave', 'dynamic-layer', onVectorMouseLeave);
  map.value.on('click', 'dynamic-layer', onVectorClick);

  function onVectorMouseMove(e) {
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
    if (!e.features?.length) {return;}
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

/**
 * Brings basemap label layers (symbols) to the front.
 */
function bringBasemapLabelsToFront() {
  const layers = map.value.getStyle().layers || [];
  layers.forEach(layer => {
    if (layer.type === 'symbol') {
      map.value.moveLayer(layer.id);
    }
  });
}

/* ---------------------------------------
   CORE FUNCTIONS
---------------------------------------*/

/** Load city coordinates and initialize or fly the map. */
async function loadCoordinates(code) {
  isLoadingCoordinates.value = true;
  try {
    const coords = await locationStore.fetchCoordinatesByCode(code);
    if (coords?.lat && coords?.lng) {
      coordinates.value = coords;
      // Calculate the expected scale based on the intended flyTo zoom
      const expectedZoom = MAP_ZOOM_FINAL; // e.g. 17
      const expectedScale = getScaleFromZoom(expectedZoom);

      // Update URL query parameters and the Pinia store BEFORE the flyTo motion
      router.replace({
        query: {
          ...route.query,
          scale: expectedScale,
          lng: coords.lng,
          lat: coords.lat
        }
      });
      locationStore.setLocation({ scale: expectedScale });

      if (map.value) {
        map.value.flyTo({
          center: [coords.lng, coords.lat],
          zoom: expectedZoom,
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
  }
}

/** Enable raster measurement events for the 'surface_temp' layer. */
// function enableRasterMeasurement() {
//   if (!map.value || currentLayer.value !== 'surface_temp') { return; }
//   // Remove any vector-layer click events.
//   map.value.off('click', 'vector-layer');

//   if (!rasterPopup.value) {
//     rasterPopup.value = new maplibregl.Popup({
//       closeButton: false,
//       closeOnClick: false,
//       offset: { top: [0, 0], bottom: [0, -5] },
//       className: 'hover-popup',
//       trackPointer: true
//     });
//   }
//   let currentRequest = null;
//   let rasterRequestId = 0;

//   const mousemoveHandler = (e) => {
//     if (currentLayer.value !== 'surface_temp') {
//       rasterPopup.value.remove();

//       return;
//     }
//     const features = map.value.queryRenderedFeatures(e.point, { layers: ['municipalities-base'] });
//     isMouseWithinMunicipality.value = features.length > 0;
//     if (!isMouseWithinMunicipality.value) {
//       rasterPopup.value.remove();

//       return;
//     }
//     // Clear any previously held content.
//     rasterPopup.value.setLngLat(e.lngLat).setHTML('')
//       .addTo(map.value);

//     rasterRequestId++;
//     const thisRequestId = rasterRequestId;
//     if (currentRequest) { currentRequest.abort(); }
//     const controller = new AbortController();
//     currentRequest = controller;
//     const { lng, lat } = e.lngLat;
//     requestAnimationFrame(() => {
//       fetchRasterValue(lng, lat, controller)
//         .then(value => {
//           if (currentLayer.value !== 'surface_temp' || thisRequestId !== rasterRequestId) { return; }
//           if (value) {
//             rasterPopup.value.setHTML(`<div class="popup-content">Temperatura Relativa:<br><strong>${value}</strong></div>`);
//           } else {
//             rasterPopup.value.remove();
//           }
//         })
//         .catch(err => {
//           // Optionally check if err.name === 'AbortError' and ignore it
//           if (err.name !== 'AbortError') {
//             console.error(err);
//           }
//         });
//     });
//   };

//   const clickHandler = async(e) => {
//     if (!e.originalEvent.ctrlKey || currentLayer.value !== 'surface_temp') { return; }
//     e.originalEvent.stopPropagation();
//     e.preventDefault();
//     const features = map.value.queryRenderedFeatures(e.point, { layers: ['municipalities-base'] });
//     if (!features.length) { return; }
//     const { lng, lat } = e.lngLat;

//     const value = await fetchRasterValue(lng, lat, new AbortController());
//     if (currentLayer.value !== 'surface_temp') { return; }
//     if (value) {
//       pinnedPopup.value
//         .setLngLat(e.lngLat)
//         .setHTML(`<div class="popup-content">Temperatura Relativa:<br><strong>${value}</strong></div>`)
//         .addTo(map.value);
//     }

//   };

//   map.value.on('mousemove', mousemoveHandler);
//   map.value.on('click', clickHandler);
//   map.value.on('mouseout', () => {
//     rasterPopup.value.remove();
//     if (currentRequest) {
//       currentRequest.abort();
//       currentRequest = null;
//     }
//   });
// }

/* ---------------------------------------
   BASEMAPS
---------------------------------------*/
/**
 * A list of custom base-map styles (MapTiler, or your own).
 * Replace these with any style endpoints you want:
 * - For example, from https://cloud.maptiler.com/maps
 * - Or from Mapbox, or from your own tile server
 */
// const baseMaps = [
//   {
//     id: 'streets',
//     name: 'Streets',
//     styleURL: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
//     thumbnail: 'https://cloud.maptiler.com/static/img/maps/streets.png'
//   },
//   {
//     id: 'satellite',
//     name: 'Satellite',
//     styleURL: 'https://api.maptiler.com/maps/92fa6478-03bb-44cc-897a-fe5411f52e99/style.json?key=eizpVHFsrBDeO6HGwWvQ"',
//     thumbnail: 'https://cloud.maptiler.com/static/img/maps/hybrid.png'
//   },
// ];

/* ---------------------------------------
   MAP INITIALIZATION
---------------------------------------*/
/** Initialize the map (if not already created). */
function initializeMap() {
  if (!coordinates.value) {return;}
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
    style:
      'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
    ...initialState,
    attributionControl: false
  });
  map.value.addControl(
    new maplibregl.NavigationControl({
      visualizePitch: true,
      // showZoom: true,
      // showCompass: true
    }), 'top-left');
  map.value.addControl(
    new maplibregl.ScaleControl({
      maxWidth: 120,
      unit: 'metric',
    }), 'bottom-left'
  );
  map.value.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: false, // or true, if you want continuous tracking
      showUserLocation: true
    }),
    'top-left'
  );
  // map.value.addSource('terrain', {
  //   type: 'raster-dem',
  //   url: 'https://api.maptiler.com/maps/basic-v2/style.json?key=eizpVHFsrBDeO6HGwWvQ',
  //   tileSize: 512,        // or 256 if you prefer
  //   maxzoom: 14           // depends on your DEM source
  // });
  map.value.addControl(
    new maplibregl.TerrainControl({
      source: 'terrain',
      exaggeration: 6,
    }), 'top-left'
  );

  customHash.value = new CustomHash();
  customHash.value.addTo(map.value);
  map.value.on('styleimagemissing', handleMissingImage);
  map.value.on('zoomend', () => {
    updateScaleBasedOnZoom(map.value.getZoom());
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
    bringBasemapLabelsToFront();
  });
}

/** Add municipality base layer and its outline. */
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
  map.value.addLayer({
    id: 'municipalities-base',
    type: 'fill',
    source: 'base-municipalities',
    'source-layer': `public.geodata_temperatura_por_municipio_${currentYear.value}`,
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        'rgba(124,153,244,0.3)',
        ['boolean', ['feature-state', 'hover'], false],
        'rgba(124,153,244,0.2)',
        'rgba(0,0,0,0)'
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        0.9,
        ['boolean', ['feature-state', 'hover'], false],
        0.6,
        0.1
      ]
    }
  });
  map.value.addLayer({
    id: 'municipalities-base-outline',
    type: 'line',
    source: 'base-municipalities',
    'source-layer': `public.geodata_temperatura_por_municipio_${currentYear.value}`,
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        '#2c46f4',
        ['boolean', ['feature-state', 'hover'], false],
        '#7c99f4',
        ['interpolate', ['linear'], ['get', 'c3'],
          27, '#3288bd',
          32, '#99d594',
          37, '#e6f598',
          42, '#fee08b',
          47, '#fc8d59',
          52, '#d53e4f'
        ]
      ],
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        4,
        ['boolean', ['feature-state', 'hover'], false],
        3,
        1.5
      ]
    }
  });
  // const currentCdMun = locationStore.cd_mun; // current municipality from the store

  // Mouse move: show hover popup only if the feature is not the current municipality
  map.value.on('mousemove', 'municipalities-base', (e) => {
    const features = e.features;
    if (!features?.length) {
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
        hoverPopup.value.remove();
        map.value.getCanvas().style.cursor = '';
      }

      return;
    }
    const feat = features[0];
    const featId = feat.id || feat.properties.cd_mun;
    // If we're at intraurbana scale and this feature is the current municipality, do nothing
    if (currentScale.value === 'intraurbana' && feat.properties.cd_mun === locationStore.cd_mun) {
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
      hoverPopup.value.remove();
      map.value.getCanvas().style.cursor = '';

      return; // Skip further handling (no hover popup for current mun)
    }

    // Otherwise, proceed with the normal hover behavior:
    if (featId !== hoveredFeatureId) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          {
            source: 'base-municipalities',
            id: hoveredFeatureId,
            sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}`
          },
          { hover: false }
        );
      }
      hoveredFeatureId = featId;
      map.value.setFeatureState(
        {
          source: 'base-municipalities',
          id: featId,
          sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}`
        },
        { hover: true }
      );
    }
    const offset = e.point.y < 50 ? [0, 20] : [0, -10];
    hoverPopup.value
      .setLngLat(e.lngLat)
      .setOffset(offset)
      .setHTML(`<div style="font-family: system-ui; padding: 8px;"><strong>${feat.properties.nm_mun}</strong></div>`)
      .addTo(map.value);
    map.value.getCanvas().style.cursor = 'pointer';
  });
  map.value.on('mouseleave', 'municipalities-base', () => {
    if (!map.value) { return; }
    if (hoveredFeatureId !== null) {
      map.value.setFeatureState(
        { source: 'base-municipalities', id: hoveredFeatureId, sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}` },
        { hover: false }
      );
      hoveredFeatureId = null;
    }
    hoverPopup.value.remove();
    map.value.getCanvas().style.cursor = '';
  });
  map.value.on('click', 'municipalities-base', (e) => {
    if (!map.value || !e.features?.length) { return; }
    const feat = e.features[0];
    const featId = feat.id || feat.properties.cd_mun;
    // For ctrl+click (pinned popup) keep your existing behavior…
    if (e.originalEvent.ctrlKey) {
      if (pinnedFeatureId !== null) {
        map.value.setFeatureState(
          {
            source: 'base-municipalities',
            id: pinnedFeatureId,
            sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}`
          },
          { pinned: false }
        );
      }
      pinnedFeatureId = featId;
      map.value.setFeatureState(
        {
          source: 'base-municipalities',
          id: featId,
          sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}`
        },
        { pinned: true }
      );
      pinnedPopup.value
        .setLngLat(e.lngLat)
        .setHTML(`<div style="font-family: system-ui; padding: 8px;"><strong>${feat.properties.nm_mun}</strong></div>`)
        .addTo(map.value);
    } else {
      // Update the selected municipality if it’s different from the current one.
      if (feat.properties.cd_mun !== locationStore.cd_mun) {
        // Use setLocation to update cd_mun
        locationStore.setLocation({ cd_mun: feat.properties.cd_mun });
      }
    }
  });
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
 * Update the “scale” based on zoom.
 */
function getScaleFromZoom(zoom) {
  if (zoom >= 12) {return 'intraurbana';}
  else if (zoom >= 6) {return 'municipal';}
  else if (zoom > 3) {return 'estadual';}
  else {return 'nacional';}
}

function updateScaleBasedOnZoom(zoom) {
  let newScale;
  if (zoom >= 12) { newScale = 'intraurbana'; }
  else if (zoom >= 6) { newScale = 'municipal'; }
  else if (zoom > 3) { newScale = 'estadual'; }
  else { newScale = 'nacional'; }
  if (locationStore.scale !== newScale) {
    const currentHash = window.location.hash;
    locationStore.setLocation({ scale: newScale });
    const newQuery = { ...route.query, scale: newScale };
    router.replace({ query: newQuery, hash: currentHash.slice(1) });
  }
}

/* ---------------------------------------
   LIFECYCLE
---------------------------------------*/
onMounted(() => { if (locationStore.cd_mun) { loadCoordinates(locationStore.cd_mun); } });
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

.popup-content {
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
}
</style>
