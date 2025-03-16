<!-- urbverde-ui/src/components/cards/RankingCard.vue -->
<template>
  <CardBase v-if="hasValidData">
    <div class="rank-card-container">
      <div class="rank-card-header">
        <h3 class="rank-card-title heading-h5">{{ data.title }}</h3>
        <p class="rank-card-subtitle body-small-medium">{{ data.subtitle }}</p>
      </div>

      <div v-if="validItems.length > 0" class="rank-card-sections">
        <div class="rank-card-section" v-for="(item, index) in validItems" :key="index">
          <div class="rank-card-section-title">
            {{ item.type }}
            <!-- <template v-if="item.number === 1">🏆</template> -->
          </div>
          <div class="rank-card-section-value">
            <span class="rank-card-number" :class="rankingClass(item)">
              {{ item.number }}</span>
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
  },
  computed: {
    validItems() {
      if (!this.data.items || !this.data.items.length) {return [];}

      return this.data.items.filter(item =>
        // Ensure number and of are valid numbers
        item &&
          item.type &&
          item.number !== undefined &&
          !isNaN(Number(item.number)) &&
          item.of !== undefined &&
          !isNaN(Number(item.of))
      );
    },

    hasValidData() {
      // Check if we have a valid title and at least one valid item
      return this.data &&
        this.data.title &&
        this.validItems.length > 0;
    }
  },
  methods: {
    rankingClass(item) {
      // Calculate percentile based on the ranking number relative to the total (item.of)
      const percentile = (item.number / item.of) * 100;
      if (percentile <= 25) {
        return 'group-top';
      } else if (percentile <= 75) {
        return 'group-middle';
      } else {
        return 'group-bottom';
      }
    },
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

h3,
p {
  margin: 0;
}

.rank-card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
}

.rank-card-header {
  display: flex;
  flex-direction: column;
  padding: 0 24px 16px 32px;
  gap: 12px;
  align-self: stretch;
}

.rank-card-section-title {
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
  padding: 16px 32px 40px 32px;
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

.rank-card-number::after {
  content: "o";
  margin-left: 2px;
  font-weight: bold;
  font-size: 40%;
  vertical-align: super;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  display: inline-block;
  text-align: center;
  position: relative;
  top: -5px;
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

/* Color classes for the three ranking groups */
.group-top {
  color: #198754;
}

.group-middle {
  color: #198754 // #f7c600;
}

.group-bottom {
  color: #198754;  // red;
}

@include breakpoint-down('tablet') {
  .rank-card-title{
    font-size: 16px;
  }

  .rank-card-section-title{
    font-size: 14px;
  }
}
</style>
