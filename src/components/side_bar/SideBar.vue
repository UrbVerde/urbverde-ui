<!-- urbverde-ui/src/components/side_bar/SideBar.vue -->
<template>

  <aside>
    <!-- Overlay fundo preto (mobile only) -->
    <div
      v-if="isOpen && !largerThan('tablet')"
      class="sidebar-overlay"
      @click="handleOverlayClick"
    >
    </div>

    <div :class="[
      'sidebar',
      {
        'sidebar-open': isOpen,
        'sidebar-closing': isClosing
      }
    ]">
      <div class="top-area">
        <Transition name="fade">
          <LogoButton v-if="showContent" />
        </Transition>
        <MinimizeButton
          v-if="shouldShowMinimizeButton"
          @click="handleMinimizeClick"
        />
      </div>
      <Transition name="fade">
        <div v-if="showContent" class="search-area">
          <BuscaSimples @api-error="$emit('api-error')" />
        </div>
      </Transition>

      <template v-if="isSearchDone">
        <Transition name="fade">
          <div v-if="showContent" class="middle-area">
            <DropDown />
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="showContent" class="bottom-area">
            <a href="/parceiro"
               class="link-button"
               target="_blank"
               rel="noopener noreferrer">
              <i class="bi bi-upload" tag="imgIcon"></i>
              <span class="txtBottom body-small-regular">Enviar dados</span>
            </a>
            <a href="https://forms.gle/JJtUMg5j9jaAPc5x5" class="link-button" target="_blank">
              <i class="bi bi-megaphone" tag="imgIcon"></i>
              <span class="txtBottom body-small-regular">Informar um erro</span>
            </a>
          </div>
        </Transition>
      </template>
    </div>
  </aside>

</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import MinimizeButton from './buttons/MinimizeButton.vue';
import LogoButton from './buttons/LogoButton.vue';
import BuscaSimples from '../search_dropdown/BuscaSimples.vue';
import DropDown from './drop_down/CategoriesDropdown.vue';
import { useWindowSize } from '@/utils/useWindowsSize';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

// Emits
const emit = defineEmits(['toggle-sidebar', 'api-error']);

// Store
const locationStore = useLocationStore();

// Responsividade
const { largerThan, smallerThan } = useWindowSize();

// Component state
const showContent = ref(props.isOpen);
const isClosing = ref(false);

// Watch para sincronizar showContent com isOpen
watch(() => props.isOpen, (newValue) => {
  if (newValue && !showContent.value) {
    setTimeout(() => {
      showContent.value = true;
    }, 150);
  }
});

const isSearchDone = computed(() => locationStore.cd_mun && locationStore.type);

const shouldShowMinimizeButton = computed(() => {
  const isMobile = smallerThan('tablet');
  const hasMunicipality = !!locationStore.cd_mun;

  // Se for mobile E não tiver município selecionado, esconde o botão
  if (isMobile && !hasMunicipality) {
    return false;
  }

  return true;
});

const shouldAllowClosing = computed(() => {
  const isMobile = smallerThan('tablet');
  const hasMunicipality = !!locationStore.cd_mun;

  // Se for mobile E não tiver município selecionado, não pode fechar
  if (isMobile && !hasMunicipality) {
    return false;
  }

  return true;
});

function handleOverlayClick() {
  if (shouldAllowClosing.value) {
    toggleSidebar();
  }
}

function handleMinimizeClick() {
  toggleSidebar();
}

// Sidebar toggle handler with animation
async function toggleSidebar() {
  if (props.isOpen && !shouldAllowClosing.value) {
    return;
  }

  if (props.isOpen) {
    isClosing.value = true;
    showContent.value = false;
    await new Promise(resolve => setTimeout(resolve, 150));
    isClosing.value = false;
    emit('toggle-sidebar');
  } else {
    emit('toggle-sidebar');
  }
}

</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: map-get($gray, white);
  box-shadow: -1px 0 0 rgba(0, 0, 0, 0.13) inset;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 301px;
  transition: transform 0.3s ease, width 0.3s ease;

  @include breakpoint-down('tablet') {
    width: 301px; // Mantém a largura para conteúdo total em mobile
    transform: translateX(-100%); // escondido no mobile/tablet

    &.sidebar-open {
      transform: translateX(0); // visível no mobile/tablet
      opacity: 1;
    }

    &.sidebar-closing {
      transform: translateX(-100%);
    }
  }

  @include breakpoint-up('tablet') {
    width: 72px;

    &.sidebar-open {
      width: 301px;
      transform: none;
    }
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-open .fade-enter-active {
  transition-delay: 0.15s;
}

.top-area {
  display: flex;
  height: 88px;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  background: map-get($gray, white);
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
  width: 100%;
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
  padding: 32px 12px 16px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  align-self: stretch;
  width: 100%;
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
  width: 100%;
}

.bottom-area {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  padding: 16px 24px;
  box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
  border-top: 1px solid rgba(0, 0, 0, 0.13);
  background: var(--White, #FFF);
  width: 100%;
}

.link-button {
  text-decoration: none;
  color: map-get($body-text, body-color);
  display: flex;
  padding: 8px 8px;
  justify-content: start;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  width: 100%;
}

.txtBottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  color: map-get($body-text, body-color);
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
