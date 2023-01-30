<template>
  <div>
    <VmLayer
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
import VmLayer from "../../Mapa/components/VmLayer.vue";
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
          `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3Atst-intraurbana-rel-30m-2021a2016&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng`,
        ],
      };
    },
  },

  watch: {
    layer: {
      handler: async function () {
        this.layerSource();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
