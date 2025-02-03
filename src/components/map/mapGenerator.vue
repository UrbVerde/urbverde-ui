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

// Map references
const mapContainer = ref(null);
const map = ref(null);
const customHash = ref(null);

// Coordinates, states
const coordinates = ref(null);
const isLoadingCoordinates = ref(false);
const errorMessage = ref('Selecione uma cidade para visualizar no mapa');
const mapLoaded = ref(false);
const showError = ref(false);

// Two popups
/** Hover popup (ephemeral) */
const hoverPopup = ref(null);
/** Fixed (pinned) popup */
const pinnedPopup = ref(null);

// Track hovered feature & pinned feature
let hoveredFeatureId = null;
let pinnedFeatureId = null;

// Constants
const MAP_ZOOM_START = 12;
const MAP_ZOOM_FINAL = 17;
const MAP_ANIMATION_DURATION = 8000;

/* ---------------------------------------
   COMPUTED
---------------------------------------*/
const currentLayer = computed(() => route.query.layer);  // e.g. 'max_surface_temp'
const currentScale = computed(() => route.query.scale);  // e.g. 'intraurbana'
const currentYear = computed(() => route.query.year || '2021');

/* ---------------------------------------
   WATCHERS
---------------------------------------*/
// When the user picks a new city, load coords.
watch(
  () => locationStore.cd_mun,
  (newVal) => {
    if (newVal) {loadCoordinates(newVal);}
  }
);
// When the layer/scale/code changes, re‐setup layers.
watch(
  () => [currentLayer.value, currentScale.value, route.query.code],
  () => {
    if (mapLoaded.value) {
      setupTemperatureLayers();
    }
  }
);

/* ---------------------------------------
   HELPER FUNCTIONS
---------------------------------------*/
/**
 * Returns the HTML content for a popup.
 * – When in intraurbana scale, show only “setor” info.
 * – Otherwise show the municipality name plus the layer’s value.
 *
 * (Note: In this example we assume that for temperature layers the
 * value comes from a property (e.g. “c3” or “c1”) and that the associated
 * “label” and “unit” are defined in the paint config. In your code you may
 * need to adjust this logic.)
 */
function getPopupContent(feat, paintConfig) {
  if (currentScale.value === 'intraurbana') {
    // For intraurbana, only mention the setor value:
    return `
      <div style="font-family: system-ui; padding: 8px;">
        <p>Setor: <strong>${feat.properties[paintConfig.property] ? feat.properties[paintConfig.property].toFixed(2) : 'N/A'}${paintConfig.unit}</strong></p>
      </div>
    `;
  } else {
    // For municipal scale, show the municipality name plus the layer value:
    return `
      <div style="font-family: system-ui; padding: 8px;">
        <strong>${feat.properties.nm_mun || ''}</strong><br/>
        <p>${paintConfig.label}: <strong>${feat.properties[paintConfig.property] ? feat.properties[paintConfig.property].toFixed(2) : 'N/A'}${paintConfig.unit}</strong></p>
      </div>
    `;
  }
}

/**
 * Bring basemap label layers (symbols) to the top.
 * (Assumes that the basemap style contains “symbol” layers.)
 */
function bringBasemapLabelsToFront() {
  const layers = map.value.getStyle().layers || [];
  layers.forEach(layer => {
    if (layer.type === 'symbol') {
      // Move this layer to the top.
      map.value.moveLayer(layer.id);
    }
  });
}

/* ---------------------------------------
   CORE FUNCTIONS
---------------------------------------*/

/** Load city coordinates, then fly or initialize the map. */
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

/** Initialize the map once coordinates are known. */
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

  // Initialize your custom hash (if used)
  customHash.value = new CustomHash();
  customHash.value.addTo(map.value);

  map.value.on('styleimagemissing', handleMissingImage);
  map.value.on('zoomend', () => {
    updateScaleBasedOnZoom(map.value.getZoom());
  });

  // When the map loads…
  map.value.on('load', () => {
    mapLoaded.value = true;
    isLoadingCoordinates.value = false;

    // Create the two popups with autoPan enabled and a dynamic offset
    hoverPopup.value = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      trackPointer: true,
      // We use an offset object so that later we can update it dynamically
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

    // Add the base municipalities layer (with a separate outline layer)
    addBaseMunicipalitiesLayer();

    // Then add your temperature layers (raster or vector)
    setupTemperatureLayers();

    // If no hash was provided, fly to the coordinates.
    if (!hash) {
      map.value.flyTo({
        center: [coordinates.value.lng, coordinates.value.lat],
        zoom: MAP_ZOOM_FINAL,
        duration: MAP_ANIMATION_DURATION,
        essential: true
      });
    }
    // Ensure that basemap labels (symbol layers) appear on top.
    bringBasemapLabelsToFront();
  });
}

