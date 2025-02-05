<!-- urbverde-ui\src\components\side_bar\drop_down\CategoriesDropdown.vue -->
<template>
  <div class="container" ref="containerRef">
    <span class="header-title body-caption-regular">CAMADAS</span>

    <div class="categories-list">
      <div v-for="(category) in categories" :key="category.id" class="category-dropdown">
        <!-- Category Header -->
        <div class="category-header"
             :class="{ 'open': openCategoryIds.includes(category.id) }"
             @click="toggleCategory(category.id)">

          <div class="category-icon">
            <IconComponent :name="category.icon" :size="20" />
          </div>
          <span class="category-name body-small-regular">{{ category.name }}</span>

          <!-- Badge: aparece se há uma active layer, mas a categoria está fechada -->
          <div class="badge-right-menu"
               v-if="getActiveLayerInCategory(category) && !openCategoryIds.includes(category.id)">
            <span class="textBadge body-caption-medium">1</span>
          </div>

          <i :class="openCategoryIds.includes(category.id)
            ? 'bi bi-chevron-up'
            : 'bi bi-chevron-down'" />
        </div>

        <!-- Layers dentro da categoria -->
        <ul v-show="openCategoryIds.includes(category.id)" class="layers-list">
          <li v-for="(layer) in category.layers"
              :key="layer.id"
              :class="['layer-item', { 'active-layer': layer.isActive }]"
              @click="selectLayer(layer, category)">
            <span class="layer-name body-small-regular">
              {{ layer.display_name || layer.title || layer.name }}
            </span>

            <div class="new-layer-tag" v-if="layer.isNew">
              <i class="bi bi-stars" id="imgIconNew"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import IconComponent from '@/components/icons/IconComponent.vue';
import { useLocationStore } from '@/stores/locationStore';

const locationStore = useLocationStore();

// Estado local
const categories = ref([]);
const openCategoryIds = ref([]);
const containerRef = ref(null);

// Atualiza as categorias conforme a store
watchEffect(() => {
  if (locationStore.categories.length > 0) {
    console.log('CategoriesDropdown: Atualizando a partir da store');
    categories.value = locationStore.categories;
    markActiveLayer();
  }
});

// Marca a layer ativa em cada categoria
function markActiveLayer() {
  categories.value.forEach(cat => {
    cat.layers.forEach(lyr => {
      lyr.isActive = lyr.id === locationStore.layer;
    });
  });
}

// Alteração 1: Fechamento exclusivo de categorias
function toggleCategory(categoryId) {
  if (openCategoryIds.value.includes(categoryId)) {
    // Se já estiver aberta, fecha a categoria
    openCategoryIds.value = [];
  } else {
    // Fecha quaisquer categorias abertas e abre somente a clicada
    openCategoryIds.value = [categoryId];
  }
}

// Seleciona uma layer e atualiza a store
function selectLayer(layer, categoryObj) {
  categories.value.forEach(cat => {
    cat.layers.forEach(lyr => {
      lyr.isActive = false;
    });
  });
  layer.isActive = true;
  locationStore.setLocation({
    category: categoryObj.name,
    layer: layer.id,
    layerName: layer.display_name || layer.title || layer.name
  });
}

// Retorna a layer ativa na categoria (se existir)
function getActiveLayerInCategory(category) {
  return category.layers.find(lyr => lyr.isActive) || null;
}

// Ciclo de vida: adiciona o listener (não altera nada quando clica fora)
onMounted(() => {
  if (locationStore.cd_mun && locationStore.type) {
    locationStore.fetchCategories();
  }
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-self: stretch;
  flex: 1 0 0;
  height: 100%;
  padding: 0 !important;
  overflow: hidden;

  ::-webkit-scrollbar {
    width: 6px;
    margin: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: map-get($gray, 400);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: map-get($primary-fade, 300);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background-color: map-get($gray, 200);
    border-radius: 4px;
  }
}

.header-title {
  color: map-get($theme, secondary);
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: map-get($gray, white);
  margin: 0;
  border-bottom: 4px solid map-get($gray, white);
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
  padding: 0 4px 0 0;
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  scroll-behavior: smooth;
  color: map-get($body-text, body-color);
}

.category-header {
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.category-header:hover {
  background: map-get($gray, 200);
}

/* Estilo aplicado somente quando a categoria está efetivamente aberta */
.category-header.open {
  background: map-get($gray, 100);
}

.category-header.open:hover {
  background: map-get($gray, 200);
}

.category-name {
  flex: 1;
}

.badge-right-menu {
  display: flex;
  align-items: center;
  padding: 2px 8px;
  gap: 10px;
  border-radius: 4px;
  color: map-get($theme, primary);
  background: map-get($primary-fade, 100);
  width: 22px;
  height: 22px;
  justify-content: center;
}

.textBadge {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.category-icon {
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.layers-list {
  list-style-type: none;
  margin-bottom: 12px;
  padding: 8px 0;
  border-top: 4px solid white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: map-get($gray, 100);
  gap: 8px;
}

.layer-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 24px;
  align-self: stretch;
}

.layer-item:not(.active-layer):hover {
  background: map-get($gray, 200);
}

.active-layer {
  border-left: 3px solid map-get($theme, primary);
  background: map-get($primary-fade, 100);
}

.layer-name {
  flex: 1;
}

.new-layer-tag {
  display: flex;
  align-items: center;
  padding: 2px 8px;
  gap: 10px;
  border-radius: 4px;
  color: map-get($theme, primary);
  background: map-get($primary-fade, 100);
  width: 22px;
  height: 22px;
  justify-content: center;
}
</style>
