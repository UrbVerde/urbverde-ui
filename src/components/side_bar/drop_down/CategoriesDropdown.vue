<!-- urbverde-ui/src/components/side_bar/drop_down/categoriesDropdown.vue -->
<template>
  <div class="container">
    <span class="text caption-medium">CAMADAS</span>
    <div class="options">
      <categoriesItem
        v-for="(category, index) in categories"
        :key="category.id"
        :itemName="category.name"
        :icon="category.icon"
        :layers="category.layers"
        @layerSelected="handleLayerSelection($event)"
      />
    </div>
  </div>
</template>

<script setup>
import categoriesItem from '@/components/side_bar/drop_down/CategoriesItemDropdown.vue';
import { ref, watch } from 'vue';
import { API_URLS } from '@/constants/endpoints';
import { useLocationStore } from '@/stores/locationStore';

const locationStore = useLocationStore();
const categories = ref([]);

const props = defineProps({
  code: { type: Number, default: null },
  type: { type: String, default: null }
});

// Watch for changes in code
watch(
  [() => props.code, () => props.type],
  async([newCode, newType]) => {
    await fetchCategories(newCode, newType);
  },
  { immediate: true }
);

async function fetchCategories(code, type) {
  try {
    console.log('Fetching categories:', { code, type });
    const response = await fetch(`${API_URLS.CATEGORIES}?code=${code}&type=${type}`);
    const data = await response.json();

    if (data && data.categories) {
      categories.value = data.categories;
      
      // Set first layer as active
      if (categories.value.length > 0 && categories.value[0].layers?.length > 0) {
        const firstLayer = categories.value[0].layers[0];
        firstLayer.isActive = true;
        
        console.log('Setting initial layer:', firstLayer);
        locationStore.setLocation({
          category: categories.value[0].name,
          layer: firstLayer.slug
        });
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

const handleLayerSelection = (layerData) => {
  console.log('Layer selected:', layerData);
  locationStore.setLocation({
    category: layerData.categoryName,
    layer: layerData.layer.slug
  });
};
</script>

<style scoped>

  .container {
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
    align-self: stretch;
    flex: 1 0 0;
    overflow-y: auto; /* Permite scroll apenas na vertical */
    height: 100%; /* Garante que o elemento ocupe a altura do pai */
  }

  .options {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    padding: 0px 0px;
  }

  .text {
    color: var(--Theme-Secondary, #6C757D);
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: white;
    border-bottom: 8px solid var(--Theme-Border, #FFFFFF); /* Borda colorida */
    margin-top: -8px; /* Compensa a altura da borda */
  }
</style>
