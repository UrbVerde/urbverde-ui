<!-- src/components/cards-new/cardTest.vue -->
<template>
  <div class="cards-container">
    <CardData
      apiEndpoint="https://api.urbverde.com.br/v1/cards/weather/temperature"
      :cardIndex="0"
      :showInfoButton="true"
      modalTitle="CARD TESTE COMPONENTE"
      modalBodyText="O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes."
    />
  </div>
</template>

<script setup>
import CardData from './cardData.vue';
</script>

<style scoped lang="scss">
</style>
