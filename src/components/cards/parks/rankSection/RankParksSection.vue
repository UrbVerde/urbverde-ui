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
import RankingCard from '../../RankingCard.vue';
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
  }

  .rank-card {
    flex: 1 1 calc(33.333% - 16px);
    max-width: calc(33.333% - 16px);
    box-sizing: border-box;
  }
  </style>
