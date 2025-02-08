<!-- urbverde-ui/src/components/map/Legenda.vue -->
<template>
  <div class="legend-wrapper">
    <div class="legend-header" @click="toggleLegend">
      <span class="body-small-semibold">Legenda</span>
      <img :src="wrapperIcon" :class="{'icon-open': isOpen, 'icon-closed': !isOpen}" alt="toggle icon" />
    </div>

    <div v-if="isOpen" class="legend-body">
      <YearSection
        :initial-year="2021"
        :year-range="6"
        @year-change="handleYearChange"/>
      <LayerSection/>
      <TempSection/>
    </div>

    <div v-if="isOpen" class="buttons-container">
      <div class="buttons-space">
        <PrimaryButton
          label="Comparar Camadas"
          :filled="false"
          :icon="wrapperIcon"
          icon-position="left"
        >
        </PrimaryButton>

        <PrimaryButton
          label="Baixar"
          :filled
          :icon="wrapperIcon"
          icon-position="left"
          @click="downloadData"
        >
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script>
import wrapperIcon from '../../assets/icons/wrapper.svg';
import PrimaryButton from '../buttons/PrimaryButton.vue';
import LayerSection from './LayerSection.vue';
import TempSection from './TempSection.vue';
import YearSection from './YearSection.vue';

export default {
  name: 'SubtitleMain',
  components: {
    PrimaryButton, LayerSection, TempSection, YearSection
  },
  data() {
    return {
      isOpen: false,
      wrapperIcon,
      selectedYear: 2021,
      availableYears: [2021, 2020, 2019, 2018],
      isHovered: false
    };
  },
  methods: {
    toggleLegend() {
      this.isOpen = !this.isOpen;
    },
    downloadData() {
      console.warn('Baixando os dados...');
    },
  }
};
</script>

<style scoped>
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
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.13) inset;
}

.legend-header span {
  margin-left: 16px;
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

.buttons-space button {
  width: 100%;
  border-radius: 12px;
}
</style>
