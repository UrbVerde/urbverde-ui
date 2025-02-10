<template>
  <div class="section-container">
    <div class="year-section">
      <div class="year-label">
        <img src="@/assets/icons/calendar.svg" alt="Calendar icon" class="calendar-icon" />
        <span class="body-small-medium">Ano</span>
      </div>
      <div class="custom-select">
        <button
          class="nav-button"
          @click="navigateYear(1)"
          :disabled="!canNavigateBack"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <select
          v-model="selectedYear"
          @change="onYearChange"
          class="year-select"
        >
          <option
            v-for="year in availableYears"
            :key="year"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
        <button
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

<script>
export default {
  name: 'YearSection',
  props: {
    initialYear: {
      type: Number,
      default: 2021
    },
    yearRange: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      // Ensure the initial value is a number
      selectedYear: this.initialYear,
      availableYears: this.generateYearRange()
    };
  },
  computed: {
    // When navigating backward, we move toward the end of the array
    canNavigateBack() {
      return this.availableYears.indexOf(Number(this.selectedYear)) < this.availableYears.length - 1;
    },
    // When navigating forward, we move toward the beginning of the array
    canNavigateForward() {
      return this.availableYears.indexOf(Number(this.selectedYear)) > 0;
    }
  },
  methods: {
    generateYearRange() {
      const currentYear = this.initialYear;
      const years = [];
      for (let i = 0; i < this.yearRange; i++) {
        years.push(currentYear - i);
      }

      return years.sort((a, b) => b - a);
    },
    navigateYear(direction) {
      const currentIndex = this.availableYears.indexOf(Number(this.selectedYear));
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < this.availableYears.length) {
        this.selectedYear = this.availableYears[newIndex];
        this.$emit('year-change', this.selectedYear);
      }
    },
    onYearChange() {
      // Convert the selected value to a number (select returns a string by default)
      this.selectedYear = Number(this.selectedYear);
      this.$emit('year-change', this.selectedYear);
    },
    handleKeydown(event) {
      if (event.key === 'ArrowLeft') {
        this.navigateYear(1);
      } else if (event.key === 'ArrowRight') {
        this.navigateYear(-1);
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped lang="scss">
.section-container {
  background-color: #FFF;
  padding: 16px 16px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.year-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.year-label {
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #525960;
    font-size: 14px;
  }
}

.custom-select {
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  border-radius: 4px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #000;  /* Arrow icons are black */
  cursor: pointer;
  border-radius: 4px;
  padding: 0;

  &:hover:not(:disabled) {
    background-color: #f8f9fa;
  }

  &:disabled {
    opacity: 0.5; /* Slight opacity change when disabled */
    cursor: not-allowed;
  }

  i {
    font-size: 14px;
  }
}

.year-select {
  min-width: 60px;
  text-align: center;
  font-size: 14px;
  color: #525960;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: white;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
