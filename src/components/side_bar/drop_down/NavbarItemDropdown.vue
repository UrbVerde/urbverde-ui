<template>
  <div class="option">
    <ul class="inline-nav-item navbar-nav">
      <div class="dropdown" data-bs-auto-close="false">
        <a href="#" class="nav-item nav-link" :class="{ 'dropdown-active': isDropdownOpen }" id="navbarDropdown"
          role="button" data-bs-toggle="dropdown" aria-expanded="false" @click="toggleDropdown">
          <i :class="iconPath" class="bi" id="imgIcon"></i>
          <span class="textItem small-regular">{{ props.itemName }}</span>
          <div class="badge-right-menu" v-if="txtBadge">
            <span class="textBadge caption-medium">{{ txtBadge }}</span>
          </div>
          <i :class="isDropdownOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" width="14" height="14"></i>
        </a>

        <ul class="dropdown-menu" :class="{ show: isDropdownOpen }" aria-labelledby="navbarDropdown">
          <li v-for="(layer, index) in props.layers" :key="layer.id"
            :class="{ 'is-active': layer.isActive, 'notActive': !layer.isActive, 'active': layer.isActive }"
            @click="toggleLayerActive(index, $event)">
            <div v-show="layer.show" id="intern-padding">
              <a tag="dropdownitem-txt" v-show="layer.show" class="dropdown-item">{{ layer.name }}</a>
            </div>
          </li>
        </ul>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';


const txtBadge = ref('');
const isDropdownOpen = ref(false);

const iconPath = computed(() => {
  switch (props.itemName.toLowerCase()) {
    case 'clima':
      return 'bi bi-cloud-sun'; // Ícone de clima
    case 'vegetação':
      return 'bi bi-tree'; // Ícone de vegetação
    case 'parques e praças':
      return 'bi bi-bicycle'; // Ícone de parques
    default:
      return 'bi bi-exclamation-circle'; // Ícone padrão
  }
});

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
  }
});

const isDropdownSelected = ref(props.isSelectedItem);
const emit = defineEmits(['update:isSelectedItem']);

const closeDropdownOnOutsideClick = (event) => {
  const dropdownElement = document.querySelector('.dropdown');
  if (!isDropdownSelected.value && isDropdownOpen.value) {
    if (dropdownElement && !dropdownElement.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  } else {
    if (isDropdownSelected.value && isDropdownOpen.value) {
      if (dropdownElement && !dropdownElement.contains(event.target)) {
        props.layers.forEach((layer) => {
          if (!layer.isActive) { layer.show = false; }
        });
      }
    }
  }
};

watch(() => props.isSelectedItem, (newVal) => {
  isDropdownSelected.value = newVal;
  if (!newVal) {
    txtBadge.value = '';
    props.layers.forEach((layer) => {
      layer.isActive = false;
      layer.show = true;
    });
  }
});

onMounted(() => {
  // Initialize show property for each layer
  props.layers.forEach(layer => {
    layer.show = true;
  });
  document.addEventListener('click', closeDropdownOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});

const toggleDropdown = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
  props.layers.forEach((layer) => {
    if (!layer.isActive) {
      layer.show = true;
    }
  });

  if (!isDropdownOpen.value && isDropdownSelected.value) {
    txtBadge.value = '1';
  }
  if (isDropdownOpen.value && isDropdownOpen.value) {
    txtBadge.value = '';
  }
};

const toggleLayerActive = (index, event) => {
  event.stopPropagation();
  if (props.layers[index].isActive) {
    isDropdownSelected.value = false;
    txtBadge.value = '';
    props.layers[index].isActive = !props.layers[index].isActive;
    props.layers.forEach((layer) => {
      layer.show = true;
    });
  } else {
    isDropdownSelected.value = true;
    emit('update:isSelectedItem', !props.isSelectedItem);
    props.layers.forEach((layer, i) => {
      layer.isActive = i === index;
    });
  }
};
</script>

<style scoped>
/* Outras regras de estilo */

#imgIcon {

  font-size: 20px;
  /* Ajuste o tamanho do ícone */
  display: flex;
  align-items: center;
  justify-content: center;

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
  background-color: pink;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;


}

.inline-nav-item {

  background-color: white;
  align-self: stretch;

}
.inline-nav-item:hover {

  color: black;
  /* Cor desejada para o texto */

  /* Cor de fundo opcional */
  background-color: var(--Primary-Fade-100, #F8F9FA);

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
  color: black;
  /* Cor desejada para o texto */

  /* Cor de fundo opcional */
  background-color: orange;
}

.dropdown-menu {
  border: none;
  box-shadow: none;
  background-color: var(--Primary-Fade-100, orange);
  display: none;

}

.dropdown-menu.show {
  display: block;
  background-color: var(--Primary-Fade-100, white);

}

#dropdownitem-txt {}

.dropdown-item {
  --bs-dropdown-link-active-bg: gray;
  --bs-dropdown-link-active-color: #fff;
  --bs-dropdown-link-hover-bg: #D3E1E0;

  font-size: small;
  font-family: Inter, sans-serif;

}

.active {
  border-left: 3px solid var(--Body-Text-Body-Color, #212529);
  background: var(--Primary-Fade-100, #D3E1E0);
  transition: .2s;
  padding: 0px 0px;
  gap: 12px;
}

.notActive {
  padding: 0px 0px;
  background: var(--Primary-Fade-100, #F8F9FA);
}

/**?*/
#intern-padding {
  padding: 0px 0px;
}

/* Novo estilo para quando o dropdown está ativo */
.dropdown-active {
  background: var(--Primary-Fade-100, #F8F9FA);
}

/*? */
.is-active .nav-item {
  background-color: var(--Primary-Fade-100, black);
}

.dropdown{
  background-color: white;
}
</style>
