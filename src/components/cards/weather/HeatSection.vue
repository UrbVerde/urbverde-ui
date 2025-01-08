<!-- urbverde-ui/src/components/cards/weather/HeatSection.vue -->
<template>
  <div class="dashboard">
    <HeatCard :data="cardData"/>
  </div>
</template>

<script>
import HeatCard from './HeatCard.vue';

export default{
  components: {
    HeatCard,
  },
  data(){
    return {
      cardData: []
    };
  },
  mounted(){
    this.fetchData(3520707,'2020');
  },
  methods: {
    async fetchData(city, year) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/heat?city=${city}&year=${year}`);
        const data = await response.json();
        this.cardData= data;

      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    }
  }
};
</script>

<style scoped>

/* Global reset for box-sizing */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Configura 4 colunas iguais */
  gap: 20px; /* Espaçamento entre os cards */
  margin: 20px;
  align-items: flex-start; /* Alinha os cards no topo */
}

</style>
