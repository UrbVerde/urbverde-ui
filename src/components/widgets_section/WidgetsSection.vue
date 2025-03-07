<!-- urbverde-ui/src/components/widgets_section/WidgetsSection.vue -->
<template>
  <div class="widgets-section">
    <div
      v-for="(section, index) in sections"
      :key="`${selectedLayer}-${section.id}`"
      :id="section.id"
      :ref="section.ref"
      class="box"
    >
      <div class="statistics-container">
        <span class="title-statistics-container heading-h5">
          {{ section.title }}
        </span>
        <YearPicker
          v-if="!section.isSeeMore"
          v-model="selectedYears[index]"
          :default-year="defaultYear"
          :city-code="computedCityCode"
          :layer="selectedLayer"
          :disabled="isParksLayer"
          @update:modelValue="(value) => handleYearChange(value, index)"
        />
      </div>
      <component
        :is="section.component"
        :city-code="computedCityCode"
        :selected-year="selectedYears[index]"
        :layer="selectedLayer"
        @change-layer="changeLayer"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
// Import your section components as needed:
import TemperatureSection from '@/components/cards/weather/temperatur/TemperatureSection.vue';
import RankSection from '@/components/cards/weather/ranking/RankSection.vue';
import HeatSection from '@/components/cards/weather/heat/HeatSection.vue';
import SeeMoreSection from '../cards/weather/seeMore/SeeMoreSection.vue';
import YearPicker from '@/components/cards/weather/YearPicker.vue';
import VegetationSection from '../cards/vegetation/vegetationCover/VegetationSection.vue';
import InequalitySection from '../cards/vegetation/inequality/InequalitySection.vue';
import SeeMoreVegSection from '../cards/vegetation/seeMore/SeeMoreVegSection.vue';
import RankVegSection from '../cards/vegetation/rankSection/RankVegSection.vue';
import InfoParksSection from '../cards/parks/infoSection/infoParksSection.vue';
import ParksSquaresSection from '../cards/parks/parksandSquaresSection/ParksSquaresSection.vue';
import SeeMoreParksSection from '../cards/parks/seeMoreSection/SeeMoreParksSection.vue';
import RankParksSection from '../cards/parks/rankSection/RankParksSection.vue';

