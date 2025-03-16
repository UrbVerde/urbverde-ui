<template>
  <div class="dashboard">
    <!-- InfoVegetation is always rendered, regardless of data status -->
    <InfoVegetation class="vegetation-info" />

    <!-- Data-dependent sections with conditional rendering -->
    <FieldCard v-if="hasValidFirstCard" :data="firstCardData" class="vegetation-field" />

    <div v-if="hasValidRemainingCards" class="right-panel">
      <FirstSectionCard :data="remainingCardData" class="section-card" />
    </div>
  </div>
</template>

<script>
import FirstSectionCard from '../../FirstSectionCard.vue';
import InfoVegetation from './InfoVegetation.vue';
import FieldCard from './FieldCard.vue';

export default {
  components: {
    FirstSectionCard,
    InfoVegetation,
    FieldCard
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
      firstCardData: null,
      remainingCardData: [],
      dataFetched: false,
      isError: false
    };
  },

  computed: {
    hasValidFirstCard() {
      if (!this.firstCardData) {return false;}

      const errorValues = [
        'Dados indisponíveis',
        'Dados não Disponíveis',
        'N/A',
        'Indisponível'
      ];

      return this.firstCardData.value &&
             !errorValues.includes(this.firstCardData.value.toString().trim());
    },

    hasValidRemainingCards() {
      if (!this.remainingCardData || this.remainingCardData.length === 0) {return false;}

      const errorValues = [
        'Dados indisponíveis',
        'Dados não Disponíveis',
        'N/A',
        'Indisponível'
      ];

      return this.remainingCardData.some(card => card &&
               card.value &&
               !errorValues.includes(card.value.toString().trim()));
    },

    // This computed property now only affects the emitted event, not the InfoVegetation display
    hasValidData() {
      // If we're still loading, don't emit empty
      if (!this.dataFetched) {return true;}

      // If there was an error, consider it empty for emitting
      if (this.isError) {return false;}

      // Check if either first card or remaining cards have valid data
      return this.hasValidFirstCard || this.hasValidRemainingCards;
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
          `https://api.urbverde.com.br/v1/cards/vegetal/cover?city=${this.cityCode}&year=${this.selectedYear}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          if (data.length > 0) {
            this.firstCardData = {
              title: data[0].title || 'Área Vegetal',
              value: data[0].value?.toString() || '0',
              subtitle: data[0].subtitle || 'Descrição padrão',
            };
            this.remainingCardData = data.slice(1);
          } else {
            this.firstCardData = null;
            this.remainingCardData = [];
          }
        } else {
          console.warn('Invalid response format from vegetation API:', data);
          this.firstCardData = null;
          this.remainingCardData = [];
          this.isError = true;
        }
      } catch (error) {
        console.error('Error fetching cards data:', error);
        this.firstCardData = null;
        this.remainingCardData = [];
        this.isError = true;
      } finally {
        this.dataFetched = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.dashboard {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    width: 100%;
}

.vegetation-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.vegetation-field {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.right-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    flex: 0 1 25%;
}

.section-card {
    width: 100%;
    padding: 20px;
    border-radius: 12px;
}

@include breakpoint-down('tablet') {
  .right-panel {
    gap: 16px;
  }
}

@media screen and (max-width: 760px) {
  .dashboard {
      flex-direction: column;
  }

  .right-panel {
      width: 100% !important;
      flex-direction: row;
  }
}
</style>
