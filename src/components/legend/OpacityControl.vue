<!-- urbverde-ui/src/components/legend/OpacityControl.vue -->
<template>
  <div class="controls-section" @click="handleControlsClick">
    <div class="visibility-controls">
      <button class="eye-container" @click.stop="toggleVisibility">
        <div class="eye-wrapper">
          <div class="eye-icon">
            <i
              :class="[modelValue > 0 ? 'bi bi-eye' : 'bi bi-eye-slash']"
              :style="{ color: modelValue > 0 ? '#025949' : '#025949' }"
            ></i>
          </div>
        </div>
      </button>
      <div class="input-wrapper" @click.stop="toggleSlider">
        <input
          type="text"
          v-model="opacityValue"
          @blur="validateAndUpdate"
          @keyup.enter="validateAndUpdate"
          class="percentage-input body-small-medium"
          :class="{ 'error': isInvalid }"
        />
        <span class="percentage-symbol">%</span>
      </div>
    </div>
    <div v-show="showSlider" class="slider-wrapper">
      <div class="progress-container">
        <input
          type="range"
          :value="modelValue"
          @input="updateValue($event.target.value)"
          @mouseup="closeSlider"
          @touchend="closeSlider"
          min="0"
          max="100"
          class="opacity-slider"
          @click.stop
        />
        <div class="progress-bg"></div>
        <div class="progress-fg" :style="{ width: modelValue + '%' }"></div>
        <div class="slider-thumb" :style="{ left: modelValue + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useLayersStore } from '@/stores/layersStore';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    default: 100
  },
  layerId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
const layersStore = useLayersStore();

// Estado reativo
const opacityValue = ref(props.modelValue);
const showSlider = ref(false);
const isInvalid = ref(false);

// Assistir mudanças no modelValue para atualizar o input
watch(() => props.modelValue, (newValue) => {
  opacityValue.value = newValue;
});

// Gerenciamento de cliques externos
const handleClickOutside = (event) => {
  const controlsSection = document.querySelector('.controls-section');
  if (controlsSection && !controlsSection.contains(event.target)) {
    showSlider.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  // Inicializa a opacidade a partir do store
  const currentLayer = layersStore.activeLayers.find(l => l.id === props.layerId);
  if (currentLayer && currentLayer.opacity !== props.modelValue / 100) {
    const newOpacity = Math.round(currentLayer.opacity * 100);
    emit('update:modelValue', newOpacity);
    opacityValue.value = newOpacity;
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Methods
const toggleVisibility = () => {
  const newValue = props.modelValue > 0 ? 0 : 100;
  updateOpacity(newValue);
};

const handleControlsClick = () => {
  if (!showSlider.value) {
    showSlider.value = true;
  }
};

const toggleSlider = () => {
  showSlider.value = !showSlider.value;
};

const closeSlider = () => {
  // Fecha o slider após o usuário soltar o mouse
  setTimeout(() => {
    showSlider.value = false;
  }, 250); // Pequeno atraso para garantir que o valor seja atualizado
};

const updateValue = (value) => {
  const numValue = Number(value);
  const validValue = Math.max(0, Math.min(100, numValue));
  updateOpacity(validValue);
};

const validateAndUpdate = () => {
  let num = Number(opacityValue.value);

  if (isNaN(num)) {
    // Caso seja NaN, restaura o valor anterior
    opacityValue.value = props.modelValue;

    return;
  }

  // Limita o valor entre 0 e 100
  if (num < 0) {
    num = 0;
  } else if (num > 100) {
    num = 100;
  }

  isInvalid.value = false;
  opacityValue.value = num;
  updateOpacity(num);
};

const updateOpacity = (value) => {
  emit('update:modelValue', value);
  layersStore.setLayerOpacity(props.layerId, value / 100);
};
</script>

<style scoped lang="scss">
.controls-section {
  align-self: stretch;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
  padding: 8px 8px 20px 32px;
  background: radial-gradient(50% 50% at 50% 50%, #FFF 53%, rgba(255, 255, 255, 0.00) 100%);
}

.visibility-controls {
  display: flex;
  padding: 4px 8px 4px 6px;
  align-items: center;
  gap: 0px;
  border-radius: 8px;
  border: 1px solid map-get($primary-fade, 200);
  background: map-get($gray, white);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content:flex-end;
  cursor: pointer;
}

.slider-wrapper {
  position: absolute;
  top: 70%;
  right: 8px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid map-get($gray, 200);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 120px;
  z-index: 100;
  margin-top: 4px;
}

.eye-container {
  padding: 2px 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  height: 24px;
  width: 24px;
  background-color: map-get($green, 100);
  transition: 0.1s;
}

.eye-container:hover {
  background-color: map-get($green, 200);
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
  font-size: 18px;
  margin-top: 2px;
}

.percentage-input {
  color: map-get($theme, primary);
  max-width: 30px;
  background: transparent;
  border: none;
  margin: 0 2px 0 0;
  text-align: right;
  align-items: center;
  outline: none;
  padding: 0;
  line-height: 1;
  font-size: 14px;
}

.percentage-symbol {
  color: map-get($theme, primary);
  font-size: 14px;
  padding-top: 1px;
}

.progress-container {
  height: 6px;
  border-radius: 8px;
  overflow: visible;
  position: relative;
  width: 100%;
  margin: 4px 0;
}

.opacity-slider {
  position: absolute;
  width: 100%;
  height: 18px;
  margin: 0;
  top: -6px;
  cursor: grab;
  opacity: 0.01;
  z-index: 2;
  -webkit-appearance: none;
  appearance: none;
}

.opacity-slider:active::-webkit-slider-thumb {
  cursor: grabbing;
}

.opacity-slider:active::-moz-range-thumb {
  cursor: grabbing;
}

.progress-bg {
  position: absolute;
  width: 100%;
  height: 6px;
  background: map-get($gray, 200);
  z-index: 0;
  border-radius: 8px;
}

.progress-fg {
  position: absolute;
  height: 6px;
  background: map-get($primary-fade, 300);
  z-index: 1;
  border-radius: 8px;
}

.slider-thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: map-get($theme, primary);
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  z-index: 3;
  pointer-events: none;
}
</style>
