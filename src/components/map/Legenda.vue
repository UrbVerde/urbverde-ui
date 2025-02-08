<!-- Legend.vue -->
<template>
  <div class="legend-wrapper">
    <div class="legend-header" @click="toggleLegend">
      <span>Legenda</span>
      <img :src="wrapperIcon" :class="{'icon-open': isOpen, 'icon-closed': !isOpen}" alt="toggle icon" />
    </div>

    <div v-if="isOpen" class="legend-body">
      <!-- Year Section with YearPicker styling -->
      <div class="section-container">
        <div class="year-section">
          <div class="year-label">
            <img src="@/assets/icons/calendar.svg" alt="Calendar icon" />
            <span>Ano</span>
          </div>
          <div class="input-wrapper">
            <span
              class="nav-button"
              @click="handleYearChange(-1)"
              :class="{ 'disabled': !canNavigateBack }"
            >
              <i class="bi bi-chevron-left"></i>
            </span>
            <div class="input-container">
              <input
                class="input-text body-small-regular"
                :value="formattedYear"
                readonly
              />
            </div>
            <span
              class="nav-button"
              @click="handleYearChange(1)"
              :class="{ 'disabled': !canNavigateForward }"
            >
              <i class="bi bi-chevron-right"></i>
            </span>
          </div>
        </div>
      </div>

      <span>CAMADAS</span>
      <!-- Layers Section -->
      <div class="section-container">
        <div class="layers-section">
          <IconComponent :name="currentCategoryIcon" :size="20" />
          <p>{{ currentLayerName }}</p>
        </div>
        <div class="layer-details">
          <p class="layer-sub"><span class="legend-line black"></span>Setores censitários</p>
          <p class="layer-sub"><span class="legend-line blue"></span>Municípios</p>
        </div>
      </div>

      <!-- Temperature Section -->
      <div class="section-container">
        <div class="temperatura-header">
          <img src="@/assets/icons/temperatura.svg" alt="Temperature icon" />
          <p>Temperatura de Superfície</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import wrapperIcon from '@/assets/icons/wrapper.svg';
import IconComponent from '@/components/icons/IconComponent.vue';
import { useLocationStore } from '@/stores/locationStore';

export default {
  name: 'MapLegend',
  components: {
    IconComponent
  },
  setup() {
    const locationStore = useLocationStore();
    const isOpen = ref(true);
    const availableYears = ref([2018, 2019, 2020, 2021]);

    // Computed properties for year navigation
    const currentYearIndex = computed(() =>
      availableYears.value.indexOf(locationStore.year)
    );

    const canNavigateBack = computed(() => currentYearIndex.value > 0);
    const canNavigateForward = computed(() =>
      currentYearIndex.value < availableYears.value.length - 1
    );

    const formattedYear = computed(() =>
      locationStore.year ? `${locationStore.year}` : ''
    );

    const currentLayerName = computed(() => locationStore.currentLayerName);
    const currentCategoryIcon = computed(() => {
      const category = locationStore.categories.find(
        cat => cat.name === locationStore.category
      );

      return category?.icon || 'layer';
    });

    // Year navigation methods
    const handleYearChange = (direction) => {
      const newIndex = currentYearIndex.value + direction;
      if (newIndex >= 0 && newIndex < availableYears.value.length) {
        locationStore.setLocation({ year: availableYears.value[newIndex] });
      }
    };

    // Keyboard navigation
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        handleYearChange(-1);
      } else if (event.key === 'ArrowRight') {
        handleYearChange(1);
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleKeyPress);
      // Set default year if not set
      if (!locationStore.year) {
        locationStore.setLocation({ year: availableYears.value[0] });
      }
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyPress);
    });

    return {
      isOpen,
      wrapperIcon,
      formattedYear,
      canNavigateBack,
      canNavigateForward,
      currentLayerName,
      currentCategoryIcon,
      handleYearChange,
      toggleLegend: () => isOpen.value = !isOpen.value
    };
  }
};
</script>

<style scoped>
/* Keep existing styles and add these new ones */
.input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-container {
  border-radius: 7px;
  padding: 5px 9px;
  display: inline-flex;
  align-items: center;
  border: 1px solid #CED4DA;
  background-color: white;
  max-width: 120px;
  height: 40px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  color: #6C757D;
}

.nav-button:hover:not(.disabled) {
  background-color: #f0f0f0;
}

.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-text {
  border: none;
  outline: none;
  background: transparent;
  width: auto;
  min-width: 0;
  box-sizing: content-box;
  padding: 0;
  margin: 0;
  text-align: center;
}

.legend-wrapper {
  position: absolute;
  top: 33px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 264px;
  height: auto;
  max-height: calc(100% - 40px);
  border-radius: 16px 0px 0px 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 2; /* Keep legend above map */
  transition: opacity 0.3s ease-in-out;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background-color: #f8f9fa;
  cursor: pointer;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.13) inset;
}

.legend-header span {
    margin-left: 16px;
    font-weight: bold;
}
.legend-header img {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  /* margin-right: 16px; */
}

.icon-open {
  transform: rotate(180deg); /* Rotaciona o ícone quando a legenda está aberta */
}

.icon-closed {
  transform: rotate(0deg); /* Ícone na posição padrão quando fechada */
}

.legend-body {
  padding: 16px;
  background-color: #F8F9FA;
  overflow-y: auto; /* Add scroll if content exceeds container height */
}

/* Estilo para a seção do ano */
.section-container {
  background-color: #FFF;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.year-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* .year-label {
  display: flex;
  align-items: center;
} */

.year-label img {
  margin-right: 10px;
}

select {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  width: 120px;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
}

.layers-section{
 display: flex;
}

.layers-section p{
  margin-left: 10px;
  font-weight: bold
}

.layers-item {
    display: flex;
}

.layer-sub {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.legend-line {
  width: 20px;
  height: 2px;
  margin-right: 8px;
  display: inline-block;
}

.legend-line.black {
  background-color: black;
}

.legend-line.blue {
  background-color: blue;
}

.temperatura-header {
  display: flex;
  margin-top: 0;
}

.temperatura-header p {
  font-weight: bold;
}

.temperature-scale {
  justify-content: space-betsween;
  align-items: center;
  margin-top: 10px;
}

.temperature-bar {
  width: 80%;
  height: 16px;
  background: linear-gradient(to right, blue, green, yellow, red);
  border-radius: 4px;
  margin: 0 10px;
}

.compare-button,
.download-button {
  text-align: center;
  width: 80%;

}

.compare {
  display: flex;
  justify-content: center;
}

.compare button {
  width: 100%;
  border-radius: 12px;
  background-color: white;
  border: 2px solid #00a651;
  border-radius: 8px;
  padding: 10px 20px;
  color: #00a651;
  font-size: 14px;
  cursor: pointer;
}

.compare button:hover {
  background-color: #00a651;
  color: white;
}

.download-button {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 80px;
}
.download-button button {
  width: 100%;
  background-color: #00a651;
  color: white;
  border: none;
  border-radius: 16px;
  border: 2px solid #00a651;
  border-radius: 8px;
  padding: 10px 16px;
}
  </style>
