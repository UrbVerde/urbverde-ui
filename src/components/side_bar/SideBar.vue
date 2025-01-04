<!-- urbverde-ui/src/components/side_bar/SideBar.vue -->
<template>
  <div>
    <div :class="['sidebar', { 'sidebar-open': isOpen }]">
      <div :class="['top-area', { 'top-area-open': isOpen }]">
        <LogoButton v-show="isOpen" />
        <!-- Emite o evento para alternar o estado da sidebar -->
        <MinimizeButton @click="toggleSidebar" />
      </div>
      <div v-show="isOpen" class="search-area">
        <BuscaSimples @api-error="$emit('api-error')" @location-updated="onLocationUpdated"/>
      </div>
      <div v-show="isOpen" class="middle-area">
        <DropDown v-if="isSearchDone" :options="options" />
      </div>
      <div v-show="isOpen" class="bottom-area">
        <a class="link-button">
          <img class="d-inline-block"
               id="imgIcon"
               src="../../assets/icons/export.svg"
               width="20"
               height="20" />
          <span id="txtBottom">Colabore com dados</span>
        </a>
        <a class="link-button">
          <img class="d-inline-block"
               id="imgIcon"
               src="../../assets/icons/help.svg"
               width="20"
               height="20" />
          <span id="txtBottom">Central de ajuda</span>
        </a>
      </div>

    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';

import MinimizeButton from './buttons/MinimizeButton.vue';
import LogoButton from './buttons/LogoButton.vue';
import BuscaSimples from '../search_dropdown/BuscaSimples.vue';
import DropDown from './drop_down/NavbarDropdown.vue';

// defineEmits é uma macro: não precisa de import!
const emit = defineEmits(['update-coordinates', 'toggle-sidebar', 'toggle-sidebar', 'update-coordinates', 'api-error']);

// Variável para controlar se a busca foi feita
const isSearchDone = ref(false);

// Variável para controlar se a sidebar fica aberta
const isOpen = ref(true);

// to-do: axios request from the api, what categories and layers exist for that specific cd_mun
const options = ref(['Clima', 'Vegetação', 'Parques e Praças']);

function onLocationUpdated(coordinates) {
  isSearchDone.value = true;
  emit('update-coordinates', coordinates);
};

function toggleSidebar() {
  isOpen.value = !isOpen.value;
  localStorage.setItem('sidebarOpen', isOpen.value);
};

</script>

<style scoped>
.sidebar {
  /* Remove position: fixed; top; left; */
  width: 72px;
  height: 100vh;
  transition: 0.3s;
  overflow: hidden;
  background: var(--Gray-White, #FFF);
  box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.13) inset;
  z-index: 100; /* optional if you want it above the map if they overlap horizontally */
}

.sidebar-open {
  width: 301px;  /* 280px*/
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  background: var(--Gray-White, #FFF);
  transition: 0.3s;
}

.top-area {
  display: flex;
  height: 88px;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  background: var(--White, #FFF);
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
}

.logo {
  display: flex;
  padding-left: 8px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
}

.list-group {
  width: 100%;
}

.list-group-item {
  width: 100%;
}

.middle-area {
  display: flex;
  padding: 32px 16px 16px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
  align-self: stretch;

}

.search-area {

  display: flex;
  padding: 0px 16px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  height: auto; /* Allow it to adjust to content */
  min-height: 48px; /* Minimum height to match the input field */
  overflow: visible; /* Allow content to overflow */
}

.bottom-area {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  padding: 16px 24px;
  margin-top: auto;
  /* Empurra a área inferior para o fim */
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
  border-top: 1px solid rgba(0, 0, 0, 0.13);
  background: var(--White, #FFF);
}

.link-button {
  text-decoration: none;
  color: var(--Primary-Color, black);
  font-weight: bold;
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

#txtBottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  font-family: Inter, sans-serif;
  font-size: small;

}

</style>
