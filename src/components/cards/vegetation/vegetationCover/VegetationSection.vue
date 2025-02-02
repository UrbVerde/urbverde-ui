<template>
  <div class="dashboard">
    <InfoVegetation class="vegetation-info" />
    <FieldCard v-if="firstCardData" :data="firstCardData" class="vegetation-field" />
    <div class="right-panel">
      <FirstSectionCard :data="remainingCardData" class="section-card" />
    </div>
  </div>
</template>

<script>

import FirstSectionCard from '../../FirstSectionCard.vue';
import InfoVegetation from './InfoVegetation.vue';
import FieldCard from './FieldCard.vue';

export default {
  components: {
    FirstSectionCard,
    InfoVegetation,
    FieldCard
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
      firstCardData: null,
      remainingCardData: []
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
        const response = await fetch(
          `https://api.urbverde.com.br/v1/cards/vegetal/cover?city=${this.cityCode}&year=${this.selectedYear}`
        );
        const data = await response.json();
        if (data.length > 0) {
          this.firstCardData = {
            title: data[0].title || 'Área Vegetal',
            value: data[0].value?.toString() || '0',
            subtitle: data[0].subtitle || 'Descrição padrão',
          };
          this.remainingCardData = data.slice(1);
        } else {
          this.firstCardData = null;
          this.remainingCardData = [];
        }
      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
}

.vegetation-info {
    display: flex;
    max-width: 400px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.vegetation-field {
    display: flex;
    max-width: 400px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.right-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    flex: 1 0 0;
    align-self: stretch;
}

.section-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
