<!-- src/components/legend/MapLegend.vue -->
<template>
  <div class="legend-wrapper">
    <!-- Legend Header -->
    <div class="legend-header" @click="toggleLegend">
      <span class="body-small-semibold">Legenda</span>
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
        <div class="layers-header">
          <span>CAMADAS</span>
          <img :src="addIcon" />
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
          @click="() => { handleCompare(); refModalWaitlist.show()(); }"
        />
        <PrimaryButton
          label="Baixar"
          :filled="true"
          icon="bi-download"
          icon-position="left"
          @click="() => { handleDownload(); refModalWaitlist.show()(); }"
        />
      </div>
    </div>
  </div>

  <!-- Modal -->
  <modalWaitList ref="refModalWaitlist" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';

// Import components
import PrimaryButton from '../buttons/PrimaryButton.vue';
import LegendYearSelector from './LegendYearSelector.vue';
import LegendCard from './LegendCard.vue';
import modalWaitList from '../modal/modalWaitList.vue';

// Import icons
import wrapperIcon from '@/assets/icons/wrapper.svg';
import addIcon from '@/assets/icons/add.svg';

// Store setup
const locationStore = useLocationStore();
const layersStore = useLayersStore();
const { year: storeYear, category, categories, layer, scale } = storeToRefs(locationStore);

// Reactive state
const isOpen = ref(true);
const isLegendHovered = ref(false);

// Computed properties
const currentYear = computed(() => storeYear.value || 2021);
const currentLayerName = computed(() => locationStore.currentLayerName);
const currentCategory = computed(() =>
  categories.value?.find(cat => cat.name === category.value)
);
const currentLayerId = computed(() => layer.value);

// Event handlers
const toggleLegend = () => {
  isOpen.value = !isOpen.value;
};

const handleYearChange = (year) => {
  locationStore.setLocation({ year });
};

// const handleBaseLayerOpacity = (opacity) => {
//   locationStore.setBaseLayerOpacity(opacity);
// };

const handleDataLayerOpacity = (opacity) => {
  console.log('[MapLegend] Handling opacity change:', opacity);
  layersStore.setLayerOpacity(opacity);
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

// Referenca o modal para utilizar seus métodos
const refModalWaitlist = ref(null);
</script>

<style scoped>
/* Basic MapLegend styles */
.legend-wrapper {
  position: absolute;
  top: 33px;
  right: 33px;
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
  background-color: #F8F9FA;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.layers-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.layers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
}

.layers-header span {
  color: #525960;
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
}

.layers-header img {
  width: 16px;
  height: 16px;
  /* cursor: pointer; */
}

.buttons-container {
  background-color: #ffffff;
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
