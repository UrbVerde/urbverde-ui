<!-- urbverde-ui/src/components/cards/vegetation/inequality/InequalitySection.vue -->
<template>
  <div v-if="hasValidData" class="dashboard-section">
    <div class="info-cards">
      <FirstSectionCard :data="cardData"/>
    </div>
    <div class="benefits-card-section">
      <BenefitsCard />
    </div>
  </div>
</template>

<script>
import FirstSectionCard from '../../FirstSectionCard.vue';
import BenefitsCard from './BenefitsCard.vue';

export default {
  name: 'InequalitySection',

  components: {
    FirstSectionCard,
    BenefitsCard
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
    hasValidData() {
      // Show while loading
      if (!this.dataFetched) {return true;}

      // Hide if error or no data
      if (this.isError || !this.cardData || this.cardData.length === 0) {
        return false;
      }

      // Check if any card has valid data
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
      handler: 'fetchDataOnChange',
      immediate: true
    },
    selectedYear: {
      handler: 'fetchDataOnChange',
      immediate: true
    },
    hasValidData(newValue) {
      if (!newValue && this.dataFetched) {
        // If we have no valid data after fetching, emit an event
        this.$emit('section-empty', 'inequality');
      }
    }
  },

  methods: {
    fetchDataOnChange() {
      if (this.cityCode && this.selectedYear) {
        this.fetchData(this.cityCode, this.selectedYear.toString());
      }
    },

    async fetchData(city, year) {
      this.dataFetched = false;
      this.isError = false;

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/vegetal/inequality?city=${city}&year=${year}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          this.cardData = data;
        } else {
          console.warn('Invalid response format from inequality API:', data);
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

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.info-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  flex-grow: 1;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
}

.benefits-card-section {
  display: flex;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
}

.benefits-card-section > * {
  flex: 1;
  max-width: 100%;
}

@include breakpoint-down('tablet') {
  .info-cards {
    gap: 16px;
  }
}

</style>
