<!-- urbverde-ui/src/components/cards/weather/ranking/RankSection.vue -->
<template>
  <div v-if="hasValidData" class="rank-section">
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
      type: [String, Number],
      required: true
    },
    selectedYear: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['section-empty'],
  data() {
    return {
      rankCards: [],
      dataFetched: false,
      isError: false
    };
  },
  computed: {
    hasValidData() {
      // Show while loading
      if (!this.dataFetched) {return true;}

      // Hide if error or no data
      if (this.isError || !this.rankCards || this.rankCards.length === 0) {
        return false;
      }

      // Check if any card has valid items
      return this.rankCards.some(card => card && card.items && card.items.length > 0);
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
    },
    hasValidData(newValue) {
      if (!newValue && this.dataFetched) {
        // If we have no valid data after fetching, emit an event
        this.$emit('section-empty', 'ranking');
      }
    }
  },
  methods: {
    async fetchRankingData() {
      this.dataFetched = false;
      this.isError = false;

      try {
        const response = await axios.get(
          `https://api.urbverde.com.br/v1/cards/weather/ranking?city=${this.cityCode}&year=${this.selectedYear}`
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          this.rankCards = response.data;
        } else {
          // Non-200 response or unexpected data format
          console.warn('Invalid response format from ranking API:', response.data);
          this.rankCards = [];
          this.isError = true;
        }
      } catch (error) {
        console.error('Error fetching ranking data:', error);
        this.rankCards = [];
        this.isError = true;
      } finally {
        this.dataFetched = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.rank-section {
  display: flex;
  gap: 24px;
  width: 100%;
  flex-wrap: wrap;
}

.rank-card {
  flex: 1 1 240px;
  min-width: 0;
}
</style>
