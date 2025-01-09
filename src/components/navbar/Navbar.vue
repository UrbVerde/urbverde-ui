# src/components/navbar/Navbar.vue
<template>
  <div class="navbar">
    <div class="response">
      <!-- Primeira linha: Título e Botões -->
      <div class="header">
        <div class="header-left">
          <h5>[ {{ currentLayer }} ] em [ {{ cityName }} ]</h5>
        </div>
        <div class="header-right">
          <button @click="shareMap" class="share-button">
            <img src="../../assets/icons/share.svg" alt="Compartilhar" />
          </button>
          <button @click="layerInfo" class="info-button">
            <img src="../../assets/icons/info.svg" alt="Entender esse dado" />
            Entender esse dado
          </button>
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
          {{ tab.label }}
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

    // Computed properties from store
    const currentLayer = computed(() => locationStore.layer || 'layer?');
    const cityName = computed(() => locationStore.nm_mun || 'city?');

    return {
      currentLayer,
      cityName
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
      alert('Info do dado');
    },
  },
};
</script>

<style scoped>
.navbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #F8F9FACC;
  box-sizing: border-box;
  padding: 32px 40px;
  display: block;
}

.response {
  width: 100%;
  display: flex;
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
  color: var(--Body-Text-Body-Color, #212529);
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
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
  border: 1px solid #f8f9fa;
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
  background: var(--Gray-White, #FFF);
  border-radius: 6px;
  border: 1px solid #F8F9FA;
  /* box-shadow: 0 1px 3px rgba(0,0,0,0.1); */
  /* border: 1px solid var(--Gray-200, #E9ECEF); */
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
  gap: 16px;
  /* margin-top: 16px */
}

.tab-button {
  background-color: transparent;
  border: none;
  padding: 4px 24px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
}

.tab-button:hover {
  background-color: #f0f0f0;
  border-radius: 16px;
}

.active-tab {
  background-color: #d2e8dd;
  color: #025949;
  border-radius: 16px;
  font-weight: 600;
}
</style>
