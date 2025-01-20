<template>
  <CardBase
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :value="item.value"
    class="see-card"
  >
    <template #footer>
      <PrimaryButton
        label="Ver no Mapa"
        :filled="false"
        icon="bi-map" 
        iconType="bootstrap"
        iconPosition="left"
        class="card-button"
      />
    </template>
  </CardBase>
</template>

<script>
import CardBase from '@/components/cards/Card.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

export default {
  name: 'SeeMoreCard',
  components: {
    CardBase,
    PrimaryButton,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.see-more-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.value-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid var(--Gray-200, #E9ECEF);
  border-radius: 16px;
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  text-align: center;
}

.value-display {
  color: var(--Green-500, #198754);
  font-family: Montserrat, sans-serif;
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
}

.card-button {
  margin-top: 16px;
  align-self: center;
}

.empty-message {
  text-align: center;
  font-size: 16px;
  color: #6B7280; /* Cinza médio */
}
</style>
