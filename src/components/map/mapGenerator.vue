<!-- urbverde-ui/src/components/map/mapGenerator.vue -->
<template>
  <div ref="mapContainer" class="map-container">
    <!-- Loading State -->
    <div v-if="isLoadingCoordinates" class="map-loading">
      <p>Carregando mapa...</p>
    </div>
    <!-- Error State -->
    <div v-else-if="showError" class="error-placeholder">
      <p class="error-text">{{ errorMessage }}</p>
      <p class="error-text">Selecione uma cidade para visualizar no mapa</p>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import { useLocationStore } from '@/stores/locationStore';
import { useRoute, useRouter } from 'vue-router';
import CustomHash from './customHash';

/* ---------------------------------------
   STORES & REFS
---------------------------------------*/
const locationStore = useLocationStore();
const route = useRoute();
const router = useRouter();

const mapContainer = ref(null);
const map = ref(null);
const customHash = ref(null);

const coordinates = ref(null);
const isLoadingCoordinates = ref(false);
const errorMessage = ref('Selecione uma cidade para visualizar no mapa');
const mapLoaded = ref(false);
const showError = ref(false);
const isMouseWithinMunicipality = ref(false);

const hoverPopup = ref(null);
const pinnedPopup = ref(null);
const rasterPopup = ref(null);

let hoveredFeatureId = null;
let pinnedFeatureId = null;

const MAP_ZOOM_START = 12;
const MAP_ZOOM_FINAL = 17;
const MAP_ANIMATION_DURATION = 8000;

/* ---------------------------------------
   COMPUTED
---------------------------------------*/
const currentLayer = computed(() => route.query.layer);
// Example values: 'surface_temp', 'max_surface_temp', 'heat_island'
// for parks: 'park_distribution', 'green_area_per_capita', 'green_area_accessibility'
// for vegetation: 'pcv', 'icv', 'idsa', 'cvp', 'ndvi'
const currentScale = computed(() => route.query.scale);
// e.g., 'intraurbana', 'estadual', etc.
const currentYear = computed(() => route.query.year || '2021');

/* ---------------------------------------
   WATCHERS
---------------------------------------*/
watch(
  () => locationStore.cd_mun,
  (newVal) => { if (newVal) {loadCoordinates(newVal);} }
);
watch(
  () => [currentLayer.value, currentScale.value, route.query.code],
  () => {
    if (mapLoaded.value) {
      // Remove previously added layers and sources.
      const idsToRemove = [
        'temperature-raster', 'vector-layer', 'vector-layer-outline',
        'parks-points', 'parks-buffers', 'parks-vector',
        'vegetation-layer', 'vegetation-layer-outline'
      ];
      idsToRemove.forEach(id => { if (map.value.getLayer(id)) {map.value.removeLayer(id);} });
      const srcIdsToRemove = [
        'temperature-source', 'vector-source',
        'parks-source', 'buffers-source', 'parks-vector-source',
        'vegetation-source'
      ];
      srcIdsToRemove.forEach(id => { if (map.value.getSource(id)) {map.value.removeSource(id);} });

      // Decide which setup function to call based on the currentLayer.
      if (['surface_temp', 'max_surface_temp', 'heat_island'].includes(currentLayer.value)) {
        setupTemperatureLayers();
      }
      else if (['park_distribution', 'green_area_per_capita', 'green_area_accessibility'].includes(currentLayer.value)) {
        setupParksLayers();
      }
      else if (['pcv','icv','idsa','cvp','ndvi'].includes(currentLayer.value)) {
        setupVegetationLayers();
      }
    }
  },
  { immediate: true }
);

/* ---------------------------------------
   HELPER FUNCTIONS
---------------------------------------*/
/**
 * Returns HTML content for a popup.
 */
