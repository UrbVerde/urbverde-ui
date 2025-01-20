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

<style>
.second-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px; /* Ajuste de espaçamento entre elementos */
  padding: 16px; /* Espaçamento interno */
}

.second-card .subtitle {
  align-self: stretch;
  color: var(--Gray-600, #6C757D);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  margin: 4px 0; /* Ajuste de margem superior e inferior */
}

.second-card .value {
  color: var(--Green-500, #198754);
  text-align: left; /* Alinha o valor ao lado esquerdo */
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: Montserrat;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 48px;
  margin-bottom: 8px; /* Adiciona espaçamento inferior */
}
</style>
