<template>
  <VmLayer
    v-if="this.$route.params.escala == 'intraurbana'"
    :name="layer.name"
    :source="layer.props.source"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="layer.sourceLayer"
    :paint="layerPaint"
  >
  </VmLayer>
</template>

<script>
import VmLayer from "../components/VmLayer.vue";
import VmPopup from "../components/VmPopup.vue";
import * as turf from "@turf/turf";
import axios from "axios";
export default {
  components: { VmLayer, VmPopup },
  props: ["layer"],
  data() {
    return {
      bbox: ``,
      loading: false,
      munId: "",
    };
  },
  computed: {
    layerPaint() {
      return {
        "fill-color": [
          "match",
          ["get", "cd_mun"],
          Number(this.munId),
          ["interpolate", ["linear"], ["get", "cd_mun"], 0, "transparent"],
          ["literal", "transparent"],
        ],
        "fill-outline-color": [
          "match",
          ["get", "cd_mun"],
          Number(this.munId),
          ["interpolate", ["linear"], ["get", "cd_mun"], 0, "#000"],
          ["literal", "transparent"],
        ],
      };
    },
  },

  methods: {},

  watch: {
    "$route.params.escala": {
      handler: function (escala) {
        if (escala == "intraurbana") {
          axios
            .get(
              `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageodata_pracas_por_municipio&PROPERTYNAME=nm_mun,cd_mun,geom&CQL_FILTER=cd_mun=${this.$route.params.id}&outputFormat=application%2Fjson`
            )
            .then((response) => {
              let bboxMun = turf.bbox(response.data.features[0].geometry);
              let massCenterMun = turf.centerOfMass(response.data.features[0]);
              window.maplibregl.flyTo({
                center: massCenterMun.geometry.coordinates,
                zoom: 10,
                bearing: 3,
                speed: 0.8,
                curve: 2,
                easing: (t) => t,
                essential: true,
              });

              window.maplibregl.fitBounds([
                [bboxMun[0], bboxMun[1]],
                [bboxMun[2], bboxMun[3]],
              ]);
            });
        }
      },
      deep: true,
      immediate: true,
    },

    "$route.params.id": {
      handler: async function (id) {
        this.munId = id;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.teste {
  background-color: red;
}
</style>
