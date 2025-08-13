<!-- urbverde-ui/src/components/side_bar/drop_down/CategoriesDropdown.vue -->
<template>
  <div class="container" ref="containerRef">

    <div class="categories-list">
      <!-- Renderizar categorias e títulos misturados -->
      <template v-for="(item, index) in mixedCategoriesAndTitles" :key="index">
        <!-- Se for um título de seção -->
        <div v-if="item.type === 'title'" class="header-title body-caption-regular">
          {{ item.title }}
        </div>

        <!-- Se for uma categoria -->
        <div v-else-if="item.type === 'category'" class="category-dropdown">
          <!-- Category Header -->
          <div class="category-header"
               :class="{ 'open': openCategoryIds.includes(item.category.id) }"
               @click="toggleCategory(item.category.id)">

            <div class="category-icon">
              <IconComponent :name="item.category.icon" :size="20" />
            </div>
            <span class="category-name body-small-regular">{{ item.category.name }}</span>

            <!-- Exclusive category tag -->
            <div class="exclusive-category-tag"
                 v-if="item.category.isExclusive"
                 :class="{ 'policies-mode': locationStore.viewMode === 'policies' }">
              <i class="bi bi-stars" id="imgIconExclusive"></i>
            </div>

            <!-- Badge: aparece se há uma active layer, mas a categoria está fechada -->
            <div class="badge-right-menu"
                 v-if="getActiveLayerInCategory(item.category) && !openCategoryIds.includes(item.category.id)"
                 :class="{ 'policies-mode': locationStore.viewMode === 'policies' }">
              <span class="textBadge bi bi-dot"></span>
            </div>

            <i :class="openCategoryIds.includes(item.category.id)
              ? 'bi bi-chevron-up'
              : 'bi bi-chevron-down'" >
            </i>
          </div>

          <!-- Layers dentro da categoria -->
          <div class="layers-wrapper" :class="{ 'expanded': openCategoryIds.includes(item.category.id) }">
            <ul class="layers-list">
              <li v-for="(layer) in item.category.layers"
                  :key="layer.id"
                  :class="['layer-item', { 'active-layer': layer.isActive, 'map-mode': locationStore.viewMode === 'map', 'policies-mode': locationStore.viewMode === 'policies' }]"
                  @click="selectLayer(layer, item.category)">
                <span class="layer-name body-small-regular">
                  {{ layer.display_name || layer.title || layer.name }}
                </span>

                <div class="exclusive-layer-tag"
                     v-if="layer.isExclusive"
                     :class="{ 'policies-mode': locationStore.viewMode === 'policies' }">
                  <i class="bi bi-stars" id="imgIconExclusive"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, computed } from 'vue';
import IconComponent from '@/components/icons/IconComponent.vue';
import { useLocationStore } from '@/stores/locationStore';

const locationStore = useLocationStore();
const categories = ref([]);
const categoryTitles = ref([]);
const openCategoryIds = ref([]);
const containerRef = ref(null);

// Computed property para misturar categorias e títulos na ordem correta
const mixedCategoriesAndTitles = computed(() => {
  const result = [];

  // Adicionar títulos de seção
  if (categoryTitles.value && categoryTitles.value.length > 0) {
    categoryTitles.value.forEach(title => {
      result.push({
        type: 'title',
        title: title.categoriesTitle,
        position: title.categoriesTitlePosition
      });
    });
  }

  // Adicionar categorias
  if (categories.value && categories.value.length > 0) {
    categories.value.forEach(category => {
      result.push({
        type: 'category',
        category,
        position: category.position || 999 // Categorias sem posição vão para o final
      });
    });
  }

  // Ordenar por posição
  result.sort((a, b) => {
    const posA = a.position || 999;
    const posB = b.position || 999;

    return posA - posB;
  });

  return result;
});

