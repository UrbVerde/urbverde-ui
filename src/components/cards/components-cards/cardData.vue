<template>
  <CardBase
    :showInfoButton="showInfoButton"
    :modalTitle="modalTitle"
    :modalBodyText="modalBodyText"
  >
    <!-- Image at the top -->
    <template v-if="showImage">
      <img :src="imageSrc" alt="Ilustração" class="card-image" />
    </template>

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
          <div class="empty-button-container">
            <PrimaryButton
              class="empty-button"
              label="Colaborar com dados"
              :filled="false"
              icon="bi bi-arrow-right"
              iconPosition="right"
            />
          </div>
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

        <!-- Primary Button -->
        <div v-if="showButtonPrimary" class="button-wrapper">
          <CardPrimaryButton
            :cityCode="cityCode"
            :changeToCategory="changeToCategory"
            :changeToLayerId="changeToLayerId"
            :layerTitle="title"
          />
        </div>
      </template>
    </div>
  </CardBase>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import CardBase from '../base/cardBase.vue';
import CardTitle from '../base/cardTitle.vue';
import NumberInsideCards from '../base/numberInsideCards.vue';
import CardPrimaryButton from '../base/cardPrimaryButton.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

const props = defineProps({
  // Image props
  showImage: {
    type: Boolean,
    default: false
  },
  imageSrc: {
    type: [String, Object],
    default: ''
  },

  // API Configuration
  apiEndpoint: {
    type: String,
    required: true
  },
  requiresYear: {
    type: Boolean,
    default: true
  },
  cardIndex: {
    type: Number,
    default: 0
  },
  cityCode: {
    type: [Number, String],
    required: true
  },
  year: {
    type: [Number, String],
    required: true
  },
  dataTransform: {
    type: Function,
    default: (data) => data
  },

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
  overrideTitle: { // Se ficar vazio, o title será buscado na API
    type: String,
    default: ''
  },
  overrideTitleSubtitle: { //Se ficar vazio, o subtitle será buscado na API
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
  overrideNumberValue: { // Se ficar vazio, o value será buscado na API
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
  overrideCardSubtitle: { // Se ficar vazio, o subtitle será buscado na API
    type: String,
    default: ''
  },

  // Custom Content
  customContent: {
    type: [String, Object],
    default: null
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
  },

  // Primary Button Props
  showButtonPrimary: {
    type: Boolean,
    default: false
  },
  changeToCategory: {
    type: String,
    default: ''
  },
  changeToLayerId: {
    type: String,
    default: ''
  }
});

// States
const isLoading = ref(false);
const error = ref(null);
const cardData = ref(null);

// Computed properties for card display
const title = computed(() => props.overrideTitle || cardData.value?.title || '');
const titleSubtitle = computed(() => props.overrideTitleSubtitle || cardData.value?.subtitle || '');
const numberValue = computed(() => props.overrideNumberValue || cardData.value?.value || '');
const cardSubtitle = computed(() => props.overrideCardSubtitle || cardData.value?.subtitle || '');
const showCardSubtitle = computed(() => !!cardSubtitle.value);
const isEmpty = computed(() => !isLoading.value && !error.value && !cardData.value);

// Fetch data from API
const fetchData = async() => {
  if (!props.apiEndpoint || !props.cityCode) {
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const url = new URL(props.apiEndpoint);
    url.searchParams.append('city', props.cityCode);

    if (props.requiresYear && props.year) {
      url.searchParams.append('year', props.year);
    }

    const response = await axios.get(url.toString());
    const data = response.data;

    if (Array.isArray(data) && data.length > 0) {
      // Apply data transform if provided
      const transformedData = props.dataTransform(data);

      // Get the specific card data based on index
      cardData.value = Array.isArray(transformedData)
        ? transformedData[props.cardIndex]
        : transformedData;
    } else {
      cardData.value = null;
    }
  } catch (err) {
    error.value = err;
    cardData.value = null;
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in props that should trigger a refetch
watch(
  [() => props.cityCode, () => props.year, () => props.apiEndpoint],
  () => {
    fetchData();
  },
  { immediate: false }
);

// Watch specifically for year changes
watch(
  () => props.year,
  () => {
    fetchData();
  }
);

// Initial fetch
onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
p {
    margin: 0;
}

.card-image {
    display: flex;
    width: 100%;
    height: auto;
    padding-bottom: 24px;
    max-width: 180px;
    margin: 0 auto;
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

.button-container {
    display: flex;
    width: 100%;
    margin-top: 16px;
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

.empty-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.empty-button-container :deep(.primary-button) {
    width: auto;
    margin: auto;
    border: none;
}

.button-wrapper {
    display: flex;
    width: 100%;
    margin-top: 0px !important;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
