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

    <slot :map="map"></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';
import { useRoute, useRouter } from 'vue-router';
import CustomHash from '@/components/map/core/MapStateManager.js';
import { getLayerConfig } from '@/constants/layers.js';
import MapControls from '@/components/map/controls/MapNavigationControls.vue';
import AttributionBar from '@/components/map/info/MapInfoBar.vue';
import CustomTerrainControl from '@/components/map/controls/customTerrainControl.js';
// import { reorderAllLayers } from '@/components/map/layers/layersOrder';

import {
  // setupDynamicLayers,
  clearPopups,
  setupSetoresLayer,
  setupDynamicSource
} from '@/components/map/layers/MapLayerController.js';
import {
  // setupRasterInteractions,
  removeRasterInteractions,
  // setupVectorInteractions,
  removeVectorInteractions,
  setupSetoresInteractions
} from '@/components/map/layers/MapLayerInteractionManager.js';

import { useMapPopups } from '@/composables/useMapPopups';
import { useMapLayers } from '@/composables/useMapLayers';
import { LayerRegistry } from '@/components/map/layers/layerRegistry';
// import { LAYER_GROUPS } from '@/components/map/layers/layersOrder';

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

// Standard popups
const {
  createPopups,
  setupVectorPopupHandlers,
  setupRasterPopupHandlers,
  removeHandlers,
  vectorPopup,
  rasterPopup,
  pinnedPopup
} = useMapPopups();

// For managing feature state on vector layers
let hoveredFeatureId = null;
let hoveredSetorId = null;

// Map constants
const MAP_ZOOM_START = 14;
const MAP_ZOOM_FINAL = 14;

// Get current layer id, scale and year from the URL query.
const currentLayer = computed(() => locationStore.activeMainLayer);
const currentScale = computed(() => locationStore.scale);
const currentYear = computed(() => locationStore.year || '2021');
const currentCode = computed(() => locationStore.cd_mun);

// No setup
const layerRegistry = new LayerRegistry();
const { addLayer} = useMapLayers(map);

