<template>
  <div class="info-vegetation-wrapper">
    <CardBase
      :title="titulo"
      :subtitle="descricao"
      imagePosition="top"
      class="vegetation-card"
    >
      <template #image>
        <img :src="image" alt="Ilustração" class="imagem"/>
      </template>
    </CardBase>
  </div>
</template>

<script>
import CardBase from '@/components/cards/Card.vue';
import Ilustracao from '@/assets/images/cards/globalwarming-vegetation.svg';

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
.info-vegetation-wrapper {
  display: flex;
  width: 100%;
  position: relative;
}

.vegetation-card {
  width: 100%;
  position: relative;
  display: flex;
  padding: 48px 40px 48px 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  align-self: stretch;
}

.vegetation-card .imagem {
  width: 100%;
  height: auto;
  align-self: center;
  margin-bottom: 54px;
}
</style>
