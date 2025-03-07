<!-- urbverde-ui/src/components/navbar/NavbarMap.vue -->
<template>

  <!-- Desktop version -->

  <div class="navbar"
       v-if="largerThan('tablet')"
  >
    <div class="response">
      <!-- Primeira linha: Título e Botões -->
      <div class="header">
        <div class="header-left heading-h5">
          <h5>{{ layer }} em {{ cityName }}-{{ uf }}</h5>
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
    <!-- Modal de compartilhamento -->
    <modalShare
      ref="refModalShare"
      :cityName="cityName"
      :stateName="uf"
    />
  </div>

  <!-- Mobile version -->

  <div class="navbar"
       v-else
  >
    <div class="response">
      <!-- Primeira linha: Título e Botões -->
      <div class="header">
        <div class="header-left heading-h5">
          <h5>{{ layer }} em {{ cityName }}-{{ uf }}</h5>
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

    </div>
    <!-- Modal de compartilhamento -->
    <modalShare
      ref="refModalShare"
      :cityName="cityName"
      :stateName="uf"
    />
  </div>

</template>

<script setup>
import { computed, ref } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import modalShare from '../modal/modalShare.vue';
import { useWindowSize } from '@/utils/useWindowsSize';

const { activeSection } = defineProps({
  activeSection: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['navigate-to']);
const refModalShare = ref(null);
const locationStore = useLocationStore();

const layer = computed(() => {
  console.log('Navbar computed - current layer:', locationStore.currentLayerName);

  return locationStore.currentLayerName;
});
const cityName = computed(() => locationStore.nm_mun);
const uf = computed(() => locationStore.uf);

const tabs = ref([
  { id: 'map', label: 'Mapa' },
  { id: 'stats', label: 'Estatísticas' },
  { id: 'ranking', label: 'Ranking' },
]);

const {
  largerThan
} = useWindowSize();

function navigateTo(sectionId) {
  emit('navigate-to', sectionId);
}

function shareMap() {
  refModalShare.value.show();
}

function layerInfo() {
  // Info do dado
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

p, h5{
  margin: 0;
}

a {
  text-decoration: none;
}

.navbar {
  flex-shrink: 1;
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 9;
  background-color: #F8F9FACC;
  box-sizing: border-box;
  display: flex;
  backdrop-filter: blur(10px);
  padding: 32px 40px !important;
  transition: all 0.3s ease;
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

@include breakpoint-down('desktop-small') {
  .navbar {
    padding: 24px 32px !important;
  }

  .response {
    gap: 2px;
  }

  .header-left h5 {
    font-size: 18px;
  }
}

</style>
