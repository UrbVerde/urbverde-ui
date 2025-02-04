<!-- urbverde-ui/src/components/cards/weather/temperatur/InfoTemperature.vue -->
<template>
  <div class="info-temperature-card">
    <CardBase
      :title="titulo"
      :subtitle="descricao"
      imagePosition="top"
      class="info-card"
    >

      <template #image>
        <img :src="image" alt="Ilustração" class="card-image" />
      </template>
    </CardBase>
  </div>
</template>

<script>
import CardBase from '@/components/cards/Card.vue';
import Ilustracao from '@/assets/images/cards/globalwarming.svg';

export default {
  name: 'InfoTemperature',
  components: {
    CardBase,
  },
  data() {
    return {
      titulo: 'O que são ilhas de calor?',
      descricao:
        'São as áreas mais quentes das cidades, causadas por materiais como asfalto e concreto que retêm calor.',
      image: Ilustracao,
    };
  },
};
</script>

<style scoped lang="scss">

.info-card {
  max-width: 365px;
  height: auto;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  padding: 48px 40px 48px 40px;
}

.info-temperature-card .textodescritivo {
  margin-top: 12px;
  color: map-get($gray, 600);
}

.card-image {
  width: 100%;
  height: auto;
  align-self: center;
  margin-bottom: 54px;
}

</style>
