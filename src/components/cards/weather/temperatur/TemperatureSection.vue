<!-- TemperatureSection.vue -->
<template>
  <!-- Only hide if explicitly determined there's no valid data after attempting to fetch -->
  <div v-if="!dataFetched || !isError || hasValidCards" class="dashboard">
    <div class="left-panel">
      <InfoTemperature />
    </div>
    <div class="right-wrapper">
      <div class="top" v-if="hasValidCards">
        <FirstSectionCard
          v-for="(card, index) in firstTwoCards"
          :key="index"
          :data="[card]"
          class="temperature-card"
        />
      </div>
      <div class="bottom" v-if="hasValidCards">
        <FirstSectionCard
          v-for="(card, index) in lastTwoCards"
          :key="index"
          :data="[card]"
          class="temperature-card"
        />
      </div>
      <div v-else-if="dataFetched && !isError" class="no-data-message">
        <p>Não há dados disponíveis para este município.</p>
      </div>
      <div v-else-if="isError" class="error-message">
        <p>Ocorreu um erro ao carregar os dados.</p>
      </div>
    </div>
  </div>
</template>

<script>
import InfoTemperature from './InfoTemperature.vue';
import FirstSectionCard from '../../FirstSectionCard.vue';

export default {
  components: {
    InfoTemperature,
    FirstSectionCard
  },

  props: {
    cityCode: {
      type: Number,
      required: true
    },
    selectedYear: {
      type: Number,
      required: true
    }
  },

  emits: ['section-empty'],

  data() {
    return {
      cardData: [],
      dataFetched: false,
      isError: false
    };
  },

  computed: {
    firstTwoCards() {
      return this.cardData.slice(0, 2);
    },

    lastTwoCards() {
      return this.cardData.slice(2, 4);
    },

    hasValidCards() {
      if (!this.cardData || this.cardData.length === 0) {
        return false;
      }

      const errorValues = [
        'Dados indisponíveis',
        'Dados não Disponíveis',
        'N/A',
        'Indisponível',
        '',
      ];

      return this.cardData.some(card => card &&
               card.value &&
               !errorValues.includes(card.value.trim()));
    },

    hasValidData() {
      // Show while loading
      if (!this.dataFetched) {return true;}

      // Hide if error or no cards
      if (this.isError || !this.hasValidCards) {
        return false;
      }

      return true;
    }
  },

  watch: {
    cityCode: {
      handler: 'fetchData',
      immediate: true
    },
    selectedYear: {
      handler: 'fetchData',
      immediate: true
    },
    hasValidData(newValue) {
      if (!newValue && this.dataFetched) {
        // If we have no valid data after fetching, emit an event
        this.$emit('section-empty', 'stats');
      }
    }
  },

  methods: {
    async fetchData() {
      this.dataFetched = false;
      this.isError = false;

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${this.cityCode}&year=${this.selectedYear}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Error fetching cards data:', error);
        this.cardData = [];
        this.isError = true;
      } finally {
        this.dataFetched = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.dashboard {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
  flex-wrap: wrap;
}

.left-panel {
  flex: 0 1 40%;
  display: flex;
}

.right-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
}

.top,
.bottom {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  flex-wrap: wrap;
}

.temperature-card {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
}

.no-data-message,
.error-message {
  width: 100%;
  padding: 24px;
  background: white;
  border-radius: 16px;
  text-align: center;
  color: #6c757d;
}

.error-message {
  color: #dc3545;
}

@include breakpoint-down('tablet') {
  .right-wrapper {
    gap: 16px;
  }

  .top,
  .bottom {
    gap: 16px;
  }
}

@media (max-width: 700px) {
  .left-panel,
  .right-wrapper {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
