<!-- urbverde-ui/src/components/side_bar/SideBar.vue -->
<template>
  <div>
    <div :class="['sidebar', { 'sidebar-open': isOpen }]">
      <div :class="['top-area', { 'top-area-open': isOpen }]">
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
          <span id="txtBottom small-regular">Colaborar com dados</span>
        </a>
        <a class="link-button" href="https://urbverde-educa.tawk.help/" target="_blank">
          <i class="bi bi-question-circle" tag="imgIcon"></i>
          <span id="txtBottom small-regular">Central de ajuda</span>
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

// Define emits with clear names
const emit = defineEmits([
  'update-coordinates',
  'toggle-sidebar',
  'api-error'
]);

// Component state
const isSearchDone = ref(false);
const isOpen = ref(true);
const showContent = ref(true);
const code = ref(null);
const type = ref(null);

// Location update handler
function onLocationUpdated(coordinates) {
  if (coordinates?.code) {
    isSearchDone.value = true;
    code.value = coordinates.code;
    type.value = coordinates.type;
    emit('update-coordinates', coordinates);
  }
}

// Sidebar toggle handler with animation
async function toggleSidebar() {
  if (isOpen.value) {
    // When closing, hide content immediately
    showContent.value = false;
    isOpen.value = false;
  } else {
    // When opening, first expand the sidebar
    isOpen.value = true;
    // Wait 0.2 second before showing content
    await new Promise(resolve => setTimeout(resolve, 200));
    showContent.value = true;
  }
  localStorage.setItem('sidebarOpen', isOpen.value);
};

</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 72px;
  height: 100vh;
  transition: 0.3s;
  overflow: hidden;
  background: var(--Gray-White, #FFF);
  box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.13) inset;
  z-index: 100;
}

.sidebar-open {
  width: 301px;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  /* background: var(--Gray-White, #FFF); */
  /* height: 100%; Garante que o sidebar ocupe a tela */
}

/* Rest of the styles remain unchanged */
.top-area {
  display: flex;
  height: 88px;
  padding: 16px;
  justify-content: space-between;
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
  flex: 1 0 auto;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  align-self: stretch;

}

.search-area {
  display: flex;
  padding: 0px 16px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  height: auto;
  min-height: 48px;
  overflow: visible;
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
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
  border-top: 1px solid rgba(0, 0, 0, 0.13);
  background: var(--White, #FFF);
}

.link-button {
  text-decoration: none;
  color: var(--Primary-Color, black);
  display: flex;
  padding: 8px 8px;
  justify-content: start;
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

#imgIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  width: 20px;
  height: 20px;
}
</style>
