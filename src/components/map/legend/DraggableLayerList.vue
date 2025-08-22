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
        <div v-if="element.id === 'parks' && props.scale === 'intraurbana'">
          <LegendCard

            :showMenu="false"
            :showOpacity="true"
            :showColorScale="false"
            :layerId="'parks'"
            :year="currentYear"
            :scale="props.scale"
            :showLegendLines="true"
            @opacity-change="handlerParksLayerOpacity"
          />
        </div>
        <div v-else>
          <LegendCard
            :showMenu="false"
            :title="getLayerConfig(element.id)?.label"
            :icon="getLayerIcon(element.id)"
            :layerId="element.id"
            :year="currentYear"
            :scale="props.scale"
            :showLegendLines="false"
            :showOpacity="true"
            :showColorScale="true"
            :stops="getLayerConfig(element.id)?.stops"
            :unit="getLayerConfig(element.id)?.unit"
            :showLayerCut="false"
            :draggable="true"
            @opacity-change="(opacity) => handleDataLayerOpacity(opacity, element.id)"
            @colorbar-click="handleColorbarClick"
          />
        </div>
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { computed,
  // watch
} from 'vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import { useLayersStore } from '@/stores/layersStore';
import { useLocationStore } from '@/stores/locationStore';
import { getLayerConfig } from '@/constants/layers';
import LegendCard from './LegendCard.vue';
import { reorderLayer } from '@/components/map/layers/ReorderLayers';

const props = defineProps({
  currentYear: {
    type: [Number, String],
    required: true
  },
  scale: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['opacity-change', 'colorbar-click']);
const layersStore = useLayersStore();
const locationStore = useLocationStore();
const { categories } = storeToRefs(locationStore);

// Watcher para garantir que o layersStore seja inicializado
// watch(() => locationStore.activeMainLayer, (newLayer) => {
//   if (newLayer && !layersStore.getActiveLayers.length) {
//     layersStore.setDefaultLayers(newLayer);
//   }
// }, { immediate: true });

// Computed para gerenciar o estado local e sincronizar com o store
const localLayers = computed({
  get: () => layersStore.getActiveLayers,
  set: (newValue) => {
    // Atualiza a ordem das camadas usando a função do ReorderLayers
    newValue.forEach((layer, index) => {
      const result = reorderLayer(layersStore.getActiveLayers, layer.id, index, layersStore.mapRef);
      layersStore.activeLayers = result.activeLayers;

      if (!result.mapSuccess) {
        console.warn(`[DraggableLayerList] Reordenação no mapa falhou para a camada ${layer.id}`);
      }
    });
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

  // Se houver um item movido, reordena a camada no mapa
  if (evt.moved) {
    const { newIndex, oldIndex } = evt.moved;
    const activeLayers = layersStore.getActiveLayers;
    const movedLayer = activeLayers[newIndex];

    console.log('[DraggableLayerList] Movendo camada:', {
      camada: movedLayer?.id,
      de: oldIndex,
      para: newIndex,
      todasCamadas: activeLayers.map(l => l.id)
    });

    if (movedLayer && layersStore.mapRef) {
      // A reordenação já foi feita no computed localLayers
      console.log('[DraggableLayerList] Camada reordenada com sucesso');
    } else {
      console.warn('[DraggableLayerList] Não foi possível reordenar a camada:', {
        camada: movedLayer?.id,
        temMapa: !!layersStore.mapRef
      });
    }
  }
};

// Funções auxiliares
const getLayerIcon = (layerId) => {
  const category = categories.value?.find(cat =>
    cat.layers?.some(l => l.id === layerId)
  );

  return category?.icon || 'bi-question-circle';
};

const handleDataLayerOpacity = (opacity, layerId) => {
  console.log('[DraggableLayerList] Handling data layer opacity:', { layerId, opacity });
  // Obter o ID correto da layer da configuração
  const layerConfig = getLayerConfig(layerId);
  if (!layerConfig) {
    console.error(`[DraggableLayerList] Configuração não encontrada para a layer: ${layerId}`);

    return;
  }
  layersStore.setLayerOpacity(layerConfig.id, opacity / 100);
};

const handlerParksLayerOpacity = (opacity) => {
  console.log('[DraggableLayerList] Handling parks layer opacity:', { opacity });
  layersStore.setLayerOpacity('parks', opacity / 100);
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
