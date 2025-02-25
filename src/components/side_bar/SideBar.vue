<!-- urbverde-ui/src/components/side_bar/SideBar.vue -->
<template>
  <aside>
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
        <MinimizeButton @click="toggleSidebar" />
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
          <div v-show="showContent" class="bottom-area">

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
import { ref, computed } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import MinimizeButton from './buttons/MinimizeButton.vue';
import LogoButton from './buttons/LogoButton.vue';
import BuscaSimples from '../search_dropdown/BuscaSimples.vue';
import DropDown from './drop_down/CategoriesDropdown.vue';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

// Emits
const emit = defineEmits(['toggle-sidebar']);

// Store
const locationStore = useLocationStore();

// Component state
const showContent = ref(true);
const isClosing = ref(false); // For animation

// Computed to check if search is complete
const isSearchDone = computed(() => locationStore.cd_mun && locationStore.type);

// Sidebar toggle handler with animation
async function toggleSidebar() {
  if (props.isOpen) {
    // Quando estiver fechando
    isClosing.value = true;
    showContent.value = false;
    // Espera a animação de fade terminar antes de fechar a sidebar
    await new Promise(resolve => setTimeout(resolve, 100));
    isClosing.value = false;
    emit('toggle-sidebar');
  } else {
    // Quando estiver abrindo
    emit('toggle-sidebar');
    await new Promise(resolve => setTimeout(resolve, 200));
    showContent.value = true;
  }
}
</script>

<style scoped lang="scss">
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 72px;
    height: 100vh;
    transition: 0.3s;
    overflow: hidden;
    background: map-get($gray, white);
    box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.13) inset;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  .sidebar-open {
    width: 301px;
    transition: 0.3s;
  }

// Fade transition
  .fade-enter-active{
    transition: opacity 0.3s ease;
  }

  .fade-leave-active {
    transition: opacity 0.1s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .sidebar-open .fade-enter-active {
    transition-delay: 0.2s;
  }

  .sidebar-closing .fade-leave-active {
    transition-delay: 0.1s;
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
    box-shadow: -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset;
    border-top: 1px solid rgba(0, 0, 0, 0.13);
    background: var(--White, #FFF);
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
