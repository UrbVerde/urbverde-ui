<!-- DatePicker.vue -->
<template>
    <div class="date-picker">
        <div class="input-container">
            <input class="input-text body-small-regular" v-model="yearChosen" @focus="showCalendar" placeholder="Ano: 2021" />
            <span class="icon-datepicker" @click="showCalendar">
                <i class="bi bi-chevron-down" tag="icon"></i>
            </span>
        </div>

        <!-- <div v-if="isVisible" class="calendar-overlay">
            <div class="calendar card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <button class="btn btn-link" @click="previousMonth">
                <i class="bi bi-chevron-left"></i>
                </button>
                <span>{{ currentMonthYear }}</span>
                <button class="btn btn-link" @click="nextMonth">
                <i class="bi bi-chevron-right"></i>
                </button>
            </div>

            <div class="card-body p-2">
                <div class="d-flex justify-content-between mb-2">
                <div v-for="day in daysOfWeek" :key="day" class="text-center" style="width: 2.5rem">
                    {{ day }}
                </div>
                </div>

                <div class="calendar-grid">
                <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day" :class="{
                    'text-muted': !day.currentMonth,
                    'selected': isSelected(day.date),
                    'today': isToday(day.date)
                }" @click="selectDate(day.date)">
                    {{ day.dayOfMonth }}
                </div>
                </div>
            </div>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'DatePicker',
    props: {
        modelValue: {
            type: Date,
            default: null
        },
        format: {
            type: String,
            default: 'DD/MM/YYYY'
        }
    },
    data() {
        return {
            isVisible: false,
            currentDate: new Date(),
            selectedDate: this.modelValue,
            daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        }
    },
    computed: {
        currentMonthYear() {
            return this.currentDate.toLocaleString('pt-BR', {
                month: 'long',
                year: 'numeric'
            })
        },
        calendarDays() {
            const year = this.currentDate.getFullYear()
            const month = this.currentDate.getMonth()

            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)

            const days = []

            // Previous month days
            const firstDayWeekday = firstDay.getDay()
            for (let i = firstDayWeekday - 1; i >= 0; i--) {
                const date = new Date(year, month, -i)
                days.push({
                    date,
                    dayOfMonth: date.getDate(),
                    currentMonth: false
                })
            }

            // Current month days
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const date = new Date(year, month, i)
                days.push({
                    date,
                    dayOfMonth: i,
                    currentMonth: true
                })
            }

            // Next month days
            const remainingDays = 42 - days.length
            for (let i = 1; i <= remainingDays; i++) {
                const date = new Date(year, month + 1, i)
                days.push({
                    date,
                    dayOfMonth: i,
                    currentMonth: false
                })
            }

            return days
        },
        formattedDate() {
            if (!this.selectedDate) return ''
            return this.formatDate(this.selectedDate)
        }
    },
    methods: {
        showCalendar() {
            this.isVisible = true
            document.addEventListener('click', this.handleClickOutside)
        },
        hideCalendar() {
            this.isVisible = false
            document.removeEventListener('click', this.handleClickOutside)
        },
        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.hideCalendar()
            }
        },
        previousMonth() {
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() - 1
            )
        },
        nextMonth() {
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() + 1
            )
        },
        selectDate(date) {
            this.selectedDate = date
            this.$emit('update:modelValue', date)
            this.hideCalendar()
        },
        isSelected(date) {
            if (!this.selectedDate) return false
            return this.formatDate(date) === this.formatDate(this.selectedDate)
        },
        isToday(date) {
            const today = new Date()
            return this.formatDate(date) === this.formatDate(today)
        },
        formatDate(date) {
            if (!date) return ''

            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()

            return this.format
                .replace('DD', day)
                .replace('MM', month)
                .replace('YYYY', year)
        }
    }
}
</script>

<style scoped>
.date-picker {
    /* position: relative;
    display: inline-block;
    width: auto; */
}

.input-container {
    /* display: flex;
    height: 32px; */
    padding: 5px 9px;
    
    /* justify-content: center; */
    /* align-items: flex-start; */

    display: inline-flex;
    align-items: center;

    border: 1px solid var(--Gray-400, #CED4DA);
    background-color: white;

    max-width: 105px;


align-items: center;
gap: 4px;

    

}
.icon-datepicker{
    display: flex;

flex-direction: column;
justify-content: center;
align-items: center;
width: 14px;
height: 14px;
}
.icon-datepicker i {
    display: flex;
flex-direction: column;
align-items: center;

padding: 1px;
color: #6C757D;

}

.input-text {
    /* position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    width: 10ch; 
    box-sizing: border-box;
 */


    border: none;
    outline: none;
    background: transparent;

    width: auto;
    min-width: 0;
    /* Define largura baseada no conteúdo */
    box-sizing: content-box;

    padding: 0;
    margin: 0;
}

.input-group {
    position: relative;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: stretch;
    width: 100%;
}

.input-group-text {
    background-color: white;
    border: none;
}

.input-group {
    border-radius: 3.2px;
    border: 1px solid var(--Gray-400, #CED4DA);
    background: var(--Gray-White, #FFF);
}



.calendar-overlay {
    position: absolute;
    top: 100%;
    /* left: 0; */
    z-index: 1000;
    margin-top: 5px;
}

.calendar {
    /* width: 320px; */
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}

.calendar-day {
    text-align: center;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
}

.calendar-day:hover {
    background-color: #f8f9fa;
}

.calendar-day.selected {
    background-color: #0d6efd;
    color: white;
}

.calendar-day.today {
    border: 1px solid #0d6efd;
}

.text-muted {
    color: #6c757d;
}
</style>