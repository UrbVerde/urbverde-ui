<!-- urbverde-ui/src/components/widgets_section/WidgetsSection.vue -->
<template>
  <div class="widgets-section">
    <div v-if="sections.length === 0" class="no-sections">
      <p class="no-data-message">Não há informações adicionais disponíveis para esta camada.</p>
    </div>

    <div
      v-for="(section, index) in sections"
      :key="`${selectedLayer}-${section.id}-${index}`"
      :id="section.id"
      :ref="section.ref"
      class="box"
    >
      <div class="statistics-container">
        <span class="title-statistics-container heading-h5">
          {{ section.title }}
        </span>
        <YearPicker
          v-if="!section.isSeeMore && showYearPicker"
          v-model="selectedYears[index]"
          :default-year="defaultYear"
          :city-code="computedCityCode"
          :layer="selectedLayer"
          :disabled="isYearPickerDisabled"
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
import YearPicker from '@/components/cards/weather/YearPicker.vue';
import { sectionConfigs, categoryToLayerMap, layerToCategoryMap, layerYearConfig } from '@/config';

export default {
  name: 'WidgetsSection',
  components: {
    YearPicker,
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

    // Determine the selected layer from the location store.
    const selectedLayer = computed(() => {
      // Pega a camada correspondente à categoria selecionada
      const mappedLayer = categoryToLayerMap[locationStore.category];

      // Se houver um mapeamento, use-o; caso contrário, use o valor direto da categoria (para debug)
      return mappedLayer || locationStore.category.toLowerCase();
    });

    // Rename this to avoid collision with props.cityCode
    const computedCityCode = computed(() =>
      locationStore.cd_mun || props.cityCode
    );

    // Get layer year configuration
    const layerConfig = computed(() =>
      layerYearConfig[selectedLayer.value] || {}
    );

    // Check if this layer uses a fixed year
    const isYearPickerDisabled = computed(() =>
      !!layerConfig.value.fixedYear
    );

    // Check if this layer shows the year picker
    const showYearPicker = computed(() =>
      layerConfig.value.hasYearPicker !== false
    );

    // Array to store selected years.
    const selectedYears = ref([]);

    // Get sections for the selected layer
    const sections = computed(() => {
      const config = sectionConfigs[selectedLayer.value];

      return config ? config(nm_mun.value, uf.value) : [];
    });

    // Initialize selected years when sections change
    watch(sections, (newSections) => {
      // If this layer has a fixed year, use that
      const year = layerConfig.value.fixedYear || props.defaultYear;
      selectedYears.value = Array(newSections.length).fill(year);
    }, { immediate: true });

    // When the category changes, reset the years accordingly.
    watch(() => locationStore.category, (newCategory) => {
      if (newCategory) {
        const layer = categoryToLayerMap[newCategory];
        const config = layerYearConfig[layer] || {};
        const year = config.fixedYear || props.defaultYear;

        selectedYears.value = selectedYears.value.map(() => year);
      }
    });

    // When default year changes, update if not fixed
    watch(() => props.defaultYear, (newValue) => {
      if (!isYearPickerDisabled.value) {
        selectedYears.value = selectedYears.value.map(() => newValue);
      }
    });

    // Method to change the layer.
    const changeLayer = (layer) => {
      const newCategory = layerToCategoryMap[layer];
      if (newCategory) {
        locationStore.setLocation({
          category: newCategory,
          layer: `${layer}-layer`
        });
      }
    };

    return {
      nm_mun,
      uf,
      computedCityCode,
      selectedLayer,
      sections,
      selectedYears,
      changeLayer,
      isYearPickerDisabled,
      showYearPicker
    };
  },
  methods: {
    handleYearChange(value, index) {
      if (!this.isYearPickerDisabled) {
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

.no-sections {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.no-data-message {
  font-size: 18px;
  color: #666;
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
