<!-- urbverde-ui/src/components/legend/MapLegend.vue -->
<template>
  <div class="legend-wrapper">
    <!-- Legend Header -->
    <div class="legend-header" @click="toggleLegend">
      <span class="body-small-medium">Detalhes do mapa</span>
      <img
        :src="wrapperIcon"
        :class="{'icon-open': isOpen, 'icon-closed': !isOpen}"
        alt="toggle icon"
      />
    </div>

    <!-- Legend Body -->
    <div
      v-if="isOpen"
      class="legend-body"
      @mouseenter="isLegendHovered = true"
      @mouseleave="isLegendHovered = false"
    >
      <!-- Year Selector -->
      <LegendYearSelector
        :initial-year="currentYear"
        :showControlsOnlyOnHover="false"
        :legendHovered="isLegendHovered"
        :available-years="currentLayerAllowedYears"
        @year-change="handleYearChange"
      />

      <!-- Layer Cards -->
      <div class="layers-section">
        <div class="layers-header body-caption-medium">
          <p>LEGENDA</p>
          <!-- <img :src="addIcon" /> -->
        </div>

        <!-- Base Layer Card -->
        <LegendCard
          :showMenu="false"
          :showOpacity="false"
          :showColorScale="false"
          :showLegendLines="true"
          :scale="scale"
          @opacity-change="onLegendOpacityChange"
        />

        <!-- Parks Layer Card - Always above data layer, only show in intraurbana -->
        <LegendCard
          v-if="scale === 'intraurbana'"
          :showMenu="false"
          :showOpacity="true"
          :showColorScale="false"
          :layerId="'parks-layer'"
          :year="currentYear"
          :scale="scale"
          :showLegendLines="true"
          @opacity-change="handleParksLayerOpacity"
          @order-change="handleLayerOrderChange"
        />

        <!-- Data Layer Card -->
        <LegendCard
          v-if="currentLayerName"
          :showMenu="false"
          :title="currentLayerName"
          :icon="currentCategory?.icon"
          :layerId="currentLayerId"
          :year="currentYear"
          :scale="scale"
          :showLegendLines="false"
          @opacity-change="handleDataLayerOpacity"
          @colorbar-click="handleColorbarClick"
          @order-change="handleLayerOrderChange"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="isOpen" class="buttons-container">
      <div class="buttons-space">
        <PrimaryButton
          label="Comparar Camadas"
          :filled="false"
          icon="bi-layers"
          icon-position="left"
          @click="() => { handleCompare(); refModalWaitlistLegend.show(); }"
        />
        <PrimaryButton
          label="Baixar"
          :filled="true"
          icon="bi-download"
          icon-position="left"
          @click="() => { handleDownload(); refModalWaitlistLegend.show(); }"
        />
      </div>
    </div>
  </div>

  <!-- Modal -->
  <modalWaitList
    ref="refModalWaitlistLegend"
    :modalId="'modalWaitlistLegend'"
  />

  <!-- Visual indicators for drag operations -->
  <div v-if="isDragging"
       class="drag-indicator"
       :style="dragIndicatorStyle"
       :class="{'above': dragDirection === 'above', 'below': dragDirection === 'below'}">
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';
import { useWindowSize } from '@/utils/useWindowsSize';

// Import components
import PrimaryButton from '../buttons/PrimaryButton.vue';
import LegendYearSelector from './LegendYearSelector.vue';
import LegendCard from './LegendCard.vue';
import modalWaitList from '../modal/modalWaitList.vue';

// Import icons
import wrapperIcon from '@/assets/icons/wrapper.svg';
//import addIcon from '@/assets/icons/add.svg';

// Store setup
const locationStore = useLocationStore();
const layersStore = useLayersStore();
const { year: storeYear, category, categories, layer, scale } = storeToRefs(locationStore);

// Reactive state
const isOpen = ref(true);
const isLegendHovered = ref(false);
const isDragging = ref(false);
const dragDirection = ref(null); // 'above' or 'below'
const dragIndicatorStyle = ref({
  top: '0px',
  left: '0px',
  width: '100%',
  height: '4px'
});

const { smallerThan } = useWindowSize();

onMounted(() => {
  // Se for menor que tablet, fecha a legenda por padrão
  if (smallerThan('tablet')) {
    isOpen.value = false;
  }
});

