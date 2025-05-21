<!-- urbverde-ui/src/components/cards/components-cards/cardsGraph/graphics-base/PizzaGraphic.vue -->
<!-- PizzaGraphic.vue -->
<template>
  <div class="pizza-chart-wrapper" ref="chartContainer">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  name: 'PizzaGraphic',
  props: {
    // Data can be passed in two ways:
    // 1. Through chartData object (preferred for Pizza charts)
    chartData: {
      type: Object,
      default: () => ({}),
    },
    // 2. Through xData (labels) and yData (values) arrays (for compatibility)
    xData: {
      type: Array,
      default: () => [],
    },
    yData: {
      type: Array,
      default: () => [],
    },
    dataType: {
      type: String,
      default: 'Data',
    },
    // Pizza chart specific props
    chartColors: {
      type: Array,
      default: () => [
        'rgba(76, 175, 80, 0.8)',    // Green
        'rgba(33, 150, 243, 0.8)',   // Blue
        'rgba(255, 193, 7, 0.8)',    // Amber
        'rgba(156, 39, 176, 0.8)',   // Purple
        'rgba(244, 67, 54, 0.8)',    // Red
        'rgba(0, 188, 212, 0.8)',    // Cyan
        'rgba(255, 152, 0, 0.8)',    // Orange
        'rgba(96, 125, 139, 0.8)'    // Blue Grey
      ],
    },
    borderColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.8)',
    },
    borderWidth: {
      type: Number,
      default: 1,
    },
    // Default color and background color for compatibility
    chartColor: {
      type: String,
      default: '#4CAF50',
    },
    chartBgColor: {
      type: String,
      default: 'rgba(76, 175, 80, 0.1)',
    },
    // Display options
    showLegend: {
      type: Boolean,
      default: true,
    },
    showPercentage: {
      type: Boolean,
      default: true,
    },
    doughnut: {
      type: Boolean,
      default: false,
    },
    cutout: {
      type: [String, Number],
      default: '50%',
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    // Process the data for the Pizza chart
    processedData() {
      // If chartData is provided, use it directly
      if (this.chartData && this.chartData.labels && this.chartData.values) {
        return {
          labels: this.chartData.labels,
          values: this.chartData.values
        };
      }

      // Otherwise, use xData and yData
      return {
        labels: this.xData,
        values: this.yData
      };
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      if (!this.$refs.chartCanvas) {return;}

      const ctx = this.$refs.chartCanvas.getContext('2d');
      const { labels, values } = this.processedData;

      // Create chart configuration
      const config = {
        type: this.doughnut ? 'doughnut' : 'pizza',
        data: {
          labels,
          datasets: [{
            label: this.dataType,
            data: values,
            backgroundColor: this.getColors(values.length),
            borderColor: this.borderColor,
            borderWidth: this.borderWidth,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: this.doughnut ? this.cutout : 0,
          plugins: {
            legend: {
              display: this.showLegend,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: this.showPercentage ? this.getTooltipLabel : null
              }
            }
          }
        }
      };

      // Create the chart
      this.chart = new Chart(ctx, config);
    },

    // Get colors for chart segments
    getColors(count) {
      // If we have specific colors for each segment
      if (this.chartColors.length >= count) {
        return this.chartColors.slice(0, count);
      }

      // Otherwise, generate colors by rotating through the available colors
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(this.chartColors[i % this.chartColors.length]);
      }

      return colors;
    },

    // Format tooltip to show percentage
    getTooltipLabel(context) {
      const dataset = context.dataset;
      const total = dataset.data.reduce((acc, data) => acc + data, 0);
      const value = dataset.data[context.dataIndex];
      const percentage = ((value / total) * 100).toFixed(1);

      return `${context.label}: ${value} (${percentage}%)`;
    },

    updateChart() {
      if (!this.chart) {return;}

      const { labels, values } = this.processedData;

      // Update data
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;
      this.chart.data.datasets[0].backgroundColor = this.getColors(values.length);

      // Update chart type if doughnut option changed
      if ((this.chart.config.type === 'pizza' && this.doughnut) ||
            (this.chart.config.type === 'doughnut' && !this.doughnut)) {
        this.chart.destroy();
        this.initChart();

        return;
      }

      // Update cutout if it's a doughnut chart
      if (this.doughnut) {
        this.chart.options.cutout = this.cutout;
      }

      // Update legend display
      this.chart.options.plugins.legend.display = this.showLegend;

      // Update tooltip callback for percentage
      if (this.showPercentage) {
        this.chart.options.plugins.tooltip.callbacks.label = this.getTooltipLabel;
      } else {
        this.chart.options.plugins.tooltip.callbacks.label = null;
      }

      this.chart.update();
    }
  },
  watch: {
    chartData: {
      handler() {
        this.updateChart();
      },
      deep: true
    },
    xData() {
      this.updateChart();
    },
    yData() {
      this.updateChart();
    },
    doughnut() {
      this.updateChart();
    },
    cutout() {
      this.updateChart();
    },
    showLegend() {
      this.updateChart();
    },
    showPercentage() {
      this.updateChart();
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
};
</script>

  <style scoped>
  .pizza-chart-wrapper {
    width: 100%;
    height: 100%;
  }
  </style>
