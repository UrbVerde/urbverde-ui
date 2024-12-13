<template>
  <nav class="navbar navbar-expand-x1 navbar-light  container-fluid">
    <ul class="navbar-nav w-100 justify-content-center" id="navCont">
      <div class="dropdown" data-bs-auto-close="false">
        <a href="#" class="navbar nav-link " :class="{ 'dropdown-active': isDropdownOpen }" id="navbarDropdown"
          role="button" data-bs-toggle="dropdown" aria-expanded="false" @click="toggleDropdown">

          <img class="d-inline-block" id="imgIcon" :src="iconPath" width="20"
            height="20" />
          <span id="txtItem">{{ props.itemName }}</span>
          <span id="txtBadge">{{ txtBadge }}</span>
          <img class="d-inline-block" :src="isDropdownOpen ? collapseIcon : expandIcon" width="14" height="14" />

        </a>

        <ul class="dropdown-menu" :class="{ show: isDropdownOpen }" aria-labelledby="navbarDropdown">
          <li v-for="(slot, index) in slots" :key="index"
            :class="{ 'is-active': slot.isActive, 'notActive': !slot.isActive, 'active': slot.isActive }"
            @click="toggleSlotActive(index, $event)"
          >
            <div v-show="slot.show" id="intern-padding">
              <a tag="dropdownitem-txt" v-show="slot.show" class="dropdown-item">{{ slot.name }}</a>
            </div>
          </li>
        </ul>
      </div>
    </ul>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

//Dropdown.Default.autoClose = false;

import collapseIcon from '../../../components/icons/collapse.svg';
import expandIcon from '../../../components/icons/expand.svg';
import sun from "../../../components/icons/sunBehindeCloud.svg";
import tree from "../../../components/icons/pineTree.svg"
import bike from "../../../components/icons/bike.svg"

const txtBadge = ref("");

const isDropdownOpen = ref(false);


// Computed property to get the icon path based on itemName
const iconPath = computed(() => {
  switch (props.itemName.toLowerCase()) {
    case 'clima':
      return sun;
    case 'vegetação':
      return tree;
    case 'parques e praças':
      return bike;
    default:
      return sun; // Default icon if itemName doesn't match any case
  }
});


const props = defineProps({
  isSelectedItem: {
    type: Boolean,
    default: false,
  },
  itemName: {
    type: String,
    default: "",
  }
});

// Crie uma variável reativa para manter o estado interno
const isDropdownSelected = ref(props.isSelectedItem);

// Crie um emit
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
        slots.value.forEach((slot) => {
          if (!slot.isActive)
            slot.show = false;
        });
      }

    }
  }
};

// Adicionar um watch para monitorar a mudança de isSelectedItem
watch(() => props.isSelectedItem, (newVal) => {
  isDropdownSelected.value = newVal;
  if (!newVal) {
    txtBadge.value = "";
    slots.value.forEach((slot) => {
      slot.isActive = false;
      slot.show = true;
    });
  }
});


onMounted(() => {
  document.addEventListener('click', closeDropdownOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});

const toggleDropdown = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
  slots.value.forEach((slot) => {
    if (!slot.isActive) {

      slot.show = true;
    }


  });
  if (!isDropdownOpen.value && isDropdownSelected.value) {//se ta fechado e selecionado
    txtBadge.value = "1";
  }
  if (isDropdownOpen.value && isDropdownOpen.value) {//se ta aberto e selecionado
    txtBadge.value = "";
  }
};





const toggleSlotActive = (index, event) => {
  event.stopPropagation();
  if (slots.value[index].isActive) {

    isDropdownSelected.value = false;

    txtBadge.value = "";

    slots.value[index].isActive = !slots.value[index].isActive;
    slots.value.forEach((slot) => {
      slot.show = true;
    });
  } else {

    // Função para alternar o valor de isDropdownSelected e emitir um evento
    isDropdownSelected.value = true;

    emit('update:isSelectedItem', !props.isSelectedItem);



    slots.value.forEach((slot, i) => {
      slot.isActive = i === index;

    });
  }
};

const slots = ref([
  { name: 'Item 1 2nd Level ', isActive: false, show: true },
  { name: 'Item 2 2nd Level ', isActive: false, show: true },
  { name: 'Item 3 2nd Level ', isActive: false, show: true }
]);






</script>

<style scoped>
/* Outras regras de estilo */

#imgIcon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#txtItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  font-family: Inter, sans-serif;
  font-size: small;
}

#txtBadge {
  font-size: small;
  display: flex;
  padding: 0px 7px;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: var(--Primary-Fade-100, #D3E1E0);
  font-family: Inter, sans-serif;
}


#navCont {}

#navItem {
  padding: 0px 0px;
}

#collapse {
  display: flex;
  flex-direction: column;
  align-items: center;
  
}

#navbarDropdown {
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 8px;
  
}

.navbar {
  padding: var(--bs-navbar-padding-x);
  background-color: white;
  padding: 8px 0px;
  
}


.nav-link:hover {
  color: black;
  /* Cor desejada para o texto */

  /* Cor de fundo opcional */
  background-color: var(--Primary-Fade-100, #F8F9FA);
}



.dropdown-menu {
  border: none;
  /* Remove a borda do dropdown */
  box-shadow: none;
  /* Remove a sombra do dropdown, se houver */
  background-color: var(--Primary-Fade-100, orange);
  display: none;
  
  
}

.dropdown-menu.show {
  display: block;
  background-color: var(--Primary-Fade-100, white);
  

}
#dropdownitem-txt{
}
.dropdown-item {
  --bs-dropdown-link-active-bg: gray;
  --bs-dropdown-link-active-color: #fff;
  --bs-dropdown-link-hover-bg: #D3E1E0;
  
  font-size:small;
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
.is-active .nav-link {
  background-color: var(--Primary-Fade-100, black);

}
</style>
