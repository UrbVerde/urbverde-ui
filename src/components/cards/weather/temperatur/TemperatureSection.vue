<!-- urbverde-ui/src/components/cards/weather/temperatur/TemperatureSection.vue -->
<template>
  <div v-if="hasValidData" class="dashboard">
    <div class="left-panel">
      <InfoTemperature />
    </div>
    <div class="right-wrapper">
      <div class="top">
        <FirstSectionCard
          v-for="(card, index) in firstTwoCards"
          :key="index"
          :data="[card]"
          class="temperature-card"
        />
      </div>
      <div class="bottom">
        <FirstSectionCard
          v-for="(card, index) in lastTwoCards"
          :key="index"
          :data="[card]"
          class="temperature-card"
        />
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
      dataFetched: false
    };
  },

  computed: {
    firstTwoCards() {
      return this.cardData.slice(0, 2);
    },
    lastTwoCards() {
      return this.cardData.slice(2, 4);
    },
    hasValidData() {
      // Check if we have valid data after fetch is complete
      if (!this.dataFetched) {return true;} // Show while loading

      if (!this.cardData || this.cardData.length === 0) {
        return false;
      }

      // Check if any card has valid data
      const errorValues = [
        'Dados indisponíveis',
        'Dados não Disponíveis',
        'N/A',
        'Indisponível',
        '',
      ];

      const hasValidCard = this.cardData.some(card => card &&
               card.value &&
               !errorValues.includes(card.value.trim()));

      return hasValidCard;
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
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${this.cityCode}&year=${this.selectedYear}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Error fetching cards data:', error);
        this.cardData = [];
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
