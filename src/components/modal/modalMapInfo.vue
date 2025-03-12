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
  'Temperatura de superfície': 'ERMIDA, S. L. et al. "Google Earth Engine open-source code for Land Surface Temperature estimation from the Landsat series". Remote Sensing, v. 12, n. 9, p. 1471, 2020.',
  'Temperatura máxima de superfície': 'ERMIDA, S. L. et al. "Google Earth Engine open-source code for Land Surface Temperature estimation from the Landsat series". Remote Sensing, v. 12, n. 9, p. 1471, 2020.',
  'Nível de exposição à ilha de calor': 'Instituto Brasileiro de Geografia e Estatística (IBGE), NASA, ERMIDA, S. L. "Google Earth Engine Open-Source Code for Land Surface Temperature Estimation from the Landsat Series". Remote Sensing, 2020.',

  'Cobertura vegetal (PCV)': 'SMALL, C.; MILESI, C. Multi-scale standardized spectral mixture models. Remote Sensing Of Environment, Amsterdã, v. 136, p. 442–54, 19 jan. 2013.',
  'Desigualdade sociambiental (IDSA)': 'Toppa, R. H.; Martines, M. R. Análise ambiental de áreas de interesse para o estabelecimento de unidades de conservação para a proteção dos mananciais do município de Araçoiaba da Serra, Estado de São Paulo. São Paulo, SP: Ed. dos autores, 2021.',
  'Cobertura vegetal por satélite': 'SMALL, C.; MILESI, C. Multi-scale standardized spectral mixture models. Remote Sensing Of Environment, Amsterdã, v. 136, p. 442–54, 19 jan. 2013.',
  'Vigor da vegetação (NDVI)': 'Rouse, J.W., Jr.; Haas, R.H.; Schell, J.; Deering, D. Monitoring the Vernal Advancement and Retrogradation (Green Wave Effect) of Natural Vegetation; Technical Report; 1973.',
  'Cobertura vegetal por habitante (ICV)': 'Dados derivados do Percentual de Cobertura Vegetal (PCV) e Censo IBGE.',

  'Distância media até as praças': 'PIPAE. Relatório Metodológico. UrbVerde.',
  'Área de praças por habitante': 'UN-Habitat (2018). SDG Indicator 11.7.1 Training Module: Public Space. United Nations Human Settlement. NUCCI, J. C. (2008).',
  'Área atendida pelas praças': 'FANTIN, M.; PEDRASSOLI, J. C.; MELO, B. M. de; MENEZES, G. P.; MARTINES, M. R. "Inteligência geográfica na construção de políticas públicas: rumo à plataforma de monitoramento de áreas verdes urbanas do Estado de São Paulo". Interações, v. 23, p. 907-922, 2022.',
  'População atendida pelas praças': 'FANTIN, M. et al. "Inteligência geográfica na construção de políticas públicas: rumo à plataforma de monitoramento de áreas verdes urbanas do Estado de São Paulo". Interações, v. 23, pp. 907-922, 2022.',
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
