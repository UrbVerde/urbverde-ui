<!-- urbverde-ui/src/components/cards/vegetation/inequality/BenefitsCard.vue -->
<template>

  <!-- Desktop Version -->

  <div class="benefits-card"
       v-if="largerThan('tablet')">
    <div class="benefits-card-content">
      <div class="label">
        <h2 class="benefits-card-title heading-h5">Quais os benefícios de uma cidade arborizada?</h2>
        <ul class="benefits-card-list">
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">1</span>
            <p class="body-small-regular">
              Árvores &nbsp;<b>reduzem a sensação de calor</b>, criando ambientes mais frescos.
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">2</span>
            <p class="body-small-regular">
              Ajudam a filtrar poluentes e &nbsp;<b>melhorar a qualidade do ar</b>&nbsp; nas cidades.
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">3</span>
            <p class="body-small-regular">
              <b>Políticas públicas</b>&nbsp; podem auxiliar a promover mais áreas verdes nas cidades
            </p>
          </li>
        </ul>
      </div>
      <a
        href="https://urbverde-educa.tawk.help/category/categorias-e-camadas/vegeta%C3%A7%C3%A3o"
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
        src="@/assets/images/cards/plantingATreeTogether.svg"
        alt="Ilustração beneficios"
      />
    </div>
  </div>

  <!-- Mobile Version -->

  <div class="benefits-card"
       v-else>
    <div class="benefits-card-content">
      <div class="label">
        <h2 class="benefits-card-title heading-h5">Quais os benefícios de uma cidade arborizada?</h2>
        <div class="benefits-card-image">
          <img
            src="@/assets/images/cards/plantingATreeTogether.svg"
            alt="Ilustração beneficios"
          />
        </div>
        <ul class="benefits-card-list">
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">1</span>
            <p class="body-small-regular">
              Árvores &nbsp;<b>reduzem a sensação de calor</b>, criando ambientes mais frescos.
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">2</span>
            <p class="body-small-regular">
              Ajudam a filtrar poluentes e &nbsp;<b>melhorar a qualidade do ar</b>&nbsp; nas cidades.
            </p>
          </li>
          <li class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">3</span>
            <p class="body-small-regular">
              <b>Políticas públicas</b>&nbsp; podem auxiliar a promover mais áreas verdes nas cidades
            </p>
          </li>
        </ul>
      </div>
      <a
        href="https://urbverde-educa.tawk.help/category/categorias-e-camadas/vegeta%C3%A7%C3%A3o"
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
  min-height: 300px;
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
  align-items: center;
  justify-content: center;
  width: auto;
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