watch(
  [
    () => locationStore.cd_mun,
    () => currentLayer.value,
    () => currentScale.value,
    () => currentYear.value
  ],
  async([newCdMun], [oldCdMun]) => {
    // Only load coordinates if cd_mun changes AND it's a new municipality
    if (newCdMun && newCdMun !== oldCdMun) {
      await loadCoordinates(newCdMun);
    }

    if (mapLoaded.value) {
      removeDynamicLayer();
      await initializeMapLayers();
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
  if (!map.value) {return;}

  // Remover handlers de eventos
  removeRasterInteractions(map.value);
  removeVectorInteractions(map.value);

  // Remover handlers de popup
  if (map.value._vectorPopupHandlers) {
    removeHandlers(map.value, {
      onMouseMove: map.value._vectorPopupHandlers.onMouseMove,
      onMouseLeave: map.value._vectorPopupHandlers.onMouseLeave,
      onClick: map.value._vectorPopupHandlers.onClick
    });
    map.value._vectorPopupHandlers = null;
  }

  if (map.value._rasterPopupHandlers) {
    removeHandlers(map.value, {
      onRasterMouseMove: map.value._rasterPopupHandlers.onRasterMouseMove,
      onRasterMouseClick: map.value._rasterPopupHandlers.onRasterMouseClick
    });
    map.value._rasterPopupHandlers = null;
  }

  // Limpar popups existentes
  clearPopups({
    vector: vectorPopup.value,
    raster: rasterPopup.value,
    pinned: pinnedPopup.value
  });

  // Remover camadas
  ['dynamic-layer', 'dynamic-layer-outline', 'parks-layer', 'setores-layer'].forEach(id => {
    if (map.value.getLayer(id)) {
      map.value.removeLayer(id);
      layerRegistry.unregister(id);
    }
  });

  // Remover sources
  ['dynamic-source', 'parks-source', 'setores-source'].forEach(id => {
    if (map.value.getSource(id)) {
      map.value.removeSource(id);
    }
  });

  // Resetar estados
  hoveredFeatureId = null;
  hoveredSetorId = null;
  if (map.value._hoveredParkId) {
    map.value._hoveredParkId = null;
  }
}

// Função para inicializar as camadas
async function initializeMapLayers() {
  if (!map.value || !currentLayer.value) { return; }

  try {
    // Registrar a camada atual
    const config = getLayerConfig(currentLayer.value, currentYear.value, currentScale.value);
    layerRegistry.register(currentLayer.value, {
      ...config,
      dependencies: ['base-municipalities']
    });

    // Adicionar a camada
    await addLayer(currentLayer.value, config);

    // Adicionar camadas adicionais se necessário
    if (currentScale.value === 'intraurbana' && currentCode.value) {
      if (config.type === 'raster') {
        addParksLayer();
        // Configurar handlers de popup para raster
        map.value._rasterPopupHandlers = setupRasterPopupHandlers(map.value, config, fetchRasterValue);
      } else {
        setupSetoresLayer(map.value, locationStore);
        setupSetoresInteractions(map.value, hoveredSetorId);
        addParksLayer();
        // Configurar handlers de popup para vector
        map.value._vectorPopupHandlers = setupVectorPopupHandlers(map.value, config);
      }
    }

    // Limpar popups existentes
    clearPopups({
      vector: vectorPopup.value,
      raster: rasterPopup.value,
      pinned: pinnedPopup.value
    });

  } catch (error) {
    console.error('Erro ao configurar layers:', error);
  }
}

// Função para adicionar camada de parques
function addParksLayer() {
  const parksConfig = getLayerConfig('parks', currentYear.value, currentScale.value);
  if (!parksConfig) {return;}

  layerRegistry.register('parks-layer', {
    ...parksConfig,
    dependencies: ['base-municipalities']
  });

  const sourceConfig = setupDynamicSource(parksConfig, locationStore, currentScale.value);
  if (!map.value.getSource('parks-source')) {
    map.value.addSource('parks-source', sourceConfig);
  }

  if (!map.value.getLayer('parks-layer')) {
    const parksLayer = {
      id: 'parks-layer',
      type: 'fill',
      source: 'parks-source',
      'source-layer': parksConfig.source.sourceLayer,
      paint: parksConfig.paint || {
        'fill-color': '#40826D',
        'fill-opacity': 0.7,
        'fill-outline-color': '#40826D'
      }
    };
    map.value.addLayer(parksLayer);
  }

  map.value.setFilter('parks-layer', ['==', 'cd_mun', String(locationStore.cd_mun)]);
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
  let scale;
  if (zoom >= 10) {
    scale = 'intraurbana';
  }
  else if (zoom > 5) {
    scale = 'estadual';
  }
  else {
    scale = 'nacional';
  }

  return scale;
}

/* ---------------------------------------
   CORE FUNCTIONS
---------------------------------------*/

/** Load city coordinates and initialize or fly the map. */
async function loadCoordinates(code) {
  isLoadingCoordinates.value = true;

  try {
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
    if (vectorPopup.value) { vectorPopup.value.remove(); }

    // Set scale and trigger layer setup
    await locationStore.setLocation({ scale: 'intraurbana' });
    if (mapLoaded.value) {
      removeDynamicLayer();
      await initializeMapLayers();
    }

    const coords = await locationStore.fetchCoordinatesByCode(code);
    if (coords?.lat && coords?.lng) {
      coordinates.value = coords;

      // Atualiza o store com as coordenadas
      await locationStore.setLocation({
        lng: coords.lng,
        lat: coords.lat
      });

      if (map.value) {
        map.value.jumpTo({
          center: [coords.lng, coords.lat],
          zoom: MAP_ZOOM_FINAL,
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

/* ---------------------------------------
   MAP INITIALIZATION
---------------------------------------*/
/** Initialize the map (if not already created). */
function initializeMap() {
  if (!coordinates.value) { return; }

  // Reset hover state
  hoveredSetorId = null;
  hoveredFeatureId = null;

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
    style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=zuxU0KiQ4drdRZ555olV',
    ...initialState,
    attributionControl: false,
    minZoom: 3.5,
    maxZoom: 18,
  });

  map.value.on('load', () => {
    mapLoaded.value = true;
    createPopups();
    addBaseMunicipalitiesLayer();
    initializeMapLayers();
    if (!hash) {
      map.value.jumpTo({
        center: [coordinates.value.lng, coordinates.value.lat],
        zoom: MAP_ZOOM_FINAL,
        essential: true
      });
    }
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
