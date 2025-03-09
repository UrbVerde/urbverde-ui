<!-- urbverde-ui/src/components/cards/vegetation/inequality/InequalitySection.vue -->
<template>
  <div class="dashboard-section">
    <div class="info-cards">
      <FirstSectionCard :data="cardData"/>
    </div>
    <div class="benefits-card-section">
      <BenefitsCard />
    </div>
  </div>
</template>

<script>
import FirstSectionCard from '../../FirstSectionCard.vue';
import BenefitsCard from './BenefitsCard.vue';

export default {
  name: 'InequalitySection',

  components: {
    FirstSectionCard,
    BenefitsCard
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
        const response = await fetch(`https:/api.urbverde.com.br/v1/cards/vegetal/inequality?city=${city}&year=${year}`);
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
  @import '@/assets/styles/breakpoints.scss';

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.info-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  flex-grow: 1;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
}

.benefits-card-section {
  display: flex;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
}

.benefits-card-section > * {
  flex: 1;
  max-width: 100%;
}

@include breakpoint-down('tablet') {
  .info-cards {
    gap: 16px;
  }
}

</style>
