<!-- urbverde-ui/src/components/cards/weather/HeatSection.vue -->
<template>
  <div class="dashboard-section">
    <div class="heat-cards">
      <HeatCard :data="cardData"/>
    </div>


    <div class="tips-card-section">
      <TipsCard />
    </div>
  </div>
</template>

<script>
import HeatCard from './HeatCard.vue';
import TipsCard from './TipsCard.vue';

export default{
  components: {
    HeatCard,
    TipsCard
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

.dashboard-section {
  display: flex;
  flex-direction: column; /* Organiza as seções verticalmente */
  gap: 20px; /* Espaçamento entre HeatCards e TipsCard */
  margin: 20px;
}

.heat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Configura 4 colunas iguais */
  gap: 20px; /* Espaçamento entre os HeatCards */
}

.tips-card-section {
  margin-top: 20px; /* Adiciona espaçamento acima do TipsCard */
  display: flex;
  justify-content: center; /* Centraliza o TipsCard horizontalmente */
}


</style>
