<!-- urbverde-ui\src\components\side_bar\drop_down\CategoriesDropdown.vue -->
<template>
  <div class="container" ref="containerRef">
    <span class="header-title caption-medium">CAMADAS</span>

    <div class="categories-list">
      <div v-for="(category) in categories" :key="category.id" class="category-dropdown">
        <!-- Category Title -->
        <div class="category-header"
             :class="{ 'open': openCategoryIds.includes(category.id) || getActiveLayerInCategory(category) }"
             @click="toggleCategory(category.id)">

          <div class="category-icon">
            <IconComponent :name="category.icon" :size="20" />
          </div>
          <span class="category-name small-regular">{{ category.name }}</span>

          <!-- Show "1" if there is an active layer in that category -->
          <div class="badge-right-menu"
               v-if="getActiveLayerInCategory(category) && !openCategoryIds.includes(category.id)">
            <span class="textBadge caption-medium">1</span>
          </div>

          <i :class="openCategoryIds.includes(category.id)
            ? 'bi bi-chevron-up'
            : 'bi bi-chevron-down'" />
        </div>

        <!-- Layers inside this category -->
        <ul v-show="openCategoryIds.includes(category.id)" class="layers-list">
          <li v-for="(layer) in category.layers"
              :key="layer.id"
              :class="['layer-item', { 'active-layer': layer.isActive }]"
              @click="selectLayer(layer, category)">
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
import { ref, onMounted, onUnmounted } from 'vue';
import IconComponent from '@/components/icons/IconComponent.vue';
import { useLocationStore } from '@/stores/locationStore';

// PROPS
const props = defineProps({
  code: { type: Number, default: null },
  type: { type: String, default: null }
});

// STORE
const locationStore = useLocationStore();

// LOCAL STATE
const categories = ref([]);
const openCategoryIds = ref([]);
const containerRef = ref(null);

// LIFECYCLE
onMounted(() => {
  // fetch categories immediately
  fetchCategories(props.code, props.type);

  // Add click event listener to document
  document.addEventListener('click', handleOutsideClick);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

function handleOutsideClick(event) {
  // If the click is outside the container
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    // Close categories without active layers
    const updatedOpenCategoryIds = openCategoryIds.value.filter(categoryId => {
      const category = categories.value.find(c => c.id === categoryId);

      return category && category.layers.some(layer => layer.isActive);
    });

    openCategoryIds.value = updatedOpenCategoryIds;
  }
}

/**
 * Fetch categories from your API (or mock),
 * then set them in local state.
 * Open the category of the initially selected layer.
 */
async function fetchCategories(code, type) {
  try {
    console.log('Fetching categories:', { code, type });
    const response = await fetch(`https://api.urbverde.com.br/v1/address/categories?code=${code}`);
    const data = await response.json();

    if (data && data.categories) {
      categories.value = data.categories;

      // If a layer is already selected in the store
      if (locationStore.layer) {
        // Find the category with the selected layer
        const categoryWithActiveLayer = categories.value.find(category =>
          category.layers.some(layer =>
            layer.slug === locationStore.layer || layer.id === locationStore.layer
          )
        );

        // If found, open the category and mark the layer as active
        if (categoryWithActiveLayer) {
          openCategoryIds.value.push(categoryWithActiveLayer.id);
        }

        markActiveLayer();
      } else {
        // If no layer is selected, set the first layer
        const firstCategory = categories.value[0];
        if (firstCategory?.layers?.length > 0) {
          const firstLayer = firstCategory.layers[0];
          firstLayer.isActive = true;
          locationStore.setLocation({
            category: firstCategory.name,
            layer: firstLayer.slug || firstLayer.id
          });

          // Open the first category
          openCategoryIds.value.push(firstCategory.id);
        }
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
  // Check if the category is already open
  const categoryIndex = openCategoryIds.value.indexOf(categoryId);

  if (categoryIndex > -1) {
    // If open, remove it
    openCategoryIds.value.splice(categoryIndex, 1);
  } else {
    // If not open, add it
    openCategoryIds.value.push(categoryId);
  }
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
  margin-top: -8px;
  margin-bottom: -4px;
  border-bottom: 4px solid white;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
  padding: 0 0;
}

.category-dropdown {
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

.category-header.open:hover {
  background: var(--Gray-200, #E9ECEF);
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

.category-icon{

  width: 20px;
  height: 20px;

  display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

}

.layers-list {
  list-style-type: none;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0px 0px 0px 0px;
  border-top: 4px solid white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;

  background: var(--Primary-Fade-100, #F8F9FA);

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
  display: flex;
  align-items: center;
  padding: 2px 8px;
  gap: 10px;
  border-radius: 4px;
  color: var(--Theme-Primary, #025949);
  background: var(--Primary-Fade-100, #D2E8DD);
  width: 22px;
  height: 22px;
  justify-content: center;
}
</style>
