<!-- urbverde-ui/src/components/cards/weather/TemperatureSection.vue -->
<template>
  <div class="dashboard">
    <InfoVegetation class="info-card" />
    <FieldCard  v-if="firstCardData" :data="firstCardData" class="area-card" />
    <div class="right-panel">
      <FirstSectionCard :data="remainingCardData" :class="first-section-card" />
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
      firstCardData: null,  // Define corretamente as variáveis
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
          // Mapeia os dados para o formato esperado
          this.firstCardData = {
            title: data[0].title || 'Área Vegetal', // Exemplo de campo
            value: data[0].value?.toString() || '0', // Exemplo de campo
            subtitle: data[0].subtitle || 'Descrição padrão', // Exemplo de campo
          };
          this.remainingCardData = data.slice(1); // Restante para os outros cards
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
  * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
  }

  .dashboard {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      align-items: flex-start;
  }

  .info-card {
      grid-column: 1;
  }

  .area-card {
      grid-column: 2;
  }

  .right-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      grid-column: 3;
  }

  .first-section-card {
      background-color: #fff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