function getPopupContent(feat, paintConfig) {
  const value = feat.properties[paintConfig.property]
    ? feat.properties[paintConfig.property].toFixed(2)
    : 'N/A';
  if (currentScale.value === 'intraurbana') {
    return `
      <div style="font-family: system-ui; padding: 8px;">
        <p><strong>${paintConfig.label} no setor:</strong><br/><strong>${value} ${paintConfig.unit}</strong></p>
      </div>
    `;
  } else if (currentScale.value === 'estadual') {
    return `
      <div style="font-family: system-ui; padding: 8px;">
        <p><strong>${feat.properties.nm_mun || ''}</strong><br/>
        ${paintConfig.label}:<br/><strong>${value}${paintConfig.unit}</strong></p>
      </div>
    `;
  } else {
    return `
      <div style="font-family: system-ui; padding: 8px;">
        <strong>${feat.properties.nm_mun || ''}</strong><br/>
        <p>${paintConfig.label}: <strong>${value}${paintConfig.unit}</strong></p>
      </div>
    `;
  }
}

/**
 * Fetches the raster value from the WMS.
 */
async function fetchRasterValue(lng, lat, controller) {
  if (!isMouseWithinMunicipality.value) {return null;}
  const bboxSize = 0.0001;
  const ts = Date.now();
  const url = 'https://urbverde.iau.usp.br/geoserver/urbverde/wms?' +
      'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&' +
      'LAYERS=urbverde:tst-intraurbana-rel-30m-2021a2016&' +
      'QUERY_LAYERS=urbverde:tst-intraurbana-rel-30m-2021a2016&' +
      'INFO_FORMAT=application/json&FEATURE_COUNT=1&X=50&Y=50&' +
      `SRS=EPSG:4326&WIDTH=101&HEIGHT=101&_ts=${ts}&` +
      `BBOX=${lng - bboxSize},${lat - bboxSize},${lng + bboxSize},${lat + bboxSize}`;
  const response = await fetch(url, { signal: controller.signal });
  const data = await response.json();
  if (data?.features?.[0]?.properties?.GRAY_INDEX !== undefined) {
    const value = data.features[0].properties.GRAY_INDEX;

    return value !== null ? `${value.toFixed(2)}°C` : null;
  }

  return null;

}

/**
 * Brings basemap label layers (symbols) to the front.
 */
function bringBasemapLabelsToFront() {
  const layers = map.value.getStyle().layers || [];
  layers.forEach(layer => { if (layer.type === 'symbol') {map.value.moveLayer(layer.id);} });
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
      showError.value = false;
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
    } else {
      showError.value = true;
    }
  } catch (err) {
    console.error('Error loading coords:', err);
    showError.value = true;
  } finally {
    isLoadingCoordinates.value = false;
  }
}

/** Enable raster measurement events for the 'surface_temp' layer. */
function enableRasterMeasurement() {
  if (!map.value || currentLayer.value !== 'surface_temp') {return;}
  // Remove any vector-layer click events.
  map.value.off('click', 'vector-layer');

  if (!rasterPopup.value) {
    rasterPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: { top: [0, 0], bottom: [0, -5] },
      className: 'hover-popup',
      trackPointer: true
    });
  }
  let currentRequest = null;
  let rasterRequestId = 0;

  const mousemoveHandler = (e) => {
    if (currentLayer.value !== 'surface_temp') {
      rasterPopup.value.remove();

      return;
    }
    const features = map.value.queryRenderedFeatures(e.point, { layers: ['municipalities-base'] });
    isMouseWithinMunicipality.value = features.length > 0;
    if (!isMouseWithinMunicipality.value) {
      rasterPopup.value.remove();

      return;
    }
    // Clear any previously held content.
    rasterPopup.value.setLngLat(e.lngLat).setHTML('')
      .addTo(map.value);

    rasterRequestId++;
    const thisRequestId = rasterRequestId;
    if (currentRequest) {currentRequest.abort();}
    const controller = new AbortController();
    currentRequest = controller;
    const { lng, lat } = e.lngLat;

    requestAnimationFrame(() => {
      fetchRasterValue(lng, lat, controller).then(value => {
        if (currentLayer.value !== 'surface_temp' || thisRequestId !== rasterRequestId) {return;}
        if (value) {
          rasterPopup.value.setHTML(`<div class="popup-content">Temperatura Relativa:<br><strong>${value}</strong></div>`);
        } else {
          rasterPopup.value.remove();
        }
      });

    });
  };

  const clickHandler = async(e) => {
    if (!e.originalEvent.ctrlKey || currentLayer.value !== 'surface_temp') {return;}
    e.originalEvent.stopPropagation();
    e.preventDefault();
    const features = map.value.queryRenderedFeatures(e.point, { layers: ['municipalities-base'] });
    if (!features.length) {return;}
    const { lng, lat } = e.lngLat;

    const value = await fetchRasterValue(lng, lat, new AbortController());
    if (currentLayer.value !== 'surface_temp') {return;}
    if (value) {
      pinnedPopup.value
        .setLngLat(e.lngLat)
        .setHTML(`<div class="popup-content">Temperatura Relativa:<br><strong>${value}</strong></div>`)
        .addTo(map.value);
    }

  };

  map.value.on('mousemove', mousemoveHandler);
  map.value.on('click', clickHandler);
  map.value.on('mouseout', () => {
    rasterPopup.value.remove();
    if (currentRequest) {
      currentRequest.abort();
      currentRequest = null;
    }
  });
}

