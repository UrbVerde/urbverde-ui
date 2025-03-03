<!-- urbverde-ui/src/components/homepage/HomeProduct.vue -->
<template>

  <!-- Div para resolucao em DESKTOP -->
  <div
    class="product"
    v-if="largerThan('mobile_large')"
  >
    <span class="effect-product"></span>
    <div class="image-wrapper">
      <!-- Imagem de fundo (bg) -->
      <img
        :src="imageBgSrc"
        :alt="imageBgAlt"
        class="image-bg shadow-lg"
        loading="lazy"
      />

      <!-- Imagem frontal (front) -->
      <img
        :src="imageFrontSrc"
        :alt="imageFrontAlt"
        class="image-front shadow-lg"
        loading="lazy"
      />
    </div>

    <div class="product-text">
      <div class="title">
        <h3 class="heading-h2">
          {{ title }}
        </h3>
        <h4 class="body-normal-regular">
          {{ description }}
        </h4>
      </div>

      <!-- Botão que utiliza rota (Vue Router) -->
      <router-link
        :to="buttonRoute"
        class="button-primary-link"
      >
        <PrimaryButton
          :label="buttonLabel"
          :filled="filled"
          :icon="icon"
          :iconType="iconType"
          iconPosition="right"
        />
      </router-link>
    </div>
  </div>

  <!-- Div para resolucao em MOBILE -->
  <div
    class="product"
    v-else
  >
    <span class="effect-product"></span>
    <div class="product-text">
      <div class="title">
        <h3 class="heading-h2">
          {{ title }}
        </h3>
      </div>
    </div>

    <div class="image-wrapper">
      <!-- Imagem de fundo (bg) -->
      <img
        :src="imageBgSrc"
        :alt="imageBgAlt"
        class="image-bg shadow-lg"
        loading="lazy"
      />

      <!-- Imagem frontal (front) -->
      <img
        :src="imageFrontSrc"
        :alt="imageFrontAlt"
        class="image-front shadow-lg"
        loading="lazy"
      />
    </div>

    <div class="product-text">

      <!-- Botão que utiliza rota (Vue Router) -->
      <router-link
        :to="buttonRoute"
        class="button-primary-link"
      >
        <PrimaryButton
          :label="buttonLabel"
          :filled="filled"
          :icon="icon"
          :iconType="iconType"
          iconPosition="right"
        />
      </router-link>
    </div>
  </div>

</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import { useWindowSize } from '@/utils/useWindowsSize';

export default {
  name: 'HomeProduct',
  components: {
    PrimaryButton,
  },

  setup() {
    const { largerThan } = useWindowSize();

    return {
      largerThan,
    };
  },

  props: {
    imageBgSrc: {
      type: String,
      required: true,
    },
    imageBgAlt: {
      type: String,
      default: '',
    },
    imageFrontSrc: {
      type: String,
      required: true,
    },
    imageFrontAlt: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
      default: false,
    },
    icon: {
      type: String,
      default: 'bi bi-arrow-right',
    },
    iconType: {
      type: String,
      default: 'bootstrap',
    },
  },
};
</script>

  <style scoped lang="scss">
  @import '@/assets/styles/breakpoints.scss';

  .product {
    display: flex;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
  }

  .effect-product {
    width: 931px;
    height: 753px;
    display: block;
    background: radial-gradient(26.73% 25.49% at 72.8% 24.58%, rgba(0, 255, 166, 0.20) 0%, rgba(68, 255, 0, 0.14) 100%);
    opacity: 75%;
    filter: blur(200px);
    transform: rotate(-28deg);
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  .image-wrapper {
    width: 530px;
    height: 397px;
    flex-shrink: 0;
    position: relative;
    margin-right: 52px;
  }

  .image-bg {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    position: absolute;
    border-radius: 21px;
  }

  .image-front {
    display: flex;
    width: 305px;
    height: 186px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    position: absolute;
    bottom: 52px;
    left: 282px;
    border-radius: 21px;
    box-shadow: -20px -20px 48px 0px rgba(0, 0, 0, 0.40);
  }

  .product-text {
    display: flex;
    padding: 0px 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex: 1 0 0;
  }

  .product-text .title {
    display: flex;
    flex-direction: column;
    padding: 0;
    justify-content: center;
    align-items: center;
    gap: 16px;
    align-self: stretch;
    color: map-get($gray, white);
    text-align: center;
  }

  .product-text .title h3{
    padding: 0;
    margin: 0;
  }

  .product-text .title h4{
    padding: 0;
    margin: 0;
    opacity: 0.75;
  }

  .button-primary-link {
    color: map-get($green, 600);
    text-decoration: none;
    z-index: 1;
  }

  @include breakpoint-down('desktop-small') {

    .image-wrapper{
      width: 375px;
      height: 281px;
      margin-right: 44px;
    }

    .image-front{
      width: 216px;
      height: 131px;
      left: 200px;
      bottom: 37px;
    }

    .product-text .title h3{
      font-size: 28px;
    }

    .effect-product {
      width: 766px;
      height: 620px;
      top: 50%;
      left: 25%;
    }

  }

  @include breakpoint-down('tablet') {

    .image-wrapper{
      width: 311px;
      height: 233px;
      margin-right: 36px;
    }

    .image-front{
      width: 180px;
      height: 110px;
      left: 165px;
      bottom: 30px;
    }

    .product-text .title h3{
      font-size: 24px;
    }

    .effect-product {
      width: 660px;
      height: 533px;
      top: 50%;
      left: 50%;
    }

  }

  @include breakpoint-down('mobile-large') {

    .effect-product {
      width: 594px;
      height: 480px;
      top: 50%;
      left: 50%;
    }

  }

  @include breakpoint-down('mobile-medium') {

    .product{
      gap: 32px
    }

    .image-wrapper{
      width: 250px;
      height: 186px;
      margin-right: 30px;
    }

    .image-front{
      width: 140px;
      height: 90px;
      left: 130px;
      bottom: 24px;
    }

    .product-text .title h3{
      font-size: 20px;
    }

    .effect-product {
      width: 520px;
      height: 420px;
      top: 50%;
      left: 50%;
    }

  }

  </style>
