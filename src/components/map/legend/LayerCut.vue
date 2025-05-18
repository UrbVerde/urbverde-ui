<!-- urbverde-ui/src/components/legend/LayerCut.vue -->
<template>
  <div class="layer-cut-container">
    <div class="layer-cut" @click.stop="togglePopover">
      <span class="body-caption-medium layer-cut-text">Por {{ currentCut }}</span>
      <i class="bi bi-chevron-right layer-cut-icon"></i>
    </div>

    <Teleport to="body">
      <div v-if="showPopover" class="layer-cut-popover" :style="popoverPosition">
        <div class="popover-header">
          <span class="body-small-medium">Selecionar recorte</span>
          <i class="bi bi-x-lg close-icon" @click.stop="closePopover"></i>
        </div>
        <div class="options-wrapper">
          <div
            v-for="cut in cutOptions"
            :key="cut"
            class="cut-option body-small-regular"
            @click.stop="selectCut(cut)"
          >
            Por {{ cut }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const currentCut = ref('setor censitário');
const showPopover = ref(false);
const cutOptions = ['setor censitário', 'rua', 'bairro', 'quadra']; // alterar aqui depois com recortes automáticos de cada camada
const popoverPosition = ref({
  left: '0px',
  top: '0px'
});

const togglePopover = async() => {
  showPopover.value = !showPopover.value;

  if (showPopover.value) {
    await nextTick();
    updatePopoverPosition();
  }
};

const closePopover = () => {
  showPopover.value = false;
};

const selectCut = (cut) => {
  currentCut.value = cut;
  showPopover.value = false;
};

const updatePopoverPosition = () => {
  const container = document.querySelector('.layer-cut-container');
  if (!container) {return;}

  const cardEl = container.closest('.card-container');

  if (cardEl) {
    const cardRect = cardEl.getBoundingClientRect();

    // Posicionamento à esquerda do card
    popoverPosition.value = {
      left: `${cardRect.left - 190}px`, // Largura do popover (considerando largura de 180px)
      top: `${cardRect.top}px`,
      minWidth: '170px'
    };
  }
};

// Fechar o popover quando clicar fora dele
const handleClickOutside = (event) => {
  if (showPopover.value) {
    const popoverEl = document.querySelector('.layer-cut-popover');
    const containerEl = document.querySelector('.layer-cut-container');

    if (popoverEl && containerEl &&
        !popoverEl.contains(event.target) &&
        !containerEl.contains(event.target)) {
      showPopover.value = false;
    }
  }
};

// Fechar o popover quando o usuário rolar a página
const handleScroll = () => {
  if (showPopover.value) {
    showPopover.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updatePopoverPosition);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updatePopoverPosition);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.layer-cut-container {
  position: relative;
  display: flex;
  width: auto !important;
  height: 20px;
  margin: 0 auto 0 0;
}

.layer-cut {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  width: auto;
}

.layer-cut:hover {
  background-color: map-get($primary-fade, 100);
  border-radius: 4px;
}

.layer-cut-text {
  color: map-get($theme, secondary);
}

.layer-cut-icon {
  display: none;
  color: map-get($theme, secondary);
  font-size: 12px;
}

.layer-cut-popover {
  position: fixed;
  background: white;
  border: 1px solid map-get($gray, 200);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid map-get($gray, 200);
}

.close-icon {
  cursor: pointer;
  font-size: 14px;
  color: map-get($gray, 600);

  &:hover {
    color: map-get($gray, 800);
  }
}

.options-wrapper {
  padding: 8px;
  display: flex;
  gap: 2px;
  flex-direction: column;
}

.cut-option {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: map-get($gray, 200);
  }
}
</style>