/** Initialize the map (if not already created). */
function initializeMap() {
  if (showError.value || !coordinates.value) {return;}
  let initialState = {
    center: [coordinates.value.lng, coordinates.value.lat],
    zoom: MAP_ZOOM_START,
    pitch: 20
  };
  const hash = window.location.hash.slice(1);
  if (hash) {
    const match = hash.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z(?:,(\d+)b,(\d+)p)?/);
    if (match) {
      initialState = {
        center: [parseFloat(match[2]), parseFloat(match[1])],
        zoom: parseFloat(match[3]),
        pitch: match[5] ? parseInt(match[5]) : 20,
        bearing: match[4] ? parseInt(match[4]) : 0
      };
    }
  }
  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
    ...initialState,
    attributionControl: false
  });
  customHash.value = new CustomHash();
  customHash.value.addTo(map.value);
  map.value.on('styleimagemissing', handleMissingImage);
  map.value.on('zoomend', () => { updateScaleBasedOnZoom(map.value.getZoom()); });
  map.value.on('load', () => {
    mapLoaded.value = true;
    isLoadingCoordinates.value = false;
    hoverPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      trackPointer: true,
      offset: { top: [0, 20], bottom: [0, -20] },
      autoPan: true,
      className: 'hover-popup'
    });
    pinnedPopup.value = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false,
      trackPointer: false,
      offset: { top: [0, 20], bottom: [0, -20] },
      autoPan: true,
      className: 'pinned-popup'
    });
    addBaseMunicipalitiesLayer();
    // Call the proper setup function based on currentLayer.
    if (['surface_temp','max_surface_temp','heat_island'].includes(currentLayer.value)) {
      setupTemperatureLayers();
    }
    else if (['park_distribution','green_area_per_capita','green_area_accessibility'].includes(currentLayer.value)) {
      setupParksLayers();
    }
    else if (['pcv','icv','idsa','cvp','ndvi'].includes(currentLayer.value)) {
      setupVegetationLayers();
    }
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
  if (!map.value) {return;}
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
        0.8,
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
  map.value.on('mousemove', 'municipalities-base', (e) => {
    const features = e.features;
    if (!features?.length) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'base-municipalities', id: hoveredFeatureId, sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}` },
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
    if (featId !== hoveredFeatureId) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'base-municipalities', id: hoveredFeatureId, sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}` },
          { hover: false }
        );
      }
      hoveredFeatureId = featId;
      map.value.setFeatureState(
        { source: 'base-municipalities', id: featId, sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}` },
        { hover: true }
      );
    }
    const offset = e.point.y < 50 ? [0, 20] : [0, -10];
    hoverPopup.value.setLngLat(e.lngLat).setOffset(offset)
      .setHTML(`<div style="font-family: system-ui; padding: 8px;"><strong>${feat.properties.nm_mun}</strong></div>`)
      .addTo(map.value);
    map.value.getCanvas().style.cursor = 'pointer';
  });
  map.value.on('mouseleave', 'municipalities-base', () => {
    if (!map.value) {return;}
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
    if (!map.value || !e.features?.length) {return;}
    const feat = e.features[0];
    const featId = feat.id || feat.properties.cd_mun;
    if (e.originalEvent.ctrlKey) {
      if (pinnedFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'base-municipalities', id: pinnedFeatureId, sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}` },
          { pinned: false }
        );
      }
      pinnedFeatureId = featId;
      map.value.setFeatureState(
        { source: 'base-municipalities', id: featId, sourceLayer: `public.geodata_temperatura_por_municipio_${currentYear.value}` },
        { pinned: true }
      );
      const paintConfig = { property: 'c3', label: 'Temperatura máxima de superfície', unit: '°C' };
      pinnedPopup.value.setLngLat(e.lngLat).setHTML(getPopupContent(feat, paintConfig))
        .addTo(map.value);
    } else {
      locationStore.setCdMun(feat.properties.cd_mun);
    }
  });
}

