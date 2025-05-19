<!-- urbverde-ui/src/components/cards/vegetation/vgraphics/VGraphicGenerator.vue -->
<template>
  <CardBase
    class="graphic-card"
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :subtitle="item.subtitle"
    :value="item.value"
    graphic
    :xLabel="xLabel"
    :yLabel="yLabel"
    :xData="xData"
    :yData="yData"
    :dataType="dataType"
    :showAverage="showAverage"
    :averageLineColor="averageLineColor"
    :averageLineDash="averageLineDash"
    :averageLineWidth="averageLineWidth"
    :averageLabel="averageLabel"
  >
    <slot></slot>
  </CardBase>
</template>

<script>
import CardBase from '@/components/cards/components-cards/cardsGraph/cardGraphBase.vue';

export default {
  name: 'GraphicGenerator',
  components: {
    CardBase,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    xData: {
      type: Array,
      default: () => [],
    },
    yData: {
      type: Array,
      default: () => [],
    },
    xLabel: {
      type: String,
      default: '',
    },
    yLabel: {
      type: String,
      default: '',
    },
    dataType: {
      type: String,
      default: 'Dados',
    },
    // Historical average line properties
    showAverage: {
      type: Boolean,
      default: true,
    },
    averageLineColor: {
      type: String,
      default: 'rgba(255, 99, 132, 1)', // Red by default
    },
    averageLineDash: {
      type: Array,
      default: () => [5, 5], // Dashed line by default
    },
    averageLineWidth: {
      type: Number,
      default: 2,
    },
    averageLabel: {
      type: String,
      default: 'Média histórica',
    }
  },
};
</script>

    <style scoped lang="scss">
    .graphic-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex: 1 0 0;
      align-self: stretch;
      height: auto;
      width: 100%;
    }
    </style>
