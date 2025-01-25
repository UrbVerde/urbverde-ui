<template>
  <div
    class="product"
    v-if="windowWidth >= 600"
  >
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

  <div
    class="product"
    v-else
  >
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

export default {
  name: 'HomeProduct',
  components: {
    PrimaryButton,
  },

  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },

  methods: {
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
  .product {
    display: flex;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
    justify-content: center;
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
  }

  .button-primary-link {
    color: map-get($green, 600);
    text-decoration: none;
  }

  // Desktop screen small
  @media screen and (max-width: 1281px) {

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

  }

  // Tablet screen
  @media screen and (max-width: 1026px) {

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

  }

  // Mobile screen small
  @media screen and (max-width: 481px) {

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

  }

  </style>
