<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="sourceLayer"
    :paint="layer.paint"
    :opacity="layer.opacity"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
    @featurehover="featurehover"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#8cb369">
        <label class="mt-2">
          <h3>Acesso população atendida pelas praças:</h3>
          <span style="font-size: 1.2em">{{
            slotProps.features[0].properties.a1.toFixed(2)
          }}</span>
        </label>
        <label class="mt-2">
          <h3>M² de praças por habitante:</h3>
          <span style="font-size: 1.2em">{{
            slotProps.features[0].properties.a2.toFixed(2)
          }}</span>
        </label>
        <label class="mt-2">
          <h3>% de áreas ocupadas pelos buffers:</h3>
          <span style="font-size: 1.2em"
            >{{ slotProps.features[0].properties.a3.toFixed(2) }} %</span
          >
        </label>
        <label class="mt-2">
          <h3>Distribuição Espacial das praças:</h3>
          <span style="font-size: 1.2em">{{
            slotProps.features[0].properties.a4.toFixed(2)
          }}</span>
        </label>
      </VmPopup>
    </template>
  </VmLayer>
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
      return `public.geodata_pracas_por_microrregiao_2021`;
    },
    layerSource() {
      return {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geodata_pracas_por_microrregiao_2021/{z}/{x}/{y}.pbf?`,
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
