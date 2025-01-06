<!-- urbverde-ui/src/components/side_bar/drop_down/NavbarDropdown.vue -->
<template>
  <div class="container">
    <span class="text caption-medium">CATEGORIAS</span>

    <div class="options">
      <NavbarItem v-for="(category, index) in categories" :key="category.id" :isSelectedItem="category.isSelected"
        :itemName="category.name" :layers="category.layers" @update:isSelectedItem="handleSelectionChange(index)" />
    </div>
  </div>
</template>

<script setup>
import NavbarItem from '@/components/side_bar/drop_down/NavbarItemDropdown.vue';
import { ref, onMounted } from 'vue';

const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    categories.value = data.categories.map(category => ({
      ...category,
      isSelected: false
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to static data in case of error
    categories.value = [
      { name: 'Clima', isSelected: false },
      { name: 'Vegetação', isSelected: false },
      { name: 'Parques e Praças', isSelected: false },
    ];
  }
};

const handleSelectionChange = (selectedIndex) => {
  categories.value.forEach((category, index) => {
    category.isSelected = index === selectedIndex;
  });
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.container {
  padding: 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  align-self: stretch;
  flex: 1 0 0;
  color: black;
  /*background: var(--HitBox, rgba(255, 255, 255, 0.00));*/
  background: black;
}

.options {

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
}

.text {
  color: var(--Theme-Secondary, #6C757D);

  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
}
</style>