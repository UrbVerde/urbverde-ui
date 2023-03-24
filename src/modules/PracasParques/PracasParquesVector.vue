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
        <h3>{{ slotProps.features[0].properties.areaM2.toFixed(2) }} m²</h3>
      </label>
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
      bbox: ``,
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
