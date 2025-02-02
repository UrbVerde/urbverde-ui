<template>
  <div class="dashboard">
    <div class="left-panel">
      <InfoParks />
    </div>
    <div class="right-panel">
      <FirstSectionCard :data="cardData" :class="first-section-card" />
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
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/square/parks?city=${this.cityCode}&year=${this.selectedYear}`);
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

  .dashboard {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    width: 100%;
  }

  .right-panel {
    display: flex;
    gap: 24px;
  }
</style>
