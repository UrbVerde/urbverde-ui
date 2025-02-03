<!-- urbverde-ui/src/components/cards/RankingCard.vue -->
<template>
  <CardBase>
    <div class="rank-card-container">
      <div class="rank-card-header">
        <h3 class="rank-card-title heading-h5">{{ data.title }}</h3>
        <p class="rank-card-subtitle body-small-medium">{{ data.subtitle }}</p>
      </div>

      <div v-if="data.items && data.items.length > 0" class="rank-card-sections">
        <div class="rank-card-section" v-for="(item, index) in data.items" :key="index">
          <div class="rank-card-section-title">{{ item.type }}</div>
          <div class="rank-card-section-value">
            <span class="rank-card-number">{{ item.number }}</span>
            <span class="rank-card-separator"> de </span>
            <span class="rank-card-total">{{ item.of }}</span>
          </div>
        </div>
      </div>
    </div>
  </CardBase>
</template>

<script>
import CardBase from '@/components/cards/Card.vue';

export default {
  components: { CardBase },
  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.rank-card-container {
  display: flex;
  flex-direction: column;
}

.rank-card-header {
  display: flex;
  flex-direction: column;
  padding: 32px 24px 16px 32px;
  gap: 12px;
  align-self: stretch;
}

.rank-card-section-title{
  text-align: left;
  align-self: stretch;
  color: var(--Body-Text-Body-Color, #212529);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
}

.rank-card-subtitle {
  color: var(--Gray-600, #6C757D);
  align-self: stretch
}

.rank-card-sections {
  display: flex;
  padding: 16px 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
}

.rank-card-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

.rank-card-section-value {
  display: flex;
  align-items: center;
  align-self: stretch;
  flex: 1 0 0;
}

.rank-card-number {
  color: var(--Green-500, #198754);

  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: Montserrat;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
}

.rank-card-separator {
  color: var(--Green-500, #198754);
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  margin-left: 5px;
  margin-right: 5px;
}

.rank-card-total {
  color: var(--Green-500, #198754);
font-family: Montserrat;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 120%;
}
</style>
