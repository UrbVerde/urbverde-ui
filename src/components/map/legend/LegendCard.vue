<!-- urbverde-ui/src/components/legend/LegendCard.vue -->
<template>
  <div class="card-container">
    <!-- Drag handle -->
    <div v-if="draggable" class="drag-handle">
      <IconComponent name="drag" size="20" />
    </div>

    <!-- Header -->
    <div class="header" v-if="title || icon || showMenu">
      <div v-if="icon" class="icon-wrapper">
        <IconComponent :name="icon || 'bi-question-circle'" :size="20" />
      </div>

      <div class="label-wrapper">
        <div class="title-wrapper">
          <span v-if="title" class="title body-small-regular">
            {{ title }}
          </span>
        </div>

        <!-- Recorte da camada - only show for non-parks layers -->
        <LayerCut v-if="layerId !== 'parks-layer'" class="layer-cut"/>
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
      <div v-if="showLegendLines || layerId === 'parks-layer'" class="legend-lines">
        <!-- For base layer, show only setores censitários -->
        <template v-if="!layerId || layerId !== 'parks-layer'">
          <p v-if="scale === 'intraurbana'" class="legend-item body-small-regular">
            <span class="legend-line census"></span>Setores censitários
          </p>
          <p v-else class="legend-item body-small-medium">
            <span class="legend-line municipal"></span>Municípios
          </p>
        </template>

        <!-- For parks layer, show only parks square -->
        <p v-if="layerId === 'parks-layer' && scale === 'intraurbana'" class="legend-item body-small-regular">
          <span class="legend-square parks"></span>Áreas verdes urbanas
        </p>
      </div>

      <!-- Opacity Control -->
      <OpacityControl v-if="showOpacity"
                      class="opacity-control"
                      v-model="localOpacity"
                      :layerId="layerId"
                      @update:modelValue="handleOpacityChange"
      />

      <!-- Card Layer Switch -->
      <!-- <CardLayerSwitch
        v-if="layerId"
        class="grip-control"
        :layerId="layerId"
      /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IconComponent from '@/components/icons/IconComponent.vue';
import ColorScale from './ColorScale.vue';
import OpacityControl from './OpacityControl.vue';
// import CardLayerSwitch from './CardLayerSwitch.vue';
// import LayerCut from './LayerCut.vue';

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

const localOpacity = ref(100);

console.log('[LegendCard] Initializing with opacity:', localOpacity.value);

const emit = defineEmits(['opacity-change', 'colorbar-click']);

const handleOpacityChange = (value) => {
  console.log('[LegendCard] Opacity changed to:', value);
  localOpacity.value = value;
  emit('opacity-change', value);
};

</script>

<style scoped lang="scss">
.card-container {
  position: relative;
  width: 100%;
  padding: 16px;
  background: map-get($gray, white);
  border-radius: 8px;
  border: 1px solid map-get($gray, 200);
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

.label-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3px;
  min-width: 0;
  flex-direction: column;
}

.title-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

.layer-cut{
  width: 100%;
  display: flex;
  align-items: left;
  cursor: pointer;
}

.title {
  color: map-get($body-text, body-color);
  min-width: 0;
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

.legend-square {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-square.parks {
  background-color: #40826D;
}

.opacity-control, .grip-control {
  display: none;
}

.card-container:hover .opacity-control,
.card-container:hover .grip-control {
  display: flex;
}

.card-container:hover :deep(.layer-cut-icon) {
  display: block;
}

.card-container:hover :deep(.layer-cut-text),
.card-container:hover :deep(.layer-cut-icon) {
  color: map-get($theme, primary);
}

</style>
