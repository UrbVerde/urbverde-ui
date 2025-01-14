<template>
  <div class="rank-section">
    <RankingCard
      v-for="(card, index) in rankCards"
      :key="index"
      :data="card"
      class="rank-card"
    />
    <p v-if="!rankCards || rankCards.length === 0" class="no-data">
      Carregando dados do ranking...
    </p>
  </div>
</template>

<script>
import RankingCard from './RankingCard.vue';
import axios from 'axios';

export default {
  name: 'RankSection',
  components: {
    RankingCard,
  },
  props: {
    cityCode: {
      type: String,
      required: true
    },
    selectedYear: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      rankCards: [],
    };
  },
  methods: {
    transformItems(items) {
      if (!items) {return [];}

      return items.map(item => ({
        title: item.type,
        value: item.number.toString(),
        total: item.of.toString()
      }));
    },
    async fetchRankingData() {
      try {
        const response = await axios.get(
          `https://api.urbverde.com.br/v1/cards/weather/ranking?city=${this.cityCode}&year=${this.selectedYear}`
        );
        this.rankCards = response.data;
      } catch (error) {
        console.error('Error fetching ranking data:', error);
        this.rankCards = [];
      }
    }
  },
  watch: {
    cityCode: {
      handler: 'fetchRankingData',
      immediate: true
    },
    selectedYear: {
      handler: 'fetchRankingData',
      immediate: true
    }
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
