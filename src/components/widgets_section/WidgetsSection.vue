<!-- src/components/widgets/WidgetsSection.vue -->
<template>
    <div class="widgets-section">
      <!-- Stats Section (scroll target) -->
      <div id="stats" ref="statsSection" class="box">
        <div class="statistics-container">
          <span class="title-statistics-container heading-h5">Estatísticas do {{ category }} em {{ cityName }}</span>
          <YearPicker 
            v-model="firstSelectedYear" 
            :default-year="defaultYear" 
            :city-code="cityCode"
            @update:modelValue="handleFirstYearChange" 
          />
        </div>
        <TemperatureSection :city-code="cityCode" :selected-year="firstSelectedYear" />
      </div>
  
      <!-- Pop Vulnerável -->
      <div id="vulnerable" ref="vulnerableSection" class="box" style="border-top: 1px solid black">
        <div class="statistics-container">
          <span class="title-statistics-container heading-h5">
            Quem é Mais Afetado Pelo Calor Extremo em {{ cityName }}?
          </span>
          <YearPicker 
            v-model="secondSelectedYear" 
            :default-year="defaultYear" 
            :city-code="cityCode"
            @update:modelValue="handleSecondYearChange" 
          />
        </div>
        <HeatSection :city-code="cityCode" :selected-year="secondSelectedYear" />
      </div>
  
      <!-- Ranking -->
      <div id="ranking" ref="rankingSection" class="box" style="border-top: 1px solid black">
        <div class="statistics-container">
          <span class="title-statistics-container heading-h5">
            {{ cityName }} no Ranking dos Municípios
          </span>
          <YearPicker 
            v-model="thirdSelectedYear" 
            :default-year="defaultYear" 
            :city-code="cityCode"
            @update:modelValue="handleThirdYearChange" 
          />
        </div>
        <RankSection :city-code="cityCode" :selected-year="thirdSelectedYear" />
      </div>
  
      <!-- Dados Gerais e Baixar Relatório -->
      <div id="data" ref="dataSection" class="box" style="height:636px; border-top: 1px solid black">
        Veja mais sobre {{ cityName }}
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useLocationStore } from '@/stores/locationStore';
  import TemperatureSection from '@/components/cards/weather/TemperatureSection.vue';
  import RankSection from '@/components/cards/weather/RankSection.vue';
  import HeatSection from '@/components/cards/weather/HeatSection.vue';
  import YearPicker from '@/components/cards/weather/YearPicker.vue';
  
  export default {
    name: 'WidgetsSection',
    components: {
      TemperatureSection,
      HeatSection,
      RankSection,
      YearPicker,
    },
    props: {
      defaultYear: {
        type: Number,
        required: true
      },
      cityCode: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        firstSelectedYear: this.defaultYear,
        secondSelectedYear: this.defaultYear,
        thirdSelectedYear: this.defaultYear,
      };
    },
    setup() {
      const locationStore = useLocationStore();
      const category = computed(() => locationStore.category || 'category?');
      const cityName = computed(() => locationStore.nm_mun || 'city?');
  
      return {
        category,
        cityName,
      };
    },
    watch: {
      defaultYear: {
        handler(newValue) {
          this.firstSelectedYear = newValue;
          this.secondSelectedYear = newValue;
          this.thirdSelectedYear = newValue;
        },
        immediate: true
      }
    },
    methods: {
      handleFirstYearChange(value) {
        this.firstSelectedYear = value;
        this.$emit('first-year-change', value);
      },
      handleSecondYearChange(value) {
        this.secondSelectedYear = value;
        this.$emit('second-year-change', value);
      },
      handleThirdYearChange(value) {
        this.thirdSelectedYear = value;
        this.$emit('third-year-change', value);
      },
    }
  };
  </script>
  
  <style scoped>
  .statistics-container {
    display: flex;
    align-items: center;
    gap: 24px;
    align-self: stretch;
  }
  
  .title-statistics-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1 0 0;
  }
  
  .box {
    display: flex;
    padding: 40px 48px 32px 48px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    align-self: stretch;
  }
  </style>