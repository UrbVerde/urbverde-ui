<!-- urbverde-ui/src/components/legend/LegendYearSelector.vue -->
<template>
  <!-- Track hover over the entire selector -->
  <div class="section-container" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="year-section">
      <div class="year-label">
        <img src="@/assets/icons/calendar.svg" alt="Calendar icon" class="calendar-icon" />
        <span class="body-small-regular">Ano</span>
      </div>
      <div class="custom-select" ref="selectContainer">
        <!-- Left nav button -->
        <button
          v-if="showControls"
          class="nav-button"
          @click="navigateYear(1)"
          :disabled="!canNavigateBack"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Input display:
             - Type is "text" with inputmode="numeric" and maxlength="4"
             - The container's border (contour) is visible only if showControls is true.
             - Real-time validation: When 4 digits are entered and the value is not valid, error is shown.
        -->
        <div class="select-display"
             :class="{
               error: isInvalid,
               shake: shake,
               'no-contour': showControlsOnlyOnHover && !legendHovered && !isHovered && !isOpen
             }"
             @click="toggleDropdown">
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="4"
            v-model="yearInput"
            @input="onYearChange"
            class="body-small-regular"
          />
        </div>

        <div v-if="isOpen" class="select-dropdown">
          <button
            v-for="year in availableYears"
            :key="year"
            class="year-option"
            :class="{ selected: Number(yearInput) === year }"
            @click.stop="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>

        <!-- Right nav button -->
        <button
          v-if="showControls"
          class="nav-button"
          @click="navigateYear(-1)"
          :disabled="!canNavigateForward"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// Allowed year range: fixed to 2016–2024
const minYear = 2016;
const maxYear = 2024;

const props = defineProps({
  initialYear: { type: Number, default: new Date().getFullYear() },
  showControlsOnlyOnHover: { type: Boolean, default: false },
  // Passed from the parent to indicate if the full legend is hovered
  legendHovered: { type: Boolean, default: false }
});
const { showControlsOnlyOnHover, legendHovered } = props;
const emit = defineEmits(['year-change']);

// Validate initial year: if out-of-range, force to maxYear.
const validInitialYear =
  props.initialYear < minYear || props.initialYear > maxYear
    ? maxYear
    : props.initialYear;

// Use a string ref for the input so we can limit to 4 digits.
const yearInput = ref(validInitialYear.toString());
const selectedYear = ref(validInitialYear);

// Build available years (newest to oldest)
const availableYears = [];
for (let y = maxYear; y >= minYear; y--) {
  availableYears.push(y);
}

const isHovered = ref(false);
const isOpen = ref(false);
const isInvalid = ref(false);
const shake = ref(false);

// Compute whether to show controls (arrows and border)
// If showControlsOnlyOnHover is false → always show.
// If true → show if any of these conditions are met: the full legend is hovered OR the selector itself is hovered OR the dropdown is open.
const showControls = computed(() => !showControlsOnlyOnHover || legendHovered || isHovered.value || isOpen.value);

const canNavigateBack = computed(() =>
  availableYears.indexOf(Number(selectedYear.value)) < availableYears.length - 1
);
const canNavigateForward = computed(() =>
  availableYears.indexOf(Number(selectedYear.value)) > 0
);

function navigateYear(direction) {
  const currentIndex = availableYears.indexOf(Number(selectedYear.value));
  const newIndex = currentIndex + direction;
  if (newIndex >= 0 && newIndex < availableYears.length) {
    selectedYear.value = availableYears[newIndex];
    yearInput.value = availableYears[newIndex].toString();
    emit('year-change', selectedYear.value);
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectYear(year) {
  selectedYear.value = year;
  yearInput.value = year.toString();
  isOpen.value = false;
  isInvalid.value = false;
  emit('year-change', year);
}

// Helper: trigger shake animation (by toggling a flag so CSS animation replays)
function triggerShake() {
  shake.value = false;
  void document.body.offsetWidth; // force reflow
  shake.value = true;
  setTimeout(() => {
    shake.value = false;
  }, 500);
}

// Validate as the user types.
// When 4 digits are entered, if the value is not in range, mark as error.
function onYearChange() {
  // Remove any non-digit characters.
  yearInput.value = yearInput.value.replace(/\D/g, '');
  if (yearInput.value.length === 4) {
    const num = Number(yearInput.value);
    if (num < minYear || num > maxYear) {
      if (!isInvalid.value) {
        triggerShake();
      }
      isInvalid.value = true;
    } else {
      isInvalid.value = false;
      selectedYear.value = num;
      emit('year-change', num);
    }
  } else {
    isInvalid.value = false;
  }
}

function handleClickOutside(e) {
  if (!e.target.closest('.custom-select')) {
    isOpen.value = false;
  }
}

function handleKeydown(e) {
  if (e.key === 'ArrowLeft') {navigateYear(1);}
  else if (e.key === 'ArrowRight') {navigateYear(-1);}
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
.section-container {
  background-color: #fff;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid map-get($gray, 200);
  width: 100%;
}

.year-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.year-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.body-small-regular {
  color: map-get($body-text, body-color);
}

.custom-select {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  width: 100px;
}

.nav-button {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 2px;
  padding: 0;
  transition: opacity 150ms ease-in-out;
}
.nav-button:hover:not(:disabled) {
  background-color: map-get($gray, 200);
}
.nav-button:disabled {
  cursor: not-allowed;
}
.nav-button i {
  font-size: 14px;
}

.select-display {
  flex: 1;
  padding: 4px 6px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: map-get($body-text, body-color);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 150ms ease-in-out;
}

/* Error state: red border */
.select-display.error {
  border-color: map-get($theme, danger);
}

/* Shake animation */
.select-display.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}

/* When no-contour is applied, hide the border */
.select-display.no-contour {
  border: none;
}

.select-display input {
  width: 50px; /* Fixed width to show 4 digits comfortably */
  max-width: 50px;
  border: none;
  outline: none;
  text-align: center;
  font-size: inherit;
  color: inherit;
  background: transparent;
}

/* Remove default number spinners if any */
.select-display input::-webkit-outer-spin-button,
.select-display input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.select-display input {
  -moz-appearance: textfield;
}

/* Centered dropdown (a bit smaller than the display) */
.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  width: 110%;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow-y: auto;
  max-height: 120px;
}

.year-option {
  width: 100%;
  padding: 7px 12px;
  border: none;
  background: none;
  text-align: center;
  font-size: 14px;
  color: map-get($theme, secondary);
  cursor: pointer;
  transition: background-color 150ms ease;
}
.year-option:hover {
  background-color: #f8f9fa;
}
.year-option.selected {
  background-color: #f0f0f0;
  font-weight: 500;
}

.select-dropdown::-webkit-scrollbar {
  width: 4px;
}
.select-dropdown::-webkit-scrollbar-track {
  background: #f8f9fa;
}
.select-dropdown::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 2px;
}
</style>
