<!-- src/components/Mapa/components/VmLayer.vue -->
<template>
  <VmLayer
    :name="layer.name"
    :source="layer.props.source"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="layer.sourceLayer"
    :paint="layerPaint"
    :paint-hover="{
      'fill-color': '#7c99f4',
      'fill-opacity': 1,
      'fill-outline-color': '#7c99f4'
    }"
  >
    <template v-slot:popupHover>
      <VmPopup
        color="#e6f1f2"
        :trackPointer="true"
        :open="!!hoverFeature"
        :position="mousePosition"
      >
        <template v-if="$route.params.escala === 'estadual'">
          <h3>{{ hoverFeature?.properties?.nm_mun }}</h3>
          <label>Temperatura no setor:</label>
        </template>
        <template v-else>
          <label>Temperatura no setor:</label>
        </template>
        <h3>{{ hoverFeature?.properties?.c1?.toFixed(2) }}</h3>
      </VmPopup>
    </template>
  </VmLayer>
</template>

<script>
import VmPopup from './VmPopup.vue';

export default {
  components: { VmPopup },
  props: ['layer'],

  data() {
    return {
      bbox: '',
      loading: false,
      features: false,
      hoverFeature: null,
      mousePosition: [0, 0]
    };
  },

  computed: {
    layerPaint() {
      const isEstadual = this.$route.params.escala === 'estadual';
      const baseOpacity = isEstadual ? 0.9 : 1;

      return {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'c1'],
          0,
          '#3288bd',
          2.8,
          '#99d594',
          4.5,
          '#e6f598',
          19,
          '#fee08b',
          36,
          '#fc8d59',
          44,
          '#d53e4f',
        ],
        'fill-opacity': baseOpacity,
        'fill-outline-color': '#666666'
      };
    }
  },

  mounted() {
    this.setupLayerEvents();
  },

  methods: {
    setupLayerEvents() {
      const map = this.getMap();
      if (!map) {return;}

      map.on('mousemove', this.layer.name, (e) => {
        // Update mouse position for popup
        this.mousePosition = [e.lngLat.lng, e.lngLat.lat];

        // Update hovered feature
        if (e.features && e.features.length > 0) {
          this.hoverFeature = e.features[0];
        }

        // Set hover state
        if (this.hoverFeature?.id) {
          map.setFeatureState(
            {
              source: this.layer.props.source.id,
              id: this.hoverFeature.id
            },
            { hover: true }
          );
        }

        // Update cursor
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', this.layer.name, () => {
        // Clear hover state
        if (this.hoverFeature?.id) {
          map.setFeatureState(
            {
              source: this.layer.props.source.id,
              id: this.hoverFeature.id
            },
            { hover: false }
          );
        }

        this.hoverFeature = null;
        map.getCanvas().style.cursor = '';
      });
    }
  },

  beforeUnmount() {
    // Clean up event listeners
    const map = this.getMap();
    if (map) {
      map.off('mousemove', this.layer.name);
      map.off('mouseleave', this.layer.name);
    }
  }
};
</script>

  <style scoped>
  /* No default fill-outline-color if not hovered */
  </style>
