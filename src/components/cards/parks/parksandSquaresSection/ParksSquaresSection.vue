<!-- urbverde-ui/src/components/cards/parks/parksandSquaresSection/ParksSquaresSection.vue -->
<template>
  <div v-if="hasValidData" class="dashboard-section">
    <div class="heat-cards">
      <SecondSectionCard :data="cardData"/>
    </div>
    <div class="benefits-card-section">
      <ParksBenefits />
    </div>
  </div>
</template>

<script>
import SecondSectionCard from '../../SecondSectionCard.vue';
import ParksBenefits from './ParksBenefits.vue';

export default {
  name: 'ParksSquaresSection',
  components: {
    SecondSectionCard,
    ParksBenefits
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
      cardData: null,
      dataFetched: false,
      isError: false
    };
  },

  computed: {
    hasValidData() {
      // Show while loading
      if (!this.dataFetched) {return true;}

      // Hide if error
      if (this.isError) {return false;}

      // Show if card data is valid
      if (!this.cardData) {return false;}

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
        this.$emit('section-empty', 'parks');
      }
    }
  },

  methods: {
    async fetchData() {
      this.dataFetched = false;
      this.isError = false;

      try {
        const response = await fetch(
          `https://api.urbverde.com.br/v1/cards/parks?city=${this.cityCode}&year=${this.selectedYear}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let processedData;

        if (Array.isArray(data)) {

          // Multiplicar os valores numéricos por 100 e atualizar os subtítulos
          processedData = data.map(item => {
          // Remover o símbolo % e converter para número
            const numericValue = parseFloat(item.value.replace('%', ''));
            // Multiplicar por 100
            const multipliedValue = numericValue * 100;

            // Formatar o valor sem casas decimais se terminar em .00
            const formattedValue = Number.isInteger(multipliedValue)
              ? `${Math.round(multipliedValue)}%`
              : `${multipliedValue.toFixed(2)}%`;

            return {
              ...item,
              subtitle: 'do total de pessoas vivendo fora da vizinhança de praças',
              value: formattedValue
            };
          });

          this.cardData = processedData;
        } else {
          console.warn('Invalid response format from parks API and processed:', processedData);
          this.cardData = null;
          this.isError = true;
        }
      } catch (error) {
        console.error('Error fetching parks data:', error);
        this.cardData = null;
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

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.heat-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}

.benefits-card-section {
  width: 100%;
}

@include breakpoint-down('tablet') {
  .heat-cards {
    gap: 16px;
  }
}

@media screen and (max-width: 760px) {
  .dashboard-section {
    flex-direction: column;
  }
}
</style>
