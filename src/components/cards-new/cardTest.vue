<!-- src/components/cards-new/cardTest.vue -->
<template>
  <div class="cards-container">
    <CardData
      apiEndpoint="https://api.urbverde.com.br/v1/cards/weather/temperature"
      :requiresYear="true"
      :cardIndex="0"
      :showInfoButton="true"
      modalTitle="Nível de ilha de calor"
      modalBodyText="O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes."
      overrideTitle="Nível de Ilha de Calor Urbana"
      overrideSubtitle="Intensidade do efeito de aquecimento"
    />

    <CardData
      apiEndpoint="https://api.urbverde.com.br/v1/cards/weather/temperature"
      :requiresYear="true"
      :cardIndex="1"
      :showInfoButton="true"
      modalTitle="Temperatura média da superfície"
      modalBodyText="A temperatura média da superfície representa a média das temperaturas registradas em diferentes pontos da cidade."
      overrideTitle="Temperatura Média"
      overrideSubtitle="Média das temperaturas superficiais"
    />
  </div>
</template>

<script setup>
import CardData from './cardData.vue';

defineProps({
  cityCode: {
    type: [Number, String],
    required: true
  },
  selectedYear: {
    type: [Number, String],
    required: true
  }
});
</script>

<style scoped lang="scss">
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
}
</style>
