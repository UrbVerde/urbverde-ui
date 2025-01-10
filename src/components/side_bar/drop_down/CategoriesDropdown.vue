<!-- urbverde-ui/src/components/side_bar/drop_down/categoriesDropdown.vue -->
<template>
  <div class="container">
    <span class="text caption-medium">CAMADAS</span>
    <div class="options">
      <categoriesItem
        v-for="(category, index) in categories"
        :key="category.id"
        :isSelectedItem="category.isSelected"
        :itemName="category.name"
        :icon="category.icon"
        :isNew="category.isNew"
        :layers="category.layers"
        @update:isSelectedItem="handleSelectionChange(index)"
      />
    </div>
  </div>
</template>

<script setup>
import categoriesItem from '@/components/side_bar/drop_down/categoriesItemDropdown.vue';
import { ref, watch } from 'vue';
import { API_URLS } from '@/constants/endpoints';
import { useLocationStore } from '@/stores/locationStore';

const locationStore = useLocationStore();
const categories = ref([]);

// Props with validation
const props = defineProps({
  code: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: null
  }
});

// Watch for changes in code
watch(
  [() => props.code, () => props.type],
  async([newCode, newType]) => {
    await fetchCategories(newCode, newType);
  },
  { immediate: true }
);

// Function to fetch categories based on location code
async function fetchCategories(code, type) {
  try {
    // console.log('Fetching categories:', { code, type });
    const response = await fetch(`${API_URLS.CATEGORIES}?code=${code}&type=${type}`);
    const data = await response.json();

    if (data && data.categories) {
      // Initialize categories with selection state
      categories.value = data.categories.map(category => ({
        ...category,
        isSelected: false
      }));

      // Update store
      locationStore.setCategories(categories.value);

      // Set initial selected category if none is selected
      const initialSelected = categories.value.find(cat => cat.isSelected);
      if (initialSelected) {
        locationStore.setSelectedCategory(initialSelected);
      }

      // console.log('Categories loaded:', categories.value);
    } else {
      console.warn('No categories received:', data);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Update selected state of categories - only one category can be selected at a time,
// this maps through all categories and sets isSelected true only for the clicked index
const handleSelectionChange = (selectedIndex) => {
  categories.value = categories.value.map((category, index) => {
    // Reset all layers' active state for non-selected categories
    if (index !== selectedIndex) {
      category.layers = category.layers.map(layer => ({
        ...layer,
        isActive: false
      }));
    }

    return {
      ...category,
      isSelected: index === selectedIndex
    };
  });

  // Update the store with the selected category
  const selectedCategory = categories.value[selectedIndex];
  locationStore.setSelectedCategory(selectedCategory);
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
