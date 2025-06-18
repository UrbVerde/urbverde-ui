<!-- urbverde-ui/src/components/modal/modalCompareLayers.vue -->
<template>
  <teleport to="body">
    <modalBootstrap
      ref="refModal"
      modalId="modalCompareLayers"
      title="Comparar Camadas"
      :showSecondaryButton="false"
      :showPrimaryButton="true"
      primaryButtonText="Fechar"
      :primaryButtonClosesModal="true"
      size="lg"
      @closePrimary="handleClose"
    >
      <template #body>
        <div class="layers-content body-normal-regular">
          <div v-for="category in categories" :key="category.id" class="category-section">
            <h3 class="category-title heading-h6">{{ category.name }}</h3>
            <div class="layers-grid">
              <div v-for="layer in category.layers"
                   :key="layer.id"
                   class="layer-card"
                   :class="{
                     'active': isLayerActive(layer.id),
                     'current-layer': layer.id === locationStore.activeMainLayer
                   }"
                   @click="toggleLayer(layer)">
                <div class="layer-info">
                  <img v-if="category.icon"
                       :src="getIconPath(category.icon)"
                       :alt="category.name"
                       class="category-icon" />
                  <span class="layer-name">{{ layer.name }}</span>
                </div>
                <div class="layer-status">
                  <i v-if="layer.id === locationStore.activeMainLayer" class="bi bi-lock-fill" title="Camada Principal - Altere no menu lateral"></i>
                  <i v-else-if="isLayerActive(layer.id)" class="bi bi-check-circle-fill"></i>
                  <i v-else class="bi bi-circle"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de camadas ativas com drag and drop -->
          <div v-if="activeLayersWithNames.length > 0" class="active-layers-section">
            <h3 class="category-title heading-h6">Camadas Ativas</h3>
            <draggable
              v-model="activeLayersWithNames"
              item-key="id"
              handle=".drag-handle"
              @end="handleDragEnd"
              class="active-layers-list"
            >
              <template #item="{ element: layer, index }">
                <div class="active-layer-item">
                  <div class="drag-handle">
                    <i class="bi bi-grip-vertical"></i>
                  </div>
                  <div class="layer-info">
                    <span class="layer-position">{{ index + 1 }}</span>
                    <span class="layer-name">{{ layer.name }}</span>
                    <span class="layer-category">({{ layer.category }})</span>
                  </div>
                  <div class="layer-actions">
                    <button class="btn-remove" @click="removeLayer(layer.id)" title="Remover camada">
                      <i class="bi bi-x-circle"></i>
                    </button>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </template>
    </modalBootstrap>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import modalBootstrap from './modalBootstrap.vue';
import { useLocationStore } from '@/stores/locationStore';
import { useLayersStore } from '@/stores/layersStore';
import draggable from 'vuedraggable';
// import { setupDynamicLayers } from '@/components/map/layers/MapLayerController';
import { getLayerConfig, getLayerPaint } from '@/constants/layers';
import { reorderLayerSetup } from '@/components/map/layers/MapLayerController';

const refModal = ref(null);
const locationStore = useLocationStore();
const layersStore = useLayersStore();

// Computed properties
const categories = computed(() => locationStore.getCategories || []);

// Get active layers with their names
const activeLayersWithNames = computed({
  get: () => layersStore.getActiveLayers.map((activeLayer, index) => {
    const category = categories.value.find(cat =>
      cat.layers.some(layer => layer.id === activeLayer.id)
    );
    const layer = category?.layers.find(layer => layer.id === activeLayer.id);

    return {
      ...activeLayer,
      name: layer?.name || activeLayer.id,
      category: category?.name || 'Sem categoria',
      order: index
    };
  }),
  set: (newValue) => {
    // Atualiza a ordem das camadas no store
    newValue.forEach((layer, index) => {
      layersStore.reorderLayer(layer.id, index);
    });
  }
});

// Methods
const getIconPath = (iconName) => new URL(`../../assets/icons/${iconName}`, import.meta.url).href;

const isLayerActive = (layerId) => {
  const isInActiveLayers = layersStore.getActiveLayers.some(layer => layer.id === layerId);
  const isCurrentLayer = layerId === locationStore.activeMainLayer;

  return isInActiveLayers || isCurrentLayer;
};

