<!-- urbverde-ui/src/components/cards/weather/RankingCard.vue -->
<template>
  <CardBase :title="data.title || 'Título não disponível'" :subtitle="data.subtitle || 'Subtítulo não disponível'">

    <div v-if="data.items && data.items.length > 0" class="sections">
      <div class="section" v-for="(item, index) in data.items" :key="index">
        <p class="section-title">{{ item.type }}</p>
        <p class="section-value">
          <span class="value">{{ item.number }}</span>
          <span v-if="item.of" class="total"> de {{ item.of }}</span>
        </p>
      </div>
    </div>

    <div v-else class="no-data">
      <p>Nenhum dado disponível para exibir.</p>
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
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #343a40;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 16px;
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
