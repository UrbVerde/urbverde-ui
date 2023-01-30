<template>
  <div>
    <VmLayer
      :name="layer.name"
      :source="layerSource"
      :type="layer.type"
      :zIndex="layer.zIndex"
      :sourceLayer="sourceLayer"
      :paint="layer.paint"
      :opacity="layer.opacity"
      :paint-hover="{ 'fill-color': '#7c99f4' }"
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="transparent">
          <div
            class="pa-2 mb-2 d-flex flex-column justify-center align-center"
            style="background-color: #8cb369; border-radius: 8px"
          >
            <label>{{ layer.name }}</label>
            <h3>
              {{ slotProps.features[0].properties.b1 }}
            </h3>
          </div>
        </VmPopup>
      </template>
    </VmLayer>
  </div>
</template>

<script>
import VmLayer from "../../Mapa/components/VmLayer.vue";
import VmPopup from "../../Mapa/components/VmPopup.vue";
export default {
  components: { VmLayer, VmPopup },
  props: ["layer"],
  data() {
    return {};
  },
  computed: {
    routeId() {
      return this.$route.params.id;
    },

    sourceLayer() {
      return `public.geodata_vegetacao_por_mesorregiao_${this.$route.params.ano}`;
    },
    layerSource() {
      return {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geodata_vegetacao_por_mesorregiao_${this.$route.params.ano}/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      };
    },
  },

  methods: {
    featurehover(e) {
      console.log(e);
    },
  },

  watch: {
    "$route.params.id": {
      handler: function () {
        // this.maplibregl.update();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
};
</script>

<style scoped>
.teste {
  border: none !important;
}
</style>
