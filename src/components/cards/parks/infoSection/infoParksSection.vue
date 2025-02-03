<template>
  <div class="dashboard">
    <div class="left-panel">
      <InfoParks />
    </div>
    <div class="right-wrapper">
      <div class="top">
        <FirstSectionCard
          v-for="(card, index) in firstTwoCards"
          :key="index"
          :data="[card]"
          class="section-card"
        />
      </div>
      <div class="bottom">
        <FirstSectionCard
          v-for="(card, index) in lastTwoCards"
          :key="index"
          :data="[card]"
          class="section-card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InfoParks from './InfoParks.vue';
import FirstSectionCard from '../../FirstSectionCard.vue';

export default {
  components: {
    InfoParks,
    FirstSectionCard
  },

  props: {
    cityCode: {
      type: Number,
      required: true
    },
    selectedYear: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      cardData: []
    };
  },

  computed: {
    firstTwoCards() {
      return this.cardData.slice(0, 2);
    },
    lastTwoCards() {
      return this.cardData.slice(2, 4);
    }
  },

  watch: {
    cityCode: {
      handler: 'fetchData',
      immediate: true
    },
    selectedYear: {
      handler: 'fetchData',
      immediate: true
    }
  },

  methods: {
    async fetchData() {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/square/parks?city=${this.cityCode}&year=${this.selectedYear}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
}

.right-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
}

.top,
.bottom {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}

.section-card {
  flex: 1;
  border-radius: 16px;
  padding: 24px;
}
</style>
