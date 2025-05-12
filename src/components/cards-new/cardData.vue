<template>
  <CardBase
    :showInfoButton="showInfoButton"
    :modalTitle="modalTitle"
    :modalBodyText="modalBodyText"
  >
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
          <p class="subtitle body-small-regular">{{ cardSubtitle }}</p>
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
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

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
    if (!response.ok) {throw new Error();}

    const data = await response.json();
    apiData.value = props.transformData(data);
  } catch (err) {
    error.value = true;
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
p {
    margin: 0;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    height: 100%;
}

.subtitle-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.subtitle {
    color: map-get($gray, 550);
}

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
</style>
