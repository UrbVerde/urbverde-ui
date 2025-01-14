<!-- urbverde-ui/src/components/cards/weather/HeatSection.vue -->
<template>
  <div class="dashboard">
    <HeatCard :data="cardData"/>
  </div>
</template>

<script>
import HeatCard from './HeatCard.vue';

export default {
  name: 'HeatSection',

  components: {
    HeatCard,
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

.dashboard {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  /* grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px;
  align-items: flex-start; Alinha os cards no topo */
}
</style>
