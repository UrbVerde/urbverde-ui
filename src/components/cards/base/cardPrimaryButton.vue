<!-- urbverde-ui/src/components/cards/base/cardPrimaryButton.vue -->
<template>
  <div class="button-wrapper">
    <PrimaryButton
      :label="buttonLabel"
      :filled="false"
      :icon="buttonIcon"
      iconType="bootstrap"
      :iconPosition="buttonIconPosition"
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
    },
    // Propriedades para personalizar o botão
    buttonLabel: {
      type: String,
      default: 'Ver no Mapa'
    },
    buttonIcon: {
      type: String,
      default: 'bi-map'
    },
    buttonIconPosition: {
      type: String,
      default: 'left',
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
      const currentYear = this.locationStore.currentYear;
      const currentViewMode = this.locationStore.viewMode;

      // Navigate directly using window.location.href
      window.location.href = `https://urbverde.iau.usp.br/mapa?code=${this.cityCode}&viewMode=${currentViewMode}&type=city&year=${currentYear}&category=${this.changeToCategory}&layer=${this.changeToLayerId}&scale=intraurbana`;
    }
  }
};
</script>

<style scoped lang="scss">
.button-wrapper {
  display: flex;
  width: 100%;
  max-width: 320px;
  margin-top: 0px !important;
  margin: auto;
}

:deep(.primary-button) {
  display: flex;
  width: 100%;
}
</style>
