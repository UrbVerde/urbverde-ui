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

<style scooped lang="scss">
.second-card {
  width: 246px;
  height: 208px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
}

.second-card .titulo{
  padding:  24px 24px 16px 24px;
}

.second-card .textodescritivo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
  padding: 16px 24px 24px 24px;
  text-align: justify;
  color: map-get($gray, 600);
}

.second-card .value {
  display: flex;
  padding: 0px 32px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  color: var(--Green-500, #198754);
  text-align: center;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: Montserrat;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
}
</style>
