<!-- urbverde-ui/src/components/cards/weather/temperatur/TemperatureSection.vue -->
<template>
  <div class="dashboard">
    <div class="left-panel">
      <InfoTemperature />
    </div>
    <div class="right-panel">
      <FirstSectionCard :data="cardData" :class="temperature-card" />
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

  data() {
    return {
      cardData: []
    };
  },

  watch: {

    cityCode: {
      handler: 'fetchData',
      immediate: true
    },
    selectedYear: {
      handler: 'fetchData',
      immediate: true
    }
  },

  methods: {
    async fetchData() {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${this.cityCode}&year=${this.selectedYear}`);
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

.dashboard {

  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;

}

.right-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.temperature-card {

  background-color: #f0f0f0;
  padding: 20px;
}
</style>
