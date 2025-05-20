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
    <MapControls v-if="mapLoaded && map"
                 :map="map"
                 :current-style="currentStyle"
                 :terrain-enabled="terrainEnabled"
                 @terrain-toggle="handleTerrainToggle"
                 @location-found="handleLocationFound" />

    <!-- Custom Attribution Bar -->
    <AttributionBar v-if="mapLoaded"
                    :scale-metric="computedScaleMetric"
                    :scale-proportion="computedScaleProportion"
                    :coordinates="currentCoordinates"
                    :altitude="computedAltitude"
                    :map="map" />

    <slot :map="map"></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';
// import { useRoute, useRouter } from 'vue-router';
import CustomHash from '@/components/map/core/MapStateManager.js';
import { getLayerConfig } from '@/constants/layers.js';
import MapControls from '@/components/map/controls/MapNavigationControls.vue';
import AttributionBar from '@/components/map/info/MapInfoBar.vue';
import CustomTerrainControl from '@/components/map/controls/customTerrainControl.js';
// import { LAYER_CONFIGS } from '@/constants/layers';
// import { reorderAllLayers } from '@/components/map/layers/layersOrder';

import {
  // setupDynamicLayers,
  setupSetoresLayer,
  setupDynamicSource
} from '@/components/map/layers/MapLayerController.js';
import {
  setupRasterInteractions,
  removeRasterInteractions,
  setupVectorInteractions,
  removeVectorInteractions,
  setupSetoresInteractions
} from '@/components/map/layers/MapLayerInteractionManager.js';

import { useMapLayers } from '@/composables/useMapLayers';
// import { LayerOrderManager } from '@/components/map/layers/layerOrderManager';
// import { LAYER_GROUPS } from '@/components/map/layers/layersOrder';

const locationStore = useLocationStore();
const layersStore = useLayersStore();
// const route = useRoute();
// const router = useRouter();

const mapContainer = ref(null);
const map = ref(null);
const customHash = ref(null);

const coordinates = ref(null);
const isLoadingCoordinates = ref(false);
const mapLoaded = ref(false);

// Map style state
const currentStyle = ref('streets');
const terrainEnabled = ref(false);

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
const { addLayer } = useMapLayers(map);

watch(
  [
    () => locationStore.cd_mun,
    () => currentLayer.value,
    () => currentScale.value,
    () => currentYear.value
  ],
  async([newCdMun], [oldCdMun]) => {
    // Only load coordinates if cd_mun changes AND it's a new municipality
    // O mapa é direcionado para o novo município
    if (newCdMun && newCdMun !== oldCdMun) {
      await initializeMapLocation(newCdMun);

      // Atualizar filtros de município em todas as camadas dinâmicas
      updateMunicipalityFilters(map.value, newCdMun);

    }

    if (mapLoaded.value) {
      removeDynamicLayer();

    }

    if (map.value.getLayer('selected-municipality-fill')) {
      map.value.setFilter('selected-municipality-fill', ['==', 'cd_mun', locationStore.cd_mun]);
    }
  }
);

// Função para atualizar os filtros do município
function updateMunicipalityFilters(mapInstance, newCdMun) {
  if (!mapInstance) { return; }

  // Percorrer todas as camadas instanciadas no mapa
  mapInstance.getStyle().layers.forEach(layer => {
    // Verificar se é uma camada dinâmica e vetorial
    if (layer.id.endsWith('-layer') && layer.type === 'fill') {
      // Aplicar filtro para excluir o município selecionado
      mapInstance.setFilter(layer.id, ['==', 'cd_mun', newCdMun]);
    }
  });

  map.value.setFilter('parks-layer', ['==', 'cd_mun', String(locationStore.cd_mun)]);
  // Atualizar o filtro do highlight_selected
  if (mapInstance.getLayer('highlight_selected-layer')) {
    mapInstance.setFilter('highlight_selected-layer', ['==', 'cd_mun', newCdMun]);
  }

  // Atualizar o filtro do out_selected_clickable_fill
  if (mapInstance.getLayer('out_selected_clickable_fill-layer')) {
    mapInstance.setFilter('out_selected_clickable_fill-layer', ['!=', 'cd_mun', newCdMun]);
  }

}

