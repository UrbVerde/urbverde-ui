<!-- to-do: show blocked icon or grayer color, dont higlight selected one in blue like this.
 show it according to settings, so for some scales we already have more than one available (nacional has pais and estado)
 estadual has municipio and estado

 note-to-self: those will be according to the layer chosen. eg: rasters will be only por pixel -->

<!-- TempSection.vue -->
<template>
  <div class="root-container">
    <div class="section-container" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
      <!-- Header -->
      <div class="header-section">
        <div class="icon-wrapper">
          <div class="icon-container">
            <div class="icon-inner">
              <IconComponent :name="currentCategory?.icon || 'bi-question-circle'" :size="20" />
            </div>
          </div>
        </div>
        <div class="title-wrapper">
          <div class="title-text" :class="{ 'shortened': isHovered }">
            <transition name="fade" mode="out-in">
              <span :key="isHovered">{{ isHovered ? shortLayerName : layerName }}</span>
            </transition>
          </div>
        </div>

        <!-- Three dots menu (only on hover) -->
        <button v-if="isHovered" class="menu-button">
          <IconComponent name="bi-three-dots-vertical" :size="16" color="#6C757D" />
        </button>
      </div>

      <!-- Gradient legend for temperature -->
      <div class="gradient-section">
        <div class="gradient-container">
          <div class="gradient-bar"></div>
          <div class="temp-labels">
            <div class="label-left">
              <div class="temp-value">-5°C</div>
            </div>
            <div class="label-center">0°C</div>
            <div class="label-right">
              <div class="temp-value">+5°C</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sector Selector (only on hover) -->
      <transition name="fade">
        <div v-if="isHovered" class="sector-selector">
          <span class="select-label">por</span>
          <select v-model="selectedRecorte" @change="handleRecorteChange" class="recorte-select">
            <option
              v-for="(recorte, index) in availableRecortesByScale"
              :key="recorte"
              :value="recorte"
              :disabled="index !== 0"
            >
              {{ recorte }}
            </option>
          </select>
        </div>
      </transition>

      <!-- Controls Section (only on hover) -->
      <transition name="fade">
        <div v-if="isHovered" class="controls-section">
          <div class="visibility-controls">
            <button class="eye-container" @click="toggleVisibility">
              <div class="eye-wrapper">
                <div class="eye-icon">
                  <IconComponent :name="opacity > 0 ? 'bi-eye' : 'bi-eye-slash'"
                                 :size="16"
                                 :color="opacity > 0 ? '#198754' : '#6C757D'" />
                </div>
              </div>
            </button>
            <div class="percentage-text">{{ opacity }}%</div>
          </div>
          <div class="progress-container">
            <input type="range"
                   v-model="opacity"
                   min="0"
                   max="100"
                   class="opacity-slider" />
            <div class="progress-bg"></div>
            <div class="progress-fg" :style="{ width: opacity + '%' }"></div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
import IconComponent from '@/components/icons/IconComponent.vue';
import { useLocationStore } from '@/stores/locationStore';
import { storeToRefs } from 'pinia'; //not sure if we should be using this here.
import { computed } from 'vue';

export default {
  name: 'TempSection',
  components: {
    IconComponent
  },
  setup() {
    const locationStore = useLocationStore();
    const {
      categories,
      category,
      layerName,
      scale
    } = storeToRefs(locationStore);

    const currentCategory = computed(() => categories.value.find(cat => cat.name === category.value));

    return {
      layerName,
      currentCategory,
      scale
    };
  },
  data() {
    return {
      opacity: 100, //trocar pra isso ser em função do basemap, caso o basemap seja satelite a opacidade é 80%
      isHovered: false,
      selectedRecorte: 'Setor IBGE 2022',
      recortesByScale: {
        intraurbana: [
          'Setor IBGE 2022',
          'Setor IBGE 2010',
          'Micro-Bacias',
          'Bairro',
          'Praça',
          'Rua',
        ],
        municipal: [
          'Município',
          'Bacia',
          'Microrregião',
          'Mesorregião',
        ],
        estadual: [
          'Município',
          'Bacia',
          'Microrregião',
          'Mesorregião',
          'Estado',
        ],
        nacional: [
          'Estado',
          'Região',
          'País',
        ]
      }
    };
  },
  computed: {
    shortLayerName() {
      return this.layerName.length > 12
        ? `${this.layerName.slice(0, 12)  }...`
        : this.layerName;
    },
    availableRecortesByScale() {
      return this.recortesByScale[this.scale] || this.recortesByScale.intraurbana;
    }
  },
  methods: {
    toggleVisibility() {
      this.opacity = this.opacity > 0 ? 0 : 100;
    },
    handleRecorteChange() {
      this.$emit('recorte-change', this.selectedRecorte);
    }
  },
  watch: {
    scale() {
      this.selectedRecorte = this.availableRecortesByScale[0];
    }
  }
};
</script>

