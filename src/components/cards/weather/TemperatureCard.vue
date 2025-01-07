<!-- urbverde-ui/src/components/cards/weather/TemperatureCard.vue -->
<template>
  <CardBase
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :subtitle="item.subtitle"
    :value="item.value"
  />
</template>

<script>
import CardBase from '@/components/cards/Card.vue';

export default {
  name: 'TemperatureCard',
  components: {
    CardBase,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .value {
  font-size: 28px;
  font-weight: bold;
  color: var(--Green-500, #198754);
  margin: 8px 0;
}
</style>
