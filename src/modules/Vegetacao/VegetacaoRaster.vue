<template>
  <div>
    <VmLayer
      v-if="this.$route.params.categoria == 'vegetacao'"
      :name="layer.name"
      :source="layerSource"
      :type="layer.type"
      :zIndex="layer.zIndex"
      :opacity="layer.opacity"
    >
    </VmLayer>
  </div>
</template>

<script>
import VmLayer from "../Mapa/components/VmLayer.vue";
export default {
  components: { VmLayer },
  props: ["layer"],
  data() {
    return {
      ano: "",
    };
  },
  computed: {
    layerSource() {
      return {
        type: "raster",
        generateId: true,
        tiles: [
          `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3APCV-30m-8bits-${
            this.ano || 2016
          }&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng`,
        ],
      };
    },
  },

  watch: {
    "$route.params.ano": {
      handler: function (ano) {
        this.ano = ano;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
