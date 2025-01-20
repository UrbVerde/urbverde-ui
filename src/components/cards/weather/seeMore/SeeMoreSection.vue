<template>
  <div class="see-more-cards">
    <SeeMoreCard v-if="cardData.length" :data="cardData" />
  </div>
</template>

<script>
import SeeMoreCard from '../../SeeMoreCard.vue';

export default {
  name: 'SeeMoreSection',

  components: {
    SeeMoreCard
  },

  props: {
    cityCode: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      cardData: []
    };
  },

  watch: {
    cityCode: {
      handler: 'fetchDataOnChange',
      immediate: true
    }
  },

  methods: {
    fetchDataOnChange() {
      if (this.cityCode) {
        this.fetchData(this.cityCode);
      }
    },

    async fetchData(city) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/info?city=${city}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Erro ao buscar dados do cartão:', error);
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.see-more-cards {
  display: flex;
  flex-direction: row; /* Cards lado a lado */
  gap: 20px; /* Espaço entre os cards */
  margin: 20px;
  flex-wrap: wrap; /* Permite quebrar linha se não houver espaço suficiente */
}

.heat-cards p {
  grid-column: 1 / -1; /* Centraliza a mensagem quando visível */
  text-align: center;
  color: gray;
}
</style>
