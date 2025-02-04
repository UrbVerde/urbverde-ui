<!-- urbverde-ui/src/components/homepage/HomeSearch.vue -->
<template>
  <div class="search">
    <div class="search-button shadow">
      <BuscaSimples @location-updated="onLocationUpdated"
                    @interaction-succeeded="handleNavigation"
                    :openDelay="0" />
    </div>
  </div>
</template>

<script>
import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'HomeSearch',
  components: {
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
  setup() {
    const router = useRouter();

    return { router };
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
    handleNavigation() {
      setTimeout(() => {
        this.router.push('/mapa');
      }, 800); // 1000 milliseconds = 1 second
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

  .search-button{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 480px;
    position: relative;
    border-radius: 99px;
  }
  </style>
