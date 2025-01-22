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
      @mounted="console.log($el.classList)"
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

<style>
.see-card {
  height: 187px;
  width: 336px;
}

.see-card .titulo {
  padding: 24px 24px 16px 24px;
  display: flex;
  align-items: center;
  align-self: stretch;
  color: var(--Body-Text-Body-Color, #212529);

  /* Heading/H6 */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 19.2px */
}

.see-card .value {
  padding: 0px 32px;
  color: var(--Green-500, #198754);
  text-align: center;

  /* Small Shadow */
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: Montserrat;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 48px */
}
.card-button {
  margin-top: 16px;
  padding: 8px 32px; /* Ajuste do espaçamento interno */
  display: inline-flex; /* Garante alinhamento do conteúdo */
  justify-content: center; /* Centraliza texto e ícone */
  align-items: center; /* Centraliza verticalmente */
}


.empty-message {
  text-align: center;
  font-size: 16px;
  color: #6B7280; /* Cinza médio */
}
</style>