/* ---------------------------------------
   SETUP FUNCTIONS FOR DIFFERENT LAYER GROUPS
---------------------------------------*/

/** Setup temperature layers (climate) */
function setupTemperatureLayers() {
  // For climate layers, if the selected layer is "surface_temp", we add a raster source.
  if (currentLayer.value === 'surface_temp') {
    map.value.addSource('temperature-source', {
      type: 'raster',
      tiles: [
        'https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:tst-intraurbana-rel-30m-2021a2016&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true'
      ],
      tileSize: 256
    });
    map.value.addLayer({
      id: 'temperature-raster',
      type: 'raster',
      source: 'temperature-source',
      paint: { 'raster-opacity': 0.7, 'raster-resampling': 'nearest' }
    }, 'municipalities-base');
    enableRasterMeasurement();
    bringBasemapLabelsToFront();

    return;
  }
  // Otherwise, add a vector source and two layers (fill and outline)
  const isIntraurbana = currentScale.value === 'intraurbana';
  const sourceLayer = `public.geodata_temperatura_por_${isIntraurbana ? 'setor' : 'municipio'}_${currentYear.value}`;
  const paintConfig = currentLayer.value === 'max_surface_temp'
    ? { property: 'c3', stops: [[27, '#3288bd'], [32, '#99d594'], [37, '#e6f598'], [42, '#fee08b'], [47, '#fc8d59'], [52, '#d53e4f']], label: 'Temperatura máxima de superfície', unit: '°C' }
    : { property: 'c1', stops: [[0, '#3288bd'], [2.8, '#99d594'], [4.5, '#e6f598'], [19, '#fee08b'], [36, '#fc8d59'], [44, '#d53e4f']], label: 'Nível de exposição à ilha de calor', unit: '' };
  map.value.addSource('vector-source', {
    type: 'vector',
    tiles: [`https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`],
    minzoom: 0,
    maxzoom: 22
  });
  map.value.addLayer({
    id: 'vector-layer',
    type: 'fill',
    source: 'vector-source',
    'source-layer': sourceLayer,
    paint: {
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        1,
        ['boolean', ['feature-state', 'hover'], false],
        currentScale.value === 'estadual' ? 1 : 0.9,
        0.6
      ],
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', paintConfig.property],
        ...paintConfig.stops.flat()
      ]
    }
  });
  if (isIntraurbana) {
    map.value.setFilter('vector-layer', ['==', ['get', 'cd_mun'], parseInt(route.query.code)]);
  }
  const hoverLineColor = isIntraurbana ? '#7D99F0' : '#7c99f4';
  map.value.addLayer({
    id: 'vector-layer-outline',
    type: 'line',
    source: 'vector-source',
    'source-layer': sourceLayer,
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        '#2c46f4',
        ['boolean', ['feature-state', 'hover'], false],
        hoverLineColor,
        ['interpolate', ['linear'], ['get', paintConfig.property], ...paintConfig.stops.flat()]
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
  map.value.on('mousemove', 'vector-layer', (e) => {
    if (!e.features?.length) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState({ source: 'vector-source', id: hoveredFeatureId }, { hover: false });
        hoveredFeatureId = null;
        hoverPopup.value.remove();
      }

      return;
    }
    const feat = e.features[0];
    const featId = feat.id;
    if (featId !== hoveredFeatureId) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState({ source: 'vector-source', id: hoveredFeatureId }, { hover: false });
      }
      hoveredFeatureId = featId;
      map.value.setFeatureState({ source: 'vector-source', id: featId }, { hover: true });
    }
    const offset = e.point.y < 50 ? [0, 20] : [0, -10];
    hoverPopup.value.setLngLat(e.lngLat).setOffset(offset)
      .setHTML(getPopupContent(feat, paintConfig))
      .addTo(map.value);
    map.value.getCanvas().style.cursor = 'pointer';
  });
  map.value.on('mouseleave', 'vector-layer', () => {
    if (hoveredFeatureId !== null) {
      map.value.setFeatureState({ source: 'vector-source', id: hoveredFeatureId }, { hover: false });
      hoveredFeatureId = null;
    }
    hoverPopup.value.remove();
    map.value.getCanvas().style.cursor = '';
  });
  map.value.on('click', 'vector-layer', (e) => {
    if (currentLayer.value === 'surface_temp') {return;}
    if (!e.features?.length) {return;}
    const feat = e.features[0];
    const featId = feat.id;
    if (e.originalEvent.ctrlKey) {
      if (pinnedFeatureId !== null) {
        map.value.setFeatureState({ source: 'vector-source', id: pinnedFeatureId }, { pinned: false });
      }
      pinnedFeatureId = featId;
      map.value.setFeatureState({ source: 'vector-source', id: featId }, { pinned: true });
      pinnedPopup.value.setLngLat(e.lngLat).setHTML(getPopupContent(feat, paintConfig))
        .addTo(map.value);
    } else {
      if (currentScale.value !== 'intraurbana') {
        locationStore.setCdMun(feat.properties.cd_mun);
      }
    }
  });
  bringBasemapLabelsToFront();
}

