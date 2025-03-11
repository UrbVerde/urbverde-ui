<template>
  <div v-if="isVisible" class="alert-message" :class="{ 'fade-in': showBanner }">
    <div class="badge">
      <i class="bi bi-stars"></i>
    </div>
    <div class="label">
      <div class="text">
        <p class="title body-small-bold">
          Participe do evento de lançamento da UrbVerde nacional!
        </p>
        <p class="title-mobile body-small-semibold">
          Evento UrbVerde Nacional
        </p>
        <p class="title-mobile-small body-small-semibold">
          Evento UrbVerde<br>Nacional
        </p>
        <p class="subtitle body-small-regular">
          No dia 17/03, explore recursos que transformarão a análise socioambiental da sua cidade
        </p>
      </div>
      <a
        href="https://www.even3.com.br/urbverde-lancamento/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <PrimaryButton
          class="button-desktop"
          label="Participar"
          iconType="bootstrap"
          :filled="false"
          icon="bi bi-arrow-right"
          icon-position="right"
        />
        <PrimaryButton
          class="button-mobile"
          label="Participar"
          :filled="false"
          :icon="null"
        />
      </a>
    </div>
    <button class="close-button" @click="closeBanner" aria-label="Fechar banner">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

// Estado para controlar a visibilidade do banner
const isVisible = ref(false);
// Estado para controlar a animação de fade
const showBanner = ref(false);

// Função para fechar o banner e salvar a preferência no localStorage
const closeBanner = () => {
  showBanner.value = false;

  // Espera a animação terminar antes de esconder o banner
  setTimeout(() => {
    isVisible.value = false;
    localStorage.setItem('urbVerdeBannerClosed', 'true');
  }, 300);
};

// Verifica o estado do banner ao montar o componente
onMounted(() => {
  const bannerClosed = localStorage.getItem('urbVerdeBannerClosed');

  if (bannerClosed === 'true') {
    // Se foi fechado anteriormente, não exibe o banner
    isVisible.value = false;
  } else {
    // Se não foi fechado, aguarda 3 segundos e então mostra com animação
    setTimeout(() => {
      isVisible.value = true;

      // Adiciona um pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        showBanner.value = true;
      }, 50);
    }, 3000);
  }
});
</script>

  <style scoped lang="scss">
  @import '@/assets/styles/breakpoints.scss';

  p {
    margin: 0;
  }

  a {
    text-decoration: none;
  }

  .alert-message {
    position: absolute;
    display: flex;
    width: auto;
    min-width: max-content;
    padding: 16px 24px;
    align-items: flex-start;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid map-get($primary-fade, 100);
    background: map-get($primary-fade, 50);
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .fade-in {
    opacity: 1;
  }

  .button-mobile {
    display: none;
  }

  .close-button {
    position: absolute;
    top: 1px;
    right: 1px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: map-get($gray, 600);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 14px;

    &:hover {
      color: map-get($theme, primary);
      background-color: map-get($primary-fade, 100);
    }
  }

  .alert-message .badge {
    background: map-get($primary-fade, 100);
    border-radius: 4px;
    display: flex;
    padding: 4px;
    align-items: center;
  }

  .alert-message .badge i {
    color: map-get($theme, primary);
    font-size: 14px;
  }

  .alert-message .label {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    height: auto;
    flex-wrap: nowrap;
  }

  .alert-message .label .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    white-space: nowrap;
  }

  .alert-message .label .text .title {
    color: map-get($theme, primary);
  }

  .alert-message .label .text .title-mobile {
    display: none;
  }

  .alert-message .label .text .title-mobile-small {
    display: none;
  }

  .alert-message .label .text .subtitle {
    color: map-get($gray, 600);
  }

  :deep(.primary-button) {
    width: auto !important;
    padding: 0 24px;
    white-space: nowrap;
  }

  @include breakpoint-down('tablet') {
    .alert-message {
      padding: 8px 24px;
      align-items: center;
    }

    .alert-message .label .text .title {
      font-weight: 700;
    }

    .alert-message .label .text .subtitle {
      display: none;
    }

    .alert-message .label {
      gap: 24px;
    }
  }

  @media screen and (max-width: 730px) {
    .alert-message {
      padding: 8px 24px 8px 16px;
    }

    .alert-message .label .text .title {
      display: none;
    }

    .alert-message .label .text .title-mobile {
      color: map-get($theme, primary);
      display: flex;
    }

    .button-mobile {
      display: flex;
    }

    .button-desktop {
      display: none;
    }
  }

  @media screen and (max-width: 450px) {
    .alert-message .label .text .title-mobile {
      display: none;
    }

    .alert-message .label .text .title-mobile-small {
      color: map-get($theme, primary);
      display: flex;
    }
  }
  </style>
