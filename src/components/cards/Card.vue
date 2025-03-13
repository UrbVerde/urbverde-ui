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

    <!-- Chart.js integration -->
    <div class="chart-container" v-if="graphic">
      <canvas ref="chartCanvas"></canvas>
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
import { Chart } from 'chart.js/auto';

export default {
  name: 'CardBase',
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
    // Chart.js properties
    graphic: {
      type: Boolean,
      default: false,
    },
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
    dataType: {
      type: String,
      default: 'Data',
      description: 'Label for dataset displayed in the chart legend',
    },
    chartColor: {
      type: String,
      default: '#4CAF50', // Default to green (from the green 500 color)
    },
    chartBgColor: {
      type: String,
      default: 'rgba(76, 175, 80, 0.1)', // Light green with transparency
    },
    // New properties for controlling Y axis
    suggestYScale: {
      type: Boolean,
      default: true, // By default, use suggested scale based on data
    },
    paddingFactor: {
      type: Number,
      default: 0.1, // 10% padding above and below min/max by default
    },
    // New properties for historical average line
    showAverage: {
      type: Boolean,
      default: true, // By default, don't show average line
    },
    averageLineColor: {
      type: String,
      default: 'rgba(255, 99, 132, 1)', // Red line for average by default
    },
    averageLineDash: {
      type: Array,
      default: () => [5, 5], // Dashed line by default
    },
    averageLineWidth: {
      type: Number,
      default: 2, // Line width
    },
    averageLabel: {
      type: String,
      default: 'Média histórica', // Label for average line in legend
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    imageSlot() {
      return !!this.$slots.image;
    },
    // Calculate suggested min and max for Y axis
    yAxisRange() {
      if (!this.yData || this.yData.length === 0) {
        return { min: 0, max: 100 };
      }

      const validValues = this.yData.filter(val => val !== null && val !== undefined && !isNaN(val));
      if (validValues.length === 0) {
        return { min: 0, max: 100 };
      }

      const minValue = Math.min(...validValues);
      const maxValue = Math.max(...validValues);

      // Calculate range and add padding
      const range = maxValue - minValue;
      const padding = range * this.paddingFactor;

      // Ensure min is never negative unless data values are negative
      const calculatedMin = minValue >= 0 ? Math.max(0, minValue - padding) : minValue - padding;
      const calculatedMax = maxValue + padding;

      return {
        min: calculatedMin,
        max: calculatedMax
      };
    },
    // Calculate historical average from yData
    historicalAverage() {
      if (!this.yData || this.yData.length === 0) {
        return 0;
      }

      const validValues = this.yData.filter(val => val !== null && val !== undefined && !isNaN(val));
      if (validValues.length === 0) {
        return 0;
      }

      const sum = validValues.reduce((acc, val) => acc + val, 0);

      return sum / validValues.length;
    }
  },
  mounted() {
    if (this.graphic) {
      this.initChart();
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.chartCanvas) {return;}

      const ctx = this.$refs.chartCanvas.getContext('2d');
      const yAxisSettings = this.getYAxisSettings();

      // Create chart configuration
      const config = {
        type: 'line',
        data: {
          labels: this.xData,
          datasets: [{
            label: this.dataType,
            data: this.yData,
            borderColor: this.chartColor,
            backgroundColor: this.chartBgColor,
            borderWidth: 2,
            pointBackgroundColor: this.chartColor,
            tension: 0.4,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: !!this.xLabel,
                text: this.xLabel
              }
            },
            y: {
              title: {
                display: !!this.yLabel,
                text: this.yLabel
              },
              ...yAxisSettings
            }
          }
        }
      };

      // Add historical average line if enabled
      if (this.showAverage && this.yData && this.yData.length > 0) {
        this.addAverageLineToConfig(config);
      }

      // Create the chart
      this.chart = new Chart(ctx, config);
    },

    addAverageLineToConfig(config) {
      const avgValue = this.historicalAverage;

      // Add horizontal average line as an annotation
      if (!config.options.plugins) {
        config.options.plugins = {};
      }

      // Configure annotation plugin
      config.options.plugins.annotation = {
        annotations: {
          averageLine: {
            type: 'line',
            yMin: avgValue,
            yMax: avgValue,
            borderColor: this.averageLineColor,
            borderWidth: this.averageLineWidth,
            borderDash: this.averageLineDash,
            label: {
              display: true,
              content: `${this.averageLabel}: ${avgValue.toFixed(1)}`,
              position: 'end',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: this.averageLineColor,
              font: {
                weight: 'bold'
              },
              padding: 4
            }
          }
        }
      };

      // Add average line to legend
      config.data.datasets.push({
        label: this.averageLabel,
        data: Array(this.xData.length).fill(avgValue),
        borderColor: this.averageLineColor,
        borderDash: this.averageLineDash,
        borderWidth: this.averageLineWidth,
        pointRadius: 0,
        fill: false,
        tension: 0
      });
    },

    getYAxisSettings() {
      if (!this.suggestYScale) {
        return { beginAtZero: true };
      }

      return {
        min: this.yAxisRange.min,
        max: this.yAxisRange.max,
        beginAtZero: this.yAxisRange.min >= 0
      };
    },

    updateChart() {
      if (!this.chart) {return;}

      // Update main dataset
      this.chart.data.labels = this.xData;
      this.chart.data.datasets[0].data = this.yData;

      // Update y-axis scale when data changes
      if (this.suggestYScale) {
        this.chart.options.scales.y.min = this.yAxisRange.min;
        this.chart.options.scales.y.max = this.yAxisRange.max;
      }

      // Update or add average line
      if (this.showAverage) {
        const avgValue = this.historicalAverage;

        // Update annotation if it exists
        if (this.chart.options.plugins && this.chart.options.plugins.annotation) {
          if (this.chart.options.plugins.annotation.annotations.averageLine) {
            this.chart.options.plugins.annotation.annotations.averageLine.yMin = avgValue;
            this.chart.options.plugins.annotation.annotations.averageLine.yMax = avgValue;
            this.chart.options.plugins.annotation.annotations.averageLine.label.content =
              `${this.averageLabel}: ${avgValue.toFixed(1)}`;
          } else {
            // Create annotation if it doesn't exist
            this.chart.options.plugins.annotation.annotations.averageLine = {
              type: 'line',
              yMin: avgValue,
              yMax: avgValue,
              borderColor: this.averageLineColor,
              borderWidth: this.averageLineWidth,
              borderDash: this.averageLineDash,
              label: {
                display: true,
                content: `${this.averageLabel}: ${avgValue.toFixed(1)}`,
                position: 'end',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: this.averageLineColor,
                font: {
                  weight: 'bold'
                },
                padding: 4
              }
            };
          }
        } else {
          // If annotation plugin wasn't configured, reconfigure the chart
          if (!this.chart.options.plugins) {
            this.chart.options.plugins = {};
          }

          this.chart.options.plugins.annotation = {
            annotations: {
              averageLine: {
                type: 'line',
                yMin: avgValue,
                yMax: avgValue,
                borderColor: this.averageLineColor,
                borderWidth: this.averageLineWidth,
                borderDash: this.averageLineDash,
                label: {
                  display: true,
                  content: `${this.averageLabel}: ${avgValue.toFixed(1)}`,
                  position: 'end',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: this.averageLineColor,
                  font: {
                    weight: 'bold'
                  },
                  padding: 4
                }
              }
            }
          };
        }

        // Update or add dataset for the legend
        if (this.chart.data.datasets.length > 1) {
          // Update existing average line dataset
          this.chart.data.datasets[1].data = Array(this.xData.length).fill(avgValue);
        } else {
          // Add new average line dataset
          this.chart.data.datasets.push({
            label: this.averageLabel,
            data: Array(this.xData.length).fill(avgValue),
            borderColor: this.averageLineColor,
            borderDash: this.averageLineDash,
            borderWidth: this.averageLineWidth,
            pointRadius: 0,
            fill: false,
            tension: 0
          });
        }
      } else {
        // Remove average line if it exists and showAverage is false
        if (this.chart.data.datasets.length > 1) {
          this.chart.data.datasets.splice(1, 1);
        }

        // Remove annotation if it exists
        if (this.chart.options.plugins &&
            this.chart.options.plugins.annotation &&
            this.chart.options.plugins.annotation.annotations.averageLine) {
          delete this.chart.options.plugins.annotation.annotations.averageLine;
        }
      }

      this.chart.update();
    }
  },
  watch: {
    graphic(newVal) {
      if (newVal && !this.chart) {
        this.$nextTick(() => {
          this.initChart();
        });
      }
    },
    xData() {
      this.updateChart();
    },
    yData() {
      this.updateChart();
    },
    suggestYScale() {
      this.updateChart();
    },
    paddingFactor() {
      this.updateChart();
    },
    showAverage() {
      this.updateChart();
    },
    averageLineColor() {
      this.updateChart();
    },
    averageLineDash() {
      this.updateChart();
    },
    averageLineWidth() {
      this.updateChart();
    },
    averageLabel() {
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

.content-wraper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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

/* Chart.js style */
.chart-container {
  width: 100%;
  height: 300px;
  padding: 8px;
  box-sizing: border-box;
}
</style>
