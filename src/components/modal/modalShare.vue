<!-- urbverde-ui/src/components/modal/modalShare.vue -->
<template>
  <teleport to="body"> <!-- Teleporta o modal para o centro do body -->
    <modalBootstrap
      ref="refModal"
      modalId="modalShare"
      :title="`Link de ${cityName} - ${stateName}`"
      :showSecondaryButton="false"
      :showPrimaryButton="false"
    >
      <template #body>
        <div>
          <div class="share-input-container">
            <input
              ref="linkInput"
              type="text"
              class="form-control"
              :value="currentShareUrl"
              readonly
              @click="copyToClipboard"
            />
            <div class="input-fade-overlay"></div>
            <button
              class="copy-button"
              @click="copyToClipboard"
            >
              <span class="icon-holder">
                <transition name="icon-fade" mode="out-in">
                  <i
                    v-if="isCopied"
                    key="success"
                    class="bi bi-check-circle-fill"
                  ></i>
                  <i
                    v-else
                    key="idle"
                    class="bi bi-copy"
                  ></i>
                </transition>
              </span>
            </button>
          </div>
        </div>
      </template>
    </modalBootstrap>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';
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
const currentShareUrl = ref('');

// Método para atualizar a URL atual quando o modal é aberto
function updateCurrentUrl() {
  currentShareUrl.value = props.url || window.location.href;
}

// Método para copiar o link para a área de transferência
function copyToClipboard() {
  if (linkInput.value) {
    linkInput.value.select();
    navigator.clipboard.writeText(linkInput.value.value)
      .then(() => {
        isCopied.value = true;

        // Fechar o modal após 1 segundo
        setTimeout(() => {
          hide();
          setTimeout(() => {
            isCopied.value = false;
          }, 300);
        }, 1000);
      })
      .catch(err => {
        console.error('Erro ao copiar texto: ', err);
      });
  }
}

function show() {
  // Atualiza a URL atual no momento em que o modal é aberto
  updateCurrentUrl();
  refModal.value.show();
}

function hide() {
  refModal.value.hide();
}

defineExpose({ show, hide });
</script>

<style scoped lang="scss">
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
  margin-bottom: 8px;
}

.share-input-container input {
  padding-right: 40px;
  padding-left: 12px;
  background-color: map-get($gray, 100);
  border: 1px solid map-get($gray, 300);
  height: 48px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-fade-overlay {
  position: absolute;
  right: 40px;
  width: 50px;
  height: 46px;
  background: linear-gradient(90deg, rgba(248,249,250,0) 0%, rgba(248,249,250,1) 100%);
  pointer-events: none;
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
  z-index: 2;
}

.form-control:focus {
  box-shadow: 0 0 0 0;
  border-color: map-get($theme, primary);
}

.icon-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.15s ease-in-out;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.copy-button i {
  font-size: 20px;
  color: map-get($theme, primary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
