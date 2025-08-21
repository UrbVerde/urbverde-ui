/**
 * Gerenciador de eventos de hover para subcamadas do mapa
 */
export class HoverManager {
  constructor(layersStore) {
    this.layersStore = layersStore;
  }

  /**
   * Configura eventos de hover para as subcamadas
   * @param {string} mainLayerId - ID da camada principal
   * @param {string} outlineLayerId - ID da camada de contorno
   * @param {string} fillLayerId - ID da camada de preenchimento
   */
  setupSubLayerHoverEvents(mainLayerId, outlineLayerId, fillLayerId) {
    if (!this.layersStore.mapRef) {
      return;
    }

    const mainLayer = this.layersStore.getActiveLayers.find(l => l.id === mainLayerId);
    if (!mainLayer || !mainLayer.source?.sourceLayer) {
      return;
    }

    const sourceLayer = mainLayer.source.sourceLayer;
    let hoveredFeatureId = null;

    // Evento de mousemove na camada principal
    this.layersStore.mapRef.on('mousemove', mainLayerId, (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        const featureId = feature.id || feature.properties.cd_mun;

        if (hoveredFeatureId !== featureId) {
          // Remove hover anterior
          if (hoveredFeatureId !== null) {
            this.layersStore.mapRef.setFeatureState(
              {
                source: mainLayerId,
                sourceLayer,
                id: hoveredFeatureId
              },
              { hover: false }
            );
          }

          // Define novo hover
          hoveredFeatureId = featureId;
          this.layersStore.mapRef.setFeatureState(
            {
              source: mainLayerId,
              sourceLayer,
              id: featureId
            },
            { hover: true }
          );
        }
      }
    });

    // Evento de mouseleave na camada principal
    this.layersStore.mapRef.on('mouseleave', mainLayerId, () => {
      if (hoveredFeatureId !== null) {
        this.layersStore.mapRef.setFeatureState(
          {
            source: mainLayerId,
            sourceLayer,
            id: hoveredFeatureId
          },
          { hover: false }
        );
        hoveredFeatureId = null;
      }
    });

    // Eventos de hover também nas subcamadas para melhor responsividade
    [outlineLayerId, fillLayerId].forEach(subLayerId => {
      this.layersStore.mapRef.on('mousemove', subLayerId, (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const featureId = feature.id || feature.properties.cd_mun;

          if (hoveredFeatureId !== featureId) {
            // Remove hover anterior
            if (hoveredFeatureId !== null) {
              this.layersStore.mapRef.setFeatureState(
                {
                  source: mainLayerId,
                  sourceLayer,
                  id: hoveredFeatureId
                },
                { hover: false }
              );
            }

            // Define novo hover
            hoveredFeatureId = featureId;
            this.layersStore.mapRef.setFeatureState(
              {
                source: mainLayerId,
                sourceLayer,
                id: featureId
              },
              { hover: true }
            );
          }
        }
      });

      this.layersStore.mapRef.on('mouseleave', subLayerId, () => {
        if (hoveredFeatureId !== null) {
          this.layersStore.mapRef.setFeatureState(
            {
              source: mainLayerId,
              sourceLayer,
              id: hoveredFeatureId
            },
            { hover: false }
          );
          hoveredFeatureId = null;
        }
      });
    });

    console.log(`[HoverManager] Hover events configured for sublayers of ${mainLayerId}`);
  }

  /**
   * Remove eventos de hover das subcamadas
   * @param {string} mainLayerId - ID da camada principal
   */
  removeSubLayerHoverEvents(mainLayerId) {
    if (!this.layersStore.mapRef) {
      return;
    }

    const outlineLayerId = `${mainLayerId}_outline`;
    const fillLayerId = `${mainLayerId}_fill`;

    // Remove eventos de todas as camadas relacionadas
    [mainLayerId, outlineLayerId, fillLayerId].forEach(layerId => {
      if (this.layersStore.mapRef.getLayer(layerId)) {
        this.layersStore.mapRef.off('mousemove', layerId);
        this.layersStore.mapRef.off('mouseleave', layerId);
      }
    });

    console.log(`[HoverManager] Hover events removed for sublayers of ${mainLayerId}`);
  }
}

/**
 * Função de conveniência para criar uma instância do HoverManager
 * @param {Object} layersStore - Store das camadas
 * @returns {HoverManager} Instância do HoverManager
 */
export function createHoverManager(layersStore) {
  return new HoverManager(layersStore);
}