export default {
  name: 'WidgetsSection',
  components: {
    TemperatureSection,
    HeatSection,
    RankSection,
    SeeMoreSection,
    YearPicker,
    VegetationSection,
    InequalitySection,
    SeeMoreVegSection,
    RankVegSection,
    InfoParksSection,
    ParksSquaresSection,
    SeeMoreParksSection,
    RankParksSection,
  },
  props: {
    defaultYear: {
      type: Number,
      required: true
    },
    // This is used as a fallback if the store value is not yet available.
    cityCode: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const locationStore = useLocationStore();

    // Use the exact names from the store.
    const nm_mun = computed(() => locationStore.nm_mun || '?');
    const uf = computed(() => locationStore.uf || '?');

    // Map categories to internal layer names.
    const categoryToLayerMap = {
      'Clima': 'temperatura',
      'Vegetação': 'vegetação',
      'Parques e Praças': 'parques'
    };

    // Determine the selected layer from the location store.
    const selectedLayer = computed(() => categoryToLayerMap[locationStore.category] || 'temperatura');

    // Rename this to avoid collision with props.cityCode
    const computedCityCode = computed(() =>
      locationStore.cd_mun || props.cityCode
    );

    // Number of subsections.
    const numSections = ref(3);

    // Array to store selected years.
    const selectedYears = ref(Array(numSections.value).fill(props.defaultYear));

    // Check if the parks layer is selected.
    const isParksLayer = computed(() => selectedLayer.value === 'parques');

    // When the category changes, reset the years accordingly.
    watch(() => locationStore.category, (newCategory) => {
      if (newCategory) {
        selectedYears.value = selectedYears.value.map(() =>
          categoryToLayerMap[newCategory] === 'parques' ? 2021 : props.defaultYear
        );
      }
    });

    // Force the year to 2021 for the parks layer.
    watch(isParksLayer, (newVal) => {
      if (newVal) {
        selectedYears.value = selectedYears.value.map(() => 2021);
      }
    });

    // Section configurations.
    // You can directly build titles using nm_mun and uf.
    const sections = computed(() => {
      const sectionConfigs = {
        temperatura: [
          {
            id: 'stats',
            ref: 'statsSection',
            title: `Temperatura e clima em ${nm_mun.value} - ${uf.value}`,
            component: TemperatureSection
          },
          {
            id: 'vulnerable',
            ref: 'vulnerableSection',
            title: `Quem é mais afetado pelo calor extremo em ${nm_mun.value}?`,
            component: HeatSection
          },
          {
            id: 'ranking',
            ref: 'rankingSection',
            title: `${nm_mun.value} - ${uf.value} nos rankings de municípios`,
            component: RankSection
          },
          {
            id: 'seeMore',
            ref: 'seeMoreSection',
            title: 'Veja mais sobre sua cidade!',
            component: SeeMoreSection,
            isSeeMore: true
          }
        ],
        vegetação: [
          {
            id: 'stats',
            ref: 'statsSection',
            title: `A cobertura vegetal em ${nm_mun.value} - ${uf.value}`,
            component: VegetationSection
          },
          {
            id: 'inequality',
            ref: 'inequalitySection',
            title: 'Desigualdade ambiental e a vegetação',
            component: InequalitySection
          },
          {
            id: 'ranking',
            ref: 'rankingVegSection',
            title: `${nm_mun.value} - ${uf.value} nos rankings de municípios`,
            component: RankVegSection
          },
          {
            id: 'seeMore',
            ref: 'seeMoreSection',
            title: 'Veja mais sobre sua cidade!',
            component: SeeMoreVegSection,
            isSeeMore: true
          }
        ],
        parques: [
          {
            id: 'stats',
            ref: 'statsSection',
            title: `Parques e praças em ${nm_mun.value} - ${uf.value}`,
            component: InfoParksSection
          },
          {
            id: 'parksSquares',
            ref: 'parksSquaresSection',
            title: 'Quem vive distante de parques e praças?',
            component: ParksSquaresSection
          },
          {
            id: 'ranking',
            ref: 'rankParksSection',
            title: `${nm_mun.value} - ${uf.value} nos rankings de municípios`,
            component: RankParksSection
          },
          {
            id: 'seeMoreParks',
            ref: 'seeMoreParksSection',
            title: 'Veja mais sobre sua cidade!',
            component: SeeMoreParksSection,
            isSeeMore: true
          }
        ]
      };

      return sectionConfigs[selectedLayer.value] || [];
    });

    // Method to change the layer.
    const changeLayer = (layer) => {
      const layerToCategoryMap = {
        'temperatura': 'Clima',
        'vegetação': 'Vegetação',
        'parques': 'Parques e Praças'
      };

      const newCategory = layerToCategoryMap[layer];
      if (newCategory) {
        locationStore.setLocation({
          category: newCategory,
          layer: `${layer}-layer`
        });
      }
    };

    return {
      // Expose the store values exactly as nm_mun and uf.
      nm_mun,
      uf,
      computedCityCode,
      selectedLayer,
      sections,
      selectedYears,
      changeLayer,
      isParksLayer
    };
  },
  watch: {
    defaultYear: {
      handler(newValue) {
        if (!this.isParksLayer) {
          this.selectedYears = this.selectedYears.map(() => newValue);
        }
      },
      immediate: true
    }
  },
  methods: {
    handleYearChange(value, index) {
      if (!this.isParksLayer) {
        this.selectedYears[index] = value;
        this.$emit(`year-change-${index}`, value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.widgets-section {
  display: flex;
  flex-direction: column;
  max-width: 1376px;
  margin: auto;
  padding-bottom: 48px;
}

.box {
  display: flex;
  padding: 40px 48px 32px 48px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
  flex-grow: 1;
  width: 100%;
}

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

@include breakpoint-down('tablet') {

  .box {
    padding: 40px 24px 32px 24px;
  }

  .statistics-container {
    padding-left: 12px;
    gap: 16px;
  }

}
</style>
