<!-- urbverde-ui/src/components/modal/modalMapInfo.vue -->
<template>
  <teleport to="body">
    <modalBootstrap
      ref="refModal"
      modalId="modalMapInfo"
      title="Fonte dos dados do mapa"
      bodyText=""
      primaryButtonText="Ok"
      :primaryButtonClosesModal="true"
      @closePrimary="closeModal"
      class="map-info-modal"
    >
      <template #body>
        <div class="map-info-content body-normal-regular">
          <p><strong>Basemap:</strong></p>
          <p>
            <a
              href="https://www.maptiler.com/"
              target="_blank"
              rel="noopener noreferrer">
              MapTiler
            </a> e
            <a
              href="https://www.openstreetmap.org/about"
              target="_blank"
              rel="noopener noreferrer">
              OpenStreetMap contributors
            </a>
          </p>

          <p><strong>Camadas:</strong></p>
          <p><strong>{{ currentLayer }}</strong>: {{ layerSource }}</p>
        </div>
      </template>
    </modalBootstrap>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import modalBootstrap from './modalBootstrap.vue';
import { useLocationStore } from '@/stores/locationStore';

const refModal = ref(null);
const locationStore = useLocationStore();

const currentLayer = computed(() => locationStore.currentLayerName || '');

// Objeto com fontes específicas para cada camada
const layerSources = {
  'Temperatura de superfície': 'Landsat 8 tratamento UrbVerde (2025).',
  'Temperatura máxima de superfície': 'Landsat 8 tratamento UrbVerde (2025).',
  'Nível de exposição à ilha de calor': 'Censo IBGE (2010), Landsat 8 tratamento UrbVerde (2025).',

  'Cobertura vegetal (PCV)': 'Sentinel tratamento UrbVerde (2025).',
  'Desigualdade sociambiental (IDSA)': 'Censo IBGE (2010), Sentinel tratamento UrbVerde (2025).',
  'Cobertura vegetal por satélite': 'Sentinel tratamento UrbVerde (2025).',
  'Vigor da vegetação (NDVI)': 'Sentinel tratamento UrbVerde (2025).',
  'Cobertura vegetal por habitante (ICV)': 'Censo IBGE (2010), Sentinel tratamento UrbVerde (2025).',

  'Distância media até as praças': 'Landsat 8 tratamento UrbVerde (2025). Recorte temporal de 2021 utiliza dados do IBGE (2020). Recorte temporal de 2024, utiliza dados do IBGE (2022).',
  'Distância media até as praças (>5000m²)': 'Landsat 8 tratamento UrbVerde (2025). Recorte temporal de 2021 utiliza dados do IBGE (2020). Recorte temporal de 2024, utiliza dados do IBGE (2022).',
  'Área de praças por habitante': 'Landsat 8 tratamento UrbVerde (2025). Recorte temporal de 2021 utiliza dados do IBGE (2020). Recorte temporal de 2024, utiliza dados do IBGE (2022).',
  'Área atendida pelas praças': 'Landsat 8 tratamento UrbVerde (2025). Recorte temporal de 2021 utiliza dados do IBGE (2020). Recorte temporal de 2024, utiliza dados do IBGE (2022).',
  'População atendida pelas praças (%)': 'Landsat 8 tratamento UrbVerde (2025). Recorte temporal de 2021 utiliza dados do IBGE (2020). Recorte temporal de 2024, utiliza dados do IBGE (2022).',

  'Quantidade de habitantes': 'IBGE (2022)',
  'Densidade demográfica': 'IBGE (2022)',
  'Percentual de alfabetizados': 'IBGE (2022)',
  'Renda média do responsável da casa': 'IBGE (2022)',
  'Percentual de crianças': 'IBGE (2022)',
  'Percentual de idosos': 'IBGE (2022)',
  'Percentual de mulheres': 'IBGE (2022)',
  'Percentual de homens': 'IBGE (2022)',
  'Percentual de pessoas brancas': 'IBGE (2022)',
  'Percentual de pessoas pretas': 'IBGE (2022)',
  'Percentual de pessoas pardas': 'IBGE (2022)',
  'Percentual de pessoas amarelas': 'IBGE (2022)',
  'Percentual de pessoas indigenas': 'IBGE (2022)'
};

// Fonte da camada para o modal
const layerSource = computed(() =>
// Retorna a fonte específica ou um texto padrão
  layerSources[currentLayer.value] ||
        'Ops! Ainda não há fontes específicas da camada aqui.'
);

// Função para acessar diretamente a fonte de uma camada específica
function getSourceForLayer(layerName) {
  return layerSources[layerName] || '';
}

function show() {
  refModal.value.show();
}

function closeModal() {
  refModal.value.hide();
}

// Expor métodos e dados para componentes pais
defineExpose({
  show,
  closeModal,
  getSourceForLayer,
  layerSources
});
</script>

  <style scoped lang="scss">
  .map-info-content {
    margin-bottom: 16px;
    color: map-get($body-text, body-color);
  }

  :global(.map-info-modal .modal-title) {
    white-space: pre-line !important;
  }
  </style>
