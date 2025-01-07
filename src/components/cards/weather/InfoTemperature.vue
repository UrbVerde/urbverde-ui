<!-- urbverde-ui/src/components/cards/weather/InfoTemperature.vue -->
<template>
  <div>
    <Card
      :title="titulo"
      :subtitle="descricao"
      :value="value"
    >
      <template #custom-content>
        <img :src="image" alt="Ilustração" class="card-image" />
      </template>
    </Card>
  </div>
</template>

<script>
import Card from '@/components/cards/Card.vue';
import Ilustracao from '@/assets/images/cards/globalwarming.png';

export default {
  name: 'InfoTemperature',
  components: {
    Card,
  },

  data() {
    return {
      titulo: 'O que sao ilhas de calor?',
      descricao: 'São as áreas mais quentes das cidades, causadas por materiais como asfalto e concreto que retêm calor.',
      image: Ilustracao,
    };
  },
};
</script>

<style scoped>
.card-image {
  width: 233px;
  height: 168px;
  margin-bottom: 24px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
