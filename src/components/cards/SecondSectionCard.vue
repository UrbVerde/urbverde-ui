<!-- urbverde-ui/src/components/cards/weather/HeatCard.vue -->
<template>
  <CardBase
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :subtitle="item.subtitle"
    :value="item.value"
    class="second-card"
  />
</template>

<script>
import CardBase from '@/components/cards/Card.vue';

export default {
  name: 'SecondCard',
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

<style scoped lang="scss">

.second-card {
  width: 100%;
  height: auto;
  padding: 24px;
}
</style>
