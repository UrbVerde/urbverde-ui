<template>
  <div class="widgets-section">
    <!-- Only show sections if the category should display widgets -->
    <template v-if="shouldShowWidgets">
      <div
        v-for="(section, index) in visibleSections"
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
          @section-empty="markSectionAsEmpty(section.id)"
          ref="sectionComponents"
        />
      </div>

      <!-- Only show download section if we have widgets and it's not already shown via SeeMore -->
      <div v-if="!hasSeeMoreSection" class="download-section box" id="download">
        <DownloadCard />
      </div>
    </template>
  </div>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
// Import your section components as needed:
import TemperatureSection from '@/components/cards/weather/temperatur/TemperatureSection.vue';
import TGraphicSection from '@/components/cards/weather/graphics/TGraphicSection.vue';
import RankSection from '@/components/cards/weather/ranking/RankSection.vue';
import HeatSection from '@/components/cards/weather/heat/HeatSection.vue';

import SeeMoreSection from '../cards/weather/seeMore/SeeMoreSection.vue';
import YearPicker from '@/components/cards/weather/YearPicker.vue';

import VegetationSection from '../cards/vegetation/vegetationCover/VegetationSection.vue';
import VGraphicSection from '@/components/cards/vegetation/vgraphics/VGraphicSection.vue';
import InequalitySection from '../cards/vegetation/inequality/InequalitySection.vue';
import SeeMoreVegSection from '../cards/vegetation/seeMore/SeeMoreVegSection.vue';
import RankVegSection from '../cards/vegetation/rankSection/RankVegSection.vue';

import InfoParksSection from '../cards/parks/infoSection/infoParksSection.vue';
import ParksSquaresSection from '../cards/parks/parksandSquaresSection/ParksSquaresSection.vue';
import SeeMoreParksSection from '../cards/parks/seeMoreSection/SeeMoreParksSection.vue';
import RankParksSection from '../cards/parks/rankSection/RankParksSection.vue';
import DownloadCard from '../cards/DownloadCard.vue';

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
    DownloadCard,
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
  emits: ['first-year-change', 'second-year-change', 'third-year-change', 'section-visibility-changed'],
  setup(props, { emit }) {
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

    // List of categories that SHOULD show widgets
    const categoriesWithWidgets = ['Clima', 'Vegetação', 'Parques e Praças'];

    // Determine the selected layer from the location store.
    const selectedLayer = computed(() => categoryToLayerMap[locationStore.category] || 'temperatura');

    // Check if the current category should display widgets
    const shouldShowWidgets = computed(() => categoriesWithWidgets.includes(locationStore.category));

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

    // Track hidden sections
    const hiddenSections = ref([]);

    // Reference to section components
    const sectionComponents = ref([]);

    // Check if any "See More" section is visible (to avoid duplicate download cards)
    const hasSeeMoreSection = computed(() => {
      const seeMoreSectionIds = ['seeMore', 'seeMoreVeg', 'seeMoreParks'];
      const visibleSeeMore = visibleSections.value.some(section =>
        seeMoreSectionIds.includes(section.id)
      );

      return visibleSeeMore;
    });

    // Mark a section as empty (no valid data)
    const markSectionAsEmpty = (sectionId) => {
      console.log('Section marked as empty:', sectionId);

      if (!hiddenSections.value.includes(sectionId)) {
        hiddenSections.value.push(sectionId);

        // Create a custom event for the navbar to respond to
        const event = new CustomEvent('section-visibility-changed', {
          detail: {
            sectionId,
            isVisible: false
          },
          bubbles: true,
          cancelable: true
        });
        document.dispatchEvent(event);

        // Also emit event through props for other components
        emit('section-visibility-changed', sectionId, false);
      }

      // Force UI update
      nextTick(() => {
        console.log('Current hidden sections:', hiddenSections.value);
      });
    };

    // When the category changes, reset the years accordingly.
    watch(() => locationStore.category, (newCategory) => {
      if (newCategory) {
        selectedYears.value = selectedYears.value.map(() =>
          categoryToLayerMap[newCategory] === 'parques' ? 2021 : props.defaultYear
        );
        hiddenSections.value = []; // Reset hidden sections when category changes
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
          { id: 'stats',
            ref: 'graphicSection',
            title: `Temperatura média em ${nm_mun.value} - ${uf.value} ao longo do tempo`,
            component: TGraphicSection
          },
          {
            id: 'stats',
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
          { id: 'stats',
            ref: 'graphicSection',
            title: `Cobertura vegetal em ${nm_mun.value} - ${uf.value} ao longo do tempo`,
            component: VGraphicSection
          },
          {
            id: 'stats',
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
            id: 'seeMoreVeg',
            ref: 'seeMoreVegSection',
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
            id: 'stats',
            ref: 'parksSquaresSection',
            title: 'Quem vive distante de parques e praças?',
            component: ParksSquaresSection
          },
          {
            id: 'ranking',
            ref: 'rankingParksSection',
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

    // Filter visible sections
    const visibleSections = computed(() => sections.value.filter(section => !hiddenSections.value.includes(section.id)));

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

    // Add a method to check if sections have valid data after loading
    const checkSectionsData = () => {
      nextTick(() => {
        // Reset hidden sections
        hiddenSections.value = [];

        // We'll rely on each component to emit section-empty events
        // when they determine their data isn't valid
      });
    };

    // Watch for city code changes to check sections after data loading
    watch(() => computedCityCode.value, () => {
      hiddenSections.value = []; // Reset hidden sections when city changes
      checkSectionsData();
    });

    return {
      nm_mun,
      uf,
      computedCityCode,
      selectedLayer,
      sections,
      selectedYears,
      changeLayer,
      isParksLayer,
      hiddenSections,
      markSectionAsEmpty,
      visibleSections,
      sectionComponents,
      shouldShowWidgets,
      hasSeeMoreSection
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
        // Emit the year change event based on the index
        if (index === 0) {
          this.$emit('first-year-change', value);
        } else if (index === 1) {
          this.$emit('second-year-change', value);
        } else if (index === 2) {
          this.$emit('third-year-change', value);
        }
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

.download-section {
  padding-top: 16px;
  padding-bottom: 16px;
}

@include breakpoint-down('tablet') {

  .box {
    padding: 40px 24px 32px 24px;
  }

  .statistics-container {
    padding-left: 2px;
    gap: 24px;
    flex-direction: column;
    align-items: flex-start;
  }

  .title-statistics-container.heading-h5{
    font-size: 18px;
  }

}
</style>
