<template>
  <modalBootstrap
    ref="modalRef"
    modalId="modalWaitlist"
    title="Avisar quando o recurso estiver pronto"
    :primaryButtonText="primaryButtonText"
    :primaryButtonClosesModal="false"
    @closePrimary="handleSubmit"
    @close="onModalClose"
    class="waitlist-modal"
  >
    <template #body>
      <div class="waitlist-body">
        <p class="text-body body-normal-regular">Estamos trabalhando para liberar o recurso em breve, envie seu e-mail e saiba quando estiver pronto!</p>
        <input
          type="email"
          class="input-text body-normal-regular"
          v-model.trim="email"
          placeholder="Adicionar seu e-mail"
          :disabled="loading"
        />
        <p v-if="errorMessage" class="error body-normal-regular">{{ errorMessage }}</p>
      </div>
    </template>
  </modalBootstrap>
</template>

<script setup>
import { ref, defineExpose, watch } from 'vue';
import modalBootstrap from './modalBootstrap.vue';

const email = ref('');
const loading = ref(false);
const success = ref(false);
const isClosing = ref(false);
const errorMessage = ref('');
const primaryButtonText = ref('Enviar');

// Ref para o modalBootstrap
const modalRef = ref(null);

// Atualiza o texto do botão conforme o estado
watch(loading, (newValue) => {
  if (!isClosing.value) {
    primaryButtonText.value = newValue ? 'Enviando...' : (success.value ? 'Enviado!' : 'Enviar');
  }
});

// Restaura o texto do botão se o email for alterado após o loading
watch(email, (newVal, oldVal) => {
  if ((loading.value || success.value) && newVal !== oldVal) {
    loading.value = false;
    success.value = false;
    primaryButtonText.value = 'Enviar';
  }
});

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
      success.value = true;
      primaryButtonText.value = 'Enviado!';

      // Marca que está fechando para não alterar o texto do botão
      isClosing.value = true;

      // Aguarda um momento para mostrar o status de "Enviado!" antes de fechar
      setTimeout(() => {
        modalRef.value.hide();
      }, 800);
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      primaryButtonText.value = 'Enviar';
      errorMessage.value = 'Ocorreu um erro ao enviar. Tente novamente.';
    });
}

function onModalClose() {
  // Só reseta o estado se não estiver no processo de fechamento após envio
  if (!isClosing.value) {
    resetState();
  } else {
    // Após fechar, reseta o estado para o próximo uso
    setTimeout(() => {
      resetState();
    }, 300);
  }
}

function resetState() {
  email.value = '';
  loading.value = false;
  success.value = false;
  isClosing.value = false;
  errorMessage.value = '';
  primaryButtonText.value = 'Enviar';
}

// Expondo o método show para que o componente pai possa chamar
function show() {
  resetState();
  modalRef.value.show();
}

defineExpose({ show });
</script>

  <style scoped lang="scss">
  p {
    margin-bottom: 16px;
  }

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
    padding: 12px 12px 12px 16px;
    font-size: 16px;
  }

  .input-text{
    color: map-get($body-text, body-color);
    border-radius: 4px;
    border: 1px solid map-get($theme, secondary);
  }

  .error {
    color: map-get($theme, danger);
    font-size: 14px;
  }

  /* Adiciona estilo para o botão primário no modal */
  :deep(.modal-footer .primary-button) {
    min-width: 120px !important;
    width: 120px !important;
  }
  </style>
