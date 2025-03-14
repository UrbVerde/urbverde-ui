<!-- urbverde-ui/src/components/cards/weather/temperatur/TemperatureSection.vue -->
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
      <span class="title-statistics-container heading-h5">
        Temperatura média em {{nm_mun}} ao longo do tempo
      </span>

      <div class="cards-container">
        <div class="large-card">
          <div v-if="isLoading" class="loading-indicator">Carregando dados...</div>
          <GraphicGenerator
            v-else
            :data="[{title: `Gáfico temperatura média ao longo dos anos`, subtitle: '', value: ''}]"
            :xData="chartXData"
            :yData="chartYData"
            :xLabel="chartXLabel"
            :yLabel="chartYLabel"
            dataType="Temperatura média"
            :showAverage="showHistoricalAverage"
          />
        </div>
        <div class="small-card">
          <GraphicData
            :title="lastYearTitle"
            :data="absDifferenceData"
            :subtitle="compareText"
            :showImage="true"
          >
          </GraphicData>
        </div>
      </div>
      <pre v-if="debug">{{ debugData }}</pre>
    </div>
  </div>
</template>

<script>
import InfoTemperature from './InfoTemperature.vue';
import FirstSectionCard from '../../FirstSectionCard.vue';
import { useLocationStore } from '@/stores/locationStore';
import { computed, ref, onMounted, watch } from 'vue';
import GraphicGenerator from './GraphicGenerator.vue';
import GraphicData from './GraphicData.vue';

export default {
  name: 'TemperatureSection',

  components: {
    InfoTemperature,
    FirstSectionCard,
    GraphicGenerator,
    GraphicData,
  },

  props: {
    cityCode: {
      type: Number,
      required: true
    },
    selectedYear: {
      type: Number,
      required: true
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
    const chartXData = ref([]);
    const chartYData = ref([]);
    const isLoading = ref(true);
    const debugData = ref({});
    const historicalAverage = ref(0);
    const lastYearTemp = ref(0);
    const tempDifference = ref(0);

    const firstTwoCards = computed(() => cardData.value.slice(0, 2));
    const lastTwoCards = computed(() => cardData.value.slice(2, 4));

    // Computed properties for GraphicData component
    const lastYear = computed(() => {
      if (availableYears.value.length === 0) {return '';}

      return availableYears.value[availableYears.value.length - 1];
    });

    const lastYearTitle = computed(() => {
      if (!lastYear.value) {return '';}

      return `A temperatura em ${lastYear.value} foi`;
    });

    const absDifferenceData = computed(() => `${Math.abs(tempDifference.value).toFixed(1)}°C`);

    const compareText = computed(() => tempDifference.value > 0 ? 'acima da média histórica' : 'abaixo da média histórica');

    // Keep the original comparisonText for debug purposes
    const comparisonText = computed(() => {
      if (availableYears.value.length === 0) {return '';}

      const lastYear = availableYears.value[availableYears.value.length - 1];
      const difference = tempDifference.value;
      const absDifference = Math.abs(difference).toFixed(1);
      const compareText = difference > 0 ? 'acima' : 'abaixo';

      return `Em ${lastYear}, a temperatura média foi ${absDifference}°C ${compareText} da média histórica.`;
    });

    const chartXLabel = 'Anos';
    const chartYLabel = 'Temperatura (°C)';
    const showHistoricalAverage = ref(true);

    // This onMounted hook is replaced by the one below with fetchData included

    // Watch for changes in cityCode
    watch(() => props.cityCode, async() => {
      isLoading.value = true;
      await fetchAvailableYears();
      await fetchHistoricalData();
    });

    // Watch for changes in selectedYear - similar to HeatSection implementation
    watch(() => props.selectedYear, async() => {
      if (props.selectedYear) {
        await fetchData();
      }
    }, { immediate: true });

    // Ensure the data is fetched on component mount
    onMounted(async() => {
      await fetchAvailableYears();
      if (props.selectedYear) {
        await fetchData();
      }
      await fetchHistoricalData();
    });

    const fetchAvailableYears = async() => {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${props.cityCode}`);
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
      if (!props.selectedYear) {
        return;
      }

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${props.cityCode}&year=${props.selectedYear}`);
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

        // Calculate historical average
        const validTemps = chartYData.value.filter(temp => temp !== null);
        historicalAverage.value = validTemps.length > 0 ?
          validTemps.reduce((sum, temp) => sum + temp, 0) / validTemps.length : 0;

        // Get the last year's temperature
        if (validTemps.length > 0) {
          lastYearTemp.value = validTemps[validTemps.length - 1];
          tempDifference.value = lastYearTemp.value - historicalAverage.value;
        }

        // For debugging
        debugData.value = {
          years: chartXData.value,
          temperatures: chartYData.value,
          historicalAverage: historicalAverage.value,
          lastYearTemp: lastYearTemp.value,
          tempDifference: tempDifference.value,
          rawTemperatureData: temperatureData
        };

        isLoading.value = false;
      } catch (error) {
        console.error('Error fetching historical data:', error);
        chartXData.value = [];
        chartYData.value = [];
        historicalAverage.value = 0;
        lastYearTemp.value = 0;
        tempDifference.value = 0;
        isLoading.value = false;
      }
    };

    return {
      nm_mun,
      cardData,
      availableYears,
      firstTwoCards,
      lastTwoCards,
      chartXData,
      chartYData,
      chartXLabel,
      chartYLabel,
      fetchData,
      isLoading,
      debugData,
      showHistoricalAverage,
      historicalAverage,
      lastYearTemp,
      tempDifference,
      comparisonText,
      lastYear,
      lastYearTitle,
      absDifferenceData,
      compareText
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
.bottom {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  flex-wrap: wrap;
}

.temperature-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
}

.third-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
}

.title-statistics-container {
  width: 100%;
  margin-bottom: 8px;
}

.cards-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
}

.large-card {
  width: 66.66%; /* Exatamente 2/3 */
  min-height: 300px;
  position: relative;
}

.small-card {
  width: 33.33%; /* Exatamente 1/3 */
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
  .bottom {
    gap: 16px;
  }

  .cards-container {
    gap: 16px;
  }
}

@media (max-width: 700px) {
  .left-panel,
  .right-wrapper {
    flex-basis: 100%;
    max-width: 100%;
  }

  .cards-container {
    flex-direction: column;
  }

  .large-card,
  .small-card {
    width: 100%;
  }
}
</style>
