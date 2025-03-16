<!-- Complete solution for infoParksSection.vue -->
<template>
  <div class="dashboard">
    <!-- InfoParks is always rendered, not conditional on card data -->
    <div class="left-panel">
      <InfoParks />
    </div>

    <!-- Only the card data section is conditional -->
    <div v-if="hasValidData" class="right-wrapper">
      <div class="top">
        <FirstSectionCard
          v-for="(card, index) in firstTwoCards"
          :key="index"
          :data="[card]"
          class="section-card"
        />
      </div>
      <div class="bottom">
        <FirstSectionCard
          v-for="(card, index) in lastTwoCards"
          :key="index"
          :data="[card]"
          class="section-card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InfoParks from './InfoParks.vue';
import FirstSectionCard from '../../FirstSectionCard.vue';

export default {
  components: {
    InfoParks,
    FirstSectionCard
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
    hasValidData() {
      // Only affects the right panel cards, not the InfoParks component
      if (!this.dataFetched) {return true;}

      if (this.isError || !this.cardData || this.cardData.length === 0) {
        return false;
      }

      const errorValues = [
        'Dados indisponíveis',
        'Dados não Disponíveis',
        'N/A',
        'Indisponível'
      ];

      return this.cardData.some(card => card &&
               card.value &&
               !errorValues.includes(card.value.toString().trim()));
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
        const response = await fetch(
          `https://api.urbverde.com.br/v1/cards/square/parks?city=${this.cityCode}&year=${this.selectedYear}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          this.cardData = data;
        } else {
          console.warn('Invalid response format from parks API:', data);
          this.cardData = [];
          this.isError = true;
        }
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
  min-width: 240px;
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

.section-card {
  flex: 1;
  border-radius: 16px;
  padding: 24px;
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
