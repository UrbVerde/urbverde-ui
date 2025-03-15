<template>
  <div class="">
    <CardBase
      :title="title"
      :subtitle="subtitle"
      :value="data"
      imagePosition="top"
      class="info-card"
    >
      <template #image>
        <img :src="cardImage" alt="Ilustração" class="card-image" />
      </template>
      <slot></slot>
    </CardBase>
  </div>
</template>

<script>
import CardBase from '@/components/cards/Card.vue';
import WarmingImage from '@/assets/images/cards/warming.png';
import CoolingImage from '@/assets/images/cards/cooling.png';

export default {
  name: 'GraphicData',
  components: {
    CardBase,
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    }
  },
  computed: {
    cardImage() {
      if (this.subtitle.includes('acima')) {
        return WarmingImage;
      } else if (this.subtitle.includes('abaixo')) {
        return CoolingImage;
      }

      // Default image if subtitle doesn't match
      return WarmingImage;
    }
  }
};
</script>

<style scoped lang="scss">
.info-card {
  width: 100%;
  height: auto;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  padding: 48px 40px 48px 40px;
}

.graphic-data-card .textodescritivo {
  margin-top: 12px;
  color: map-get($gray, 600);
}

.card-image {
  width: 100%;
  height: auto;
  align-self: center;
  margin-bottom: 54px;
}
</style>