// Computed properties
const currentYear = computed(() => storeYear.value || 2021);
const currentLayerName = computed(() => locationStore.currentLayerName);
const currentCategory = computed(() =>
  categories.value?.find(cat => cat.name === category.value)
);
const currentLayerId = computed(() => layer.value);
const currentLayerAllowedYears = computed(() =>
  // Get the allowed years for the current layer from your layer config
  // This is a placeholder - implement according to your layer management system
  [2016, 2017, 2018, 2019, 2020, 2021]
);

// Event handlers
const toggleLegend = () => {
  isOpen.value = !isOpen.value;
};

const handleYearChange = (year) => {
  locationStore.setLocation({ year });
};

const handleColorbarClick = () => {
  console.log('Color options clicked');
};

const handleCompare = () => {
  console.log('Compare layers clicked');
};

const handleDownload = () => {
  console.warn('Downloading data...');
};

// Opacity handlers
const onLegendOpacityChange = (opacity) => {
  // Handle base layer opacity if needed
  console.log('Base layer opacity:', opacity);
};

// Parks layer opacity handler
const handleParksLayerOpacity = (opacity) => {
  console.log('[MapLegend] Handling parks opacity change:', opacity);

  // Convert from percentage (0-100) to decimal (0-1)
  const decimalOpacity = opacity / 100;

  // Update through layersStore to ensure we track this layer's opacity
  layersStore.setLayerOpacity('parks-layer', decimalOpacity);
};

const handleDataLayerOpacity = (opacity) => {
  console.log('[MapLegend] Handling opacity change:', opacity, 'for layer:', currentLayerId.value);

  // Convert from percentage (0-100) to decimal (0-1)
  const decimalOpacity = opacity / 100;

  // Track the opacity for this layer ID in the store
  layersStore.setLayerOpacity(currentLayerId.value, decimalOpacity);

  // IMPORTANT: Also directly update the dynamic-layer
  const mapRef = layersStore.mapRef;
  if (mapRef) {
    if (mapRef.getLayer('dynamic-layer')) {
      // Check layer type to use correct opacity property
      const layer = mapRef.getLayer('dynamic-layer');
      const isRaster = layer.type === 'raster';
      const opacityProp = isRaster ? 'raster-opacity' : 'fill-opacity';

      mapRef.setPaintProperty('dynamic-layer', opacityProp, decimalOpacity);
      console.log(`[MapLegend] Directly updated dynamic-layer opacity to ${decimalOpacity} (${opacityProp})`);
    }

    if (mapRef.getLayer('dynamic-layer-outline')) {
      mapRef.setPaintProperty('dynamic-layer-outline', 'line-opacity', decimalOpacity);
      console.log(`[MapLegend] Directly updated dynamic-layer-outline opacity to ${decimalOpacity}`);
    }
  }
};

// Layer order handling
const handleLayerOrderChange = (direction) => {
  console.log('Layer order change:', direction);
};

// Referenca o modal para utilizar seus métodos
const refModalWaitlistLegend = ref(null);

</script>

<style scoped lang="scss">
/* Basic MapLegend styles */
.legend-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 264px;
  height: auto;
  max-height: calc(100% - 40px);
  border-radius: 16px;
  background-color: #F8F9FA;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1;
  transition: opacity 0.3s ease-in-out;
  cursor: default;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.13);
}

.legend-header img {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.icon-open {
  transform: rotate(180deg);
}

.icon-closed {
  transform: rotate(0deg);
}

.legend-body {
  padding: 16px;
  background-color: map-get($gray, 100);
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.layers-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.layers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
}

.layers-header p {
  margin: 0;
  color: map-get($theme, secondary);
}

.layers-header img {
  width: 16px;
  height: 16px;
  /* cursor: pointer; */
}

.buttons-container {
  background-color: map-get($gray, white);
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.buttons-space {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
}

.buttons-space :deep(button) {
  width: 100%;
  border-radius: 12px;
}

/* Drag indicator styles */
.drag-indicator {
  position: absolute;
  background-color: #4CAF50;
  z-index: 1000;
  pointer-events: none;
  transition: all 0.1s ease;
}

.drag-indicator.above {
  border-top: 2px solid #4CAF50;
}

.drag-indicator.below {
  border-bottom: 2px solid #4CAF50;
}

/* Card being dragged */
.card-dragging {
  opacity: 0.7;
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
</style>
