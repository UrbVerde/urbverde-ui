<template>
  <div class="info-vegetation-card">
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
  name: 'InfoVegetation',
  components: {
    CardBase,
  },
  data() {
    return {
      titulo: 'O que é cobertura vegetal?',
      descricao:
          'Áreas da cidade cobertas por vegetação, como árvores e gramíneas',
      image: Ilustracao,
    };
  },
};
</script>

<style scoped lang="scss">

  .card-image {
    display: flex;
    width: 233px;
    height: 168px;
    align-self: center;
    margin-bottom: 54px;
  }
</style>
