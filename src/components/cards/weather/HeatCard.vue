<!-- urbverde-ui/src/components/cards/weather/HeatCard.vue -->
<template>
  <CardBase
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :subtitle="item.subtitle"
    :value="item.value"
    class="value-heat"
  />
</template>

<script>
import CardBase from '@/components/cards/Card.vue';

export default {
  name: 'HeatCard',
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

  .value-heat {
    color: var(--Green-500, #198754);
    text-align: center;

    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    font-family: Montserrat;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 48px;
  }

  </style>
