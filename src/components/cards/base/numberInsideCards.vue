<!-- urbverde-ui/src/components/cards/base/numberInsideCards.vue -->
<template>
  <div class="number-wrapper" :class="{ 'composed': type === 'composed', 'large': type === 'large' }">
    <div class="value-container">
      <span class="value">{{ value }}</span>
      <span class="unit" v-if="unit">{{ unit }}</span>
    </div>
    <span v-if="type === 'composed' && subtitle" class="subtitle">{{ subtitle }}</span>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'composed'].includes(value)
  },
  value: {
    type: [Number, String],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
.number-wrapper {

    &.composed {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 8px;
        height: 100%;
    }

    .value-container {
        display: flex;
        align-items: baseline;
        gap: 4px;
        flex-wrap: wrap;

    }

    .value, .unit {
        color: map-get($green, 500);
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 700;
        line-height: 120%;
        padding: 0;
        margin: 0;
    }

    .value {
        font-size: 28px;
    }

    .unit {
        font-size: 16px;
        font-weight: 600;
    }

    &.composed {
        .value {
            font-size: 40px;
        }

        .unit {
            font-size: 16px;
            font-weight: 600;
        }

        .subtitle {
            color: map-get($green, 500);
            text-align: left;
            text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
            font-family: Montserrat;
            font-size: 24px;
            font-style: normal;
            font-weight: 600;
            line-height: 120%;
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
        }
    }

    &.large {
        .value {
            font-size: 40px;
        }

        .unit {
            font-size: 16px;
            font-weight: 600;
        }
    }
}
</style>
