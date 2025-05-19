<!-- urbverde-ui/src/components/cards-new/cards-aux/cardPrimaryButton.vue -->
<template>
  <div class="button-wrapper">
    <PrimaryButton
      label="Ver no Mapa"
      :filled="false"
      icon="bi-map"
      iconType="bootstrap"
      iconPosition="left"
      class="card-button"
      @click="handleClick"
    />
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import { useLocationStore } from '@/stores/locationStore';
import { useRouter } from 'vue-router';

export default {
  name: 'CardPrimaryButton',
  components: {
    PrimaryButton,
  },
  props: {
    cityCode: {
      type: Number,
      required: true
    },
    changeToCategory: {
      type: String,
      required: true
    },
    changeToLayerId: {
      type: String,
      required: true
    },
    layerTitle: {
      type: String,
      required: true
    }
  },
  setup() {
    const locationStore = useLocationStore();
    const router = useRouter();

    return {
      locationStore,
      router
    };
  },
  methods: {
    handleClick() {
      const currentYear = this.locationStore.year || '2021';

      // Navigate directly using window.location.href
      window.location.href = `https://urbverde.iau.usp.br/mapa?code=${this.cityCode}&type=city&year=${currentYear}&category=${this.changeToCategory}&layer=${this.changeToLayerId}&scale=intraurbana`;
    }
  }
};
</script>

<style scoped lang="scss">
.button-wrapper {
  display: flex;
  width: 100%;
  margin-top: 0px !important;
}

:deep(.primary-button) {
  display: flex;
  width: 100%;
}
</style>