/** Setup parks layers */
function setupParksLayers() {
  if (!map.value || !mapLoaded.value) {return;}
  const layerIds = ['parks-points', 'parks-buffers', 'parks-vector'];
  const sourceIds = ['parks-source', 'buffers-source', 'parks-vector-source'];
  layerIds.forEach(id => { if (map.value.getLayer(id)) {map.value.removeLayer(id);} });
  sourceIds.forEach(id => { if (map.value.getSource(id)) {map.value.removeSource(id);} });

  const selectedLayer = currentLayer.value;
  if (!selectedLayer) {return;}

  // Add a basic parks source (used by all parks layers)
  map.value.addSource('parks-source', {
    type: 'vector',
    tiles: [
      'https://urbverde.iau.usp.br/dados/public.geom_pracas/{z}/{x}/{y}.pbf'
    ],
    minzoom: 0,
    maxzoom: 22
  });

  if (selectedLayer === 'park_distribution') {
    map.value.addLayer({
      id: 'parks-points',
      type: 'fill',
      source: 'parks-source',
      'source-layer': 'public.geom_pracas',
      paint: {
        'fill-color': '#40826D',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'pinned'], false],
          1,
          ['boolean', ['feature-state', 'hover'], false],
          0.9,
          0.7
        ],
        'fill-outline-color': [
          'case',
          ['boolean', ['feature-state', 'pinned'], false],
          '#2c46f4',
          ['boolean', ['feature-state', 'hover'], false],
          '#7c99f4',
          '#40826D'
        ]
      }
    });
    setupParksInteractions('parks-points');
  } else if (selectedLayer === 'green_area_per_capita') {
    map.value.addSource('parks-vector-source', {
      type: 'vector',
      tiles: [
        `https://urbverde.iau.usp.br/dados/public.geodata_pracas_por_municipio_${currentYear.value}/{z}/{x}/{y}.pbf`
      ],
      minzoom: 0,
      maxzoom: 22
    });
    map.value.addLayer({
      id: 'parks-vector',
      type: 'fill',
      source: 'parks-vector-source',
      'source-layer': `public.geodata_pracas_por_municipio_${currentYear.value}`,
      paint: {
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'pinned'], false],
          1,
          ['boolean', ['feature-state', 'hover'], false],
          0.9,
          0.6
        ],
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'a2'],
          0, '#d53e4f',
          40, '#f46d43',
          50, '#fdae61',
          60, '#fee08b',
          70, '#e6f598',
          85, '#abdda4'
        ]
      }
    });
    setupParksInteractions('parks-vector');
  } else if (selectedLayer === 'green_area_accessibility') {
    // Add parks points layer.
    map.value.addLayer({
      id: 'parks-points',
      type: 'fill',
      source: 'parks-source',
      'source-layer': 'public.geom_pracas',
      paint: {
        'fill-color': '#40826D',
        'fill-opacity': 0.7,
        'fill-outline-color': '#40826D'
      }
    });
    // Add 400m buffer source and layer.
    map.value.addSource('buffers-source', {
      type: 'vector',
      tiles: [
        'https://urbverde.iau.usp.br/dados/public.geom_buffer_400m_municipios/{z}/{x}/{y}.pbf'
      ],
      minzoom: 0,
      maxzoom: 22
    });
    map.value.addLayer({
      id: 'parks-buffers',
      type: 'fill',
      source: 'buffers-source',
      'source-layer': 'public.geom_buffer_400m_municipios',
      paint: {
        'fill-color': '#FF6F91',
        'fill-opacity': 0.5,
        'fill-outline-color': '#FF6F91'
      }
    }, 'parks-points');
    if (currentScale.value === 'intraurbana') {
      map.value.setFilter('parks-buffers', [
        '==',
        ['get', 'cd_mun'],
        parseInt(route.query.code)
      ]);
    }
    setupParksInteractions('parks-points');
  }
  bringBasemapLabelsToFront();
}

