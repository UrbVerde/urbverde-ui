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

  </div>
</template>

<script>
import InfoTemperature from './InfoTemperature.vue';
import FirstSectionCard from '../../FirstSectionCard.vue';

import { useLocationStore } from '@/stores/locationStore';
import { computed, ref, onMounted, watch } from 'vue';

export default {
  name: 'TemperatureSection',

  components: {
    InfoTemperature,
    FirstSectionCard,

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

    const firstTwoCards = computed(() => cardData.value.slice(0, 2));
    const lastTwoCards = computed(() => cardData.value.slice(2, 4));

    // Watch for changes in selectedYear
    watch(() => props.selectedYear, async() => {
      if (props.selectedYear) {
        await fetchData();
      }
    }, { immediate: true });

    // Ensure the data is fetched on component mount
    onMounted(async() => {
      if (props.selectedYear) {
        await fetchData();
      }
    });

    const fetchData = async() => {
      if (!props.selectedYear) {
        return;
      }

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${props.cityCode}&year=${props.selectedYear}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          // Add the subtitle to the "Nível de ilha de calor" card
          const processedData = data.map(card => {
            if (card.title === 'Nível de ilha de calor') {
              return {
                ...card,
                subtitle: 'Conta o número de crianças e idosos morando em áreas mais quentes. Quanto maior, maior a vulnerabilidade.'
              };
            }

            return card;
          });

          cardData.value = processedData;
        } else {
          console.error('Unexpected data format for card data:', data);
          cardData.value = [];
        }
      } catch (error) {
        console.error('Error fetching cards data:', error);
        cardData.value = [];
      }
    };

    return {
      nm_mun,
      cardData,
      firstTwoCards,
      lastTwoCards,
      fetchData
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

@include breakpoint-down('tablet') {
  .right-wrapper {
    gap: 16px;
  }

  .top,
  .bottom {
    gap: 16px;
  }
}

@media (max-width: 700px) {
  .left-panel,
  .right-wrapper {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
