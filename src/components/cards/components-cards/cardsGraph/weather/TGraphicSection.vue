<!-- urbverde-ui/src/components/cards/weather/graphics/TGraphicSection.vue -->
<template>
  <div class="third-row">
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
          :title="selectedYearTitle"
          :data="absDifferenceData"
          :subtitle="compareText"
          :showImage="true"
        >
        </GraphicData>
      </div>
    </div>
    <pre v-if="debug">{{ debugData }}</pre>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import GraphicGenerator from './GraphicGenerator.vue';
import GraphicData from './GraphicData.vue';

export default {
  name: 'GraphicSection',

  components: {
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
    const availableYears = ref([]);
    const chartXData = ref([]);
    const chartYData = ref([]);
    const isLoading = ref(true);
    const debugData = ref({});
    const historicalAverage = ref(0);
    const selectedYearTemp = ref(0);
    const tempDifference = ref(0);
    const showHistoricalAverage = ref(true);

    // Computed property for selected year's index in the data array
    const selectedYearIndex = computed(() => chartXData.value.findIndex(year => parseInt(year) === props.selectedYear));

    // Computed properties for GraphicData component
    const selectedYearTitle = computed(() => {
      if (!props.selectedYear) {return '';}

      return `A temperatura em ${props.selectedYear} foi`;
    });

    const absDifferenceData = computed(() => `${Math.abs(tempDifference.value).toFixed(1)}°C`);

    const compareText = computed(() => tempDifference.value > 0 ? 'acima da média histórica' : 'abaixo da média histórica');

    // Keep the original comparisonText for debug purposes
    const comparisonText = computed(() => {
      if (!props.selectedYear) {return '';}

      const difference = tempDifference.value;
      const absDifference = Math.abs(difference).toFixed(1);
      const compareText = difference > 0 ? 'acima' : 'abaixo';

      return `Em ${props.selectedYear}, a temperatura média foi ${absDifference}°C ${compareText} da média histórica.`;
    });

    const chartXLabel = 'Anos';
    const chartYLabel = 'Temperatura (°C)';

    // Function to update the temperature difference based on selected year
    const updateTemperatureDifference = () => {
      const index = selectedYearIndex.value;
      if (index >= 0 && index < chartYData.value.length) {
        selectedYearTemp.value = chartYData.value[index];
        tempDifference.value = selectedYearTemp.value - historicalAverage.value;
      } else {
        selectedYearTemp.value = 0;
        tempDifference.value = 0;
      }

      // Update debug data
      debugData.value = {
        years: chartXData.value,
        temperatures: chartYData.value,
        historicalAverage: historicalAverage.value,
        selectedYear: props.selectedYear,
        selectedYearIndex: selectedYearIndex.value,
        selectedYearTemp: selectedYearTemp.value,
        tempDifference: tempDifference.value
      };
    };

    // Ensure the data is fetched on component mount
    onMounted(async() => {
      await fetchAvailableYears();
      await fetchHistoricalData();
    });

    // Watch for changes in cityCode
    watch(() => props.cityCode, async() => {
      isLoading.value = true;
      await fetchAvailableYears();
      await fetchHistoricalData();
    });

    // Watch for changes in selectedYear
    watch(() => props.selectedYear, () => {
      updateTemperatureDifference();
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

        // Update temperature difference based on selected year
        updateTemperatureDifference();

        isLoading.value = false;
      } catch (error) {
        console.error('Error fetching historical data:', error);
        chartXData.value = [];
        chartYData.value = [];
        historicalAverage.value = 0;
        selectedYearTemp.value = 0;
        tempDifference.value = 0;
        isLoading.value = false;
      }
    };

    return {
      nm_mun,
      availableYears,
      chartXData,
      chartYData,
      chartXLabel,
      chartYLabel,
      isLoading,
      debugData,
      showHistoricalAverage,
      historicalAverage,
      selectedYearTemp,
      tempDifference,
      comparisonText,
      selectedYearTitle,
      absDifferenceData,
      compareText
    };
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

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
  width: 66.66%;
  position: relative;
}

.small-card {
  width: 33.33%;
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
  .cards-container {
    gap: 16px;
  }
}

@media (max-width: 700px) {
  .cards-container {
    flex-direction: column;
  }

  .large-card,
  .small-card {
    width: 100%;
    min-height: auto;
  }
}
</style>
