<template>
  <div class="info-field-card">
    <CardBase
      :title="titulo"
      :value="valor"
      :subtitle="descricao"
      imagePosition="top"
      class="info-card"
    >
      <template #image>
        <img :src="image" alt="Ilustração" class="card-image" />
      </template>
    </CardBase>
  </div>
</template>

<script>
import CardBase from '@/components/cards/Card.vue';
import Ilustracao from '@/assets/images/cards/img.svg';

export default {
  name: 'AreaCard',
  components: {
    CardBase,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    cityCode: {
      type: Number,
      required: true,
    },
    selectedYear: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      image: Ilustracao,
    };
  },
  computed: {
    titulo() {
      return this.data?.title || 'N/A';
    },
    valor() {
      return this.data?.value || 'N/A';
    },
    descricao() {
      return this.data?.subtitle || 'N/A';
    },
  },
};
</script>