/** Add municipality base layer and its outline.
 *  Note: We remove fill-outline-color from the fill layer and add a separate line layer
 *  so that we can style “contours” (bolder, colored by value).
 */
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

  // Fill layer without an outline
  map.value.addLayer({
    id: 'municipalities-base',
    type: 'fill',
    source: 'base-municipalities',
    'source-layer': `public.geodata_temperatura_por_municipio_${currentYear.value}`,
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'pinned'], false],
        'rgba(124,153,244,0.3)', // pinned highlight
        ['boolean', ['feature-state', 'hover'], false],
        'rgba(124,153,244,0.2)', // hovered highlight
        'rgba(0,0,0,0)'          // normal invisible fill
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

  // Separate outline layer so we can use thicker, data‐driven styling.
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
        // Default: use an interpolated color based on a data property (for example “c3”)
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

  // --- Mouse events on base municipalities ---

  // Ephemeral (hover) effect:
  map.value.on('mousemove', 'municipalities-base', (e) => {
    if (!map.value) {return;}
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
    if (featId !== hoveredFeatureId) {
      // Unhover the old feature:
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
    // Adjust popup offset based on vertical position so it does not get cut off.
    const offset = e.point.y < 50 ? [0, 20] : [0, -10];
    // (For non-intraurbana scales only, as before.)
    if (currentScale.value !== 'intraurbana') {
      hoverPopup.value
        .setLngLat(e.lngLat)
        .setOffset(offset)
        .setHTML(`
          <div style="font-family: system-ui; padding: 8px;">
            <strong>${feat.properties.nm_mun}</strong>
          </div>
        `)
        .addTo(map.value);
    }
    map.value.getCanvas().style.cursor = 'pointer';
  });

  map.value.on('mouseleave', 'municipalities-base', () => {
    if (!map.value) {return;}
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
  });

  // On click: if Ctrl is held, show a fixed popup; otherwise, update the active municipality.
  map.value.on('click', 'municipalities-base', (e) => {
    if (!map.value || !e.features?.length) {return;}
    const feat = e.features[0];
    const featId = feat.id || feat.properties.cd_mun;

    if (e.originalEvent.ctrlKey) {
      // Fixed popup: remove any old pinned state…
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
      // Use the same content as the ephemeral popup.
      // Here we assume the “paintConfig” for base municipalities is the “max_surface_temp” config.
      const paintConfig = {
        property: 'c3',
        label: 'Temperatura',
        unit: '°C'
      };
      pinnedPopup.value
        .setLngLat(e.lngLat)
        .setHTML(getPopupContent(feat, paintConfig))
        .addTo(map.value);
    } else {
      // Normal click: update the active municipality.
      locationStore.setCdMun(feat.properties.cd_mun);
    }
  });
}

/**
 * Build (or re-add) the temperature layers.
 *
 * If the selected layer is “surface_temp” we add a raster source/layer;
 * otherwise we use a vector fill layer plus a separate line (outline) layer.
 */
