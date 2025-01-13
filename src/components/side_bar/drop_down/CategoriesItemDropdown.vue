<!-- urbverde-ui/src/components/side_bar/drop_down/categoriesItemDropdown.vue -->
<template>
  <div class="option">
    <ul class="inline-nav-item navbar-nav">
      <div class="dropdown" data-bs-auto-close="false">
        <a href="#"
           class="nav-item nav-link"
           :class="{ 'dropdown-active': isDropdownOpen }"
           role="button"
           @click="toggleDropdown">
          <IconComponent :name="icon" :size="20" />
          <span class="textItem small-regular">{{ itemName }}</span>
          <div class="badge-right-menu" v-if="hasActiveLayer">
            <span class="textBadge caption-medium">1</span>
          </div>
          <i :class="isDropdownOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" />
        </a>

        <ul class="dropdown-menu-hidden" :class="{ 'dropdown-menu-show': isDropdownOpen }">
          <li class="dropdown-menu-item"
              v-for="(layer, index) in layers"
              :key="layer.id"
              :class="{ 'dropdown-menu-item-active': layer.isActive }"
              @click="selectLayer(layer)">
            <span class="dropdown-item-text small-regular">{{ layer.name }}</span>
            <div class="new-layout" v-if="layer.isNew">
              <i :class="'bi bi-stars'" class="bi" id="imgIconNew"></i>
            </div>
          </li>
        </ul>
      </div>
    </ul>
  </div>
</template>

<script setup>
import IconComponent from '@/components/icons/IconComponent.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  itemName: { type: String, required: true },
  icon: { type: String, default: 'bi bi-exclamation-circle' },
  layers: { type: Array, required: true }
});

const emit = defineEmits(['layerSelected']);

const isDropdownOpen = ref(false);

// Automatically open dropdown if there's an active layer
const hasActiveLayer = computed(() => props.layers.some(layer => layer.isActive));

onMounted(() => {
  if (hasActiveLayer.value) {
    isDropdownOpen.value = true;
  }
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

function handleOutsideClick(event) {
  const dropdownEl = event.target.closest('.dropdown');
  if (!dropdownEl && isDropdownOpen.value) {
    // Only close if no active layers
    if (!hasActiveLayer.value) {
      isDropdownOpen.value = false;
    }
  }
}

function toggleDropdown(event) {
  event.preventDefault();
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;

  // Close other dropdowns
  document.querySelectorAll('.dropdown-menu-show').forEach(el => {
    if (!el.closest('.dropdown').contains(event.target)) {
      el.classList.remove('dropdown-menu-show');
    }
  });
}

function selectLayer(layer) {
  // Deactivate all other layers across all categories
  document.querySelectorAll('.dropdown-menu-item-active').forEach(el => {
    el.classList.remove('dropdown-menu-item-active');
  });

  // Set the new active layer
  props.layers.forEach(l => {
    l.isActive = l.id === layer.id;
  });

  emit('layerSelected', {
    layer,
    categoryName: props.itemName
  });
}
</script>

<style scoped>

#imgIcon {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#imgIconNew {
  font-size: 14px;
  height: 14px;
  width: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.new-layout {
  font-size: 22px;
  height: 22px;
  width: 22px;
  display: inline-flex;
  padding: 4px;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: var(--Primary-Fade-100, #D2E8DD);;
}

.textItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
}

.textBadge {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
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

#navItem {
  padding: 0px 0px;
}

#collapse {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
}

.inline-nav-item {
  background-color: black;
  align-self: stretch;
}

.nav-item {
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 8px;
}

.nav-item:hover {
  background: var(--Gray-200, #E9ECEF);
}

.dropdown-menu-hidden {
  border: none;
  box-shadow: none;
  display: none;
}

.dropdown-menu-show {
  list-style-type: none;
  background-color: var(--Primary-Fade-100, pink);
  display: flex;
  padding: 8px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 4px;
  background: var(--Gray-100, #F8F9FA);
}

.dropdown-menu-item {
  cursor: pointer;
  display: flex;
  padding: 8px 16px 8px 24px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
}

.dropdown-menu-item:hover {
  background: var(--Gray-200, #E9ECEF);
}

.dropdown-menu-item-active {
  border-left: 3px solid var(--Body-Text-Body-Color, #212529);
  background: var(--Primary-Fade-100, #D2E8DD);
}

.dropdown-menu-item-active:hover {
  background: var(--Primary-Fade-100, #D2E8DD);
}

.dropdown-item-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  color: var(--Body-Text-Body-Color, #212529);
}

.notActive {
  padding: 0px 0px;
  background: var(--Primary-Fade-100, #F8F9FA);
}

/* Novo estilo para quando o dropdown está ativo */
.dropdown-active {
  background: var(--Primary-Fade-100, #F8F9FA);
}

/*? */
.is-active .nav-item {
  background-color: var(--Primary-Fade-100, black);
}

.dropdown {
  background-color: white;
}
</style>
