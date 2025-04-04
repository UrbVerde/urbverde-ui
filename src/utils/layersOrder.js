/**
 * Ordem principal das camadas
 */
const LAYER_ORDER = [
  'base-municipalities', // Camada transparente de municípios
  'selected-municipality-fill', // Camada de hover de municípios
  'municipalities-base-outline', // Camada de contorno de municípios
  'parks-layer', // Camada de parques nacionais
  'dynamic-layer-outline', // Camada de setor censitário
  'dynamic-layer', // Camada selecionada
];

/**
   * Função básica: move cada camada primeiro da próxima definida em LAYER_ORDER.
   */
export function reorderLayers(map) {
  if (!map) {return;}

  for (let i = LAYER_ORDER.length - 1; i >= 0; i--) {
    const layer = LAYER_ORDER[i];
    if (map.getLayer(layer)) {
      // Move cada camada para o topo, em ordem
      map.moveLayer(layer);
    }
  }
}

/**
   * Move todas as camadas do tipo 'symbol' (normalmente labels) para o topo,
   * garantindo que os rótulos do basemap fiquem acima das suas camadas.
   */
export function bringBasemapLabelsToFront(map) {
  if (!map) {return;}

  const layers = map.getStyle().layers || [];
  layers.forEach(layer => {
    if (layer.type === 'symbol') {
      map.moveLayer(layer.id);
    }
  });
  console.log('[layerOrder] Labels (symbol) movidos para o topo.');
}

/**
   * Exemplo de função auxiliar que chama reorderLayers e depois
   * bringBasemapLabelsToFront em sequência, se você quiser encurtar chamadas.
   */
export function reorderAllLayers(map) {
  reorderLayers(map);
  bringBasemapLabelsToFront(map);
}
