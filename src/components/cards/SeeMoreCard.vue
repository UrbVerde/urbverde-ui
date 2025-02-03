<template>
  <CardBase
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :value="item.value"
    class="see-card"
  >
    <div class="botao">
      <PrimaryButton
        label="Ver no Mapa"
        :filled="false"
        icon="bi-map"
        iconType="bootstrap"
        iconPosition="left"
        class="card-button"
        @click="$emit('change-layer', index)"
      />
    </div>
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
  emits: ['change-layer'],
};
</script>

<style scoped lang="scss">

.see-card{
  padding: 24px 32px 24px 32px;
}

</style>
