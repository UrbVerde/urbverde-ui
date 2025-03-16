<!-- urbverde-ui/src/components/cards/Card.vue -->
<!-- CardBase.vue -->
<template>
  <div class="custom-card shadow-sm">
    <div class="card-image-wrapper" v-if="imagePosition === 'top' && imageSlot">
      <slot name="image"></slot>
    </div>

    <div class="card-header">
      <h6 v-if="title" class="titulo heading-h6">{{ title }}</h6>
    </div>

    <div class="content-wrapper">
      <h2 v-if="value" class="value">{{ value }}</h2>
      <p v-if="subtitle" class="textodescritivo body-small-medium">{{ subtitle }}</p>
    </div>

    <div class="card-image-wrapper" v-if="imagePosition === 'middle' && imageSlot">
      <slot name="image"></slot>
    </div>

    <!-- Chart component integration -->
    <div class="chart-container" v-if="graphic">
      <component
        :is="graphicComponent"
        :xData="xData"
        :yData="yData"
        :xLabel="xLabel"
        :yLabel="yLabel"
        :dataType="dataType"
        :chartColor="chartColor"
        :chartBgColor="chartBgColor"
        :suggestYScale="suggestYScale"
        :paddingFactor="paddingFactor"
        :showAverage="showAverage"
        :averageLineColor="averageLineColor"
        :averageLineDash="averageLineDash"
        :averageLineWidth="averageLineWidth"
        :averageLabel="averageLabel"
        :chartData="chartData"
      />
    </div>

    <div class="card-content" v-if="$slots.default">
      <slot></slot>
    </div>

    <div class="card-image-wrapper" v-if="imagePosition === 'bottom' && imageSlot">
      <slot name="image"></slot>
    </div>

    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import LineGraphic from './graphics/LineGraphic.vue';
import PizzaGraphic from './graphics/PizzaGraphic.vue';

export default {
  name: 'CardBase',
  components: {
    LineGraphic,
    PizzaGraphic
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    imagePosition: {
      type: String,
      default: 'top',
      validator: value => ['top', 'middle', 'bottom'].includes(value),
    },
    // Chart properties
    graphic: {
      type: Boolean,
      default: false,
    },
    graphicType: {
      type: String,
      default: 'line',
      validator: value => ['line', 'pizza'].includes(value),
    },
    // Data properties shared by all chart types
    xLabel: {
      type: String,
      default: '',
    },
    yLabel: {
      type: String,
      default: '',
    },
    xData: {
      type: Array,
      default: () => [],
    },
    yData: {
      type: Array,
      default: () => [],
    },
    chartData: {
      type: Object,
      default: () => ({}),
      description: 'Custom data structure for specific chart types (e.g., pizza chart)'
    },
    dataType: {
      type: String,
      default: 'Data',
      description: 'Label for dataset displayed in the chart legend',
    },
    chartColor: {
      type: String,
      default: '#4CAF50', // Default to green
    },
    chartBgColor: {
      type: String,
      default: 'rgba(76, 175, 80, 0.1)', // Light green with transparency
    },
    // Line chart specific properties
    suggestYScale: {
      type: Boolean,
      default: true,
    },
    paddingFactor: {
      type: Number,
      default: 0.1,
    },
    showAverage: {
      type: Boolean,
      default: true,
    },
    averageLineColor: {
      type: String,
      default: 'rgba(255, 99, 132, 1)',
    },
    averageLineDash: {
      type: Array,
      default: () => [5, 5],
    },
    averageLineWidth: {
      type: Number,
      default: 2,
    },
    averageLabel: {
      type: String,
      default: 'Média histórica',
    },
  },
  computed: {
    imageSlot() {
      return !!this.$slots.image;
    },
    graphicComponent() {
      // Map graphic type to component
      const componentMap = {
        'line': 'LineGraphic',
        'pizza': 'PizzaGraphic'
      };

      return componentMap[this.graphicType] || 'LineGraphic';
    }
  }
};
</script>

<style scoped lang="scss">
p, h6 {
  margin: 0;
}

.custom-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: auto;
  width: 100%;
  border-radius: 16px;
  border: 1px solid map-get($gray, 200);
  background-color: map-get($gray, white);
  gap: 16px;
  overflow-wrap: break-word;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  width: 100%;
}

.card-image-wrapper {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  height: auto;
  max-width: min(100%, 300px);
}

.card-header {
  display: flex;
  align-items: center;
  align-self: stretch;
  width: 100%;
  height: auto;
}

.card-header .titulo {
  color: map-get($body-text, body-color);
  width: 100%;
  word-wrap: break-word;
}

.textodescritivo {
  color: map-get($gray, 600);
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  word-wrap: break-word;
}

.value {
  color: map-get($green, 500);
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: 'Montserrat';
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  padding: 0;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Chart container style */
.chart-container {
  width: 100%;
  height: auto;
  min-height: auto;
  padding: 8px;
  box-sizing: border-box;
}
</style>
