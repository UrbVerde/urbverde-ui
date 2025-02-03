<!-- urbverde-ui/src/components/cards/DownloadCard.vue -->
<template>
  <div class="download-card">
    <div class="content">
      <h2 class="title heading-h5">Baixe gratuitamente o relatório completo</h2>
      <ul class="text body-small-medium">
        Obtenha dados completos de temperatura, vegetação e áreas verdes de seu município
      </ul>
      <div class="botao">
        <PrimaryButton
          label="Baixar Relatório"
          :filled="true"
          icon="bi-download"
          iconType="bootstrap"
          iconPosition="left"
          class="download-card-button"
        />
      </div>
    </div>
    <div class="download-card-image">
      <img
        src="@/assets/images/cards/youngFarmer.svg"
        alt="Ilustração dicas"
      />
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

export default {
  name: 'TipsCard',
  components: {
    PrimaryButton,
  },
};
</script>

  <style scoped>
  .download-card {
    width: 1056px;
    height: 354px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid var(--Gray-200, #E9ECEF);
    border-radius: 16px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    padding: 40px 80px 48px 56px;
    box-sizing: border-box;
    gap: 40px;
  }

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
      flex: 1 0 0;
  }

  .text {
    color: var(--Theme-Secondary, #525960);
  text-align: center;
  }

  .download-card-image img {
    width: 306px;
    height: 266px;

  }

  </style>
