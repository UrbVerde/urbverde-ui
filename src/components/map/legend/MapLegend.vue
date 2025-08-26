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
        </div>

        <!-- Basemap Lines Layer Card -->
        <LegendCard
          :showMenu="false"
          :showOpacity="false"
          :showColorScale="false"
          :showLegendLines="true"
          :scale="scale"
          @opacity-change="onLegendOpacityChange"
        />

        <!-- Parks Layer Card - Always above data layer, only show in intraurbana -->
        <!-- <LegendCard
          v-if="scale === 'intraurbana'"
          :showMenu="false"
          :showOpacity="true"
          :showColorScale="false"
          :layerId="'parks-layer'"
          :year="currentYear"
          :scale="scale"
          :showLegendLines="true"
          @opacity-change="handlerParksLayerOpacity"
        /> -->

        <!-- Dynamic Layer Cards -->
        <DraggableLayerList
          :current-year="currentYear"
          :scale="scale"
          @opacity-change="handleDataLayerOpacity"
          @colorbar-click="handleColorbarClick"
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
          @click="() => { handleCompare(); refModalCompareLayers.show(); }"
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
  <modalCompareLayers
    ref="refModalCompareLayers"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';
import { useWindowSize } from '@/utils/useWindowsSize';
// import { getLayerConfig } from '@/constants/layers';

// Import components
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import LegendYearSelector from '@/components/map/legend/LegendYearSelector.vue';
import LegendCard from '@/components/map/legend/LegendCard.vue';
import DraggableLayerList from '@/components/map/legend/DraggableLayerList.vue';
import modalCompareLayers from '@/components/modal/modalCompareLayers.vue';

// Import icons
import wrapperIcon from '@/assets/icons/wrapper.svg';

// Store setup
const locationStore = useLocationStore();
const layersStore = useLayersStore();
const { scale } = storeToRefs(locationStore);

// Reactive state
const isOpen = ref(true);
const isLegendHovered = ref(false);

const { smallerThan } = useWindowSize();

onMounted(() => {
  // Se for menor que tablet, fecha a legenda por padrão
  if (smallerThan('tablet')) {
    isOpen.value = false;
  }
});

// Computed properties
const currentYear = computed(() => layersStore.getCurrentYear);
const currentLayerAllowedYears = computed(() =>
  [2016, 2017, 2018, 2019, 2020, 2021]
);

// const activeLayers = computed(() => layersStore.getActiveLayers);

// Event handlers
const toggleLegend = () => {
  isOpen.value = !isOpen.value;
};

const handleYearChange = (year) => {
  locationStore.setLocation({ year });
};

const handleColorbarClick = () => {
  // Color options clicked
};

const handleCompare = () => {
  refModalCompareLayers.value.show();
};

const handleDownload = () => {
  // Downloading data...
};

// Opacity handlers
const onLegendOpacityChange = () => {
  // Handle base layer opacity if needed
};

// const handlerParksLayerOpacity = (opacity) => {
//   const decimalOpacity = opacity / 100;
//   layersStore.setLayerOpacity('parks-layer', decimalOpacity);
// };
const handleDataLayerOpacity = (opacity, layerId) => {
  const decimalOpacity = opacity / 100;
  layersStore.setLayerOpacity(layerId, decimalOpacity);
};

// Referenca o modal para utilizar seus métodos
const refModalWaitlistLegend = ref(null);
const refModalCompareLayers = ref(null);

// const props = defineProps({
//   map: {
//     type: Object,
//     required: true
//   }
// });
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
</style>
