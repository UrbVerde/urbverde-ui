# src/components/widgets/WidgetsSection.vue
<template>
  <div class="widgets-section">
    <div
      v-for="(section, index) in sections"
      :key="section.id"
      :ref="section.ref"
      class="box"
      :style="index > 0 ? {'border-top': '1px solid black'} : {}"
    >
      <div class="statistics-container">
        <span class="title-statistics-container heading-h5">
          {{ section.title }}
        </span>
        <YearPicker
          v-model="selectedYears[index]"
          :default-year="defaultYear"
          :city-code="cityCode"
          @update:modelValue="(value) => handleYearChange(value, index)"
        />
      </div>
      <component
        :is="section.component"
        :city-code="cityCode"
        :selected-year="selectedYears[index]"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import TemperatureSection from '@/components/cards/weather/temperatur/TemperatureSection.vue';
import RankSection from '@/components/cards/weather/ranking/RankSection.vue';
import HeatSection from '@/components/cards/weather/heat/HeatSection.vue';
import SeeMoreSection from '../cards/weather/seeMore/SeeMoreSection.vue';
import YearPicker from '@/components/cards/weather/YearPicker.vue';

export default {
  name: 'WidgetsSection',
  components: {
    TemperatureSection,
    HeatSection,
    RankSection,
    SeeMoreSection,
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
  setup(props) {
    const locationStore = useLocationStore();
    const category = computed(() => locationStore.category || 'category?');
    const cityName = computed(() => locationStore.nm_mun || 'city?');

    // Estado para controlar a camada selecionada
    const selectedLayer = ref('temperatura');

    // Número de subseções
    const numSections = ref(3);

    // Array para armazenar os anos selecionados
    const selectedYears = ref(Array(numSections.value).fill(props.defaultYear));

    // Configuração das seções baseada na camada selecionada
    const sections = computed(() => {
      const sectionConfigs = {
        temperatura: [
          {
            id: 'stats',
            ref: 'statsSection',
            title: `Estatísticas do ${category.value} em ${cityName.value}`,
            component: TemperatureSection
          },
          {
            id: 'vulnerable',
            ref: 'vulnerableSection',
            title: `Quem é Mais Afetado Pelo Calor Extremo em ${cityName.value}?`,
            component: HeatSection
          },
          {
            id: 'ranking',
            ref: 'rankingSection',
            title: `${cityName.value} nos Rankings por Regiões`,
            component: RankSection
          },
          {
            id: 'seeMore',
            ref: 'seeMoreSection',
            title: 'Veja mais sobre sua cidade!',
            component: SeeMoreSection
          }
        ]
        // Adicione outras configurações de camada aqui
      };

      return sectionConfigs[selectedLayer.value] || [];
    });

    // Método para mudar a camada selecionada
    const changeLayer = (layer) => {
      selectedLayer.value = layer;
    };

    return {
      category,
      cityName,
      selectedLayer,
      sections,
      selectedYears,
      changeLayer
    };
  },
  watch: {
    defaultYear: {
      handler(newValue) {
        this.selectedYears = this.selectedYears.map(() => newValue);
      },
      immediate: true
    }
  },
  methods: {
    handleYearChange(value, index) {
      this.selectedYears[index] = value;
      this.$emit(`year-change-${index}`, value);
    }
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
