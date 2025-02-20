<!-- urbverde-ui/src/components/legend/OpacityControl.vue -->
<template>
  <div class="controls-section">
    <div class="visibility-controls">
      <button class="eye-container" @click="toggleVisibility">
        <div class="eye-wrapper">
          <div class="eye-icon">
            <IconComponent
              :name="modelValue > 0 ? 'bi-eye' : 'bi-eye-slash'"
              :size="16"
              :color="modelValue > 0 ? '#198754' : '#6C757D'"
            />
          </div>
        </div>
      </button>
      <div class="percentage-text">{{ modelValue }}%</div>
    </div>
    <div class="progress-container">
      <input
        type="range"
        :value="modelValue"
        @input="updateValue($event.target.value)"
        min="0"
        max="100"
        class="opacity-slider"
      />
      <div class="progress-bg"></div>
      <div class="progress-fg" :style="{ width: modelValue + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import {  onMounted } from 'vue';
import { useLayersStore } from '@/stores/layersStore';
import IconComponent from '@/components/icons/IconComponent.vue';

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

// Methods
const toggleVisibility = () => {
  const newValue = props.modelValue > 0 ? 0 : 100;
  updateOpacity(newValue);
};

const updateValue = (value) => {
  updateOpacity(Number(value));
};

const updateOpacity = (value) => {
  emit('update:modelValue', value);
  layersStore.setLayerOpacity(props.layerId, value / 100);
};

// Initialize opacity from store on mount
onMounted(() => {
  const currentLayer = layersStore.activeLayers.find(l => l.id === props.layerId);
  if (currentLayer && currentLayer.opacity !== props.modelValue / 100) {
    emit('update:modelValue', currentLayer.opacity * 100);
  }
});
</script>

<style scoped>
.controls-section {
  align-self: stretch;
  height: 18px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.visibility-controls {
  display: flex;
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
  background: none;
  cursor: pointer;
  height: 24px;
  width: 24px;
}

.eye-container:hover {
  background-color: #f0f0f0;
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
  min-width: 36px;
}

.progress-container {
  flex: 1;
  height: 7px;
  border-radius: 8px;
  overflow: hidden;
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
</style>
