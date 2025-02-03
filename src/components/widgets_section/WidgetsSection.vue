<!-- urbverde-ui/src/components/widgets_section/WidgetsSection.vue -->
<template>
  <div class="widgets-section">
    <div
      v-for="(section, index) in sections"
      :key="`${selectedLayer}-${section.id}`"
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
          :city-code="cityCode"
          :layer="selectedLayer"
          :disabled="isParksLayer"
          @update:modelValue="(value) => handleYearChange(value, index)"
        />
      </div>
      <component
        :is="section.component"
        :city-code="cityCode"
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

    // Computed property para verificar se a camada selecionada é "parques"
    const isParksLayer = computed(() => selectedLayer.value === 'parques');

    // Watch para forçar o valor do YearPicker para 2021 quando a camada for "parques"
    watch(isParksLayer, (newVal) => {
      if (newVal) {
        selectedYears.value = selectedYears.value.map(() => 2021);
      }
    });

    // Configuração das seções baseada na camada selecionada
    const sections = computed(() => {
      const sectionConfigs = {
        temperatura: [
          {
            id: 'stats',
            ref: 'statsSection',
            title: `Temperatura e clima em ${cityName.value}`,
            component: TemperatureSection
          },
          {
            id: 'vulnerable',
            ref: 'vulnerableSection',
            title: `Quem é mais afetado pelo calor extremo em ${cityName.value}?`,
            component: HeatSection
          },
          {
            id: 'ranking',
            ref: 'rankingSection',
            title: `${cityName.value} nos rankings de municípios`,
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
            title: `A cobertura vegetal em ${cityName.value}`,
            component: VegetationSection
          },
          {
            id: 'inequality',
            ref: 'inequalitySection',
            title: 'Desigualdade ambiental e a vegetação',
            component: InequalitySection
          },
          {
            id: 'rankinVegetation',
            ref: 'rankingVegSection',
            title: `${cityName.value} nos rankings de municípios`,
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
            title: `Parques e praças em ${cityName.value}`,
            component: InfoParksSection
          },
          {
            id: 'parksSquares',
            ref: 'parksSquaresSection',
            title: 'Quem vive distante de parques e praças?',
            component: ParksSquaresSection
          },
          {
            id: 'rankParks',
            ref: 'rankParksSection',
            title: `${cityName.value} nos rankings de municípios`,
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
      changeLayer,
      isParksLayer
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
      if (!this.isParksLayer) {
        this.selectedYears[index] = value;
        this.$emit(`year-change-${index}`, value);
      }
    }
  }
};
</script>

<style scoped>
.widgets-section{
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
</style>
