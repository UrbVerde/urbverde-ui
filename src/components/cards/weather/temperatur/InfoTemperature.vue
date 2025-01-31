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

<style>

.info-card {
  width: 365px;
  height: 412px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background-color: var(--Gray-White, #FFF);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
  padding: 48px 40px 48px 40px;
}

.info-temperature-card .textodescritivo {
  margin-top: 12px;
  color: var(--Theme-Secondary, #525960);
}

.card-image {
  width: 233px;
  height: 168px;
  align-self: center;
  margin-bottom: 54px;
}

</style>