function setupParksInteractions(layerId) {
  const isIntra = (currentScale.value === 'intraurbana');
  if (isIntra) {return;} // Skip interactions for intraurbana.

  map.value.on('mousemove', layerId, (e) => {
    if (!e.features?.length) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          { source: layerId.includes('vector') ? 'parks-vector-source' : 'parks-source', id: hoveredFeatureId },
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
          { source: layerId.includes('vector') ? 'parks-vector-source' : 'parks-source', id: hoveredFeatureId },
          { hover: false }
        );
      }
      hoveredFeatureId = featId;
      map.value.setFeatureState(
        { source: layerId.includes('vector') ? 'parks-vector-source' : 'parks-source', id: featId },
        { hover: true }
      );
    }
    let content;
    if (layerId === 'parks-points') {
      content = `
        <div style="font-family: system-ui; padding: 8px;">
          <strong>Parque/Praça</strong><br/>
          ${feat.properties.nome || 'Sem nome'}
        </div>
      `;
    } else {
      const areaPerCapita = feat.properties.a2;
      content = `
        <div style="font-family: system-ui; padding: 8px;">
          <strong>${feat.properties.nm_mun}</strong><br/>
          Área verde: ${areaPerCapita ? areaPerCapita.toFixed(2) : 'N/A'} m²/hab
        </div>
      `;
    }

    hoverPopup.value.setLngLat(e.lngLat).setHTML(content)
      .addTo(map.value);
    map.value.getCanvas().style.cursor = 'pointer';
  });

  map.value.on('mouseleave', layerId, () => {
    if (hoveredFeatureId !== null) {
      map.value.setFeatureState(
        { source: layerId.includes('vector') ? 'parks-vector-source' : 'parks-source', id: hoveredFeatureId },
        { hover: false }
      );
      hoveredFeatureId = null;
    }
    hoverPopup.value.remove();
    map.value.getCanvas().style.cursor = '';
  });

  map.value.on('click', layerId, (e) => {
    if (!e.features?.length) {return;}
    const feat = e.features[0];
    const featId = feat.id;
    if (e.originalEvent.ctrlKey) {
      if (pinnedFeatureId !== null) {
        map.value.setFeatureState(
          { source: layerId.includes('vector') ? 'parks-vector-source' : 'parks-source', id: pinnedFeatureId },
          { pinned: false }
        );
      }
      pinnedFeatureId = featId;
      map.value.setFeatureState(
        { source: layerId.includes('vector') ? 'parks-vector-source' : 'parks-source', id: featId },
        { pinned: true }
      );
      let content;
      if (layerId === 'parks-points') {
        content = `
          <div style="font-family: system-ui; padding: 8px;">
            <h4>Parque/Praça Selecionado</h4>
            <strong>${feat.properties.nome || 'Sem nome'}</strong>
          </div>
        `;
      } else {
        const areaPerCapita = feat.properties.a2;
        content = `
          <div style="font-family: system-ui; padding: 8px;">
            <h4>${feat.properties.nm_mun}</h4>
            Área verde por habitante:<br/>
            <strong>${areaPerCapita ? areaPerCapita.toFixed(2) : 'N/A'} m²/hab</strong>
          </div>
        `;
      }

      pinnedPopup.value.setLngLat(e.lngLat).setHTML(content)
        .addTo(map.value);
    } else {
      if (!isIntra) {
        locationStore.setCdMun(feat.properties.cd_mun);
      }
    }
  });
}

