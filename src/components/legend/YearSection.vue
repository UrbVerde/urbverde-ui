<template>
  <div class="section-container"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false">
    <div class="year-section">
      <div class="year-label">
        <img src="@/assets/icons/calendar.svg" alt="Calendar icon" class="calendar-icon" />
        <span class="body-small-medium">Ano</span>
      </div>

      <div class="custom-select" @click="toggleDropdown" ref="selectContainer">
        <div class="select-display">
          <span>{{ selectedYear }}</span>
          <img
            src="@/assets/icons/wrapper.svg"
            :class="['chevron-icon', { 'rotated': isOpen }]"
            alt="toggle"
          />
        </div>

        <!-- Dropdown -->
        <div v-if="isOpen" class="select-dropdown">
          <button
            v-for="year in availableYears"
            :key="year"
            class="year-option"
            :class="{ 'selected': year === selectedYear }"
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </div>

    <!-- Range Slider -->
    <transition name="fade">
      <div v-if="isHovered" class="year-range-container">
        <div class="year-range">
          <span class="year-limit">1985</span>
          <div class="range-slider-container">
            <input
              type="range"
              :min="1985"
              :max="2024"
              v-model="selectedYear"
              class="range-slider"
              @input="handleRangeInput"
            />
            <div class="range-track">
              <div class="range-progress" :style="{ width: rangeProgress + '%' }"></div>
            </div>
          </div>
          <span class="year-limit">2024</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'YearSection',
  props: {
    initialYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    yearRange: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      selectedYear: this.initialYear,
      availableYears: this.generateYearRange(),
      isOpen: false,
      isHovered: false,
      rangeProgress: 0
    };
  },
  watch: {
    selectedYear(newYear) {
      this.updateRangeProgress(newYear);
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.updateRangeProgress(this.selectedYear);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectYear(year) {
      this.selectedYear = year;
      this.isOpen = false;
      this.$emit('year-change', year);
    },
    handleClickOutside(event) {
      if (this.$refs.selectContainer && !this.$refs.selectContainer.contains(event.target)) {
        this.isOpen = false;
      }
    },
    handleRangeInput(event) {
      this.selectYear(Number(event.target.value));
    },
    updateRangeProgress(year) {
      const min = 1985;
      const max = 2024;
      this.rangeProgress = ((year - min) / (max - min)) * 100;
      const thumbPosition = `${this.rangeProgress}%`;
      document.documentElement.style.setProperty('--thumb-position', thumbPosition);
    }

  }
};
</script>

<style scoped>
.section-container {
  background-color: #FFF;
  padding: 16px 24px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width: 232px;
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
}

.year-label span {
  color: #525960;
  font-size: 14px;
  font-weight: 500;
}

/* Custom Select Styling */
.custom-select {
  position: relative;
  width: 90px;
}

.select-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 9px;
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: #525960;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  transition: transform 150ms ease-in-out;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.year-option {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: #525960;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.year-option:hover {
  background-color: #F8F9FA;
}

.year-option.selected {
  background-color: #F0F0F0;
  font-weight: 500;
}

/* Scrollbar styling */
.select-dropdown::-webkit-scrollbar {
  width: 4px;
}

.select-dropdown::-webkit-scrollbar-track {
  background: #F8F9FA;
}

.select-dropdown::-webkit-scrollbar-thumb {
  background: #D1D1D1;
  border-radius: 2px;
}

.year-range-container {
  margin-top: 16px;
  opacity: 0;
  transform: translateY(-10px);
  animation: slideIn 150ms ease-in-out forwards;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.year-limit {
  color: #525960;
  font-size: 12px;
  font-weight: 500;
  min-width: 35px;
}

.range-slider-container {
  position: relative;
  flex: 1;
  height: 24px;
  display: flex;
  align-items: center;
}

.range-slider {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.range-track {
  position: absolute;
  width: 100%;
  height: 4px;
  background-color: #E0E0E0;
  border-radius: 2px;
}

.range-progress {
  position: absolute;
  height: 100%;
  background-color: #006754;
  border-radius: 2px;
  transition: width 150ms ease-out;
}

.range-track::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: #006754;
  border-radius: 50%;
  top: 50%;
  left: calc(var(--thumb-position, 0%));
  transform: translate(-50%, -50%);
  z-index: 1;
  transition: left 150ms ease-out;
}

/* Animações */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
