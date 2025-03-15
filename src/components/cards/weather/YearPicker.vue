<!-- urbverde-ui/src/components/cards/weather/YearPicker.vue -->
<template>
  <div class="date-picker">
    <div class="input-wrapper">
      <span
        class="nav-button"
        @click="navigateYear(-1)"
        :class="{
          'disabled': !canNavigateBack,
          'invisible': !canNavigateBack
        }"
      >
        <i class="bi bi-chevron-left"></i>
      </span>

      <div
        class="input-container"
        :class="{ 'year-modified': yearModified }"
        @click="showYearSelector"
      >
        <input
          class="input-text body-small-regular"
          :value="formattedYear"
          @focus="showYearSelector"
          placeholder=""
          readonly
        />
        <span class="icon-datepicker">
          <i class="bi bi-chevron-down" tag="icon"></i>
        </span>
      </div>

      <span
        class="nav-button"
        @click="navigateYear(1)"
        :class="{
          'disabled': !canNavigateForward,
          'invisible': !canNavigateForward
        }"
      >
        <i class="bi bi-chevron-right"></i>
      </span>
    </div>

    <Transition name="fade">
      <div v-if="isVisible" class="calendar-overlay">
        <div class="calendar card">
          <div class="card-body p-2">
            <div class="year-grid">
              <div
                v-for="year in availableYears"
                :key="year"
                class="year-item body-small-regular"
                :class="{ 'selected': isSelected(year) }"
                @click="selectYear(year)"
              >
                {{ year }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  defaultYear: {
    type: Number,
    required: true
  },
  cityCode: {
    type: Number,
    required: true
  },
  layer: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const isVisible = ref(false);
const defaultYearValue = ref(props.modelValue);
const currentYear = ref(props.modelValue);
const yearModified = ref(false);
const years = ref([]);

// Ensure the defaultYearValue is set
defaultYearValue.value = props.modelValue;

/**
 * Define fetchYears before any watcher that references it.
 */
const fetchYears = async(cityCode) => {
  try {
    let apiUrl = '';

    // Choose the API endpoint based on the layer prop.
    switch (props.layer) {
    case 'temperatura':
      apiUrl = `https://api.urbverde.com.br/v1/cards/weather/temperature?city=${cityCode}`;
      break;
    case 'vegetação':
      apiUrl = `https://api.urbverde.com.br/v1/cards/vegetal/cover?city=${cityCode}`;
      break;
    case 'parques':
      apiUrl = `https://api.urbverde.com.br/v1/cards/parks/info?city=${cityCode}`;
      break;
    default:
      apiUrl = `https://api.urbverde.com.br/v1/cards/weather/temperature?city=${cityCode}`;
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch years');
    }
    const data = await response.json();
    years.value = data;

    // After fetching years, check if the current year is valid
    // If not, set it to the default year if available in the years list,
    // otherwise set it to the most recent year available
    if (!years.value.includes(currentYear.value)) {
      if (years.value.includes(props.defaultYear)) {
        currentYear.value = props.defaultYear;
        emit('update:modelValue', props.defaultYear);
      } else if (years.value.length > 0) {
        // If default year is not available, use the most recent year
        const mostRecentYear = Math.max(...years.value);
        currentYear.value = mostRecentYear;
        emit('update:modelValue', mostRecentYear);
      }
    }
  } catch (error) {
    console.error('Error fetching years:', error);
    years.value = [];
  }
};

// Then modify the onMounted hook to ensure proper initialization
onMounted(async() => {
  // Ensure currentYear is initialized with modelValue or defaultYear
  if (!currentYear.value && props.modelValue) {
    currentYear.value = props.modelValue;
  } else if (!currentYear.value) {
    currentYear.value = props.defaultYear;
  }

  await fetchYears(props.cityCode);
});

// Then modify the onMounted hook to ensure proper initialization
onMounted(async() => {
  // Ensure currentYear is initialized with modelValue or defaultYear
  if (!currentYear.value && props.modelValue) {
    currentYear.value = props.modelValue;
  } else if (!currentYear.value) {
    currentYear.value = props.defaultYear;
  }

  await fetchYears(props.cityCode);
});

// Watch for changes in modelValue and update currentYear.
watch(
  () => props.modelValue,
  (newValue) => {
    currentYear.value = newValue;
  },
  { immediate: true }
);

// Watch for changes in cityCode and fetch new years.
watch(
  () => props.cityCode,
  async(newCityCode) => {
    await fetchYears(newCityCode);
  },
  { immediate: true }
);

// Watch currentYear to update the yearModified flag.
watch(currentYear, (newValue) => {
  yearModified.value = newValue !== defaultYearValue.value;
});

const availableYears = computed(() =>
  [...years.value].sort((a, b) => a - b)
);

const formattedYear = computed(() =>
  currentYear.value ? `Ano: ${currentYear.value}` : ''
);

const currentYearIndex = computed(() =>
  availableYears.value.indexOf(currentYear.value)
);

const canNavigateBack = computed(() => currentYearIndex.value > 0);

const canNavigateForward = computed(() =>
  currentYearIndex.value < availableYears.value.length - 1
);

const showYearSelector = () => {
  isVisible.value = true;
  document.addEventListener('click', handleClickOutside);
};

const hideYearSelector = () => {
  isVisible.value = false;
  document.removeEventListener('click', handleClickOutside);
};

const handleClickOutside = (event) => {
  const element = event.target;
  if (!element.closest('.date-picker')) {
    hideYearSelector();
  }
};

const selectYear = (year) => {
  currentYear.value = year;
  emit('update:modelValue', year);
  hideYearSelector();
};

const isSelected = (year) => year === currentYear.value;

const navigateYear = (direction) => {
  const newIndex = currentYearIndex.value + direction;
  if (newIndex >= 0 && newIndex < availableYears.value.length) {
    const newYear = availableYears.value[newIndex];
    selectYear(newYear);
  }
};

onMounted(async() => {
  await fetchYears(props.cityCode);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.date-picker {
  position: relative;
  display: inline-block;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-wrapper .nav-button {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  visibility: visible;
}

.input-wrapper:hover .nav-button:not(.invisible) {
  opacity: 1;
}

.input-container {
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--Gray-400, #CED4DA);
  background-color: white;
  max-width: 128px;
  height: 40px;
  gap: 4px;
}

.input-container.year-modified {
  outline: 2px solid #418377;
  outline-offset: -2px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  color: #6C757D;
}

.nav-button:hover:not(.disabled) {
  background-color: #f0f0f0;
}

.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.invisible {
  visibility: hidden;
}

.icon-datepicker {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.icon-datepicker i {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1px;
  color: #6C757D;
  font-size: 16px;
}

.input-text {
  border: none;
  outline: none;
  background: transparent;
  width: auto;
  min-width: 0;
  box-sizing: content-box;
  padding: 0;
  margin: 0;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 2fr);
  gap: 8px;
}

.year-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0px 8px;
  cursor: pointer;
  border-radius: 4px;
  height: 30px;
}

.year-item:hover {
  background-color: #f0f0f0;
}

.year-item.selected {
  background-color: var(--Green-500, #198754);
  color: white;
}

.calendar-overlay {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  margin-top: 5px;
  border-radius: 7px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendar {
  min-width: 200px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@include breakpoint-down('tablet') {
  .nav-button{
    display: none;
  }

  .calendar-overlay {
    right: 0;
    left: 0;
  }
}
</style>
