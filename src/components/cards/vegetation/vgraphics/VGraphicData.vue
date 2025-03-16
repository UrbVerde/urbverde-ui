<!-- urbverde-ui/src/components/cards/vegetation/vgraphics/VGraphicData.vue -->
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
import MoreVegetationImage from '@/assets/images/cards/moreVegetation.png';
import LessVegetationImage from '@/assets/images/cards/lessVegetation.png';

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
        return MoreVegetationImage;
      } else if (this.subtitle.includes('abaixo')) {
        return LessVegetationImage;
      }

      // Default image if subtitle doesn't match
      return LessVegetationImage;
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
