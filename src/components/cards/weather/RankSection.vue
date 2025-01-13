<!-- urbverde-ui/src/components/cards/weather/RankSection.vue -->
<template>
  <div>
    <RankingCard
      v-for="(rank, index) in rankCards"
      :key="'rank-' + index"
      :title="rank.title"
      :subtitle="rank.subtitle"
      :data="transformItems(rank.items)"
    />
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
