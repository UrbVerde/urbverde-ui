<template>
    <div class="download-card">
      <div class="content">
        <h2 class="title">Baixe gratuitamente o relatório completo</h2>
        <ul class="text">
            Obtenha dados completos de temperatura, vegetação e áreas verdes de seu município
        </ul>
        <PrimaryButton
            label="Baixar Relatório"
            :filled="true"
            icon="bi-download"
            iconType="bootstrap"
            iconPosition="left"
            class="download-card-button"
            />

      </div>
      <div class="download-card-image">
        <img
          src="@/assets/images/cards/youngFarmer.jpg"
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
    padding: 16px;
    box-sizing: border-box;
  }
  
  .content {
    flex: 1;
    padding: 40px 40px 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .download-card-image img {
    width: 306px;
    height: 266px;
    object-fit: contain;
  }
  
  .title {
    color: var(--Body-Text-Body-Color, #212529);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 24px */
    align-self: stretch;
    margin-bottom: 32px;
  }

  
  .tips-card-button {
    margin-top: 16px;
    align-self: flex-start;
  }
  </style>
  