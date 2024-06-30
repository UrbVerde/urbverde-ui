<template>
  <VmLayer
    :name="layer.name"
    :source="layer.props.source"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="layer.sourceLayer"
    :paint="paintLayer"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
    :opacity="layer.opacity"
    @featureclick="featureHovered"
  >
  <template v-slot:popupHover="slotProps">
    <VmPopup color="#e6f1f2">
      <h3>{{ slotProps.features[0].properties.nm_praca || "Sem Nome"}}</h3>
      <label> Área da Praça: {{ slotProps.features[0].properties.aream2.toFixed(0) }} m²</label>
    </VmPopup>
  </template>
  </VmLayer>
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
      bbox: '',
      loading: false,
      feature: "",
      munId: "",
    };
  },
  computed: {
    paintLayer() {
      return {
        "fill-color": [
          "match",
          ["get", "cd_mun"],
          Number(this.$route.params.id),
          ["interpolate", ["linear"], ["get", "cd_mun"], 0, "#40826D"],
          ["literal", "transparent"],
        ],
        "fill-outline-color": [
          "match",
          ["get", "cd_mun"],
          Number(this.$route.params.id),
          ["interpolate", ["linear"], ["get", "cd_mun"], 0, "#c6c6c6"],
          ["literal", "transparent"],
        ],
      };
    },
  },

  methods: {
    featureHovered(e) {
      this.feature = e[0].geometry;
    },
    addBufferLayer() {
      let buffer = turf.buffer(this.feature, 400, { units: "meters" });
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
      },);
    },
    removeBufferLayer() {
      window.maplibregl.removeLayer("buffer");
      window.maplibregl.removeSource("buffer");
    },
  },

  watch: {
    feature: {
      handler: function (val, oldVal) {
        if (oldVal) {
          this.removeBufferLayer();
        }
        if (val) {
          this.addBufferLayer();
        }
      },
      immediate: true,
      deep: true,
    },

    "$route.params.id": {
      handler: async function (id) {
        this.munId = id;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
};
</script>

<style></style>
