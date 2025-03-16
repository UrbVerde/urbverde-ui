<template>
  <div class="dashboard-section">
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
      type: Number,
      required: true
    },
    selectedYear: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      cardData: []
    };
  },

  watch: {
    cityCode: {
      handler: 'fetchDataOnChange',
      immediate: true
    },
    selectedYear: {
      handler: 'fetchDataOnChange',
      immediate: true
    }
  },

  methods: {
    fetchDataOnChange() {
      if (this.cityCode && this.selectedYear) {
        this.fetchData(this.cityCode, this.selectedYear.toString());
      }
    },

    async fetchData(city) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/square/inequality?city=${city}&year=${this.selectedYear}`);
        const data = await response.json();

        // Multiplicar os valores numéricos por 100 e atualizar os subtítulos
        const processedData = data.map(item => {
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
        console.log('Data fetched and processed:', processedData);
      } catch (error) {
        console.error('Error fetching cards data:', error);
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
  width: 100%;
  gap: 24px;
}

.heat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 24px;
  flex-wrap: wrap;
}

@include breakpoint-down('tablet') {
  .heat-cards {
    gap: 16px;
  }
}
</style>
