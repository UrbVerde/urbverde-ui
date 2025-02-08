<!-- YearSection.vue -->
<template>
  <div class="section-container">
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
      isOpen: false
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
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
</style>
