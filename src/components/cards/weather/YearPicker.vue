<!-- YearPicker.vue -->
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
        @click="showYearSelector">
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
  }
});

const emit = defineEmits(['update:modelValue']);

const isVisible = ref(false);
const defaultYear = ref(props.modelValue);
const currentYear = ref(props.modelValue);
const yearModified = ref(false);
const years = ref([]);

defaultYear.value = props.modelValue;

watch(() => props.modelValue, (newValue) => {
  currentYear.value = newValue;
}, { immediate: true });

watch(() => props.cityCode, async(newCityCode) => {
  await fetchYears(newCityCode);
}, { immediate: true });

watch(currentYear, (newValue) => {
  yearModified.value = newValue !== defaultYear.value;
});

const fetchYears = async(cityCode) => {
  try {
    const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/temperature?city=${cityCode}`);

    if (!response.ok) {
      throw new Error('Failed to fetch years');

    }
    const data = await response.json();
    years.value = data;
  } catch (error) {
    console.error('Error fetching years:', error);
    years.value = [];

  }
};

const availableYears = computed(() => [...years.value].sort((a, b) => a - b));

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

<style scoped>
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
    border-radius: 7px;
    cursor: pointer;
    padding: 5px 9px;
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--Gray-400, #CED4DA);
    background-color: white;
    max-width: 120px;
    height: 40px;
    gap: 5px;
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
    color: azure;
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
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
</style>
