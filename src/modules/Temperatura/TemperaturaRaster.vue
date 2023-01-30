<template>
  <div>
    <VmLayer
      :name="layer.name"
      :source="layerSource"
      :type="layer.type"
      :zIndex="layer.zIndex"
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
      bbox: "",
    };
  },
  computed: {
    layerSource() {
      if (this.$route.params.escala == "intraurbana") {
        return {
          type: "raster",
          generateId: true,
          tiles: [
            `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3Atst-intraurbana-rel-30m-${
              this.$route.params.ano || 2016
            }&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng`,
          ],
        };
      }
      if (this.$route.params.escala == "estadual") {
        return {
          type: "raster",
          generateId: true,
          tiles: [
            `https://urbverde.iau.usp.br/geoserver/urbverde/wms?service=WMS&version=1.1.0&request=GetMap&layers=urbverde%3ATST-30m-8bits-${
              this.$route.params.ano || 2016
            }&bbox={bbox-epsg-3857}&transparent=true&width=768&height=478&srs=EPSG%3A3857&styles=&format=image%2Fpng`,
          ],
        };
      }
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped></style>
