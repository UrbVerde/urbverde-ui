<!-- urbverde-ui/src/components/legend/LegendCard.vue -->
<!-- LegendCard.vue -->
<template>
  <div class="card-container shadow-sm">
    <!--  @mouseenter="isHovered = true" @mouseleave="isHovered = false" -->
    <!-- Drag handle -->
    <div v-if="draggable && isHovered" class="drag-handle">
      <IconComponent name="drag" size="20" />
    </div>

    <!-- Header -->
    <div class="header" v-if="title || icon || showMenu">
      <div v-if="icon" class="icon-wrapper">
        <IconComponent :name="icon || 'bi-question-circle'" :size="20" />
      </div>

      <div class="title-wrapper">
        <span v-if="title" class="title body-small-regular" :class="{ 'with-ellipsis': isHovered }">
          {{ title }}
        </span>

        <button v-if="showMenu && isHovered" class="menu-button">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Color Scale -->
      <ColorScale v-if="showColorScale"
                  :currentLayerId="layerId"
                  :currentYear="year"
                  :scale="scale"
                  @colorbar-click="$emit('colorbar-click')" />

      <!-- Legend Lines -->
      <div v-if="showLegendLines" class="legend-lines">
        <p v-if="scale === 'intraurbana' && title !== 'Temperatura de superfície'" class="legend-item body-small-regular">
          <span class="legend-line census"></span>Setores censitários
        </p>
        <p v-else class="legend-item body-small-medium">
          <span class="legend-line municipal"></span>Municípios
        </p>
      </div>

      <!-- Opacity Control -->
      <!-- <OpacityControl v-if="showOpacity && isHovered"
                      v-model="localOpacity"
                      :layerId="layerId"
                      @update:modelValue="handleOpacityChange" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IconComponent from '@/components/icons/IconComponent.vue';
import ColorScale from './ColorScale.vue';
// import OpacityControl from './OpacityControl.vue';

defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  draggable: {
    type: Boolean,
    default: false
  },
  showMenu: {
    type: Boolean,
    default: true  // Changed to true to match original behavior
  },
  showOpacity: {
    type: Boolean,
    default: true  // Changed to true to match original behavior
  },
  showColorScale: {
    type: Boolean,
    default: true  // Changed to true to match original behavior
  },
  showLegendLines: {
    type: Boolean,
    default: false
  },
  layerId: {
    type: String,
    default: ''
  },
  year: {
    type: Number,
    default: null
  },
  scale: {
    type: String,
    default: ''
  }
});

const isHovered = ref(false);
const localOpacity = ref(100);

console.log('[LegendCard] Initializing with opacity:', localOpacity.value);

// const emit = defineEmits(['opacity-change', 'colorbar-click']);

// const handleOpacityChange = (value) => {
//   console.log('[LegendCard] Opacity changed to:', value);
//   localOpacity.value = value;
//   emit('opacity-change', value);
// };
</script>

<style scoped lang="scss">
.card-container {
  position: relative;
  width: 100%;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E9ECEF;
}

.drag-handle {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: move;
  color: #6C757D;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  padding: 6px;
  background: #E9ECEF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

.title {
  color: map-get($body-text, body-color);
  min-width: 0;
}

.title.with-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6C757D;
  border-radius: 4px;
}

.menu-button:hover {
  background: #f0f0f0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.legend-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  color: map-get($body-text, body-color);
}

.legend-line {
  width: 22px;
  height: 3px;
  border-radius: 8px;
}

.legend-line.census {
  background-color: #999;
}

.legend-line.municipal {
  background-color: #999;
}
</style>
