<template>
  <modalBootstrap
    ref="modalRef"
    modalId="modalWaitlist"
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

        <!-- Formulário de newsletter similar ao footer -->
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
import { ref, defineExpose, watch, computed } from 'vue';
import modalBootstrap from './modalBootstrap.vue';

// Estado persistente que não será redefinido ao fechar o modal
const persistentEmail = ref('');
const persistentSuccess = ref(false);

// Estado do formulário atual
const email = ref('');
const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

// Ref para o modalBootstrap
const modalRef = ref(null);

// Computed para o estado do botão
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

// Restaura o estado se o email for alterado após o success
watch(email, (newVal, oldVal) => {
  if (success.value && newVal !== oldVal) {
    success.value = false;
  }
});

// Função que é chamada quando o usuário clica no botão de envio dentro do form
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

  fetch('https://script.google.com/macros/s/AKfycbxXwPCAHpHFhr2C1mkhsbbzUbCbXfaS2EwooF6-bmaOUXXXZsuFMCMMOHKcZbLpoKtb/exec', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao enviar o e‑mail.');
      }

      return response.json();
    })
    .then(result => {
      if (result.status !== 'success') {
        throw new Error('Falha no envio.');
      }
      loading.value = false;
      success.value = true;

      // Atualiza o estado persistente após o sucesso
      persistentEmail.value = email.value;
      persistentSuccess.value = true;
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      errorMessage.value = 'Ocorreu um erro ao enviar. Tente novamente.';
    });
}

function onModalClose() {
  // Não redefine o estado ao fechar o modal
  // Só limpa mensagens de erro e loading
  loading.value = false;
  errorMessage.value = '';
}

// Expondo o método show para que o componente pai possa chamar
function show() {
  // Não chama mais resetState()
  // Restaura o estado persistente quando o modal é mostrado
  email.value = persistentEmail.value;
  success.value = persistentSuccess.value;
  loading.value = false;
  errorMessage.value = '';
  modalRef.value.show();
}

defineExpose({ show });
</script>

    <style scoped lang="scss">
    .waitlist-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .text-body {
      color: map-get($body-text, body-color);
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
      border: 1px solid map-get($gray, 400);
      padding: 8px 12px;
      font-size: 16px;
      cursor: text;
    }

    .form-control:focus {
      box-shadow: 0 0 0 0.25rem map-get($primary-fade, 100);
      border-color: transparent;
    }

    .form-control:disabled {
      cursor: default;
      pointer-events: none;
      opacity: 1;
      background-color: map-get($gray, white);
    }

    .button-base {
      border-radius: 8px !important;
      border: 1px solid map-get($gray, 400);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      min-width: 56px;
      background-color: white !important;
    }

    .button-invalid {
      background-color: map-get($gray, 100);
      color: map-get($gray, 500);
    }

    .button-valid {
      background-color: map-get($gray, 100);
      color: map-get($green, 500);
      border: 1px solid map-get($green, 400);
    }

    .button-loading {
      background-color: map-get($gray, 100);
      color: map-get($green, 500);
      border: 1px solid map-get($green, 400);
    }

    .button-success {
      background-color: map-get($gray, 100);
      color: map-get($green, 500);
      border: 1px solid map-get($green, 400);
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

    .success {
      color: map-get($green, 600);
      font-size: 14px;
      margin-top: 4px;
      margin-bottom: 0;
    }

    .body-caption-regular {
      color: map-get($gray, 500);
      font-size: 12px;
      text-align: center;
      margin-top: 4px;
    }
    </style>
