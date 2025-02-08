// // src/stores/layerStore.js
// import { defineStore } from 'pinia';
// import { ref, computed, watch } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import { categories } from '../mock/categories';
// import { useLocationStore } from './locationStore';

// export const useLayerStore = defineStore('layerStore', () => {
//   const router = useRouter();
//   const route = useRoute();
//   const locationStore = useLocationStore();

//   // State
//   const activeLayers = ref(new Set());
//   const layerOpacities = ref(new Map());
//   const selectedCategory = ref(null);
//   const selectedLayer = ref(null);
//   const availableCategories = ref(categories);
//   const loading = ref(false);
//   const error = ref(null);

//   // Getters
//   const currentCategory = computed(() =>
//     availableCategories.value.find(c => c.id === selectedCategory.value)
//   );

//   const currentLayer = computed(() => {
//     if (!currentCategory.value) return null;
//     return currentCategory.value.layers.find(l => l.id === selectedLayer.value);
//   });

//   const visibleLayers = computed(() => {
//     const layers = [];
//     for (const categoryId of Array.from(activeLayers.value)) {
//       const [catId, layerId] = categoryId.split('/');
//       const category = availableCategories.value.find(c => c.id === catId);
//       if (!category) continue;

//       const layer = category.layers.find(l => l.id === layerId);
//       if (!layer) continue;

//       layers.push({
//         ...layer,
//         categoryId: catId,
//         opacity: layerOpacities.value.get(layerId) ?? 1
//       });
//     }
//     return layers;
//   });

//   const currentScale = computed(() => locationStore.scale || 'municipal');

//   const currentYear = computed(() => locationStore.year || 2021);

//   // Actions
//   function setCategory(categoryId) {
//     selectedCategory.value = categoryId;
//     // Clear layer selection if category changes
//     if (selectedLayer.value) {
//       const currentLayerCategory = getLayerCategory(selectedLayer.value);
//       if (currentLayerCategory !== categoryId) {
//         selectedLayer.value = null;
//       }
//     }
//     updateUrl();
//   }

//   function setLayer(layerId) {
//     selectedLayer.value = layerId;
//     updateUrl();
//   }

//   function toggleLayer(categoryId, layerId) {
//     const layerKey = `${categoryId}/${layerId}`;
//     if (activeLayers.value.has(layerKey)) {
//       activeLayers.value.delete(layerKey);
//     } else {
//       activeLayers.value.add(layerKey);
//     }
//     updateUrl();
//   }

//   function setLayerOpacity(layerId, opacity) {
//     layerOpacities.value.set(layerId, opacity);
//   }

//   function getLayerCategory(layerId) {
//     for (const category of availableCategories.value) {
//       if (category.layers.some(l => l.id === layerId)) {
//         return category.id;
//       }
//     }
//     return null;
//   }

//   function updateUrl() {
//     const query = {
//       ...route.query,
//       category: selectedCategory.value,
//       layer: selectedLayer.value,
//       active: Array.from(activeLayers.value).join(',')
//     };

//     // Only update if query params have changed
//     const currentQuery = route.query;
//     if (JSON.stringify(query) !== JSON.stringify(currentQuery)) {
//       router.replace({ query });
//     }
//   }

//   async function loadCategories() {
//     loading.value = true;
//     error.value = null;

//     try {
//       // In the future, this will be an API call
//       // const response = await fetch('api/categories');
//       // const data = await response.json();
//       // availableCategories.value = data;

//       // For now, use mock data
//       availableCategories.value = categories;
//     } catch (err) {
//       console.error('Error loading categories:', err);
//       error.value = err.message;
//     } finally {
//       loading.value = false;
//     }
//   }

//   // Initialize from URL
//   function initFromUrl(query) {
//     if (query.category) {
//       selectedCategory.value = query.category;
//     }
//     if (query.layer) {
//       selectedLayer.value = query.layer;
//     }
//     if (query.active) {
//       activeLayers.value = new Set(query.active.split(','));
//     }
//   }

//   // Watch for scale changes
//   watch(() => locationStore.scale, (newScale, oldScale) => {
//     if (newScale !== oldScale) {
//       // Could trigger layer updates or reconfiguration based on scale
//       console.log('Scale changed:', newScale);
//     }
//   });

//   // Initialize store
//   loadCategories();

//   return {
//     // State
//     activeLayers,
//     layerOpacities,
//     selectedCategory,
//     selectedLayer,
//     availableCategories,
//     loading,
//     error,

//     // Getters
//     currentCategory,
//     currentLayer,
//     visibleLayers,
//     currentScale,
//     currentYear,

//     // Actions
//     setCategory,
//     setLayer,
//     toggleLayer,
//     setLayerOpacity,
//     loadCategories,
//     initFromUrl
//   };
// });
