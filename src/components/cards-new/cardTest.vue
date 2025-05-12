<!-- src/components/cards-new/cardTest.vue -->
<template>
  <div class="cards-container">
    <CardData
      apiEndpoint="https://api.urbverde.com.br/v1/cards/weather/temperature"
      :cardIndex="0"
      :showInfoButton="true"
      modalTitle="Nível de ilha de calor"
      modalBodyText="O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes."
    />

    <CardData
      apiEndpoint="https://api.urbverde.com.br/v1/cards/weather/temperature"
      :cardIndex="1"
      :showInfoButton="true"
      modalTitle="Temperatura média da superfície"
      modalBodyText="A temperatura média da superfície representa a média das temperaturas registradas em diferentes pontos da cidade."
    />

    <CardData
      apiEndpoint="https://api.urbverde.com.br/v1/cards/weather/temperature"
      :cardIndex="2"
      :showInfoButton="true"
      modalTitle="Temperatura média da superfície"
      modalBodyText="A temperatura média da superfície representa a média das temperaturas registradas em diferentes pontos da cidade."
    />
  </div>
</template>

<script setup>
import CardData from './cardData.vue';
</script>

<style scoped lang="scss">
.cards-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 8px;
}
</style>
