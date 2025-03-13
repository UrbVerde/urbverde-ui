<template>
  <div class="dashboard">
    <div class="left-panel">
      <InfoTemperature />
    </div>
    <div class="right-wrapper">
      <div class="top">
        <FirstSectionCard
          v-for="(card, index) in firstTwoCards"
          :key="index"
          :data="[card]"
          class="temperature-card"
        />
      </div>
      <div class="bottom">
        <FirstSectionCard
          v-for="(card, index) in lastTwoCards"
          :key="index"
          :data="[card]"
          class="temperature-card"
        />
      </div>
    </div>
    <div class="third-row">
      <div class="large-card">
        <div v-if="isLoading" class="loading-indicator">Carregando dados...</div>
        <GraphicGenerator
          v-else
          :data="[{title: `Temperatura média em ${nm_mun} ao longo do tempo`, subtitle: '', value: ''}]"
          :xData="chartXData"
          :yData="chartYData"
          :xLabel="chartXLabel"
          :yLabel="chartYLabel"
          class="temperature-card"
          dataType="Temperatura média"
          :showAverage="showHistoricalAverage"
        />
      </div>
      <div class="small-card">
        <FirstSectionCard
          :data="[{title: yearSelectorTitle, subtitle: '', value: ''}]"
          class="temperature-card"
        >
          <div class="year-selector">
            <select v-model="selectedYear" class="year-dropdown" @change="fetchData">
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </FirstSectionCard>
      </div>
    </div>
    <pre v-if="debug">{{ debugData }}</pre>
  </div>
</template>

<script>
import InfoTemperature from './InfoTemperature.vue';
import FirstSectionCard from '../../FirstSectionCard.vue';
import { useLocationStore } from '@/stores/locationStore';
import { computed, ref, onMounted, watch } from 'vue';
import GraphicGenerator from './GraphicGenerator.vue';

export default {
  components: {
    InfoTemperature,
    FirstSectionCard,
    GraphicGenerator,
  },

  props: {
    cityCode: {
      type: Number,
      required: true
    },
    selectedYearProp: {
      type: Number,
      default: null
    },
    debug: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const locationStore = useLocationStore();
    const nm_mun = computed(() => locationStore.nm_mun || '?');
    const cardData = ref([]);
    const availableYears = ref([]);
    const selectedYear = ref(null);
    const chartXData = ref([]);
    const chartYData = ref([]);
    const yearSelectorTitle = ref('Selecione o ano');
    const isLoading = ref(true);
    const debugData = ref({});

    const firstTwoCards = computed(() => cardData.value.slice(0, 2));
    const lastTwoCards = computed(() => cardData.value.slice(2, 4));

    const chartXLabel = 'Anos';
    const chartYLabel = 'Temperatura (°C)';
    const showHistoricalAverage = ref(true);

    onMounted(async() => {
      await fetchAvailableYears();
      if (availableYears.value.length > 0) {
        selectedYear.value = props.selectedYearProp || availableYears.value[availableYears.value.length - 1];
        await fetchData();
      }
      await fetchHistoricalData();
    });

    watch(() => props.cityCode, async() => {
      isLoading.value = true;
      await fetchAvailableYears();
      if (availableYears.value.length > 0) {
        selectedYear.value = props.selectedYearProp || availableYears.value[availableYears.value.length - 1];
        await fetchData();
      }
      await fetchHistoricalData();
    });

    const fetchAvailableYears = async() => {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${props.cityCode}`);
        alert(props.cityCode);
        const data = await response.json();
        if (Array.isArray(data)) {
          availableYears.value = data.sort((a, b) => a - b);
        } else {
          console.error('Unexpected data format for available years:', data);
          availableYears.value = [];
        }
      } catch (error) {
        console.error('Error fetching available years:', error);
        availableYears.value = [];
      }

    };

    const fetchData = async() => {
      if (!selectedYear.value) {return;}

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${props.cityCode}&year=${selectedYear.value}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          cardData.value = data;
        } else {
          console.error('Unexpected data format for card data:', data);
          cardData.value = [];
        }
      } catch (error) {
        console.error('Error fetching cards data:', error);
        cardData.value = [];
      }
    };

    const fetchHistoricalData = async() => {
      isLoading.value = true;
      try {
        const years = availableYears.value;
        if (!years.length) {
          isLoading.value = false;

          return;
        }

        // Set x-axis data directly from available years
        chartXData.value = years.map(year => year.toString());

        // Fetch temperature data for each year
        const temperaturePromises = years.map(year =>
          fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${props.cityCode}&year=${year}`)
            .then(response => response.json())
            .catch(error => {
              console.error(`Error fetching data for year ${year}:`, error);

              return null;
            })
        );

        const temperatureData = await Promise.all(temperaturePromises);

        // Extract average surface temperature from each year's data
        const temps = temperatureData.map((yearData, index) => {
          if (!yearData || !Array.isArray(yearData)) {
            console.error(`Invalid data for year ${years[index]}:`, yearData);

            return null;
          }

          const tempCard = yearData.find(card => card.title === 'Temperatura média da superfície');
          if (tempCard && tempCard.value) {
            // Extract number from string like "30°C"
            const tempValue = tempCard.value.replace(/[^\d.]/g, '');

            return parseFloat(tempValue) || null;
          }

          return null;
        });

        chartYData.value = temps;

        // For debugging
        debugData.value = {
          years: chartXData.value,
          temperatures: chartYData.value,
          rawTemperatureData: temperatureData
        };

        isLoading.value = false;
      } catch (error) {
        console.error('Error fetching historical data:', error);
        chartXData.value = [];
        chartYData.value = [];
        isLoading.value = false;
      }
    };

    return {
      nm_mun,
      cardData,
      selectedYear,
      availableYears,
      firstTwoCards,
      lastTwoCards,
      chartXData,
      chartYData,
      chartXLabel,
      chartYLabel,
      yearSelectorTitle,
      fetchData,
      isLoading,
      debugData,
      showHistoricalAverage
    };
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.dashboard {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
  flex-wrap: wrap;
}

.left-panel {
  flex: 0 1 40%;
  display: flex;
}

.right-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
}

.top,
.bottom,
.third-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  flex-wrap: wrap;
}

.temperature-card {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
}

.third-row {
  width: 100%;
}

.large-card {
  flex: 2;
  min-height: 300px;
  position: relative;
}

.small-card {
  flex: 1;
}

.year-selector {
  margin-top: 16px;
  width: 100%;
}

.year-dropdown {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  outline: none;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 18px;
  color: #666;
}

@include breakpoint-down('tablet') {
  .right-wrapper {
    gap: 16px;
  }

  .top,
  .bottom,
  .third-row {
    gap: 16px;
  }
}

@media (max-width: 700px) {
  .left-panel,
  .right-wrapper {
    flex-basis: 100%;
    max-width: 100%;
  }

  .large-card,
  .small-card {
    flex-basis: 100%;
  }
}
</style>
