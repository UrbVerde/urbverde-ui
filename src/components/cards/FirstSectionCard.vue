<!-- urbverde-ui/src/components/cards/FirstSectionCard.vue -->
<template>
  <CardBase
    class="first-card"
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :subtitle="item.subtitle"
    :value="item.value"
  >
  </CardBase>

</template>

<script>
import CardBase from './Card.vue';

export default {
  name: 'FirstCard',
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
.first-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
  height: auto;
}
</style>
