<template>
  <modalBootstrap
    ref="modalRef"
    modalId="modalWaitlist"
    title="Este recurso ainda não está diponível"
    :primaryButtonText="primaryButtonText"
    :primaryButtonClosesModal="false"
    @closePrimary="handleSubmit"
    @close="resetState"
  >
    <template #body>
      <div class="waitlist-body">
        <p class="text-body body-normal-regular">Experimente digitar seu e-mail para enviarmos quando estiver pronto!</p>
        <input
          type="email"
          class="input-text body-normal-regular"
          v-model.trim="email"
          placeholder="Seu e‑mail"
          :disabled="loading"
        />
        <p v-if="errorMessage" class="error body-normal-regular">{{ errorMessage }}</p>
      </div>
    </template>
  </modalBootstrap>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import modalBootstrap from './modalBootstrap.vue';

const email = ref('');
const loading = ref(false);
const errorMessage = ref('');
const primaryButtonText = ref('Enviar');

// Ref para o modalBootstrap
const modalRef = ref(null);

// Função que é chamada quando o usuário clica no botão primário
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
      modalRef.value.hide();
      email.value = '';
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      errorMessage.value = 'Ocorreu um erro ao enviar. Tente novamente.';
    });
}

function resetState() {
  email.value = '';
  loading.value = false;
  errorMessage.value = '';
}

// Expondo o método show para que o componente pai possa chamar
function show() {
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

  .text-body{
    color: map-get($body-text, body-color);
  }

  input[type="email"] {
    width: 100%;
    padding: 8px;
    font-size: 16px;
  }

  .input-text{
    color: map-get($body-text, body-color);
  }

  .error {
    color: map-get($theme, danger);
    font-size: 14px;
  }
  </style>
