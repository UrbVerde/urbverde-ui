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
    display: flex;
    flex-wrap: wrap;
  }

  .heat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .benefits-card-section {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  </style>
