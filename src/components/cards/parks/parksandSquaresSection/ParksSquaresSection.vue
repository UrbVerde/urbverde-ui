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
        this.cardData = data;
      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    }
  }
};
</script>

  <style scoped lang="scss">

  .dashboard-section {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 24px;
  }

  .heat-cards {
    display: flex;
    gap: 24px;
    width: 100%;
    height: auto;
  }

  </style>
