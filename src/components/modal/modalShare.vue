<!-- urbverde-ui/src/components/modal/modalShare.vue -->
<template>
  <teleport to="body"> <!-- Teleporta o modal para o centro do body -->
    <modalBootstrap
      ref="refModal"
      modalId="modalShare"
      title="Compartilhar link"
      :showSecondaryButton="false"
      :showPrimaryButton="false"
    >
      <template #body>
        <div>
          <p class="mb-3 body-normal-regular">
            Link para visualizar {{ cityName }} - {{ stateName }}
          </p>
          <div class="share-input-container">
            <input
              ref="linkInput"
              type="text"
              class="form-control"
              :value="shareUrl"
              readonly
              @click="copyToClipboard"
            />
            <button
              class="copy-button"
              @click="copyToClipboard"
              :class="{'copied': isCopied}"
            >
              <i v-if="!isCopied" class="bi bi-copy"></i>
              <i v-else class="bi bi-check-circle-fill"></i>
            </button>
          </div>
        </div>
      </template>
    </modalBootstrap>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import modalBootstrap from './modalBootstrap.vue';

const props = defineProps({
  cityName: {
    type: String,
    default: '',
  },
  stateName: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  }
});

const refModal = ref(null);
const linkInput = ref(null);
const isCopied = ref(false);

const shareUrl = computed(() => props.url || window.location.href);

// Método para copiar o link para a área de transferência
function copyToClipboard() {
  if (linkInput.value) {
    linkInput.value.select();
    navigator.clipboard.writeText(linkInput.value.value)
      .then(() => {
        isCopied.value = true;
        setTimeout(() => {
          isCopied.value = false;
        }, 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar texto: ', err);
      });
  }
}

// Métodos para controlar o modal
function show() {
  refModal.value.show();
}

function hide() {
  refModal.value.hide();
}

// Expõe métodos para o componente pai
defineExpose({ show, hide });
</script>

  <style scoped lang="scss">

  /* Garantir que o modal fique centralizado */
  :deep(.modal-dialog) {
    display: flex;
    align-items: center;
    min-height: calc(100% - 1rem);
  }

  :deep(.modal-content) {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  .share-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .share-input-container input {
    padding-right: 40px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    height: 48px;
    cursor: pointer;
  }

  .copy-button {
    position: absolute;
    right: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .copy-button i {
    font-size: 20px;
    color: map-get($theme, primary);
    transition: all 0.3s ease;
  }

  .copy-button.copied {
    animation: pulse 0.4s ease;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  </style>
