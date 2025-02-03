<!-- urbverde-ui/src/components/homepage/HomeSearch.vue -->
<template>
  <div class="search">
    <div class="search-button">
      <BuscaSimples @location-updated="onLocationUpdated" :openDelay="0" />
    </div>

    <!-- Botão para largura maiores que 600px -->
    <router-link
      v-if="windowWidth >= 600"
      :to="buttonRoute"
      class="button-primary-link">
      <PrimaryButton
        class="button-primary-link"
        :label="buttonLabel"
        :filled="filled"
        :iconType="iconType"
        :icon="icon"
        iconPosition="right"
      />
    </router-link>

    <!-- Botão para largura menores que 600px -->
    <router-link
      v-else
      :to="buttonRoute"
      class="button-primary-link-mobile">
      <PrimaryButton
        class="button-primary-link-mobile"
        :filled="filled"
        :iconType="iconType"
        :icon="icon"
        iconPosition="right"
      />
    </router-link>
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';

export default {
  name: 'HomeSearch',
  components: {
    PrimaryButton,
    BuscaSimples,
  },
  props: {
    buttonRoute: {
      type: String,
      default: '/mapa',
    },
    buttonLabel: {
      type: String,
      default: 'Acessar',
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
  data() {
    return {
      windowWidth: window.innerWidth,
    };
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

  <style scoped>
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
  </style>
