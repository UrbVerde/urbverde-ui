<!-- urbverde-ui/src/components/cards/vegetation/vegetationCover/FieldCard.vue -->
<template>
  <div class="field-card-wrapper">
    <CardBase
      :title="titulo"
      :value="valor"
      :subtitle="descricao"
      imagePosition="top"
      class="field-base-card"
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

<style scoped lang="scss">

.field-card-wrapper {
  display: flex;
  width: 100%;
  position: relative;
}

.field-base-card {
  display: flex;
  width: 100%;
  position: relative;
  display: flex;
  padding: 48px 40px 48px 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-image {
  display: flex;
  width: 100%;
  height: auto;
  padding-bottom: 24px;
}

:deep(h2.value){
  font-size: 26px;
}

</style>