/* ---------------------------------------
   HELPER FUNCTIONS
---------------------------------------*/
function removeDynamicLayer() {
  if (!map.value) { return; }

  // Remover handlers de eventos
  removeRasterInteractions(map.value);
  removeVectorInteractions(map.value);

  // Remover camadas
  ['dynamic-layer', 'dynamic-layer-outline', 'parks-layer', 'setores-layer'].forEach(id => {
    if (map.value.getLayer(id)) {
      map.value.removeLayer(id);
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
    // Obter configuração da camada
    const config = getLayerConfig(currentLayer.value, currentYear.value, currentScale.value);

    // Adicionar a camada
    await addLayer(currentLayer.value, config);

    // Adicionar camadas adicionais se necessário
    if (currentScale.value === 'intraurbana' && currentCode.value) {
      if (config.type === 'raster') {
        addParksLayer();
        setupRasterInteractions(map.value, config, fetchRasterValue);
      } else {
        setupSetoresLayer(map.value, locationStore);
        setupSetoresInteractions(map.value, hoveredSetorId);
        addParksLayer();
        setupVectorInteractions(map.value, config);
      }
    }
  } catch (error) {
    console.error('Erro ao configurar layers:', error);
  }
}

// Função para adicionar camada de parques
function addParksLayer() {
  const parksConfig = getLayerConfig('parks', currentYear.value, currentScale.value);
  if (!parksConfig) { return; }

  const sourceConfig = setupDynamicSource(parksConfig, locationStore, currentScale.value);
  if (!map.value.getSource('parks-source')) {
    map.value.addSource('parks-source', sourceConfig);
  }

  if (!map.value.getLayer(parksConfig.id)) {
    const parksLayer = {
      id: parksConfig.id,
      type: parksConfig.renderType,
      source: 'parks-source',
      'source-layer': parksConfig.source.sourceLayer,
      paint: parksConfig.paint
    };
    map.value.addLayer(parksLayer);
  }

  map.value.setFilter(parksConfig.id, ['==', 'cd_mun', String(locationStore.cd_mun)]);
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
// function getScaleFromZoom(zoom) {
//   let scale;
//   if (zoom >= 10) {
//     scale = 'intraurbana';
//   }
//   else if (zoom > 5) {
//     scale = 'estadual';
//   }
//   else {
//     scale = 'nacional';
//   }

//   return scale;
// }

/* ---------------------------------------
   CORE FUNCTIONS
---------------------------------------*/

/** Busca as coordenadas de um município pelo código */
async function fetchMunicipalityCoordinates(code) {
  try {
    const coords = await locationStore.fetchCoordinatesByCode(code);
    if (coords?.lat && coords?.lng) {
      coordinates.value = coords;
      await locationStore.setLocation({
        lng: coords.lng,
        lat: coords.lat
      });

      return coords;
    }

    return null;
  } catch (err) {
    console.error('Error fetching municipality coordinates:', err);

    return null;
  }
}

/** Inicializa ou atualiza a localização do mapa */
async function initializeMapLocation(code) {
  isLoadingCoordinates.value = true;

  try {
    clearMunicipalityHoverState();

    // Remove any existing popups
    // if (vectorPopup.value) { vectorPopup.value.remove(); }

    // Set scale and trigger layer setup
    await locationStore.setLocation({ scale: 'intraurbana' });
    if (mapLoaded.value) {
      removeDynamicLayer();
      await initializeMapLayers();
    }

    const coords = await fetchMunicipalityCoordinates(code);
    if (coords) {
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
    console.error('Error initializing map location:', err);
  } finally {
    isLoadingCoordinates.value = false;
  }
}

/* ---------------------------------------
   MAP INITIALIZATION
---------------------------------------*/
// Função para criar o estado inicial do mapa
function createInitialMapState(coordinates, mapState) {
  return {
    center: mapState.center || [coordinates.lng, coordinates.lat],
    zoom: mapState.zoom || MAP_ZOOM_START,
    pitch: mapState.pitch || 20
  };
}

// Função para criar o mapa
function createMapInstance(container, initialState) {
  return new maplibregl.Map({
    container,
    style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=zuxU0KiQ4drdRZ555olV',
    ...initialState,
    attributionControl: false,
    minZoom: 3.5,
    maxZoom: 18,
  });
}

// Função refatorada
function initializeMap() {
  if (!coordinates.value) { return; }

  const mapState = locationStore.getMapState();
  const initialState = createInitialMapState(coordinates.value, mapState);

  // Usando a função createMapInstance
  map.value = createMapInstance(mapContainer.value, initialState);

  map.value.on('load', () => {
    mapLoaded.value = true;
    generateBaseLayers();
    initializeMapLayers();
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
    locationStore.updateScaleFromZoom(map.value.getZoom());
  });
}

/** Add municipality outline, click and move effects - ONLY SP STATE */
// function addBaseMunicipalitiesLayer() {
//   if (!map.value) { return; }

//   // Obter configurações das layers base
//   const baseConfig = getLayerConfig('base_municipalities', currentYear.value);
//   const selectedConfig = getLayerConfig('selected_municipality', currentYear.value);
//   const outlineConfig = getLayerConfig('municipalities_outline', currentYear.value);

//   // Adicionar source
//   map.value.addSource('base-municipalities', baseConfig.source);

//   // Configurar layers
//   const selectedMunicipalityConfig = {
//     id: 'selected-municipality-fill',
//     type: 'line',
//     source: 'base-municipalities',
//     'source-layer': baseConfig.source.sourceLayer,
//     paint: selectedConfig.paint,
//     filter: ['==', 'cd_mun', locationStore.cd_mun]
//   };

//   const baseMunicipalitiesConfig = {
//     id: 'municipalities-base',
//     type: 'fill',
//     source: 'base-municipalities',
//     'source-layer': baseConfig.source.sourceLayer,
//     paint: baseConfig.paint
//   };

//   const baseOutlineConfig = {
//     id: 'municipalities-base-outline',
//     type: 'line',
//     source: 'base-municipalities',
//     'source-layer': baseConfig.source.sourceLayer,
//     paint: outlineConfig.paint
//   };

//   // Registrar as layers no registry
//   layerRegistry.register('selected-municipality-fill', selectedMunicipalityConfig);
//   layerRegistry.register('municipalities-base', baseMunicipalitiesConfig);
//   layerRegistry.register('municipalities-base-outline', baseOutlineConfig);

//   // Adicionar as layers ao mapa
//   map.value.addLayer(selectedMunicipalityConfig);
//   map.value.addLayer(baseMunicipalitiesConfig);
//   map.value.addLayer(baseOutlineConfig);

//   // Events
//   map.value.on('mousemove', 'municipalities-base', handleMunicipalityMouseMove);
//   map.value.on('mouseleave', 'municipalities-base', handleMunicipalityMouseLeave);
//   map.value.on('click', 'municipalities-base', handleMunicipalityClick);
// }

function generateBaseLayers() {
  if (!map.value) { return; }

  const baseConfig = getLayerConfig('base_layer', currentYear.value, currentScale.value, locationStore.cd_mun);

  // Adicionar source se ainda não existir
  if (!map.value.getSource('base-municipalities')) {
    map.value.addSource('base-municipalities', baseConfig.source);
  }

  // Gerar e adicionar cada layer baseada nos roles
  Object.entries(baseConfig.roles).forEach(([roleName, role]) => {
    const layerId = `${roleName}-layer`;

    // Se a layer já existe, não adiciona novamente
    if (map.value.getLayer(layerId)) { return; }

    // Usar a configuração do role diretamente, apenas adicionando o necessário
    const layerConfig = {
      id: layerId,
      type: role.renderType,
      source: 'base-municipalities',
      'source-layer': baseConfig.source.sourceLayer,
      paint: role.paint
    };

    // Aplicar filtro se existir na configuração do role
    if (role.filter) {
      layerConfig.filter = role.filter(locationStore.cd_mun);
    }

    // Adicionar a layer ao mapa
    map.value.addLayer(layerConfig);
  });

  // Configurar eventos de interação usando o ID da layer de preenchimento
  const clickableLayerId = 'out_selected_clickable_fill-layer';
  const outlineLayerId = 'out_selected_outline-layer';

  // Configurar eventos de hover para a camada clicável
  map.value.on('mousemove', clickableLayerId, handleMunicipalityMouseMove);
  map.value.on('mouseleave', clickableLayerId, handleMunicipalityMouseLeave);
  map.value.on('click', clickableLayerId, handleMunicipalityClick);

  // Configurar eventos de hover para a camada de outline
  map.value.on('mousemove', outlineLayerId, handleMunicipalityMouseMove);
  map.value.on('mouseleave', outlineLayerId, handleMunicipalityMouseLeave);
}

function handleMunicipalityMouseMove(e) {
  const features = e.features;
  if (!features?.length) {
    clearMunicipalityHoverState();

    return;
  }

  const feat = features[0];
  const featId = feat.id || feat.properties.cd_mun;

  // Se estamos na escala intraurbana e este é o município atual, não fazemos nada
  if (currentScale.value === 'intraurbana' && feat.properties.cd_mun === locationStore.cd_mun) {
    clearMunicipalityHoverState();

    return;
  }

  // Caso contrário, prossiga com o comportamento normal de hover
  if (featId !== hoveredFeatureId) {
    clearMunicipalityHoverState();
    setHoveredState(featId);
  }

}

function clearMunicipalityHoverState() {
  if (!hoveredFeatureId || !map.value) { return; }

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
  clearMunicipalityHoverState();
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
async function setupMap() {
  if (!locationStore.cd_mun) { return; }

  try {
    // 1. Buscar coordenadas do município
    const coords = await fetchMunicipalityCoordinates(locationStore.cd_mun);
    if (!coords) {
      console.error('Não foi possível obter as coordenadas do município');

      return;
    }

    // 2. Criar instância do mapa
    const mapState = locationStore.getMapState();
    const initialState = createInitialMapState(coords, mapState);
    map.value = createMapInstance(mapContainer.value, initialState);

    // 3. Configurar eventos de carregamento do mapa
    map.value.on('load', async() => {
      mapLoaded.value = true;
      generateBaseLayers();
      await setupLayers();
    });

    // 4. Configurar referência do mapa no store
    layersStore.mapRef = map.value;

    // 5. Adicionar controles do mapa
    setupMapControls();

    // 6. Configurar gerenciamento de estado da URL
    setupUrlStateManagement();

    // 7. Configurar handlers de eventos do mapa
    setupMapEventHandlers();

    // 8. Definir escala inicial
    await locationStore.setLocation({ scale: 'intraurbana' });

  } catch (error) {
    console.error('Erro ao configurar mapa:', error);
  }
}

function setupMapControls() {
  if (!map.value) { return; }

  // Controle de navegação
  map.value.addControl(
    new maplibregl.NavigationControl({
      visualizePitch: true,
    }), 'top-left'
  );

  // Controle de geolocalização
  map.value.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true
    }),
    'top-left'
  );

  // Controle de terreno
  map.value.addControl(
    new CustomTerrainControl({
      source: 'terrain',
      exaggeration: 3,
      highPerformance: false,
      lazyLoading: true
    }), 'top-left'
  );
}

function setupUrlStateManagement() {
  if (!map.value) { return; }

  customHash.value = new CustomHash();
  customHash.value.addTo(map.value);
}

function setupMapEventHandlers() {
  if (!map.value) { return; }

  // Handler para imagens faltantes
  map.value.on('styleimagemissing', handleMissingImage);

  // Handler para atualização de escala baseada no zoom
  map.value.on('zoomend', () => {
    locationStore.updateScaleFromZoom(map.value.getZoom());
  });
}

async function setupLayers() {
  if (!map.value || !currentLayer.value) { return; }

  try {
    // Obter configuração da camada
    const config = getLayerConfig(currentLayer.value, currentYear.value, currentScale.value);

    alert(currentLayer.value);
    // Adicionar a camada usando o LayerOrderManager
    await addLayer(currentLayer.value);

    // Adicionar camadas adicionais se necessário
    if (currentScale.value === 'intraurbana' && currentCode.value) {
      if (config.type === 'raster') {
        addParksLayer();
        setupRasterInteractions(map.value, config, fetchRasterValue);
      } else {
        setupSetoresLayer(map.value, locationStore);
        setupSetoresInteractions(map.value, hoveredSetorId);
        addParksLayer();
        setupVectorInteractions(map.value, config);
      }
    }
  } catch (error) {
    console.error('Erro ao configurar layers:', error);
  }
}

onMounted(() => {
  setupMap();
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
