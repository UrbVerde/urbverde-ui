<!-- urbverde-ui/src/components/cards/weather/RankingCard.vue -->
<template>
  <CardBase 
    v-bind="{
      ...(data.title && { title: data.title }),
      ...(data.subtitle && { subtitle: data.subtitle }),
      titleClass: 'rank-card-title',
      subtitleClass: 'rank-card-subtitle'
    }"
  >
    <div v-if="data.items && data.items.length > 0" class="sections">
      <div class="section" v-for="(item, index) in data.items" :key="index">
        <p class="section-title">{{ item.type }}</p>
        <p class="section-value">
          <span class="value">{{ item.number }}</span>
          <span v-if="item.of" class="total"> de {{ item.of }}</span>
        </p>
      </div>
    </div>
  </CardBase>
</template>
<script>
import CardBase from '@/components/cards/Card.vue';

export default {
  name: 'RankingCard',
  components: {
    CardBase,
  },
  props: {
    data: {
      type: Object,
      required: true,
      validator: (value) =>
        typeof value.title === 'string' &&
        typeof value.subtitle === 'string' &&
        Array.isArray(value.items) &&
        value.items.every(
          (item) =>
            typeof item.type === 'string' &&
            typeof item.number === 'number' &&
            (typeof item.of === 'number' || item.of === undefined)
        ),
    },
  },
};
</script>

<style scoped>
.rank-card {
  height: 516px;
  width: 428px;
  border-radius: 16px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-top: 32px;
}

.rank-card-title {
  color: var(--Body-Text-Body-Color, #212529);

  /* Heading/H5 */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 24px */
  padding: 32px 24px 32px 24px;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 16px;
  padding: 0px 24px 16px 24px;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 16px;
  color: #6c757d;
}

.section-value {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.value {
  color: #28a745;
}

.total {
  color: #6c757d;
}
</style>