watchEffect(() => {
  if (locationStore.categories.length > 0) {
    console.log('CategoriesDropdown: Atualizando a partir da store');
    categories.value = locationStore.categories;
    categoryTitles.value = locationStore.categoryTitles || [];

    // Se já existe uma layer ativa no locationStore, marca ela e abre a categoria
    if (locationStore.layer) {
      markActiveLayer();
    } else {
      // Se não existe layer ativa, seleciona a primeira por padrão
      const firstCategory = categories.value[0];
      if (firstCategory?.layers?.length > 0) {
        const firstLayer = firstCategory.layers[0];
        firstLayer.isActive = true;
        openCategoryIds.value = [firstCategory.id];
        locationStore.setLocation({
          category: firstCategory.id,
          layer: firstLayer.id,
          layerName: firstLayer.display_name || firstLayer.title || firstLayer.name
        });
      }
    }
  }
});

function selectLayer(layer, categoryObj) {
  categories.value.forEach(cat => {
    cat.layers.forEach(lyr => {
      lyr.isActive = false;
    });
  });
  layer.isActive = true;
  locationStore.setLocation({
    category: categoryObj.id,
    layer: layer.id
  });

  gtag('event', 'select_map_layer', {
    category: categoryObj.name,
    layer_id: layer.id,
    layer_name: layer.name
  });
}

async function updateCategoryHeight(categoryId) {
  const categoryEl = document.querySelector(`[data-category-id="${categoryId}"] .layers-list`);
  if (categoryEl) {
    const height = categoryEl.scrollHeight;
    categoryEl.parentElement.style.setProperty('--content-height', `${height}px`);
  }
}

async function toggleCategory(categoryId) {
  if (openCategoryIds.value.includes(categoryId)) {
    openCategoryIds.value = [];
  } else {
    openCategoryIds.value = [categoryId];
    await updateCategoryHeight(categoryId);
  }
}

function markActiveLayer() {
  categories.value.forEach(cat => {
    cat.layers.forEach(lyr => {
      if (lyr.id === locationStore.layer) {
        lyr.isActive = true;
        // Abre a categoria que contém a layer ativa
        openCategoryIds.value = [cat.id];
      } else {
        lyr.isActive = false;
      }
    });
  });
}

function getActiveLayerInCategory(category) {
  return category.layers.find(lyr => lyr.isActive) || null;
}

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
    padding: 24px 4px 4px 4px;
    top: 0;
    z-index: 2;
    background-color: map-get($gray, white);
    margin: 0;
  }

  .header-title:first-of-type {
    padding: 16px 4px 4px 4px;
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
    transition: all 0.15s ease;
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
    transition: all 0.15s ease;
  }

  .category-name {
    flex: 1;
  }

  .badge-right-menu {
    display: flex;
    align-items: center;
    border-radius: 4px;
    color: map-get($green, 500);
    background: transparent;
    width: 20px;
    height: 20px;
    justify-content: center;

    .textBadge {
      display: flex;
      font-size: 40px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    &.policies-mode {
      color: map-get($yellow, 600);
      background: transparent;
    }
  }

  .category-icon {
    width: 20px;
    height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .layers-wrapper {
    overflow: hidden;
    height: 0;
    opacity: 0;
    transition: height 0.3s ease-in-out, opacity 0.2s ease-in-out;

    &.expanded {
      height: var(--content-height);
      opacity: 1;
    }
  }

  .layers-list {
    list-style-type: none;
    margin-bottom: 4px;
    padding: 8px 0;
    border-top: 4px solid white;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background: map-get($gray, 100);
    gap: 6px;
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
    transition: all 0.15s ease;
  }

  .active-layer {
    border-left: 3px solid map-get($theme, primary);
    background: map-get($primary-fade, 100);

    &.map-mode {
      border-left: 3px solid map-get($theme, primary);
      background: map-get($primary-fade, 100);
    }
    &.policies-mode {
      border-left: 3px solid map-get($yellow, 600);
      background: map-get($yellow, 100);
    }
  }

  .layer-name {
    flex: 1;
  }

  .exclusive-layer-tag, .exclusive-category-tag {
    display: flex;
    font-size: 14px;
    align-items: center;
    color: map-get($theme, primary);
    justify-content: center;
    padding: 0;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: map-get($primary-fade, 100);

    &.policies-mode {
      color: map-get($yellow, 700);
      background: map-get($yellow, 100);
    }
  }

</style>
