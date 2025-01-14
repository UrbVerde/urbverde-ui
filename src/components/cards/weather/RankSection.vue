<template>
  <div class="rank-section">
    <RankingCard 
      v-for="(card, index) in cardData" 
      :key="index" 
      :data="card" 
      class="rank-card"
    />
    <p v-if="!cardData || cardData.length === 0" class="no-data">
      Carregando dados do ranking...
    </p>
  </div>
</template>

<script>
import RankingCard from './RankingCard.vue';

export default {
  components: {
    RankingCard,
  },
  data() {
    return {
      cardData: [], 
    };
  },
  mounted() {
    this.fetchData('3520707', '2020'); 
  },
  methods: {
    async fetchData(city, year) {
      try {
        const response = await fetch(
          `https://api.urbverde.com.br/v1/cards/weather/ranking?city=${city}&year=${year}`
        );
        const data = await response.json();
        console.log("Dados recebidos da API:", data); 
        this.cardData = data; 
      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    },
  },
};
</script>

<style scoped>
.rank-section {
  display: flex; /* Exibe os itens em linha */
  flex-wrap: wrap; /* Garante que os itens se ajustem, se necessário */
  justify-content: space-between; /* Espaçamento uniforme entre os cards */
  gap: 16px; /* Espaço fixo entre os cards */
  padding: 16px; /* Margem interna para o container */
}

.rank-card {
  flex: 1 1 calc(33.333% - 16px); /* Cards ocupam 1/3 do espaço com espaçamento */
  max-width: calc(33.333% - 16px); /* Previne o card de ultrapassar o limite */
  box-sizing: border-box; /* Garante que padding seja incluído no tamanho total */
}
</style>
