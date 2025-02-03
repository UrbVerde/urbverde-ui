<!-- urbverde-ui/src/components/cards/weather/heat/TipsCard.vue -->
<template>
  <div class="tips-card">
    <div class="tips-card-content">
      <h2 class="tips-card-title heading-h5">Como podemos tornar as cidades mais frescas?</h2>
      <ul class="tips-card-list">
        <li class="tips-card-item">
          <span class="tips-card-number">1</span>
          <b>Árvores</b>&nbsp;ajudam a reduzir o calor e melhorar a qualidade do ar.
        </li>
        <li class="tips-card-item">
          <span class="tips-card-number">2</span>
          <b>Rios e lagos</b>&nbsp;ajudam a resfriar o clima urbano.
        </li>
        <li class="tips-card-item">
          <span class="tips-card-number">3</span>
          Implementação de &nbsp;<b>políticas públicas</b>&nbsp;que podem promover mais áreas verdes nas cidades.
        </li>
      </ul>
      <PrimaryButton
        label="Ver mais dicas"
        :filled="true"
        class="tips-card-button"
      />
    </div>
    <div class="tips-card-image">
      <img
        src="@/assets/images/cards/environmentalcampaign.svg"
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
.tips-card {
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

.tips-card-content {
  flex: 1;
  padding: 40px 40px 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tips-card-image img {
  width: 306px;
  height: 266px;
  object-fit: contain;
}

.tips-card-title {
  align-self: stretch;
  margin-bottom: 32px;
}

.tips-card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-card-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
}

.tips-card-number {
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
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 21px */
}

.tips-card-button {
  margin-top: 16px;
  align-self: flex-start;
}
</style>
