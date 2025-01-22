<!-- urbverde-ui/src/components/side_bar/SideBar.vue -->
<template>

  <aside class="sidebar" :class="{ 'collapsed': !isOpen }">
    <div class="top-area">
      <LogoButton v-show="showContent" />
      <MinimizeButton @click="toggleSidebar" />
    </div>
    <!-- componente painel: brasil / políticas públicas -->
    <div v-show="showContent" class="search-area">
      <BuscaSimples
        :openDelay="2000"
        @api-error="$emit('api-error')"
        @location-updated="onLocationUpdated"
      />

    </div>

    <div v-show="showContent" class="middle-area">
      <DropDown
        v-if="isSearchDone"
        :code="code"
        :type="type"
      />
    </div>

    <div v-show="showContent" class="bottom-area">
      <a class="link-button" href="https://urbverde-educa.tawk.help/" target="_blank">
        <i class="bi bi-upload" tag="imgIcon"></i>
        <span class="txt-bottom small-regular">Colaborar com dados</span>
      </a>
      <a class="link-button" href="https://urbverde-educa.tawk.help/" target="_blank">
        <i class="bi bi-question-circle" tag="imgIcon"></i>
        <span class="txt-bottom small-regular">Central de ajuda</span>
      </a>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 301px;
  height: 100vh;
  background: #FFF;
  box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.13) inset;
  z-index: 100;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 72px;
  overflow: hidden;
}

.top-area {
  flex: 0 0 auto;
  display: flex;
  height: 88px;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  background: #FFF;
  border-right: 1px solid rgba(0, 0, 0, 0.13);
}

/* Container for search and middle areas */
.middle-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0; /* Important for Firefox */
}

.search-area {
  flex: 0 0 auto;
  padding: 16px 16px 0;
  min-height: 48px;
}

.middle-area {
  flex: 1 1 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.bottom-area {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 24px;
  background: #FFF;
  border-right: 1px solid rgba(0, 0, 0, 0.13);
  border-top: 1px solid rgba(0, 0, 0, 0.13);
}

.link-button {
  text-decoration: none;
  color: black;
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 16px;
}

.txt-bottom {
  font-family: Inter, sans-serif;
  font-size: small;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

i[tag="imgIcon"] {
  font-size: 20px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<script setup>
import { ref } from 'vue';
import MinimizeButton from './buttons/MinimizeButton.vue';
import LogoButton from './buttons/LogoButton.vue';
import BuscaSimples from '../search_dropdown/BuscaSimples.vue';
import DropDown from './drop_down/NavbarDropdown.vue';

const emit = defineEmits(['update-coordinates', 'toggle-sidebar', 'api-error']);

const isSearchDone = ref(false);
const isOpen = ref(true);
const showContent = ref(true);
const code = ref(null);
const type = ref(null);

function onLocationUpdated(coordinates) {
  if (coordinates?.code) {
    isSearchDone.value = true;
    code.value = coordinates.code;
    type.value = coordinates.type;
    emit('update-coordinates', coordinates);
  }
}

async function toggleSidebar() {
  if (isOpen.value) {
    showContent.value = false;
    isOpen.value = false;
  } else {
    isOpen.value = true;
    await new Promise(resolve => setTimeout(resolve, 200));
    showContent.value = true;
  }
  emit('toggle-sidebar');
  localStorage.setItem('sidebarOpen', isOpen.value.toString());
}
</script>
