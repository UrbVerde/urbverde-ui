<template>
  <div class="cta-content">
    <img :src="bgSrc" :alt="bgAlt" />

    <div class="cta-label container">
      <h2>
        <span class="h2-cta heading-h1" data-aos="zoom-in-up" data-aos-duration="750" data-aos-offset="850">{{ title }}</span>
      </h2>

      <div class="search" data-aos="zoom-in-up" data-aos-duration="750" data-aos-offset="850">
        <div class="search-button">
          <!--<BuscaSimples @location-updated="onLocationUpdated" /> TIRAR COMENTÁRIO AO AJUSTAR A BUSCA-->
        </div>
        <router-link :to="buttonRoute" class="button-primary-link">
          <PrimaryButton class="button-primary-link"
                         :label="buttonLabel"
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

import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  name: 'HomeCta',
  components: {
    PrimaryButton,
    BuscaSimples,
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
  mounted() {
    AOS.init();
  },
};
</script>

  <style scoped lang="scss">
  .cta-content {
    position: relative;
    width: 100vw; /* Ocupa toda a largura da tela */
    height: 700px; /* Altura fixa */
    overflow: hidden; /* Esconde partes da imagem que ultrapassam os limites */
  }

  .cta-content img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto; /* Largura automática */
    height: 100%; /* Altura total do container */
    transform: translate(-50%, -50%); /* Centraliza a imagem */
    object-fit: cover; /* Garante que a imagem preencha o espaço sem distorção */
  }

  .cta-label {
    max-width: 698px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 72px;
    top: 240px;
    transform: translate(-50%, -50%);
    left: 50%;
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
  </style>
