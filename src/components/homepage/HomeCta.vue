<template>
  <div class="cta-content">
    <img :src="bgSrc" :alt="bgAlt" />

    <div class="cta-label container">
      <h2>
        <span class="h2-cta heading-h1">{{ title }}</span>
      </h2>

      <div class="search">
        <div class="search-button">
          <BuscaSimples @location-updated="onLocationUpdated" />
        </div>

        <!-- Botão para largura maiores que 1025px -->
        <router-link
          v-if="windowWidth >= 1026"
          :to="buttonRoute"
          class="button-primary-link">
          <PrimaryButton class="button-primary-link"
                         :label="buttonLabel"
                         :filled="filled"
                         :iconType="iconType"
                         :icon="icon"
                         iconPosition="right"
          />
        </router-link>

        <!-- Botão para largura menores que 1025px -->
        <router-link
          v-else
          :to="buttonRoute"
          class="button-primary-link-mobile">
          <PrimaryButton class="button-primary-link-mobile"
                         :filled="filled"
                         :iconType="iconType"
                         :icon="icon"
                         iconPosition="right"
          />
        </router-link>

      </div>
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';
import CtaBackground from '@/assets/images/homepage/cta-background.svg';

export default {
  name: 'HomeCta',
  components: {
    PrimaryButton,
    BuscaSimples,
  },

  return: {
    CtaBackground,
  },

  data() {
    return {
      windowWidth: window.innerWidth,
    };
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
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },

  mounted() {
    window.addEventListener('resize', this.updateWindowWidth);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth);
  },

};

</script>

  <style scoped lang="scss">
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

  .search {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-direction: row;
  }

  .button-primary-link {
    width: 143px;
    height: 48px;
    text-decoration: none;
    margin: 0;
    padding: 0;
  }

  .button-primary-link-mobile {
    width: 56px;
    height: 48px;
    text-decoration: none;
    margin: 0;
    padding: 0;
  }

  // Desktop screen large
  @media screen and (min-width: 1922px) {

    .cta-content {
      height: 800px;
    }

    .cta-content img{
      width: 100%;
      object-position: bottom;
    }

  }

  // Desktop screen small
  @media screen and (max-width: 1281px) {

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

  // Tablet screen
  @media screen and (max-width: 1026px) {

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

  // Mobile screen large
  @media screen and (max-width: 601px) {

    .cta-content {
      height: 550px;
    }

    .cta-label {
      top: 160px;
    }

  }

  // Mobile screen small
  @media screen and (max-width: 481px) {

    .h2-cta {
      font-size: 32px;
    }

  }

  </style>
