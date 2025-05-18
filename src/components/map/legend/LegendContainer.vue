<template>
  <div class="legend-container">
    <div class="legend-header">
      <h2 class="title-large-medium">Legenda</h2>
      <div class="header-actions">
        <button class="action-button" @click="toggleCollapse">
          <IconComponent :name="isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'" :size="20" />
        </button>
      </div>
    </div>

    <div v-show="!isCollapsed" class="legend-content">
      <div class="legend-cards">
        <div v-for="(layer, index) in orderedLayers"
             :key="layer.id"
             class="legend-card-wrapper"
             :class="{ 'is-dragging': draggedIndex === index }"
             draggable="true"
             @dragstart="handleDragStart($event, index)"
             @dragend="handleDragEnd"
             @dragover.prevent
             @drop="handleDrop($event, index)">
          <LegendCard
            :title="layer.title"
            :icon="layer.icon"
            :showOpacity="layer.showOpacity"
            :showColorScale="layer.showColorScale"
            :showLegendLines="layer.showLegendLines"
            :showLayerCut="layer.showLayerCut"
            :layerId="layer.id"
            :year="layer.year"
            :scale="layer.scale"
            :stops="layer.stops"
            :unit="layer.unit"
            @opacity-change="(value) => handleOpacityChange(layer.id, value)"
            @colorbar-click="handleColorbarClick(layer.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconComponent from '@/components/icons/IconComponent.vue';
import LegendCard from './LegendCard.vue';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();
const isCollapsed = ref(false);
const draggedIndex = ref(null);

const orderedLayers = computed(() => mapStore.orderedLayers);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleOpacityChange = (layerId, value) => {
  mapStore.updateLayerOpacity(layerId, value);
};

const handleColorbarClick = (layerId) => {
  mapStore.toggleColorbar(layerId);
};

const handleDragStart = (event, index) => {
  draggedIndex.value = index;
  event.target.classList.add('dragging');
};

const handleDragEnd = (event) => {
  draggedIndex.value = null;
  event.target.classList.remove('dragging');
};

const handleDrop = (event, dropIndex) => {
  event.preventDefault();
  if (draggedIndex.value === null) {return;}

  const newOrder = [...orderedLayers.value];
  const [draggedItem] = newOrder.splice(draggedIndex.value, 1);
  newOrder.splice(dropIndex, 0, draggedItem);

  mapStore.reorderLayers(newOrder.map(layer => layer.id));
};
</script>

<style scoped lang="scss">
.legend-container {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: map-get($gray, white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.legend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid map-get($gray, 200);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: map-get($body-text, body-color);
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: map-get($gray, 100);
  }
}

.legend-content {
  padding: 16px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.legend-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-card-wrapper {
  cursor: move;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &.is-dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  &:hover {
    transform: translateY(-1px);
  }
}
</style>
