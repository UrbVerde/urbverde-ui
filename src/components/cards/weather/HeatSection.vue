<!-- urbverde-ui/src/components/cards/weather/HeatSection.vue -->
<template>
  <div class="dashboard-section">
    <div class="heat-cards">
      <HeatCard :data="cardData"/>
    </div>

    <div class="tips-card-section">
      <TipsCard />
    </div>
  </div>
</template>

<script>
import HeatCard from './HeatCard.vue';
import TipsCard from './TipsCard.vue';

export default {
  name: 'HeatSection',

  components: {
    HeatCard,
    TipsCard
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

    async fetchData(city, year) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/heat?city=${city}&year=${year}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Global reset for box-sizing */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard-section {
  display: flex;
  flex-direction: column; /* Organiza as seções verticalmente */
  gap: 20px; /* Espaçamento entre HeatCards e TipsCard */
  margin: 20px;
}

.heat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Configura 4 colunas iguais */
  gap: 20px; /* Espaçamento entre os HeatCards */
}

.tips-card-section {
  margin-top: 20px; /* Adiciona espaçamento acima do TipsCard */
  display: flex;
  justify-content: center; /* Centraliza o TipsCard horizontalmente */
}

</style>
