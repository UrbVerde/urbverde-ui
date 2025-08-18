<!-- urbverde-ui/src/components/modal/modalDebug.vue -->
<template>
  <teleport to="body">
    <modalBootstrap
      ref="refModal"
      modalId="modalDebug"
      title="Debug - Estado do Sistema"
      bodyText=""
      primaryButtonText="Fechar"
      :primaryButtonClosesModal="true"
      @closePrimary="closeModal"
      @close="closeModal"
      class="debug-modal"
      size="lg"
    >
      <template #body>
        <div class="debug-content body-normal-regular">
          <!-- Abas -->
          <div class="tabs-container">
            <div class="tabs-header">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['tab-button', { 'active': activeTab === tab.id }]"
                :title="tab.title"
              >
                <i :class="tab.icon"></i>
                <span>{{ tab.label }}</span>
              </button>
            </div>
          </div>

          <!-- Conteúdo das Abas -->
          <div class="tab-content">
            <!-- Aba: Estado Geral -->
            <div v-if="activeTab === 'general'" class="tab-panel">
              <div class="debug-section">
                <h4>Estado Geral (LayersStore)</h4>
                <div class="debug-grid">
                  <div class="debug-item">
                    <strong>MapRef:</strong>
                    <span :class="{ 'status-ok': layersStore.mapRef, 'status-error': !layersStore.mapRef }">
                      {{ layersStore.mapRef ? 'Conectado' : 'Não conectado' }}
                    </span>
                  </div>
                  <div class="debug-item">
                    <strong>Estatísticas:</strong>
                    <span>{{ layersStore.currentStatistics || 'Não definidas' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Setores Visíveis:</strong>
                    <span :class="{ 'status-ok': layersStore.setoresVisible, 'status-warning': !layersStore.setoresVisible }">
                      {{ layersStore.setoresVisible ? 'Sim' : 'Não' }}
                    </span>
                  </div>
                  <div class="debug-item">
                    <strong>Erro:</strong>
                    <span :class="{ 'status-error': layersStore.error, 'status-ok': !layersStore.error }">
                      {{ layersStore.error || 'Nenhum erro' }}
                    </span>
                  </div>
                  <div class="debug-item">
                    <strong>Opacidade Padrão:</strong>
                    <span>{{ layersStore.defaultOpacity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aba: Localização -->
            <div v-if="activeTab === 'location'" class="tab-panel">
              <div class="debug-section">
                <h4>Informações de Localização (LocationStore)</h4>
                <div class="debug-grid">
                  <div class="debug-item">
                    <strong>Município ID:</strong>
                    <span>{{ locationStore.cd_mun || 'Não definido' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Município:</strong>
                    <span>{{ locationStore.nm_mun || 'Não definido' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>UF:</strong>
                    <span>{{ locationStore.uf || 'Não definida' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Escala:</strong>
                    <span>{{ locationStore.scale || 'Não definida' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Ano:</strong>
                    <span>{{ locationStore.year || 'Não definido' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Categoria:</strong>
                    <span>{{ locationStore.category || 'Não definida' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Camada Ativa:</strong>
                    <span>{{ locationStore.activeMainLayer || 'Não definida' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Coordenadas:</strong>
                    <span>{{ locationStore.lng && locationStore.lat ? `${locationStore.lng.toFixed(4)}, ${locationStore.lat.toFixed(4)}` : 'Não definidas' }}</span>
                  </div>
                  <div class="debug-item">
                    <strong>Zoom:</strong>
                    <span>{{ locationStore.mapState.zoom || 'Não definido' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aba: Camadas -->
            <div v-if="activeTab === 'layers'" class="tab-panel">
              <div class="debug-section">
                <h4>Camadas Ativas ({{ layersStore.activeLayers.length }})</h4>
                <div v-if="layersStore.activeLayers.length === 0" class="no-layers">
                  Nenhuma camada ativa
                </div>
                <div v-else class="layers-list">
                  <div
                    v-for="(layer, index) in layersStore.activeLayers"
                    :key="layer.id"
                    class="layer-item"
                  >
                    <div class="layer-header">
                      <span class="layer-index">{{ index + 1 }}</span>
                      <span class="layer-id">{{ layer.id }}</span>
                      <span
                        v-if="layer.currentMain"
                        class="main-badge"
                        title="Camada Principal"
                      >
                        ★
                      </span>
                    </div>
                    <div class="layer-details">
                      <div class="layer-property">
                        <strong>ID: </strong> {{ layer.id }}
                      </div>
                      <div class="layer-property">
                        <strong>Principal: </strong>
                        <span :class="{ 'status-ok': layer.currentMain, 'status-warning': !layer.currentMain }">
                          {{ layer.currentMain ? 'Sim' : 'Não' }}
                        </span>
                      </div>
                      <div class="layer-property">
                        <strong>Opacidade: </strong> {{ layer.opacity }}
                      </div>
                      <div class="layer-property">
                        <strong>Ano: </strong> {{ layer.year || 'Não definido' }}
                      </div>
                      <div class="layer-property">
                        <strong>Escala: </strong> {{ layer.scale || 'Não definida' }}
                      </div>
                      <div class="layer-property">
                        <strong>Source: </strong>
                        <span :class="{ 'status-ok': layer.source, 'status-warning': !layer.source }">
                          {{ layer.source ? 'Configurado' : 'Não configurado' }}
                        </span>
                      </div>
                      <div v-if="layer.source" class="layer-property source-details">
                        <strong>Source Details: </strong>
                        <pre>{{ JSON.stringify(layer.source, null, 2) }}</pre>
                      </div>
                      <div v-if="layer.subLayers && layer.subLayers.length > 0" class="layer-property sublayers-details">
                        <strong>Subcamadas ({{ layer.subLayers.length }}): </strong>
                        <div v-for="subLayer in layer.subLayers" :key="subLayer.id" class="sublayer-item">
                          <div class="sublayer-header">
                            <span class="sublayer-id">{{ subLayer.id }}</span>
                            <span class="sublayer-type">{{ subLayer.type }}</span>
                          </div>
                          <div class="sublayer-paint">
                            <strong>Paint: </strong>
                            <pre>{{ JSON.stringify(subLayer.paint, null, 2) }}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aba: Getters -->
            <div v-if="activeTab === 'getters'" class="tab-panel">
              <div class="debug-section">
                <h4>Getters</h4>
                <div class="debug-grid">
                  <div class="debug-item">
                    <strong>É Escala Intraurbana:</strong>
                    <span :class="{ 'status-ok': layersStore.isIntraurbanScale, 'status-warning': !layersStore.isIntraurbanScale }">
                      {{ layersStore.isIntraurbanScale ? 'Sim' : 'Não' }}
                    </span>
                  </div>
                  <div class="debug-item">
                    <strong>Tem Setores:</strong>
                    <span :class="{ 'status-ok': layersStore.hasSetores, 'status-warning': !layersStore.hasSetores }">
                      {{ layersStore.hasSetores ? 'Sim' : 'Não' }}
                    </span>
                  </div>
                  <div class="debug-item">
                    <strong>Camada Principal Atual:</strong>
                    <span>{{ layersStore.getCurrentMainLayer?.id || 'Nenhuma' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aba: Ações -->
            <div v-if="activeTab === 'actions'" class="tab-panel">
              <div class="debug-section">
                <h4>Ações Disponíveis</h4>
                <div class="actions-grid">
                  <button @click="clearLayers" class="action-btn action-danger">
                    <i class="bi bi-trash"></i>
                    Limpar Todas as Camadas
                  </button>
                  <button @click="refreshData" class="action-btn action-primary">
                    <i class="bi bi-arrow-clockwise"></i>
                    Atualizar Dados
                  </button>
                  <button @click="exportData" class="action-btn action-secondary">
                    <i class="bi bi-download"></i>
                    Exportar JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </modalBootstrap>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import modalBootstrap from './modalBootstrap.vue';
import { useLayersStore } from '@/stores/layersStore';
import { useLocationStore } from '@/stores/locationStore';

const refModal = ref(null);
const layersStore = useLayersStore();
const locationStore = useLocationStore();

// Estado da aba ativa com memória
const activeTab = ref('general');

// Configuração das abas
const tabs = [
  {
    id: 'general',
    label: 'Estado Geral',
    icon: 'bi bi-gear',
    title: 'Estado geral do sistema'
  },
  {
    id: 'location',
    label: 'Localização',
    icon: 'bi bi-geo-alt',
    title: 'Informações de localização'
  },
  {
    id: 'layers',
    label: 'Camadas',
    icon: 'bi bi-layers',
    title: 'Camadas ativas no mapa'
  },
  {
    id: 'getters',
    label: 'Getters',
    icon: 'bi bi-calculator',
    title: 'Valores calculados'
  },
  {
    id: 'actions',
    label: 'Ações',
    icon: 'bi bi-tools',
    title: 'Ações de debug'
  }
];

// Memória de estado - recupera a aba ativa quando o modal é aberto
onMounted(() => {
  const savedTab = sessionStorage.getItem('debugModalActiveTab');
  if (savedTab && tabs.find(tab => tab.id === savedTab)) {
    activeTab.value = savedTab;
  }
});

function show() {
  refModal.value.show();
}

function closeModal() {
  // Salva a aba ativa na memória antes de fechar
  sessionStorage.setItem('debugModalActiveTab', activeTab.value);
  refModal.value.hide();
}

function clearLayers() {
  if (confirm('Tem certeza que deseja limpar todas as camadas?')) {
    layersStore.clearActiveLayers();
  }
}

function refreshData() {
  // Força reatividade
  layersStore.$patch({});
}

function exportData() {
  const data = {
    timestamp: new Date().toISOString(),
    activeTab: activeTab.value,
    layersStore: {
      mapRef: !!layersStore.mapRef,
      currentMunicipioId: layersStore.currentMunicipioId,
      currentScale: layersStore.currentScale,
      currentYear: layersStore.currentYear,
      currentStatistics: layersStore.currentStatistics,
      setoresVisible: layersStore.setoresVisible,
      error: layersStore.error,
      defaultOpacity: layersStore.defaultOpacity,
      activeLayers: layersStore.activeLayers
    },
    locationStore: {
      cd_mun: locationStore.cd_mun,
      nm_mun: locationStore.nm_mun,
      uf: locationStore.uf,
      year: locationStore.year,
      scale: locationStore.scale,
      category: locationStore.category,
      activeMainLayer: locationStore.activeMainLayer,
      bbox: locationStore.bbox,
      lng: locationStore.lng,
      lat: locationStore.lat,
      mapState: locationStore.mapState
    },
    getters: {
      isIntraurbanScale: layersStore.isIntraurbanScale,
      hasSetores: layersStore.hasSetores,
      getCurrentMainLayer: layersStore.getCurrentMainLayer
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `debug-${new Date().toISOString()
    .slice(0, 19)
    .replace(/:/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Expor métodos para componentes pais
defineExpose({
  show,
  closeModal
});
</script>

<style scoped lang="scss">
.debug-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 8px;
}

// Abas
.tabs-container {
  margin-bottom: 20px;
  border-bottom: 2px solid map-get($gray, 200);
}

.tabs-header {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: map-get($gray, 600);
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    color: map-get($theme, primary);
    background-color: map-get($gray, 50);
  }

  &.active {
    color: map-get($theme, primary);
    border-bottom-color: map-get($theme, primary);
    background-color: map-get($gray, 50);
  }

  i {
    font-size: 16px;
  }
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.debug-section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid map-get($gray, 300);
  border-radius: 8px;
  background-color: map-get($gray, 50);

  h4 {
    margin: 0 0 16px 0;
    color: map-get($theme, primary);
    font-size: 16px;
    font-weight: 600;
  }
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid map-get($gray, 200);

  strong {
    color: map-get($theme, secondary);
  }
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.layer-item {
  background-color: white;
  border: 1px solid map-get($gray, 200);
  border-radius: 8px;
  overflow: hidden;
}

.layer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: map-get($gray, 100);
  border-bottom: 1px solid map-get($gray, 200);

  .layer-index {
    background-color: map-get($theme, primary);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }

  .layer-id {
    font-weight: 600;
    color: map-get($theme, secondary);
  }

  .main-badge {
    color: #f59e0b;
    font-size: 16px;
    margin-left: auto;
  }
}

.layer-details {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.layer-property {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 0;

  strong {
    color: map-get($theme, secondary);
    font-size: 16px;
  }
}

.source-details {
  grid-column: 1 / -1;

  pre {
    background-color: map-get($gray, 100);
    padding: 8px;
    border-radius: 4px;
    font-size: 10px;
    max-height: 100px;
    overflow-y: auto;
    margin: 4px 0 0 0;
  }
}

.no-layers {
  text-align: center;
  padding: 24px;
  color: map-get($gray, 500);
  font-style: italic;
}

.actions-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  i {
    font-size: 16px;
  }

  &.action-primary {
    background-color: map-get($theme, primary);
    color: white;

    &:hover {
      background-color: darken(map-get($theme, primary), 10%);
    }
  }

  &.action-secondary {
    background-color: map-get($gray, 300);
    color: map-get($theme, secondary);

    &:hover {
      background-color: map-get($gray, 400);
    }
  }

  &.action-danger {
    background-color: #ef4444;
    color: white;

    &:hover {
      background-color: #dc2626;
    }
  }
}

// Status classes
.status-ok {
  color: #10b981;
  font-weight: 600;
}

.status-warning {
  color: #f59e0b;
  font-weight: 600;
}

.status-error {
  color: #ef4444;
  font-weight: 600;
}

// Subcamadas styles
.sublayers-details {
  margin-top: 12px;
  padding: 12px;
  background-color: map-get($gray, 100);
  border-radius: 6px;
  border-left: 3px solid map-get($theme, primary);
}

.sublayer-item {
  margin-bottom: 12px;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid map-get($gray, 200);

  &:last-child {
    margin-bottom: 0;
  }
}

.sublayer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid map-get($gray, 200);
}

.sublayer-id {
  font-weight: 600;
  color: map-get($theme, primary);
  font-size: 14px;
}

.sublayer-type {
  background-color: map-get($gray, 200);
  color: map-get($gray, 700);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.sublayer-paint {
  pre {
    font-size: 11px;
    background-color: map-get($gray, 50);
    padding: 8px;
    border-radius: 4px;
    margin: 4px 0 0 0;
    overflow-x: auto;
  }
}

:global(.debug-modal .modal-title) {
  white-space: pre-line !important;
}

// Responsividade para abas
@media (max-width: 768px) {
  .tabs-header {
    gap: 2px;
  }

  .tab-button {
    padding: 8px 12px;
    font-size: 12px;

    span {
      display: none;
    }

    i {
      font-size: 18px;
    }
  }
}
</style>
