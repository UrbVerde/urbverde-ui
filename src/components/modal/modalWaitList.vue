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
import { ref, computed, watch } from 'vue';
import modalBootstrap from './modalBootstrap.vue';

const persistentEmail = ref('');
const persistentSuccess = ref(false);

const email = ref('');
const loading = ref(false);
const success = ref(false);
const errorMessage = ref('');

const modalRef = ref(null);

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
watch(email, (newVal, oldVal) => {
  if (success.value && newVal !== oldVal) {
    success.value = false;
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

      persistentEmail.value = email.value;
      persistentSuccess.value = true;
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      errorMessage.value = 'Ocorreu um erro ao enviar. Tente novamente.';
    });
}

// Método público para abrir o modal
function show() {
  email.value = persistentEmail.value;
  success.value = persistentSuccess.value;
  loading.value = false;
  errorMessage.value = '';

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
    border: 1px solid #ccc;
    padding: 8px 12px;
    font-size: 16px;
  }

  .form-control:focus {
    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
    border-color: transparent;
  }

  .form-control:disabled {
    cursor: default;
    pointer-events: none;
    opacity: 1;
    background-color: #f6f6f6;
  }

  .button-base {
    border-radius: 8px !important;
    border: 1px solid #ccc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    min-width: 56px;
    background-color: #fff !important;
  }

  .button-invalid {
    background-color: #eee;
    color: #999;
  }

  .button-valid {
    background-color: #e5fff2;
    color: #28a745;
    border: 1px solid #28a745;
  }

  .button-loading {
    background-color: #e5fff2;
    color: #28a745;
    border: 1px solid #28a745;
  }

  .button-success {
    background-color: #e5fff2;
    color: #28a745;
    border: 1px solid #28a745;
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
    color: #d9534f;
    font-size: 14px;
    margin-top: 4px;
    margin-bottom: 0;
  }
  </style>
