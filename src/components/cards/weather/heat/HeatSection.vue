<!-- urbverde-ui/src/components/cards/weather/heat/HeatSection.vue -->
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
        let data = await response.json();

        // Transformar os dados conforme solicitado
        data = data.map(item => ({
          ...item,
          title: item.title.replace(/(afetados|afetadas)/, ''),
          subtitle: 'do total de pessoas vivendo nas regiões mais quentes.'
        }));

        this.cardData = data;
      } catch (error) {
        console.error('Error fetching cards data:', error);
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
