<!-- urbverde-ui/src/components/widgets_section/WidgetsSection.vue -->
<template>
  <div class="widgets-section">
    <div v-if="sections.length === 0" class="empty-state-wrapper">
      <div class="empty-state">
        <img src="@/assets/images/cards/empty-state.svg" alt="Nenhum dado disponível" />
        <div class="label">
          <h5 class="heading-h5">Sem dados estatísticos por aqui</h5>
          <p class="body-small-regular">Parece que os dados ainda não foram plantados</p>
        </div>
      </div>
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
import { computed, ref, watch, provide } from 'vue';
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
    cityCode: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const locationStore = useLocationStore();

    // Determine the selected layer from the location store.
    const selectedLayer = computed(() => {
      const currentCategory = locationStore.category;

      // Se não houver categoria definida, retorne string vazia
      if (!currentCategory) {
        return '';
      }

      // Use o mapeamento se existir, ou use uma versão normalizada da categoria
      return categoryToLayerMap[currentCategory] || currentCategory.toLowerCase();
    });

    // Rename this to avoid collision with props.cityCode
    const computedCityCode = computed(() =>
      locationStore.cd_mun || props.cityCode
    );

    // Provide the values for child components
    provide('cityCode', computedCityCode);

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

    // Provide the selected year for the current section
    provide('selectedYear', computed(() => selectedYears.value[0] || props.defaultYear));

    // Get sections for the selected layer
    const sections = computed(() => {
      // Verifica se possui uma configuração específica para a camada
      const layerId = locationStore.layer;

      if (layerId && sectionConfigs.layers && sectionConfigs.layers[layerId]) {
        // Usa a configuração específica da camada
        console.log(`Usando configuração específica para a camada: ${layerId}`);
        const layerSpecificConfig = sectionConfigs.layers[layerId];
        const sectionsComputed = layerSpecificConfig();

        return sectionsComputed.value;
      }

      // Se não, verifica se possui uma configuração de categoria
      const configGetter = sectionConfigs[selectedLayer.value];

      if (!configGetter) {
        console.log(`Nenhuma configuração encontrada para: ${selectedLayer.value}`);

        return [];
      }

      console.log(`Usando configuração de categoria para: ${selectedLayer.value}`);
      const sectionsComputed = configGetter();

      return sectionsComputed.value;
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

p, h5 {
  margin: 0;
}

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

.empty-state-wrapper {
  margin: 160px 0 128px 0;
  display: flex;
  width: 100%;
  height: auto;
  justify-content: center;
}

.empty-state {
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.empty-state img{
  max-width: 323px;
  width: 100%;
  height: auto;
}

.label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  width: 100%;
}

.label h5, .label p {
  color: map-get($body-text, body-color);
  text-align: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
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

  .empty-state img{
    max-width: 256px;
    height: auto;
  }
}

@include breakpoint-down('mobile-small') {
  .widgets-section{
    max-width: 300px;
  }
}
</style>
