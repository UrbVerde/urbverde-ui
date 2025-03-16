<template>
  <div class="dashboard-section">
    <!-- TipsCard is always rendered -->
    <div class="tips-card-section">
      <TipsCard />
    </div>

    <!-- Only the card data section is conditional -->
    <div v-if="hasValidData" class="heat-cards">
      <SecondSectionCard :data="cardData"/>
    </div>
  </div>
</template>

<script>
import SecondSectionCard from '../../SecondSectionCard.vue';
import TipsCard from './TipsCard.vue';

export default {
  name: 'HeatSection',

  components: {
    SecondSectionCard,
    TipsCard
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
        this.$emit('section-empty', 'vulnerable');
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
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/heat?city=${city}&year=${year}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();

        if (Array.isArray(data)) {

          // Transformar os dados conforme solicitado
          data = data.map(item => ({
            ...item,
            title: item.title.replace(/(afetados|afetadas)/, ''),
            subtitle: 'do total de pessoas vivendo nas regiões mais quentes.'
          }));

          this.cardData = data;
        } else {
          console.warn('Invalid response format from heat API:', data);
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

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.heat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 24px;
  flex-wrap: wrap;
}

.see-more-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

.tips-card-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@include breakpoint-down('tablet') {
  .heat-cards {
    gap: 16px;
  }
}
</style>
