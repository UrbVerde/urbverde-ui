<!-- urbverde-ui/src/components/navbar/NavbarMap.vue -->
<template>

  <!-- Desktop version -->

  <div class="navbar"
       v-if="largerThan('tablet')"
  >
    <div class="response">
      <!-- Primeira linha: Título e Botões -->
      <div class="header">
        <div class="header-left heading-h5">
          <h5>{{ layer }} em {{ cityName }}-{{ uf }}</h5>
        </div>
        <div class="header-right">
          <button @click="shareMap" class="nav-button">
            <i class="bi bi-share"></i>
          </button>

          <a
            href="https://urbverde-educa.tawk.help/category/categorias-e-camadas"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button @click="layerInfo" class="nav-button">
              <i class="bi bi-info-circle"></i>
              <p class="body-small-regular">Entender esse dado</p>
            </button>
          </a>
        </div>
      </div>

      <!-- Segunda linha: Navegação -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="navigateTo(tab.id)"
          :class="{ 'active-tab': activeSection === tab.id }"
          class="tab-button"
        >
          <p class="body-small-medium">{{ tab.label }}</p>
        </button>
      </div>
    </div>
    <!-- Modal de compartilhamento -->
    <modalShare
      ref="refModalShare"
      :cityName="cityName"
      :stateName="uf"
    />
  </div>

  <!-- Mobile version -->

  <div class="navbar"
       v-else
  >
    <div class="response">
      <div class="header">
        <CollapseButton
          :is-open="isSidebarOpen"
          @toggle-sidebar="$emit('toggle-sidebar')"
        />

        <div class="mobile-nav-right">
          <div class="logo">
            <LogoButton />
          </div>

          <div class="search-nav">
            <BuscaSimples @api-error="$emit('api-error')" />
          </div>

          <!-- Botão de três pontos para mobile -->
          <div class="mobile-menu-container">
            <button
              @click="togglePopover"
              class="three-dots-button"
              ref="popoverButton"
            >
              <i class="bi bi-three-dots-vertical"></i>
            </button>

            <!-- Popover e nasted button -->
            <div
              v-if="isPopoverVisible"
              class="popover-menu shadow"
              ref="popoverMenu"
            >

              <div class="popover-item" @click="shareMap">
                <i class="bi bi-share"></i>
                <p class="body-small-regular">Compartilhar</p>
              </div>

              <a
                href="https://urbverde-educa.tawk.help/category/categorias-e-camadas"
                target="_blank"
                rel="noopener noreferrer"
                class="popover-item"
                @click="layerInfo"
              >
                <i class="bi bi-info-circle"></i>
                <p class="body-small-regular">Entender esse dado</p>
              </a>

            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- Modal de compartilhamento -->
    <modalShare
      ref="refModalShare"
      :cityName="cityName"
      :stateName="uf"
    />
  </div>

</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import modalShare from '../modal/modalShare.vue';
import { useWindowSize } from '@/utils/useWindowsSize';
import CollapseButton from '../side_bar/buttons/CollapseButton.vue';
import BuscaSimples from '../search_dropdown/BuscaSimples.vue';
import LogoButton from '../side_bar/buttons/LogoButton.vue';

const { activeSection, isSidebarOpen } = defineProps({
  activeSection: {
    type: String,
    required: true,
  },
  isSidebarOpen: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(['navigate-to', 'toggle-sidebar']);
const refModalShare = ref(null);
const locationStore = useLocationStore();

// Popover refs e estado
const isPopoverVisible = ref(false);
const popoverButton = ref(null);
const popoverMenu = ref(null);

const layer = computed(() => {
  console.log('Navbar computed - current layer:', locationStore.currentLayerName);

  return locationStore.currentLayerName;
});
const cityName = computed(() => locationStore.nm_mun);
const uf = computed(() => locationStore.uf);

const tabs = ref([
  { id: 'map', label: 'Mapa' },
  { id: 'stats', label: 'Estatísticas' },
  { id: 'vulnerable', label: 'Vulnerabilidade' },
  { id: 'ranking', label: 'Ranking' },

]);

const {
  largerThan
} = useWindowSize();

function navigateTo(sectionId) {
  emit('navigate-to', sectionId);
}

function shareMap() {
  refModalShare.value.show();
}

function layerInfo() {
  // Info do dado
}

// Função para abrir/fechar o popover
function togglePopover() {
  isPopoverVisible.value = !isPopoverVisible.value;
}

// Função para fechar o popover ao clicar fora dele
const handleClickOutside = (event) => {
  if (
    isPopoverVisible.value &&
    popoverButton.value &&
    popoverMenu.value &&
    !popoverButton.value.contains(event.target) &&
    !popoverMenu.value.contains(event.target)
  ) {
    isPopoverVisible.value = false;
  }
};

// Adicionar e remover event listener para fechar o popover ao clicar fora
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

p, h5{
  margin: 0;
}

a {
  text-decoration: none;
}

.navbar {
  flex-shrink: 1;
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 9;
  background-color: #F8F9FACC;
  box-sizing: border-box;
  display: flex;
  backdrop-filter: blur(10px);
  padding: 32px 40px !important;
  transition: all 0.3s ease;
}

.response {
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.header-left h5 {
  color: map-get($body-text, body-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-button{
  display: flex;
  width: auto;
  height: 40px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #fff;
  border-radius: 8px;
  gap: 8px;
  padding: 11px;
  border: 1px solid map-get($gray, 200);
  color: map-get($body-text, body-color);
}

/* Tabs */
.tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button {
  background-color: transparent;
  border: none;
  padding: 4px 16px;
  font-size: 14px;
  cursor: pointer;
  color: map-get($theme, secondary);
  transition: all 0.0s ease; /* Adicione esta linha */

}

.tab-button:hover {
  color: map-get($theme, primary);
}

.active-tab {
  background-color: map-get($primary-fade, 100);
  color: map-get($theme, primary);
  border-radius: 16px;
  padding: 4px 16px;
  font-weight: 600;
}

.search-nav {
  height: 48px;
  width: 100%;
}

.mobile-nav-right {
  display: flex;
  width: 100%;
  gap: 8px;
}

.logo {
  width: auto;
  height: auto;
}

:deep(.search-wrapper) {
  width: 100%;
}

:deep(.logo-button) {
  height: 48px;
  padding: 0 16px 0 4px;
}

/* Botão de três pontos e popover mobile */
.mobile-menu-container {
  position: relative;
}

.three-dots-button {
  display: flex;
  width: 40px;
  height: 48px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: transparent;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
}

.three-dots-button i {
  font-size: 22px;
  color: map-get($green, 500);
}

.popover-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 100%;
  right: 0;
  width: 240px;
  background-color: white;
  border-radius: 6px;
  z-index: 100;
  margin-top: 8px;
  overflow: hidden;
  padding: 12px 8px;
  gap: 4px;
}

.popover-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
  cursor: pointer;
  text-decoration: none;
  color: map-get($body-text, body-color);
}

.popover-item:hover {
  background-color: map-get($gray, 100);
}

.popover-item img {
  width: 18px;
  height: 18px;
}

@include breakpoint-down('desktop-small') {
  .navbar {
    padding: 24px 32px !important;
  }

  .response {
    gap: 2px;
  }

  .header-left h5 {
    font-size: 18px;
  }
}

@include breakpoint-down('tablet') {
  .navbar {
    padding: 24px !important;
  }

  .header {
    display: flex;
    align-items: left;
    flex: 1;
    gap: 12px;
    width: 100%;
  }
}

@include breakpoint-down('mobile-large') {
  .logo {
    display: none;
  }
}

</style>
