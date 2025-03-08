<!-- urbverde-ui/src/components/cards/parks/parksandSquaresSection/ParksBenefits.vue -->
<template>

  <!-- Desktop Version -->

  <div class="benefits-card"
       v-if="largerThan('tablet')">
    <div class="benefits-card-content">
      <div class="label">
        <h2 class="benefits-card-title heading-h5">Quais os benefícios dos parques e praças?</h2>
        <ul class="benefits-card-list">
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">1</span>
            <p class="body-small-regular">
              Incentivam a &nbsp;<b>atividade física</b>, ajudando a prevenir problemas de saúde.
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">2</span>
            <p class="body-small-regular">
              Ajudam a &nbsp;<b>reduzir o estresse</b>, promovendo saúde mental e bem-estar
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">3</span>
            <p class="body-small-regular">
              <b>Políticas públicas</b>&nbsp; ajudam a promover e manter esses espaços.
            </p>
          </li>
        </ul>
      </div>
      <a
        href="https://urbverde-educa.tawk.help/category/categorias-e-camadas/pra%C3%A7as-e-parques"
        target="_blank"
        rel="noopener noreferrer"
        class="body-small-regular"
      >
        <PrimaryButton
          label="Ver mais dicas"
          :filled="true"
          class="benefits-card-button"
        />
      </a>
    </div>
    <div class="benefits-card-image">
      <img
        src="@/assets/images/cards/airPollutionFree.svg"
        alt="Ilustração beneficios"
      />
    </div>
  </div>

  <!-- Mobile Version -->

  <div class="benefits-card"
       v-else>
    <div class="benefits-card-content">
      <div class="label">
        <h2 class="benefits-card-title heading-h5">Quais os benefícios dos parques e praças?</h2>
        <div class="benefits-card-image">
          <img
            src="@/assets/images/cards/airPollutionFree.svg"
            alt="Ilustração beneficios"
          />
        </div>
        <ul class="benefits-card-list">
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">1</span>
            <p class="body-small-regular">
              Incentivam a &nbsp;<b>atividade física</b>, ajudando a prevenir problemas de saúde.
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">2</span>
            <p class="body-small-regular">
              Ajudam a &nbsp;<b>reduzir o estresse</b>, promovendo saúde mental e bem-estar
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">3</span>
            <p class="body-small-regular">
              <b>Políticas públicas</b>&nbsp; ajudam a promover e manter esses espaços.
            </p>
          </li>
        </ul>
      </div>
      <a
        href="https://urbverde-educa.tawk.help/category/categorias-e-camadas/pra%C3%A7as-e-parques"
        target="_blank"
        rel="noopener noreferrer"
        class="body-small-regular"
      >
        <PrimaryButton
          label="Ver mais dicas"
          :filled="true"
          class="benefits-card-button"
        />
      </a>
    </div>
  </div>

</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import { useWindowSize } from '@/utils/useWindowsSize';

export default {
  name: 'BenefitsCard',
  components: {
    PrimaryButton,
  },
  setup() {
    const {
      largerThan
    } = useWindowSize();

    return {
      largerThan
    };
  },
};

</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

a{
  text-decoration: none;
}

p {
  margin: 0;
}

.benefits-card {
  display: flex;
  align-items: center;
  gap: 56px;
  justify-content: center;
  background: map-get($gray, white);
  border: 1px solid map-get($gray, 200);
  border-radius: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 40px 40px 40px 40px;
  box-sizing: border-box;
  flex-grow: 1;
  width: 100%;
  max-height: 100%;
}

.label{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
}

.benefits-card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 48px;
}

.benefits-card-image {
  flex-shrink: 0;
  display: flex;
  width: auto;
  align-items: center;
  justify-content: center;
}

.benefits-card-image img {
  width: auto;
  height: auto;
  max-width: min(100%, 300px);
  object-fit: contain;
}

.benefits-card-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  gap: 12px;
  margin: 0;
}

.benefits-card-item {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  color: #374151;
}

.benefits-card-number {
  display: flex;
  width: 24px;
  height: 24px;
  padding: 0px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 99px;
  background: map-get($green, 100);
}

.benefits-card-button {
  align-self: flex-start;
}

:deep(.primary-button) {
  width: 100%;
  max-width: 261px;
}

@include breakpoint-down('tablet') {
  .benefits-card-title{
    text-align: center;
    margin: auto;
    font-size: 16px;
  };

  .benefits-card-image {
    margin: auto;
  }

  .benefits-card a{
    display: flex;
    justify-content: center;
  }
}

</style>