function setupTemperatureLayers() {
  if (!map.value || !mapLoaded.value) {return;}

  // Remove any old layers and sources.
  for (const id of ['temperature-raster', 'vector-layer', 'vector-layer-outline']) {
    if (map.value.getLayer(id)) {map.value.removeLayer(id);}
  }
  for (const id of ['temperature-source', 'vector-source']) {
    if (map.value.getSource(id)) {map.value.removeSource(id);}
  }

  const selectedLayer = currentLayer.value;
  if (!selectedLayer) {return;}

  // If the user picked “surface_temp”, add a raster layer.
  if (selectedLayer === 'surface_temp') {
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
      paint: {
        'raster-opacity': 0.7,
        'raster-resampling': 'nearest'
      }
    });

    return;
  }

  // Otherwise, use a vector source.
  const isIntraurbana = currentScale.value === 'intraurbana';
  // Choose the source layer based on the scale.
  const sourceLayer = `public.geodata_temperatura_por_${isIntraurbana ? 'setor' : 'municipio'}_${currentYear.value}`;

  // Define the “paintConfig” based on the selectedLayer.
  const paintConfig = selectedLayer === 'max_surface_temp'
    ? {
      property: 'c3',
      stops: [
        [27, '#3288bd'],
        [32, '#99d594'],
        [37, '#e6f598'],
        [42, '#fee08b'],
        [47, '#fc8d59'],
        [52, '#d53e4f']
      ],
      label: 'Temperatura',
      unit: '°C'
    }
    : {
      property: 'c1',
      stops: [
        [0, '#3288bd'],
        [2.8, '#99d594'],
        [4.5, '#e6f598'],
        [19, '#fee08b'],
        [36, '#fc8d59'],
        [44, '#d53e4f']
      ],
      label: 'Coeficiente',
      unit: ''
    };

  map.value.addSource('vector-source', {
    type: 'vector',
    tiles: [`https://urbverde.iau.usp.br/dados/${sourceLayer}/{z}/{x}/{y}.pbf`],
    minzoom: 0,
    maxzoom: 22
  });

  // Add the fill layer – note that we do not set fill-outline-color here.
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

  // For intraurbana, restrict to the current municipality code.
  if (isIntraurbana) {
    map.value.setFilter('vector-layer', ['==', ['get', 'cd_mun'], parseInt(route.query.code)]);
  }

  // Add a separate outline (line) layer for the vector layer.
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
        '#7c99f4',
        // Default: use the same interpolation as the fill.
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

  // --- Ephemeral hover for the vector layer (if not intraurbana) ---
  // (Se você deseja desabilitar efeitos de hover em intraurbana, basta pular estes handlers.)
  if (!isIntraurbana) {
    map.value.on('mousemove', 'vector-layer', (e) => {
      if (!e.features?.length) {
        if (hoveredFeatureId !== null) {

          map.value.setFeatureState(
            { source: 'vector-source', id: hoveredFeatureId },
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
            { source: 'vector-source', id: hoveredFeatureId },
            { hover: false }
          );
        }
        hoveredFeatureId = featId;
        map.value.setFeatureState(
          { source: 'vector-source', id: featId },
          { hover: true }
        );
      }
      const offset = e.point.y < 50 ? [0, 20] : [0, -10];
      hoverPopup.value
        .setLngLat(e.lngLat)
        .setOffset(offset)
        .setHTML(getPopupContent(feat, paintConfig))
        .addTo(map.value);
      map.value.getCanvas().style.cursor = 'pointer';
    });

    map.value.on('mouseleave', 'vector-layer', () => {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState(
          { source: 'vector-source', id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
      }
      hoverPopup.value.remove();
      map.value.getCanvas().style.cursor = '';
    });
  } else {
    // Em intraurbana, se desejar mostrar popups apenas no clique (via Ctrl+Click), você pode
    // pular a lógica de hover.
    map.value.off('mousemove', 'vector-layer');
    map.value.off('mouseleave', 'vector-layer');
  }

  // --- Fixed (pinned) popup on click for the vector layer ---
  map.value.on('click', 'vector-layer', (e) => {
    if (!e.features?.length) {return;}
    const feat = e.features[0];
    const featId = feat.id;

    if (e.originalEvent.ctrlKey) {
      if (pinnedFeatureId !== null) {

        map.value.setFeatureState({ source: 'vector-source', id: pinnedFeatureId }, { pinned: false });

      }
      pinnedFeatureId = featId;
      map.value.setFeatureState({ source: 'vector-source', id: featId }, { pinned: true });
      pinnedPopup.value
        .setLngLat(e.lngLat)
        .setHTML(getPopupContent(feat, paintConfig))
        .addTo(map.value);
    } else {
      if (currentScale.value !== 'intraurbana') {
        locationStore.setCdMun(feat.properties.cd_mun);
      }
    }
  });
}

/** If a sprite image is missing, add a placeholder image. */
function handleMissingImage(e) {
  const imageId = e.id?.trim();
  if (!imageId) {return;}
  if (!map.value.hasImage(imageId)) {
    const placeholder = {
      width: 1,
      height: 1,
      data: new Uint8Array(4).fill(0)
    };
    map.value.addImage(imageId, placeholder);
  }
}

/**
 * Update the “scale” (in your location store and URL) based on zoom.
 */
function updateScaleBasedOnZoom(zoom) {
  let newScale;
  if (zoom >= 12) {
    newScale = 'intraurbana';
  } else if (zoom >= 6) {
    newScale = 'municipal';
  } else if (zoom > 3) {
    newScale = 'estadual';
  } else {
    newScale = 'nacional';
  }

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
onMounted(() => {
  if (locationStore.cd_mun) {
    loadCoordinates(locationStore.cd_mun);
  }
});

onBeforeUnmount(() => {
  if (map.value) {
    if (customHash.value) {
      customHash.value.remove();
    }
    setTimeout(() => {
      map.value.remove();
    }, 300);
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: transparent;  /* no forced green background */
  overflow: visible;        /* allow popup near edges */
}

.maplibregl-popup {
  z-index: 999999 !important;
}

/* Optional styling for popups */
.hover-popup .maplibregl-popup-content {
  background: white;
  opacity: 0.9;
}
.pinned-popup .maplibregl-popup-content {
  background: #fffbe6;
  border: 1px solid #ffed4f;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
</style>
