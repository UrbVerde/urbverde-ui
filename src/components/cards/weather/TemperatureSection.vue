<!-- urbverde-ui/src/components/cards/weather/TemperatureSection.vue -->
<template>
  <div class="dashboard">
    <div class="left-panel">
      <InfoTemperature />
    </div>
    <div class="right-panel">
      <TemperatureCard  :data="cardData" :class="temperature-card"/>
    </div>
  </div>
</template>

<script>
import InfoTemperature from './InfoTemperature.vue';
import TemperatureCard from './TemperatureCard.vue';

export default{
  components: {
    InfoTemperature,
    TemperatureCard
  },
  data(){
    return {
      cardData: []
    };
  },
  mounted(){
    this.fetchData('3520707','2020');
  },
  methods: {
    async fetchData(city, year) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${city}&year=${year}`);
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
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin: 20px;
  align-items: flex-start;
}

.right-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Duas colunas para os cards */
  gap: 20px;
}

.temperature-card {
  /* Adicione qualquer estilo necessário para os cards */
  background-color: #f0f0f0; /* Exemplo de estilo */
  padding: 20px; /* Adicione algum espaçamento interno se necessário */
}
</style>
