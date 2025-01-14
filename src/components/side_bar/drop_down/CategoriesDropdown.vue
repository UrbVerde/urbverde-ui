<!-- urbverde-ui\src\components\side_bar\drop_down\CategoriesDropdown.vue -->
<template>
  <div class="container">
    <span class="header-title caption-medium">CAMADAS</span>

    <div class="categories-list">
      <div
        v-for="(category) in categories"
        :key="category.id"
        class="category-dropdown"
      >
        <!-- Category Title -->
        <div
          class="category-header"
          :class="{ 'open': openCategoryId === category.id }"
          @click="toggleCategory(category.id)"
        >
          <IconComponent :name="category.icon" :size="20" />
          <span class="category-name small-regular">{{ category.name }}</span>

          <!-- Show “1” if there is an active layer in that category -->
          <div class="badge-right-menu" v-if="getActiveLayerInCategory(category)">
            <span class="textBadge caption-medium">1</span>
          </div>

          <i
            :class="openCategoryId === category.id
              ? 'bi bi-chevron-up'
              : 'bi bi-chevron-down'"
          />
        </div>

        <!-- Layers inside this category -->
        <ul
          v-show="openCategoryId === category.id"
          class="layers-list"
        >
          <li
            v-for="(layer) in category.layers"
            :key="layer.id"
            :class="['layer-item', { 'active-layer': layer.isActive }]"
            @click="selectLayer(layer, category)"
          >
            <span class="layer-name small-regular">{{ layer.name }}</span>

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
import { ref, onMounted } from 'vue';
import IconComponent from '@/components/icons/IconComponent.vue';
import { useLocationStore } from '@/stores/locationStore';
import { API_URLS } from '@/constants/endpoints';

// PROPS
const props = defineProps({
  code: { type: Number, default: null },
  type: { type: String, default: null }
});

// STORE
const locationStore = useLocationStore();

// LOCAL STATE
const categories = ref([]);
const openCategoryId = ref(null);

// LIFECYCLE
onMounted(() => {
  // fetch categories immediately
  fetchCategories(props.code, props.type);
});

/**
 * Fetch categories from your API (or mock),
 * then set them in local state. Optionally
 * set the first layer if nothing is active.
 */
async function fetchCategories(code, type) {
  try {
    const response = await fetch(`${API_URLS.CATEGORIES}?code=${code}&type=${type}`);
    const data = await response.json();

    if (data && data.categories) {
      categories.value = data.categories;

      // Optionally, check if locationStore.layer is set.
      // If it’s not set, we can set the first available layer:
      if (!locationStore.layer) {
        const firstCategory = categories.value[0];
        if (firstCategory?.layers?.length > 0) {
          // Set the first layer if none is chosen
          const firstLayer = firstCategory.layers[0];
          firstLayer.isActive = true;
          locationStore.setLocation({
            category: firstCategory.name,
            layer: firstLayer.slug || firstLayer.id // fallback
          });
        }
      } else {
        // if locationStore.layer is already set, mark that as active if it appears
        markActiveLayer();
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

function markActiveLayer() {
  for (const cat of categories.value) {
    for (const lyr of cat.layers) {
      if (
        lyr.slug === locationStore.layer ||
        lyr.id === locationStore.layer
      ) {
        lyr.isActive = true;
      } else {
        lyr.isActive = false;
      }
    }
  }
}

function toggleCategory(categoryId) {
  openCategoryId.value = (openCategoryId.value === categoryId)
    ? null
    : categoryId;
}

function selectLayer(layer, categoryObj) {
  // 1) Deactivate all
  categories.value.forEach(cat => {
    cat.layers.forEach(lyr => {
      lyr.isActive = false;
    });
  });
  // 2) Activate the chosen layer
  layer.isActive = true;

  // 3) Update pinia
  locationStore.setLocation({
    category: categoryObj.name,
    layer: layer.slug || layer.id // fallback
  });
}

function getActiveLayerInCategory(category) {
  return category.layers.find(lyr => lyr.isActive) || null;
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-self: stretch;
  flex: 1 0 0;
  overflow-y: auto;
  height: 100%;
  padding: 0;
}

.header-title {
  color: var(--Theme-Secondary, #6C757D);
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: white;
  border-bottom: 8px solid var(--Theme-Border, #FFFFFF);
  margin-top: -8px;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
  padding: 0 0;
}

.category-dropdown {
  /* border-bottom: 1px solid #dee2e6; */
  padding-bottom: 8px;
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
  background: var(--Gray-200, #E9ECEF);
}

.category-header.open {
  background: var(--Primary-Fade-100, #F8F9FA);
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
  color: var(--Theme-Primary, #025949);
  background: var(--Primary-Fade-100, #D2E8DD);
}

.layers-list {
  list-style-type: none;
  margin: 0;
  padding: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-item {
  cursor: pointer;
  display: flex;
  padding: 8px 24px;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
}

.layer-item:hover {
  background: var(--Gray-200, #E9ECEF);
}

.active-layer {
  border-left: 3px solid var(--Body-Text-Body-Color, #212529);
  background: var(--Primary-Fade-100, #D2E8DD);
}

.layer-name {
  flex: 1;
}

.new-layer-tag {
  font-size: 22px;
  height: 22px;
  width: 22px;
  display: inline-flex;
  padding: 4px;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: var(--Primary-Fade-100, #D2E8DD);
}
</style>
