<!-- urbverde-ui/src/components/homepage/HomeCta.vue -->
<template>
  <div class="cta-content">
    <img :src="bgSrc" :alt="bgAlt" />

    <div class="cta-label container">
      <h2>
        <span class="h2-cta heading-h1">{{ title }}</span>
      </h2>

      <HomeSearch
        @location-updated="onLocationUpdated"
        :buttonRoute="buttonRoute"
        :buttonLabel="buttonLabel"
        :filled="filled"
        :iconType="iconType"
        :icon="icon"
      />
    </div>
  </div>
</template>

<script>
import HomeSearch from './HomeSearch.vue';
import CtaBackground from '@/assets/images/homepage/cta-background.svg';

export default {
  name: 'HomeCta',
  components: {
    HomeSearch,
  },

  return: {
    CtaBackground,
  },

  props: {
    bgSrc: {
      type: String,
      default: CtaBackground,
    },
    bgAlt: {
      type: String,
      default: 'Paisagem natural com pessoas plantando árvores para um futuro sustentável',
    },
    title: {
      type: String,
      default: 'Conheça mais sobre sua cidade!',
    },
    buttonLabel: {
      type: String,
      default: 'Acessar',
    },
    buttonRoute: {
      type: String,
      default: '/mapa',
    },
    filled: {
      type: Boolean,
      default: true,
    },
    iconType: {
      type: String,
      default: 'bootstrap',
    },
    icon: {
      type: String,
      default: 'bi bi-arrow-right',
    },
  },

  methods: {
    onLocationUpdated(location) {
      this.$emit('location-updated', location);
    },
  },
};

</script>

  <style scoped lang="scss">
  @import '@/assets/styles/breakpoints.scss';

  .cta-content {
    position: relative;
    width: 100vw;
    height: 700px;
    overflow: hidden;
  }

  .cta-content img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: 100%;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }

  .cta-label {
    max-width: 698px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 72px;
    top: 220px;
    transform: translate(-50%, -50%);
    left: 50%;
    margin: 0;
    padding: 0;
  }

  .cta-label h2{
    margin: 0;
    padding: 0;
  }

  .h2-cta {
    padding: 0;
    margin: 0;
    color: map-get($primary-fade, 800);
    text-align: center;
    font-size: 48px;
    font-weight: 700;
    display: flex;
  }

  @include breakpoint-up('desktop-large') {

    .cta-content {
      height: 800px;
    }

    .cta-content img{
      width: 100%;
      object-position: bottom;
    }

  }

  @include breakpoint-down('desktop-small') {

    .h2-cta {
      font-size: 40px;
    }

    .cta-content {
      height: 650px;
    }

    .cta-label {
      top: 200px;
    }

  }

  @include breakpoint-down('tablet') {

    .h2-cta {
      font-size: 36px;
    }

    .cta-content {
      height: 600px;
    }

    .cta-label {
      top: 180px;
      padding: 0px 24px;
    }

  }

  @include breakpoint-down('mobile-large') {

    .cta-content {
      height: 550px;
    }

    .cta-label {
      top: 160px;
    }

  }

  @include breakpoint-down('mobile-medium') {

    .h2-cta {
      font-size: 32px;
    }

  }

  </style>
