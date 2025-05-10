<template>
  <CardBase>
    <CardTitle
      :title="title"
      :subtitle="titleSubtitle"
      :showSubtitle="showTitleSubtitle"
      :showRightIcon="showTitleRightIcon"
      :showLeftIcon="showTitleLeftIcon"
      :rightIconClass="titleRightIconClass"
      :leftIconClass="titleLeftIconClass"
    />

    <div class="content-wrapper">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="isEmpty" class="empty-state">
        <p class="empty-message">Nenhum dado disponível</p>
      </div>

      <!-- Content State -->
      <template v-else>
        <component
          :is="customContent || NumberInsideCards"
          v-if="!customContent"
          :value="numberValue"
          :unit="numberUnit"
          :type="numberType"
          :subtitle="numberSubtitle"
        />
        <slot v-else></slot>

        <div v-if="showCardSubtitle" class="subtitle-wrapper">
          <p class="subtitle">{{ cardSubtitle }}</p>
        </div>
      </template>
    </div>
  </CardBase>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import CardBase from './cardBase.vue';
import CardTitle from './cardTitle.vue';
import NumberInsideCards from './numberInsideCards.vue';

const props = defineProps({
  // CardTitle Props
  showTitleSubtitle: {
    type: Boolean,
    default: false
  },
  showTitleRightIcon: {
    type: Boolean,
    default: false
  },
  showTitleLeftIcon: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  titleSubtitle: {
    type: String,
    default: ''
  },
  titleRightIconClass: {
    type: String,
    default: 'bi bi-stars'
  },
  titleLeftIconClass: {
    type: String,
    default: 'bi bi-stars'
  },

  // numberInsideCards Props
  numberValue: {
    type: [Number, String],
    default: null
  },
  numberUnit: {
    type: String,
    default: ''
  },
  numberType: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'composed'].includes(value)
  },
  numberSubtitle: {
    type: String,
    default: ''
  },

  // Card Subtitle Props
  showCardSubtitle: {
    type: Boolean,
    default: true
  },
  cardSubtitle: {
    type: String,
    default: ''
  },

  // Custom Content
  customContent: {
    type: [String, Object],
    default: null
  },

  // API Props
  apiUrl: {
    type: String,
    default: ''
  },
  cityCode: {
    type: [Number, String],
    required: true
  },
  selectedYear: {
    type: [Number, String],
    required: true
  },
  additionalParams: {
    type: Object,
    default: () => ({})
  },
  transformData: {
    type: Function,
    default: (data) => data
  }
});

// States
const isLoading = ref(false);
const error = ref(null);
const apiData = ref(null);

// Computed
const isEmpty = computed(() => {
  if (!apiData.value) {return true;}
  if (Array.isArray(apiData.value)) {return apiData.value.length === 0;}

  return Object.keys(apiData.value).length === 0;
});

// Computed para combinar os parâmetros padrão com os adicionais
const apiParams = computed(() => ({
  city: props.cityCode,
  year: props.selectedYear,
  ...props.additionalParams
}));

// Methods
const fetchData = async() => {
  if (!props.apiUrl) {return;}

  isLoading.value = true;
  error.value = null;

  try {
    const queryParams = new URLSearchParams(apiParams.value).toString();
    const url = `${props.apiUrl}${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) {throw new Error('Erro ao buscar dados');}

    const data = await response.json();
    apiData.value = props.transformData(data);
  } catch (err) {
    error.value = err.message || 'Erro ao carregar dados';
    console.error('Error fetching data:', err);
  } finally {
    isLoading.value = false;
  }
};

// Watch for API params changes
watch(
  () => apiParams.value,
  () => fetchData(),
  { deep: true, immediate: true }
);

// Watch for API URL changes
watch(
  () => props.apiUrl,
  () => fetchData(),
  { immediate: true }
);
</script>

<style scoped lang="scss">
.content-wrapper {
    display: flex;
    padding-bottom: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
}

.subtitle-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1 0 0;
}

.subtitle {
    color: map-get($gray, 550);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin: 0;
}

.loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100px;
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid map-get($gray, 200);
    border-top-color: map-get($green, 500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.error-state, .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100px;
    color: map-get($gray, 550);
    font-family: Inter;
    font-size: 14px;
}

.error-message {
    color: map-get($red, 500);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
