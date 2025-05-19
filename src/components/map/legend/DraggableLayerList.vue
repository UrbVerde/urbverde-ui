<template>
  <draggable
    v-model="localLayers"
    :animation="200"
    item-key="id"
    ghost-class="sortable-ghost"
    drag-class="sortable-drag"
    @start="onDragStart"
    @end="onDragEnd"
    @change="onChange"
    class="draggable-container"
  >
    <template #item="{ element }">
      <div class="layer-card-wrapper">
        <LegendCard
          v-if="element.id === 'parks' && scale === 'intraurbana'"
          :showMenu="false"
          :showOpacity="true"
          :showColorScale="false"
          :layerId="'parks-layer'"
          :year="currentYear"
          :scale="scale"
          :showLegendLines="true"
          @opacity-change="handlerParksLayerOpacity"
        />

        <LegendCard
          v-else
          :showMenu="false"
          :title="getLayerConfig(element.id)?.label"
          :icon="getLayerIcon(element.id)"
          :layerId="element.id"
          :year="currentYear"
          :scale="scale"
          :showLegendLines="false"
          :showOpacity="true"
          :showColorScale="true"
          :stops="getLayerConfig(element.id)?.stops"
          :unit="getLayerConfig(element.id)?.unit"
          :showLayerCut="false"
          :draggable="true"
          @opacity-change="handleDataLayerOpacity"
          @colorbar-click="handleColorbarClick"
        />
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import { useLayersStore } from '@/stores/layersStore';
import { useLocationStore } from '@/stores/locationStore';
import { getLayerConfig } from '@/constants/layers';
import LegendCard from './LegendCard.vue';

const props = defineProps({
  layers: {
    type: Array,
    required: true
  },
  currentYear: {
    type: [Number, String],
    required: true
  },
  scale: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:layers', 'opacity-change', 'colorbar-click']);
const layersStore = useLayersStore();
const locationStore = useLocationStore();
const { categories } = storeToRefs(locationStore);

// Watcher para garantir que o layersStore seja inicializado
watch(() => locationStore.activeMainLayer, (newLayer) => {
  if (newLayer && !layersStore.getActiveLayers.length) {
    layersStore.setDefaultLayers(newLayer);
  }
}, { immediate: true });

// Computed para gerenciar o estado local e sincronizar com o store
const localLayers = computed({
  get: () => props.layers,
  set: (value) => {
    emit('update:layers', value);
    // Atualiza o store com a nova ordem
    layersStore.$patch({ activeLayers: value });
  }
});

// Handlers de eventos do draggable
const onDragStart = (evt) => {
  console.log('[DraggableLayerList] Drag started', evt);
};

const onDragEnd = (evt) => {
  console.log('[DraggableLayerList] Drag ended', evt);
};

const onChange = (evt) => {
  console.log('[DraggableLayerList] Order changed', evt);
  // O Vue.Draggable já atualiza o v-model automaticamente
  // A atualização do store é feita através do computed localLayers
};

// Funções auxiliares
const getLayerIcon = (layerId) => {
  const category = categories.value?.find(cat =>
    cat.layers?.some(l => l.id === layerId)
  );

  return category?.icon || 'bi-question-circle';
};

const handleDataLayerOpacity = (opacity) => {
  emit('opacity-change', opacity);
};

const handlerParksLayerOpacity = (opacity) => {
  layersStore.setLayerOpacity('parks-layer', opacity);
};

const handleColorbarClick = () => {
  emit('colorbar-click');
};
</script>

<style scoped lang="scss">
.draggable-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-card-wrapper {
  margin: 4px 0;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

:deep(.sortable-ghost) {
  opacity: 0.5;
  background: #f8f9fa;
  border: 2px dashed map-get($theme, primary);
}

:deep(.sortable-drag) {
  opacity: 0.9;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: grabbing;
}

:deep(.card-container) {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>
