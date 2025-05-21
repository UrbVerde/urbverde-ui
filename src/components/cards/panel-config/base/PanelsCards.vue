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
        <div class="title-container">
          <span class="title-statistics-container heading-h5">
            {{ section.title }}
          </span>
          <span v-if="section.subtitle" class="subtitle-statistics-container body-small-medium">
            {{ section.subtitle }}
          </span>
        </div>
        <YearPicker
          v-if="section.showYearPicker !== false"
          v-model="selectedYears[index]"
          :default-year="defaultYear"
          :city-code="computedCityCode"
          :layer="selectedLayer"
          :disabled="section.fixedYear !== undefined"
          @update:modelValue="(value) => handleYearChange(value, index)"
        />
      </div>
      <component
        :is="section.component"
        v-bind="{
          'city-code': computedCityCode,
          year: selectedYears[index],
          layer: selectedLayer,
          ...section.props
        }"
        @change-layer="changeLayer"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import YearPicker from './YearPicker.vue';
import { sectionConfigs, categoryToLayerMap, layerToCategoryMap } from '@/components/cards/panel-config/index.js';

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
    const computedCityCode = computed(() => {
      const cityCode = locationStore.cd_mun || props.cityCode;

      return cityCode;
    });

    // Check if this layer uses a fixed year
    const isYearPickerDisabled = computed(() => {
      // Verifica se a seção atual tem um ano fixo definido
      const currentSection = sections.value[0];

      return currentSection?.fixedYear !== undefined;
    });

    // Get sections for the selected layer
    const sections = computed(() => {
      // Verifica se possui uma configuração específica para a camada
      const layerId = locationStore.layer;

      if (layerId && sectionConfigs.layers && sectionConfigs.layers[layerId]) {
        // Usa a configuração específica da camada
        const layerSpecificConfig = sectionConfigs.layers[layerId];
        const sectionsComputed = layerSpecificConfig();

        return sectionsComputed.value;
      }

      // Se não, verifica se possui uma configuração de categoria
      const configGetter = sectionConfigs[selectedLayer.value];

      if (!configGetter) {
        return [];
      }

      const sectionsComputed = configGetter();

      return sectionsComputed.value;
    });

    // Array to store selected years.
    const selectedYears = ref([]);

    // Initialize selectedYears when sections change
    watch(() => sections.value, (newSections) => {
      if (newSections && newSections.length > 0) {
        // Usa o fixedYear de cada seção individualmente, ou o defaultYear se não houver
        selectedYears.value = newSections.map(section => section.fixedYear || props.defaultYear);
      }
    }, { immediate: true });

    // When default year changes, update if not fixed
    watch(() => props.defaultYear, (newValue) => {
      // Atualiza apenas os anos das seções que não têm fixedYear
      selectedYears.value = sections.value.map(section =>
        section.fixedYear || newValue
      );
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
      isYearPickerDisabled
    };
  },
  methods: {
    handleYearChange(value, index) {
      // Atualiza apenas os anos das seções que não têm fixedYear
      this.selectedYears = this.sections.map((section, i) =>
        section.fixedYear || (i === index ? value : this.selectedYears[i])
      );
      this.$emit(`year-change-${index}`, value);
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
  padding: 48px 48px 32px 48px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  flex-grow: 1;
  width: 100%;

  &:first-child {
    padding-top: 72px;
  }

  &:last-child {
    padding-bottom: 104px;
  }
}

.statistics-container {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}

.title-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1 0 0;
}

.title-statistics-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: map-get($primary-fade, 600);
}

.subtitle-statistics-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: map-get($gray, 550);
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

</style>
