<!-- urbverde-ui/src/components/cards/weather/HeatSection.vue -->
<template>
  <div class="dashboard-section">
    <div class="heat-cards">
      <SecondSectionCard :data="cardData"/>
    </div>

    <div class="tips-card-section">
      <TipsCard />
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard-section {
  display: flex;
  flex-direction: column; 
  gap: 20px; 
  margin: 20px;
}

.heat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 20px;
}

.tips-card-section {
  margin-top: 20px; 
  display: flex;
  justify-content: center; 
}

</style>
