<!-- urbverde-ui/src/components/cards/SeeMoreCard.vue -->
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
};
</script>

<style>
.see-card {
  height: 187px;
  width: 336px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.see-card .titulo {
  padding:  24px 24px 16px 24px;
}

.see-card .card-cantent {
  text-align: left;
  margin: 0px 32px;
}

.card-cantent {
  text-align: left;
  margin: 0px 32px;
}
.see-card .value {
  font-family: Montserrat;
  font-size: 40px;
  font-weight: 700;
  color: var(--Green-500, #198754);
  text-align: left;
  margin: 0px 32px;
  gap: 16px;
}
.botao {
  padding: 16px 32px 24px 32px;
}

.see-card .card-button {
  padding: 16px 32px 24px 32px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
