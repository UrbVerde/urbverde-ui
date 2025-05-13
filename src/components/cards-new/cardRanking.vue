<template>
  <CardBase
    :showInfoButton="showInfoButton"
    :modalTitle="modalTitle"
    :modalBodyText="modalBodyText"
  >
    <div class="rank-card-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-content">
          <img src="@/assets/images/cards/not-found-info.svg" alt="Error" class="error-image" />
          <p class="error-subtitle body-small-regular">Ocorreu um erro ao carregar os dados</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="isEmpty" class="empty-state">
        <div class="empty-content">
          <div class="empty-info">
            <img src="@/assets/images/cards/error-info.svg" alt="Information Not Found" class="empty-image" />
            <span class="empty-message body-small-regular">Ops, ainda não temos esses dados!</span>
          </div>
          <PrimaryButton
            label="Colaborar com dados"
            :filled="false"
            icon="bi bi-arrow-right"
            iconPosition="right"
          />
        </div>
      </div>

      <!-- Content State -->
      <template v-else>
        <div class="rank-card-header">
          <h3 class="rank-card-title heading-h5">{{ cardData?.title }}</h3>
          <p class="rank-card-subtitle body-small-medium">{{ cardData?.subtitle }}</p>
        </div>

        <div v-if="cardData?.items && cardData.items.length > 0" class="rank-card-sections">
          <div class="rank-card-section" v-for="(item, index) in cardData.items" :key="index">
            <div class="rank-card-section-title">
              {{ item.type }}
            </div>
            <div class="rank-card-section-value">
              <span class="rank-card-number" :class="rankingClass(item)">
                {{ item.number }}</span>
              <span class="rank-card-separator"> de </span>
              <span class="rank-card-total">{{ item.of }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </CardBase>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import CardBase from './cards-aux/cardBase.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import { useCardData } from '@/utils/useCardData';

const props = defineProps({
  // API Configuration
  apiEndpoint: {
    type: String,
    required: true
  },
  requiresYear: {
    type: Boolean,
    default: true
  },
  cityCode: {
    type: [Number, String],
    default: null
  },
  year: {
    type: [Number, String],
    default: null
  },
  dataTransform: {
    type: Function,
    default: (data) => data
  },
  rankingIndex: {
    type: Number,
    default: 0
  },

  // Modal Props
  showInfoButton: {
    type: Boolean,
    default: false
  },
  modalTitle: {
    type: String,
    default: 'Informações'
  },
  modalBodyText: {
    type: String,
    default: ''
  }
});

// Get injected values
const { injectedCityCode, injectedSelectedYear } = useCardData();

// Computed for actual values to use
const actualCityCode = computed(() => props.cityCode ?? injectedCityCode.value);
const actualYear = computed(() => props.year ?? injectedSelectedYear.value);

// States
const isLoading = ref(false);
const error = ref(null);
const cardData = ref(null);

// Computed properties
const isEmpty = computed(() => !isLoading.value && !error.value && !cardData.value);

// Methods
const rankingClass = (item) => {
  const percentile = (item.number / item.of) * 100;
  if (percentile <= 25) {
    return 'group-top';
  } else if (percentile <= 75) {
    return 'group-middle';
  } else {
    return 'group-bottom';
  }
};

// Fetch data from API
const fetchData = async() => {
  if (!props.apiEndpoint || !actualCityCode.value) {return;}

  isLoading.value = true;
  error.value = null;

  try {
    const url = new URL(props.apiEndpoint);
    url.searchParams.append('city', actualCityCode.value);

    if (props.requiresYear && actualYear.value) {
      url.searchParams.append('year', actualYear.value);
    }

    const response = await axios.get(url.toString());
    const data = response.data;

    if (data && Array.isArray(data) && data.length > 0) {
      // Get the specific ranking based on index
      const selectedRanking = data[props.rankingIndex];
      // Apply data transform if provided
      cardData.value = props.dataTransform(selectedRanking);
    } else {
      cardData.value = null;
    }
  } catch (err) {
    console.error('Error fetching card data:', err);
    error.value = err;
    cardData.value = null;
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in props that should trigger a refetch
watch(
  [() => actualCityCode.value, () => actualYear.value, () => props.apiEndpoint],
  () => {
    fetchData();
  },
  { immediate: false }
);

// Initial fetch
onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

h3,
p {
  margin: 0;
}

.rank-card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
}

.rank-card-header {
  display: flex;
  flex-direction: column;
  padding: 0 24px 16px 32px;
  gap: 12px;
  align-self: stretch;
}

.rank-card-section-title {
  text-align: left;
  align-self: stretch;
  color: var(--Body-Text-Body-Color, #212529);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
}

.rank-card-subtitle {
  color: var(--Gray-600, #6C757D);
  align-self: stretch
}

.rank-card-sections {
  display: flex;
  padding: 16px 32px 40px 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
}

.rank-card-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

.rank-card-section-value {
  display: flex;
  align-items: center;
  align-self: stretch;
  flex: 1 0 0;
}

.rank-card-number {
  color: var(--Green-500, #198754);
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: Montserrat;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
}

.rank-card-number::after {
  content: "o";
  margin-left: 2px;
  font-weight: bold;
  font-size: 40%;
  vertical-align: super;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  display: inline-block;
  text-align: center;
  position: relative;
  top: -5px;
}

.rank-card-separator {
  color: var(--Green-500, #198754);
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  margin-left: 5px;
  margin-right: 5px;
}

.rank-card-total {
  color: var(--Green-500, #198754);
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
}

/* Color classes for the three ranking groups */
.group-top {
  color: #198754;
}

.group-middle {
  color: #198754;
}

.group-bottom {
  color: #198754;
}

/* Loading, Error and Empty States */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 6px solid map-get($gray, 200);
  border-top-color: map-get($green, 500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-state, .empty-state {
  width: 100%;
  height: 100%;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  align-self: stretch;
  height: 100%;
}

.error-image {
  max-width: 88px;
  max-height: 88px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.error-subtitle {
  color: map-get($gray, 550);
  text-align: center;
  margin: 0;
}

.empty-content {
  display: flex;
  padding: 16px 0 0 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
  height: 100%;
}

.empty-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  height: 100%;
  justify-content: center;
}

.empty-image {
  max-width: 127px;
  max-height: 88px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.empty-message {
  color: map-get($gray, 550);
  text-align: center;
  line-height: 150%;
}

:deep(.primary-button) {
  width: auto;
  margin: auto;
  border: none;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@include breakpoint-down('tablet') {
  .rank-card-title {
    font-size: 16px;
  }

  .rank-card-section-title {
    font-size: 14px;
  }
}
</style>
