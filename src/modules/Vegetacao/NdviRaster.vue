<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
  >
  </VmLayer>
</template>

<script>
import VmLayer from "../Mapa/components/VmLayer.vue";
import * as turf from "@turf/turf";
import axios from "axios";
export default {
  components: { VmLayer },
  props: ["layer"],
  data() {
    return {
      bbox: "",
    };
  },
  computed: {
    layerSource() {
      return {
        type: "raster",
        generateId: true,
        tiles: [
          `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3ANDVI-10m-${
            this.$route.params.ano || 2016
          }&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng`,
        ],
      };
    },
  },

  watch: {
    "$route.params.id": {
      handler: async function (id) {
        await axios
          .get(
            `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${id}?formato=application/vnd.geo+json`
          )
          .then((response) => {
            let feature = response.data.features[0];
            let bbox = turf.bbox(feature.geometry);
            this.bbox = `${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`;
            this.bbox = turf.toMercator(feature);
          });
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
