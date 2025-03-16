<!-- Fixed InfoVegetation.vue with guaranteed rendering -->
<template>
  <div class="info-vegetation-wrapper">
    <!-- Direct HTML instead of using CardBase to guarantee rendering -->
    <div class="custom-card shadow-sm vegetation-card">
      <div class="card-image-wrapper">
        <img :src="image" alt="Ilustração" class="imagem"/>
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
import Ilustracao from '@/assets/images/cards/globalwarming-vegetation.svg';

export default {
  name: 'InfoVegetation',
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

.card-image-wrapper {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  height: auto;
  width: 100%;
}

.imagem {
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