<style scoped>
/* --- Root Container --- */
.root-container {
  width: 100%;
  height: auto;
  display: flex;
}

/* --- Section Container --- */
.section-container {
  width: 232px;
  padding: 16px 0 24px;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: 1px #E9ECEF solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

/* --- Header Section --- */
.header-section {
  align-self: stretch;
  padding: 0 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
}

.icon-container {
  width: 32px;
  height: 32px;
  padding: 4px;
  background: #E9ECEF;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.icon-inner {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.title-wrapper {
  flex: 1;
  align-self: stretch;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
}

.title-text {
  flex: 1;
  color: #212529;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  line-height: 21px;
  word-wrap: break-word;
}

/* Menu button styles */
.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.menu-button:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}

/* --- Gradient Section --- */
.gradient-section {
  align-self: stretch;
  height: 41px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

.gradient-container {
  align-self: stretch;
  height: 41px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
}

.gradient-bar {
  align-self: stretch;
  height: 16px;
  padding: 8px;
  background: linear-gradient(90deg, #388BBB 0%, #FADE8C 50%, #D74752 100%);
  border-radius: 2px;
}

.temp-labels {
  align-self: stretch;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.label-left,
.label-right {
  flex: 1;
  background: rgba(255, 255, 255, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label-left {
  align-items: flex-start;
}

.label-right {
  align-items: flex-end;
}

.label-center {
  flex: 1;
  text-align: center;
  color: #212529;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 400;
  line-height: 21px;
  word-wrap: break-word;
}

.temp-value {
  color: #212529;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 400;
  line-height: 21px;
  word-wrap: break-word;
}

/* --- Controls Section --- */
.controls-section {
  align-self: stretch;
  height: 18px;
  padding: 0 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}

.visibility-controls {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
}

.eye-container {
  padding: 2px 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  height: 24px;
  width: 24px;
}

.eye-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.percentage-text {
  color: #212529;
  font-size: 12px;
  font-family: Inter, sans-serif;
  font-weight: 400;
  line-height: 18px;
  word-wrap: break-word;
}

.progress-container {
  flex: 1;
  height: 7px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  position: relative;
}

.opacity-slider {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  opacity: 0;
  z-index: 2;
}

.progress-bg {
  position: absolute;
  width: 100%;
  height: 7px;
  background: #E9ECEF;
  z-index: 0;
}

.progress-fg {
  position: absolute;
  height: 7px;
  background: #75B798;
  transition: width 0.2s ease;
  z-index: 1;
}

/* --- Sector Selector --- */
.sector-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  padding: 0 24px;
  justify-content: flex-start;
}

.select-label {
  color: #525960;
  font-size: 14px;
  font-family: Inter, sans-serif;
  white-space: nowrap;
}

.recorte-select {
  width: 100%;
  min-width: 60px;
  text-align: left;
  font-size: 14px;
  color: #525960;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: white;
  cursor: pointer;
  font-family: Inter, sans-serif;

  /* Reset default select styles */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* Add custom dropdown arrow */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23525960' d='M3 5h6L6 9z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  padding-right: 24px;
  /* Space for the arrow */
}

.recorte-select:hover {
  border-color: #adb5bd;
}

.recorte-select:focus {
  outline: none;
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Maintain other styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
