/**
 * Ordem principal das camadas, indo do "fundo" para o "topo"
 */
const LAYER_ORDER = [
  'dynamic-layer', // Camada selecionada
  'dynamic-layer-outline', // Camada de setor censitário
  'setores-layer', // Camada de setores censitários com hover
  'parks-layer', // Camada de parques nacionais
  'base-municipalities', // Camada transparente de municípios
  'municipalities-base-outline', // Camada de contorno de municípios
  'selected-municipality-fill', // Camada de hover de municípios
];

/**
   * Função básica: move cada camada antes da próxima definida em LAYER_ORDER.
   */
export function reorderLayers(map) {
  if (!map) {return;}

  for (let i = 0; i < LAYER_ORDER.length; i++) {
    const current = LAYER_ORDER[i];
    const next = LAYER_ORDER[i + 1];

    if (map.getLayer(current)) {
      // Se existir "próxima camada" e ela também estiver presente no mapa:
      if (next && map.getLayer(next)) {
        map.moveLayer(current, next);
      } else {
        // Caso contrário, move sem parâmetro, que joga pro topo
        map.moveLayer(current);
      }
    }
  }
  console.log('[layerOrder] Reordenadas as camadas definidas em LAYER_ORDER.');
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
