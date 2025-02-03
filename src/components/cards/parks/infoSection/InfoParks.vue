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
      titulo: 'Quem as praças e parques atendem?',
      descricao:
          'Segundo a OMS, atendem principalmente moradores que vivem num raio de 400m, considerados "população da vizinhança"',
      image: Ilustracao,
    };
  },
};
</script>

<style scoped lang="scss">

  .info-card {
    width: 365px;
    height: auto;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    padding: 48px 40px 48px 40px;
  }

  .card-image {
    width: 233px;
    height: 168px;
    align-self: center;
    margin-bottom: 54px;
  }

</style>
