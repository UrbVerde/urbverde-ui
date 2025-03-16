<!-- Fixed InfoParks.vue with guaranteed rendering -->
<template>
  <div class="info-parks-wrapper">
    <!-- Direct HTML instead of using CardBase to guarantee rendering -->
    <div class="custom-card shadow-sm info-card">
      <div class="card-image-wrapper">
        <img :src="image" alt="Ilustração" class="card-image" />
      </div>

      <div class="card-header">
        <h6 class="titulo heading-h6">{{ titulo }}</h6>
      </div>

      <div class="card-content">
        <p class="textodescritivo body-small-medium">{{ descricao }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Ilustracao from '@/assets/images/cards/globalwarming-park.svg';

export default {
  name: 'InfoParks',
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
.info-parks-wrapper {
  width: 100%;
}

.custom-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: auto;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #E9ECEF;
  background-color: white;
  box-sizing: border-box;
  overflow-wrap: break-word;
}

.info-card {
  height: auto;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  padding: 48px 40px 48px 40px;
  flex-shrink: 0;
  width: 100%;
}

.card-image-wrapper {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  height: auto;
  width: 100%;
}

.card-image {
  width: 100%;
  height: auto;
  align-self: center;
  margin-bottom: 54px;
}

.card-header {
  display: flex;
  align-items: center;
  align-self: stretch;
  width: 100%;
}

.titulo {
  color: #212529;
  width: 100%;
  word-wrap: break-word;
  margin: 0;
}

.card-content {
  display: flex;
  width: 100%;
  margin-top: 16px;
}

.textodescritivo {
  color: #6C757D;
  align-self: stretch;
  word-wrap: break-word;
  margin: 0;
}
</style>
