<!-- urbverde-ui/src/components/side_bar/drop_down/ViewModeDropdown.vue -->
<template>
  <!-- Componente de dropdown para seleção de modo de visualização -->
  <div class="view-mode-container" ref="dropdownRef">
    <!-- Botão que exibe o modo selecionado e alterna a visibilidade das opções -->
    <button class="view-mode-button"
            @click="toggleDropdown"
            :class="{
              'active': isOpen,
              'national-selected': selectedMode === 'map',
              'policies-selected': selectedMode === 'policies'
            }">
      <!-- Ícone do modo selecionado -->
      <img v-if="selectedModeData.icon.includes('.png') || selectedModeData.icon.includes('.svg')"
           :src="selectedModeData.icon"
           class="view-mode-icon"
           alt="ícone" />
      <i v-else :class="['view-mode-icon', selectedModeData.icon]"></i>
      <!-- Texto do modo selecionado -->
      <div class="view-mode-text-container">
        <span class="view-mode-title body-caption-regular">PAINEL</span>
        <span class="view-mode-text body-small-medium">{{ selectedModeData.label }}</span>
      </div>
      <!-- Ícone de seta para indicar dropdown aberto/fechado -->
      <i class="bi view-mode-icon" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
    </button>

    <!-- Transição para exibir/esconder opções de modo -->
    <Transition name="slide-fade">
      <div v-if="isOpen" class="view-mode-options">
        <!-- Botões para cada modo de visualização disponível -->
        <button v-for="mode in viewModes"
                :key="mode.id"
                class="view-mode-option"
                :class="{
                  'selected': selectedMode === mode.id,
                  'national-selected': mode.id === 'map' && selectedMode === 'map',
                  'policies-selected': mode.id === 'policies' && selectedMode === 'policies'
                }"
                @click="selectMode(mode.id)">
          <!-- Ícone de seleção ou ícone do modo -->
          <i v-if="selectedMode === mode.id" class="bi bi-check2 view-mode-icon"></i>
          <img v-else-if="mode.icon.includes('.svg')"
               :src="mode.icon"
               class="view-mode-icon"
               alt="ícone" />
          <i v-else :class="['view-mode-icon', mode.icon]"></i>
          <!-- Texto descritivo do modo -->
          <div class="view-mode-option-text-container">
            <span class="view-mode-option-title body-small-regular">{{ mode.label }}</span>
            <span class="view-mode-option-text body-caption-medium">{{ mode.text }}</span>
          </div>
        </button>
        <!-- Rodapé com link para mais detalhes -->
        <div class="view-mode-option-footer-container">
          <span class="view-mode-option-footer-text body-caption-medium">Ver mais detalhes dos painéis</span>
          <i class="bi bi-arrow-right view-mode-icon"></i>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import { useRoute } from 'vue-router';

const locationStore = useLocationStore();
const route = useRoute();

// Estado para controlar se o dropdown está aberto
const isOpen = ref(false);
// Estado para armazenar o modo selecionado default
const selectedMode = ref('map');

// Verifica se há um modo de visualização na URL
watch(() => route.query.viewMode, (newViewMode) => {
  if (newViewMode) {
    selectedMode.value = newViewMode;
    locationStore.setViewMode(newViewMode);
    setTimeout(() => {
      locationStore.fetchCategories(); // Atualiza as categorias com delay
    }, 500); // Delay de 500ms
  }
}, { immediate: true });

// Retorna o modo para 'map' quando o componente é destruído
onUnmounted(() => {
  locationStore.setViewMode('map');
});

// Referência para o elemento do dropdown
const dropdownRef = ref(null);

// Lista de modos de visualização disponíveis
const viewModes = [
  {
    id: 'map',
    label: 'Nacional',
    icon: '/src/assets/icons/world-map.svg',
    text: '5570 cidades'
  },
  {
    id: 'policies',
    label: 'Políticas Públicas',
    text: '7 cidades',
    icon: '/src/assets/icons/public-policies.svg'
  }
];

// Computed para obter os dados do modo selecionado
const selectedModeData = computed(() => viewModes.find(mode => mode.id === selectedMode.value) || viewModes[0]);

// Função para fechar o dropdown ao clicar fora dele
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Adiciona e remove o listener para cliques fora do dropdown
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Alterna a visibilidade do dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Seleciona um modo e fecha o dropdown
const selectMode = (modeId) => {
  selectedMode.value = modeId;
  locationStore.setViewMode(modeId);
  locationStore.fetchCategories();
  isOpen.value = false;
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/colors.scss';

.view-mode-container {
  width: 100%;
  position: relative;
}

.view-mode-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 6.5px 16px;
  border: none;
  border-radius: 99px;

  cursor: pointer;

  &.national-selected {
    background: linear-gradient(90deg, #ABE1C6 0%, #D2E8DD 100%);
    outline: 3px solid var(--Primary-Fade-200, #ABE1C6);
    outline-offset: -3px;
  }

  &.policies-selected {
    background: linear-gradient(90deg, #FFE69C 0%, #FFF3CD 100%);
    outline: 3px solid var(--Yellow-200, #FFE69C);
    outline-offset: -3px;
  }

  &:hover {}

  &.active {}

  i {
    font-size: 18px;
    color: map-get($body-text, body-color);
  }
}

.view-mode-text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: -3px;
  flex: 1 0 0;
  padding-left: 5px;
}

.view-mode-title {
  color: map-get($theme, secondary);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.view-mode-text {

  color: map-get($body-text, body-color);

}

.view-mode-options {
  display: flex;
  padding: 12px 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  margin-top: 1px;
  position: absolute;

  width: 100%;

  background: map-get($gray, white);
  // border: 1px solid rgba(0, 0, 0, 0.13);

  border-radius: 0px 0px 16px 16px;

  /* Larger Shadow */
  box-shadow: 0px 16px 48px 0px rgba(0, 0, 0, 0.17);

  z-index: 1000;
}

.view-mode-option {
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 8px;
  align-self: stretch;

  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;

  &:hover {
    background: var(--Gray-200, #E9ECEF);
  }

  &.national-selected {

    background: var(--Primary-Fade-100, #D2E8DD);

  }

  &.policies-selected {

    background: var(--Yellow-100, #FFF3CD);

  }

  i {
    font-size: 16px;
    color: map-get($body-text, body-color);
  }

  span {
    font-size: 14px;
  }
}

.view-mode-icon {
  transition: color 0.2s ease;
  display: flex;
  width: 22px;
  height: 22px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  &.bi-check2 {
    font-size: 22px;
  }

  &.bi-chevron-up,
  &.bi-chevron-down {
    font-size: 18px;
  }

  &.bi-arrow-right {
    font-size: 16px;
    color: var(--Gray-550, #86919B);
    margin-left: auto;
  }
}

// Animações
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.view-mode-option-text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  flex: 1 0 0;
  padding-left: 5px;

}

.view-mode-option-title {
  overflow: hidden;
  color: map-get($body-text, body-color);
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-top: -5px;

}

.view-mode-option-text {
  overflow: hidden;
  color: map-get($theme, secondary);
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-bottom: -5px;

}

.view-mode-option-footer-container {
  border-top: 1px solid rgba(0, 0, 0, 0.13);
  display: flex;
  padding: 8px 16px 0px 16px;
  align-items: center;
  gap: 16px;
  align-self: stretch;

  cursor: pointer;

}

.view-mode-option-footer-text {
  color: var(--Gray-550, #86919B);

}
</style>
