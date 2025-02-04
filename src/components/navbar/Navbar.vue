<!-- urbverde-ui/src/components/navbar/Navbar.vue -->
<template>
  <div class="navbar">
    <div class="response">
      <!-- Primeira linha: Título e Botões -->
      <div class="header">
        <div class="header-left heading-h5">
          <h5>[ {{ layer }} ] em {{ cityName }}-{{ uf }}</h5>
        </div>
        <div class="header-right">
          <button @click="shareMap" class="share-button">
            <img src="../../assets/icons/share.svg" alt="Compartilhar" />
          </button>

          <a
            href="https://urbverde-educa.tawk.help/category/categorias-e-camadas"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button @click="layerInfo" class="info-button">
              <img src="../../assets/icons/info.svg" alt="Entender esse dado" />
              <p class="body-small-regular">Entender esse dado</p>
            </button>
          </a>

        </div>
      </div>

      <!-- Segunda linha: Navegação -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="navigateTo(tab.id)"
          :class="{ 'active-tab': activeSection === tab.id }"
          class="tab-button"
        >
          <p class="body-small-medium">{{ tab.label }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useLocationStore } from '@/stores/locationStore';

export default {
  name: 'AppNavbar',
  props: {
    activeSection: {
      type: String,
      required: true
    }
  },

  setup() {
    const locationStore = useLocationStore();

    const layer = computed(() => locationStore.currentLayerName);  // Use currentLayerName instead
    console.log('Navbar computed - current layer:', locationStore.currentLayerName);
    const cityName = computed(() => locationStore.nm_mun);
    const uf = computed(() => locationStore.uf);

    return {
      layer,
      cityName,
      uf
    };
  },

  data() {
    return {
      tabs: [
        { id: 'map', label: 'Mapa' },
        { id: 'stats', label: 'Estatísticas' },
        { id: 'ranking', label: 'Ranking' },
      ]
    };
  },

  methods: {
    navigateTo(sectionId) {
      this.$emit('navigate-to', sectionId);
    },
    shareMap() {
      // Get current URL with query params for sharing
      const url = window.location.href;
      // You could implement a share dialog here
      alert(`Compartilhar: ${url}`);
    },
    layerInfo() {
      //alert('Info do dado');
    },
  },
};
</script>

<style scoped lang="scss">
p, h5{
  margin: 0;
}

a {
  text-decoration: none;
}

.navbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10000;
  background-color: #F8F9FACC;
  box-sizing: border-box;
  padding: 32px 40px;
  display: flex;
  backdrop-filter: blur(10px);
}

.response {
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.header-left h5 {
  color: map-get($body-text, body-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Buttons */
.share-button,
.info-button {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #fff;
  border-radius: 6px;
  border: 1px solid map-get($gray, 200);
  color: map-get($body-text, body-color);
}

/* Specific sizes */

.share-button {
  display: flex;
  width: 38px;
  height: 38px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid map-get($gray, 200);
}

.info-button {
  height: 40px;
  padding: 8px 16px;
  border: 1px solid #e9ecef;
}

.share-button img {
  width: 40x;
  height: 40px;
}

.info-button img {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

/* Tabs */
.tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button {
  background-color: transparent;
  border: none;
  padding: 4px 16px;
  font-size: 14px;
  cursor: pointer;
  color: map-get($theme, secondary);
}

.tab-button:hover {
  color: map-get($theme, primary);
}

.active-tab {
  background-color: map-get($primary-fade, 100);
  color: map-get($theme, primary);
  border-radius: 16px;
  padding: 4px 16px;
  font-weight: 600;
}
</style>
