<!-- urbverde-ui/src/components/modal/modalWaitList.vue -->
<template>
  <modalBootstrap
    ref="modalRef"
    :modalId="modalId"
    title="Ops, recurso indisponível!"
    primaryButtonText="Ok"
    :primaryButtonClosesModal="true"
    @close="onModalClose"
    class="waitlist-modal"
  >
    <template #body>
      <div class="waitlist-body">
        <p class="text-body body-normal-regular">
          Estamos corrigindo isso! Deixe seu e-mail para entrar na lista de espera e ser avisado quando ficar pronto.
        </p>

        <form class="input-group body-small-medium" @submit.prevent="handleSubmit">
          <input
            type="email"
            class="form-control"
            placeholder="Adicionar seu e-mail"
            aria-label="Adicionar seu e-mail"
            aria-describedby="button-submit"
            required
            v-model.trim="email"
            :disabled="loading"
          />

          <button
            :class="['button-base', buttonStateClass]"
            :style="{ minWidth: '56px' }"
            :disabled="loading || success"
            type="submit"
            id="button-submit"
          >
            <span class="icon-holder">
              <transition name="icon-fade" mode="out-in">
                <i
                  v-if="success"
                  key="success"
                  class="bi bi-check-lg"
                  style="font-size: 26px;"
                ></i>
                <span
                  v-else-if="loading"
                  key="loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <i
                  v-else
                  key="idle"
                  class="bi bi-send"
                  style="font-size: 18px;"
                ></i>
              </transition>
            </span>
          </button>
        </form>

        <p v-if="errorMessage" class="error body-normal-regular">{{ errorMessage }}</p>
      </div>
    </template>
  </modalBootstrap>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import modalBootstrap from './modalBootstrap.vue';

const props = defineProps({
  modalId: {
    type: String,
    required: true
  }
});

const EMAIL_STORAGE_KEY = `waitlist_email_${props.modalId}`;
const SUCCESS_STORAGE_KEY = `waitlist_success_${props.modalId}`;

const email = ref('');
const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

const modalRef = ref(null);

// Inicializa carregando dados do localStorage
onMounted(() => {
  try {
    const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
    const savedSuccess = localStorage.getItem(SUCCESS_STORAGE_KEY);

    if (savedEmail) {
      email.value = savedEmail;
    }

    if (savedSuccess === 'true') {
      success.value = true;
    }

    setTimeout(() => {
      if (savedSuccess === 'true') {
        success.value = true;
      }
    }, 100);
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
  }
});

const buttonStateClass = computed(() => {
  if (success.value) {
    return 'button-success';
  }
  if (loading.value) {
    return 'button-loading';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.value.trim()) ? 'button-valid' : 'button-invalid';
});

// Se o usuário digitar outro e-mail após "success", reseta o status
// mas APENAS se a mudança foi causada pelo usuário, não pelo carregamento inicial
let isInitialLoad = true;
watch(email, (newVal, oldVal) => {
  if (isInitialLoad) {
    isInitialLoad = false;

    return;
  }

  if (success.value && newVal !== oldVal) {
    success.value = false;
    // Atualiza o localStorage quando o status muda
    try {
      localStorage.setItem(SUCCESS_STORAGE_KEY, 'false');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  // Salva o email no localStorage sempre que mudar
  try {
    localStorage.setItem(EMAIL_STORAGE_KEY, newVal);
  } catch (error) {
    console.error('Erro ao salvar email no localStorage:', error);
  }
});

function onModalClose() {
  loading.value = false;
  errorMessage.value = '';
}

// Ação do formulário: enviar o e-mail para a API
function handleSubmit() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Por favor, insira um e‑mail válido.';

    return;
  }

  errorMessage.value = '';
  loading.value = true;

  const formData = new FormData();
  formData.append('email', email.value);
  formData.append('url', window.location.href);
  formData.append('userAgent', navigator.userAgent);
  formData.append('timestamp', new Date().toISOString());

  fetch('https://script.google.com/macros/s/AKfycbwTJ1OTDroTEYLusrvPhtDuXj_8vcEBzW1EnE5hGXuk4lRkEoiDByZtF3EjkB3wmufA/exec', {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  })
    .then(() => {
      loading.value = false;
      success.value = true;

      // Salva o estado no localStorage
      try {
        localStorage.setItem(EMAIL_STORAGE_KEY, email.value);
        localStorage.setItem(SUCCESS_STORAGE_KEY, 'true');
      } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
      }
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      errorMessage.value = 'Ocorreu um erro ao enviar. Tente novamente.';
    });
}

// Método público para abrir o modal
function show() {
  loading.value = false;
  errorMessage.value = '';

  try {
    const savedSuccess = localStorage.getItem(SUCCESS_STORAGE_KEY);
    if (savedSuccess === 'true') {
      success.value = true;
    }
  } catch (error) {
    console.error('Erro ao verificar status de sucesso no localStorage:', error);
  }

  if (modalRef.value) {
    modalRef.value.show();
  }
}

function hide() {
  if (modalRef.value) {
    modalRef.value.hide();
  }
}

defineExpose({ show, hide });
</script>

<style scoped lang="scss">
.waitlist-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-body {
  cursor: default;
}

.input-group {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
}

.form-control {
  flex: 1;
  height: 40px;
  border-radius: 8px !important;
  border: 1px solid map-get($gray, 500);
  padding: 8px 12px;
  font-size: 16px;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem map-get($primary-fade, 100);
  border-color: transparent;
}

.form-control:disabled {
  cursor: default;
  pointer-events: none;
  opacity: 1;
  background-color: map-get($gray, 100);
}

.button-base {
  border-radius: 8px !important;
  border: 1px solid map-get($gray, 500);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 56px;
  background-color: transparent !important;
}

.button-invalid {
  color: map-get($gray, 500);
}

.button-valid {
  color: map-get($green, 500);
  border: 1px solid map-get($green, 500);
}

.button-loading {
  color: map-get($green, 500);
  border: 1px solid map-get($green, 500);
}

.button-success {
  color: map-get($green, 500);
  border: 1px solid map-get($green, 500);
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

.icon-fade-enter,
.icon-fade-leave-to {
  opacity: 0;
}

.icon-fade-enter-to,
.icon-fade-leave {
  opacity: 1;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.icon-fade-enter:not(.spinner-border),
.icon-fade-leave-to:not(.spinner-border) {
  transform: scale(0.7);
}

.icon-fade-enter-to:not(.spinner-border),
.icon-fade-leave:not(.spinner-border) {
  transform: scale(1);
}

.icon-fade-enter-active:not(.spinner-border),
.icon-fade-leave-active:not(.spinner-border) {
  transition: opacity 0.3s ease-in-out, transform 0.15s ease-in-out;
}

.spinner-border {
  margin: 0 !important;
  transform-origin: center center;
}

.error {
  color: map-get($theme, danger);
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 0;
}
</style>
