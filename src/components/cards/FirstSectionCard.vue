<!-- urbverde-ui/src/components/cards/FirstSectionCard.vue -->
<template>
  <template v-if="hasValidCards">
    <CardBase
      class="first-card"
      v-for="(item, index) in filteredData"
      :key="index"
      :title="item.title"
      :subtitle="item.subtitle"
      :value="item.value"
    >
    </CardBase>
  </template>
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
  computed: {
    // Filter out items with unavailable data
    filteredData() {
      if (!this.data || !this.data.length) {return [];}

      return this.data.filter(item => {
        if (!item.value) {return false;}

        const errorValues = [
          'Dados indisponíveis',
          'Dados não Disponíveis',
          'N/A',
          'Indisponível',
          '',
        ];

        return !errorValues.includes(item.value.trim());
      });
    },

    // Check if there are any valid cards to display
    hasValidCards() {
      return this.filteredData.length > 0;
    }
  }
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
