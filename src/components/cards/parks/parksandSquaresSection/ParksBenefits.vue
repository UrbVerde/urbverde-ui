<template>
  <div class="benefits-card">
    <div class="benefits-card-content">
      <h2 class="benefits-card-title heading-h5">Quais os benefícios dos parques e praças?</h2>
      <ul class="benefits-card-list">
        <li class="benefits-card-item">
          <span class="benefits-card-number">1</span>
          Incentivam a &nbsp;<b>atividade física</b>, ajudando a prevenir problemas de saúde.
        </li>
        <li class="benefits-card-item">
          <span class="benefits-card-number">2</span>
          Ajudam a &nbsp;<b>reduzir o estresse</b>, promovendo saúde mental e bem-estar
        </li>
        <li class="benefits-card-item">
          <span class="benefits-card-number">3</span>
          <b>Políticas públicas</b>&nbsp; ajudam a promover e manter esses espaços.
        </li>
      </ul>
      <PrimaryButton
        label="Ver mais dicas"
        :filled="true"
        class="benefits-card-button"
      />
    </div>
    <div class="benefits-card-image">
      <img
        src="@/assets/images/cards/airPollutionFree.svg"
        alt="Ilustração beneficios"
      />
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

export default {
  name: 'BenefitsCard',
  components: {
    PrimaryButton,
  },
};
</script>

<style scoped lang="scss">
  .benefits-card {
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
    flex-grow: 1;
    width: 100%;
    min-height: 300px;
    max-height: 100%;
  }

  .benefits-card-content {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: justify;
  }

  .benefits-card-image {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .benefits-card-image img {
    width: auto;
    height: 100%;
    max-width: 300px;
    object-fit: contain;
  }

  .benefits-card-title {
    margin-bottom: 32px;
  }

  .benefits-card-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .benefits-card-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #374151;
    margin-bottom: 12px;
  }

  .benefits-card-number {
    width: 21px;
    height: 21px;
    background-color: #e7f6e8;
    font-weight: bold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;

    color: var(--Green-700, #0F5132);
  }

  .benefits-card-button {
    margin-top: 16px;
    align-self: flex-start;
  }
</style>