// Nova função para criar e adicionar camada
const createAndAddLayer = (layerId) => {
  if (!layersStore.mapRef) {return false;}

  // Obtém configuração da camada
  const layerConfig = getLayerConfig(layerId, locationStore.year, locationStore.scale);
  if (!layerConfig) {
    console.warn('[CompareLayers] Configuração da camada não encontrada:', layerId);

    return false;
  }

  // Determina onde a camada será inserida
  const activeLayers = [...layersStore.getActiveLayers];
  const topLayer = activeLayers[0];
  const beforeId = (topLayer && topLayer.id === 'parks') ? 'parks' : 'highlight_selected-layer';

  console.log('[CompareLayers] Adicionando camada:', {
    camada: layerId,
    antesDe: beforeId,
    totalCamadas: activeLayers.length
  });

  // Configura a fonte da camada
  const source = typeof layerConfig.source === 'function'
    ? layerConfig.source(locationStore.year, locationStore.scale, locationStore.currentMunicipioId)
    : layerConfig.source;

  if (source) {
    layersStore.mapRef.addSource(layerId, source);
  }

  // Adiciona a camada ao mapa
  if (layerConfig.type === 'raster') {
    layersStore.mapRef.addLayer({
      id: layerId,
      type: 'raster',
      source: layerId,
      paint: layerConfig.paint
    }, beforeId);
  } else {
    const layerObject = {
      id: layerId,
      type: 'fill',
      source: layerId,
      'source-layer': source.sourceLayer,
      paint: getLayerPaint(layerConfig, {
        scale: locationStore.scale,
        municipioId: locationStore.currentMunicipioId,
        statistics: layersStore.currentStatistics
      })
    };

    console.log('[CompareLayers] Adicionando camada vetorial:', {
      id: layerId,
      sourceLayer: source.sourceLayer,
      beforeId
    });

    layersStore.mapRef.addLayer(layerObject, beforeId);
  }
  // Add layer
  layersStore.addLayer({
    id: `${layerId}`,
    year: locationStore.year,
    scale: locationStore.scale,
    opacity: 0.7,
    source
  });
  console.log('[CompareLayers] Camada adicionada com sucesso:', layerId);

  // Reordena todas as camadas após adicionar a nova
  const updatedActiveLayers = [...layersStore.getActiveLayers];
  reorderLayerSetup(layersStore.mapRef, updatedActiveLayers);

  return true;
};

const toggleLayer = (layer) => {
  if (isLayerActive(`${layer.id}`)) {
    // Remove layer
    layersStore.removeLayer(`${layer.id}`);
  } else {
    // Cria e adiciona a camada no mapa
    createAndAddLayer(layer.id);
  }
};

const handleDragEnd = (evt) => {
  console.log('Drag ended:', evt);
};

const removeLayer = (layerId) => {
  layersStore.removeLayer(layerId);
};

const handleClose = () => {
  if (activeLayersWithNames.value.length > 0) {
    const layersList = activeLayersWithNames.value
      .map((layer, index) => `${index + 1}. ${layer.name} (${layer.category})`)
      .join('\n');

    alert(`Camadas ativas:\n\n${layersList}`);
  } else {
    alert('Nenhuma camada selecionada');
  }
};

// Public methods
function show() {
  refModal.value.show();
}

function hide() {
  refModal.value.hide();
}

defineExpose({ show, hide });
</script>

<style scoped lang="scss">
.layers-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 8px;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-title {
  color: map-get($theme, secondary);
  margin: 0;
}

.layers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.layer-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid map-get($gray, 300);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: map-get($gray, 100);
  }

  &.active {
    border-color: map-get($theme, primary);
    background-color: map-get($primary-fade, 100);
  }

  &.current-layer {
    border-color: map-get($theme, primary);
    background-color: map-get($primary-fade, 100);
    cursor: not-allowed;
    opacity: 0.8;

    &:hover {
      background-color: map-get($theme, 100);
    }
  }
}

.layer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.layer-name {
  font-size: 14px;
  color: map-get($body-text, body-color);
}

.layer-status {
  color: map-get($theme, primary);
  font-size: 18px;

  .bi-lock-fill {
    color: map-get($theme, primary);
  }
}

.active-layers-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid map-get($gray, 300);
}

.active-layers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.active-layer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid map-get($gray, 200);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: map-get($gray, 50);
  }
}

.drag-handle {
  cursor: move;
  color: map-get($gray, 400);
  padding: 4px;

  &:hover {
    color: map-get($gray, 600);
  }
}

.layer-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.layer-position {
  font-weight: 600;
  color: map-get($theme, primary);
  min-width: 24px;
}

.layer-category {
  color: map-get($gray, 500);
  font-size: 0.9em;
}

.layer-actions {
  display: flex;
  gap: 8px;
}

.btn-remove {
  background: none;
  border: none;
  color: map-get($gray, 400);
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: map-get($red, 500);
  }
}
</style>