/** Setup vegetation layers */
function setupVegetationLayers() {
  if (!map.value || !mapLoaded.value) {return;}
  map.value.off('mousemove');
  map.value.off('mouseleave');
  if (rasterPopup.value) {rasterPopup.value.remove();}
  // Remove any existing vegetation layers/sources
  ['vegetation-layer', 'vegetation-layer-outline'].forEach(id => {
    if (map.value.getLayer(id)) {map.value.removeLayer(id);}
  });
  ['vegetation-source'].forEach(id => {
    if (map.value.getSource(id)) {map.value.removeSource(id);}
  });

  const selectedLayerId = currentLayer.value; // e.g., 'pcv', 'icv', 'idsa', 'cvp', 'ndvi'
  if (!selectedLayerId) {return;}

  // If NDVI is selected, add a raster source/layer.
  if (selectedLayerId === 'ndvi') {
    map.value.addSource('vegetation-source', {
      type: 'raster',
      tiles: [
        `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde:NDVI-10m-${currentYear.value}&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`
      ],
      tileSize: 256
    });
    map.value.addLayer({
      id: 'vegetation-layer',
      type: 'raster',
      source: 'vegetation-source',
      paint: { 'raster-opacity': 0.7 }
    }, 'municipalities-base');
    bringBasemapLabelsToFront();

    return;
  }

  // Otherwise, for vector vegetation layers:
  const isIntraurbana = currentScale.value === 'intraurbana';
  const sourceLayer = isIntraurbana
    ? `public.geodata_vegetacao_por_setor_${currentYear.value}`
    : `public.geodata_vegetacao_por_municipio_${currentYear.value}`;

  // Define paint configuration based on the selected vegetation layer.
  let paintConfig;
  if (selectedLayerId === 'pcv') {
    paintConfig = {
      property: 'b1',
      label: 'Percentual de Cobertura Vegetal',
      unit: '%',
      stops: [[0.04, '#ffffe5'], [0.14, '#f7fcb9'], [0.15, '#d9f0a3'], [0.18, '#addd8e'], [0.21, '#78c679'], [0.25, '#41ab5d'], [0.28, '#238443'], [0.31, '#006837'], [0.44, '#004529']]
    };
  } else if (selectedLayerId === 'icv') {
    paintConfig = {
      property: 'b2',
      label: 'Índice de Cobertura Vegetal',
      unit: '',
      stops: [[0, '#3288bd'], [1, '#d53e4f']]
    };
  } else if (selectedLayerId === 'idsa') {
    paintConfig = {
      property: 'b3',
      label: 'Índice de Desigualdade Socioambiental',
      unit: '',
      stops: [[0.33, '#2b83ba'], [0.455, '#abdda4'], [0.555, '#fdae61'], [0.685, '#d7191c']]
    };
  } else if (selectedLayerId === 'cvp') {
    // If you want to treat "Cobertura Vegetal por Pixel" similarly to PCV:
    paintConfig = {
      property: 'b1',
      label: 'Cobertura Vegetal',
      unit: '%',
      stops: [[0.04, '#ffffe5'], [0.14, '#f7fcb9'], [0.15, '#d9f0a3'], [0.18, '#addd8e'], [0.21, '#78c679'], [0.25, '#41ab5d'], [0.28, '#238443'], [0.31, '#006837'], [0.44, '#004529']]
    };
  }

  // Add a vector source for vegetation.
  map.value.addSource('vegetation-source', {
    type: 'vector',
    tiles: [`https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`],
    minzoom: 0,
    maxzoom: 22
  });

  // Add a fill layer.
  map.value.addLayer({
    id: 'vegetation-layer',
    type: 'fill',
    source: 'vegetation-source',
    'source-layer': sourceLayer,
    paint: {
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        1,
        ['boolean', ['feature-state', 'hover'], false],
        0.9,
        0.6
      ],
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', paintConfig.property],
        ...paintConfig.stops.flat()
      ]
    }
  });
  // Optionally add an outline layer.
  map.value.addLayer({
    id: 'vegetation-layer-outline',
    type: 'line',
    source: 'vegetation-source',
    'source-layer': sourceLayer,
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        '#2c46f4',
        ['boolean', ['feature-state', 'hover'], false],
        '#7c99f4',
        ['interpolate', ['linear'], ['get', paintConfig.property],
          ...paintConfig.stops.flat()
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
  map.value.on('mousemove', 'vegetation-layer', (e) => {
    if (!e.features?.length) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState({ source: 'vegetation-source', id: hoveredFeatureId }, { hover: false });
        hoveredFeatureId = null;
        hoverPopup.value.remove();
      }

      return;
    }
    const feat = e.features[0];
    const featId = feat.id;
    if (featId !== hoveredFeatureId) {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState({ source: 'vegetation-source', id: hoveredFeatureId }, { hover: false });
      }
      hoveredFeatureId = featId;
      map.value.setFeatureState({ source: 'vegetation-source', id: featId }, { hover: true });
    }
    const offset = e.point.y < 50 ? [0, 20] : [0, -10];
    hoverPopup.value.setLngLat(e.lngLat).setOffset(offset)
      .setHTML(getPopupContent(feat, paintConfig))
      .addTo(map.value);
    map.value.getCanvas().style.cursor = 'pointer';
  });
  map.value.on('mouseleave', 'vegetation-layer', () => {
    if (hoveredFeatureId !== null) {
      map.value.setFeatureState({ source: 'vegetation-source', id: hoveredFeatureId }, { hover: false });
      hoveredFeatureId = null;
    }
    hoverPopup.value.remove();
    map.value.getCanvas().style.cursor = '';
  });
  bringBasemapLabelsToFront();
}

/**
 * If a sprite image is missing, add a placeholder image.
 */
function handleMissingImage(e) {
  const imageId = e.id?.trim();
  if (!imageId) {return;}
  if (!map.value.hasImage(imageId)) {
    const placeholder = { width: 1, height: 1, data: new Uint8Array(4).fill(0) };
    map.value.addImage(imageId, placeholder);
  }
}

/**
 * Update the “scale” based on zoom.
 */
function updateScaleBasedOnZoom(zoom) {
  let newScale;
  if (zoom >= 12) {newScale = 'intraurbana';}
  else if (zoom >= 6) {newScale = 'municipal';}
  else if (zoom > 3) {newScale = 'estadual';}
  else {newScale = 'nacional';}
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
onMounted(() => { if (locationStore.cd_mun) {loadCoordinates(locationStore.cd_mun);} });
onBeforeUnmount(() => {
  if (map.value) {
    if (customHash.value) {customHash.value.remove();}
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
}

.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
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
