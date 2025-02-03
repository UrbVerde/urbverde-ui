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

<style>
.first-card {
  width: 322px;
  height: 175px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
  justify-content: space-betwee
}

.first-card .value {
  color: var(--Green-500, #198754);
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: Montserrat;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 33.6px;
  padding: 0 32px;
}

.first-card .titulo{
  padding:  24px 24px 16px 24px;
}

.first-card .textodescritivo {
  color: var(--Gray-600, #6C757D);
  padding: 16px 24px 24px 24px;
  min-height: 48px;
}
</style>
