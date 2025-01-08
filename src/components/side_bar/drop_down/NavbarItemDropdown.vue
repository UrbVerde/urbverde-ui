<!-- urbverde-ui/src/components/side_bar/drop_down/NavbarItemDropdown.vue -->
<template>
  <div class="option">
    <ul class="inline-nav-item navbar-nav">
      <div class="dropdown" data-bs-auto-close="false">
        <a href="#" class="nav-item nav-link" :class="{ 'dropdown-active': isDropdownOpen }" role="button"
          data-bs-toggle="dropdown" aria-expanded="false" @click="toggleDropdown">
          <i :class="icon" class="bi" id="imgIcon"></i>
          <span class="textItem small-regular">{{ props.itemName }}</span>
          <div class="badge-right-menu" v-if="txtBadge">
            <span class="textBadge caption-medium">{{ txtBadge }}</span>
          </div>
          <i :class="isDropdownOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" width="14" height="14"></i>
        </a>

        <ul class="dropdown-menu-hidden" :class="{ 'dropdown-menu-show': isDropdownOpen }">

          <li class="dropdown-menu-item" v-for="(layer, index) in props.layers" :key="layer.id"
            :class="{ 'dropdown-menu-item-active': layer.isActive }" @click="toggleLayerActive(index, $event)">

            <span class="dropdown-item-text small-regular">{{ layer.name }}</span>
            <div class="new-layout" v-if="layer.isNew">
              <i :class="iconNew" v-if="layer.isNew" class="bi" id="imgIconNew"></i>
            </div>
          </li>

        </ul>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Reactive variable for badge text
const txtBadge = ref('');

// Reactive variable to track dropdown open state
const isDropdownOpen = ref(false);

// Computed property for new layer icon
const iconNew = computed(() => {
  return 'bi bi-stars'; // Icon for new layer
});

// Define component props
const props = defineProps({
  isSelectedItem: {
    type: Boolean,
    default: false,
  },
  itemName: {
    type: String,
    default: '',
  },
  layers: {
    type: Array,
    default: () => [],
  },
  icon: {
    type: String,
    default: 'bi bi-exclamation-circle',
  },
});

// Reactive variable to track if dropdown item is selected
const isDropdownSelected = ref(props.isSelectedItem);

// Emit event to update selected item state
const emit = defineEmits(['update:isSelectedItem']);

// Function to close dropdown when clicking outside
const closeDropdownOnOutsideClick = (event) => {
  const dropdownElement = document.querySelector('.dropdown');
  if (!isDropdownSelected.value && isDropdownOpen.value) {
    if (dropdownElement && !dropdownElement.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  }
};

// Add event listener on component mount
onMounted(() => {
  document.addEventListener('click', closeDropdownOnOutsideClick);
});

// Remove event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});

// Function to toggle dropdown open state
const toggleDropdown = (event) => {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;

  if (!isDropdownOpen.value && isDropdownSelected.value) {
    txtBadge.value = '1';
  }
  /* if (isDropdownOpen.value) { 
  txtBadge.value = '';
  }*/
};

// Function to toggle layer active state
const toggleLayerActive = (index, event) => {
  event.stopPropagation();
  const currentLayer = props.layers[index];
  
  if (currentLayer.isActive) {
    // If clicking an active layer, deactivate it
    isDropdownSelected.value = false;
    txtBadge.value = '';
    currentLayer.isActive = false;
    emit('update:isSelectedItem', false);
  } else {
    // If clicking an inactive layer, activate it and deactivate others
    isDropdownSelected.value = true;
    emit('update:isSelectedItem', true);
    props.layers.forEach((layer, i) => {
      layer.isActive = i === index;
    });
  }
};
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