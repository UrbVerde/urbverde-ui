<template>
  <div>
    <VmLayer
      :name="layer.name"
      :source="layer.props.source"
      :type="layer.type"
      :zIndex="layer.zIndex"
      :sourceLayer="layer.sourceLayer"
      :paint="paintLayer"
      :paint-hover="{ 'fill-color': '#7c99f4' }"
      :opacity="layer.opacity"
      @featurehover="featureHovered"
    >
      <template v-slot:popupHover="slotProps">
        <label>
          Praça / parque:
          <h3>
            {{ slotProps.features[0].properties.nm_praca }}
          </h3>
        </label>
        <label>
          Área:
          <h3>
            {{ slotProps.features[0].properties.areaM2.toFixed() / 100 }} m²
          </h3>
        </label>
      </template>
    </VmLayer>
  </div>
</template>

<script>
import VmLayer from "../Mapa/components/VmLayer.vue";
import VmPopup from "../Mapa/components/VmPopup.vue";
import * as turf from "@turf/turf";
export default {
  components: { VmLayer, VmPopup },
  props: ["layer"],
  data() {
    return {
      bbox: ``,
      loading: false,
      feature: "",
    };
  },
  computed: {
    paintLayer() {
      return {
        "fill-color": "green",
        "fill-outline-color": "#7c99f4",
        "fill-opacity": 0.3,
      };
    },
  },

  methods: {
    featureHovered(e) {
      this.feature = e[0].geometry;
    },
  },

  watch: {
    feature: {
      handler: function (val, oldVal) {
        if (oldVal) {
          window.maplibregl.removeLayer("buffer");
          window.maplibregl.removeSource("buffer");
        }

        let buffer = turf.buffer(val, 400, { units: "meters" });

        window.maplibregl.addSource("buffer", {
          type: "geojson",
          data: buffer,
        });
        window.maplibregl.addLayer({
          id: "buffer",
          source: "buffer",
          type: "fill",
          paint: {
            "fill-color": "#FF6F91",
            "fill-opacity": 0.4,
          },
        });
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
};
</script>

<style></style>
