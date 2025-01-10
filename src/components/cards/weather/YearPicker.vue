<!-- YearPicker.vue -->
<template>
    <div class="date-picker">
        <div class="input-container" @click="showYearSelector" >
            <input 
                class="input-text body-small-regular" 
                :value="formattedYear"
                @focus="showYearSelector" 
                placeholder="" 
                readonly
            />
            <span class="icon-yearpicker" @click="showYearSelector">
                <i class="bi bi-chevron-down" tag="icon"></i>
            </span>
        </div>

        <div v-if="isVisible" class="calendar-overlay">
            <div class="calendar card">
                <div class="card-body p-2">
                    <div class="year-grid">
                        <div 
                            v-for="year in availableYears" 
                            :key="year"
                            class="year-item"
                            :class="{ 'selected': isSelected(year) }"
                            @click="selectYear(year)"
                        >
                            {{ year }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YearPicker',
    props: {
        modelValue: {
            type: Number,
            default: null
        },
        years: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data() {
        return {
            isVisible: false,
            selectedYear: this.modelValue
        }
    },
    computed: {
        availableYears() {
            return [...this.years].sort((a, b) => a - b);
        },
        formattedYear() {
            return this.selectedYear ? `Ano: ${this.selectedYear}` : '';
        }
    },
    watch: {
        modelValue: {
            handler(newValue) {
                this.selectedYear = newValue;
            },
            immediate: true
        }
    },
    methods: {
        showYearSelector() {
            this.isVisible = true;
            document.addEventListener('click', this.handleClickOutside);
        },
        hideYearSelector() {
            this.isVisible = false;
            document.removeEventListener('click', this.handleClickOutside);
        },
        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.hideYearSelector();
            }
        },
        selectYear(year) {
            this.selectedYear = year;
            this.$emit('update:modelValue', year);
            this.hideYearSelector();
        },
        isSelected(year) {
            return year === this.selectedYear;
        }
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }
}
</script>

<style scoped>
.date-picker {
    position: relative;
    display: inline-block;
}

.input-container {
    border-radius: 7px;
    cursor: pointer;
    padding: 5px 9px;
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--Gray-400, #CED4DA);
    background-color: white;
    max-width: 107px;
    gap: 4px;
}

.icon-yearpicker {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 14px;
    height: 14px;
    cursor: pointer;
}

.icon-yearpicker i {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1px;
    color: #6C757D;
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
    text-align: center;
    padding: 0px 8px;
    cursor: pointer;
    border-radius: 4px;
    
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
</style>