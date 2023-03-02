<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="sourceLayer"
    :opacity="layer.opacity"
    :paint="layerPaint"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#8cb369">
        <label>Município</label>
        <h3>
          {{ slotProps.features[0].properties.nm_mun }}
        </h3>
        <label>Renda</label>
        <h3>R$ {{ slotProps.features[0].properties.renda.toFixed(2) }}</h3>
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
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021][0];
    },
    routeId() {
      return this.$route.params.id;
    },

    layerPaint() {
      return {
        "fill-color": [
          "match",
          ["get", "cd_mun"],
          Number(this.routeId),
          [
            "interpolate",
            ["linear"],
            ["get", "renda"],
            this.munPracaData.renda_min,
            ["to-color", "#f63939"],
            this.munPracaData.renda_mean,
            ["to-color", "#ad90e3"],
            this.munPracaData.renda_max,
            ["to-color", "#6182f6"],
          ],
          ["literal", "transparent"],
        ],
      };
    },
    sourceLayer() {
      return `public.geodata_pracas_por_setor_2021`;
    },
    layerSource() {
      return {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geodata_pracas_por_setor_2021/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      };
    },
  },

  methods: {
    buildLegend() {
      const values = [];

      values.push({
        range: true,
        color: "linear-gradient(to right, #f63939, #fc3f74, #6d93f1, #6c3df2",
        value: `${this.munPracaData.renda_min.toFixed(
          2
        )} - ${this.munPracaData.renda_max.toFixed(2)} R$`,
      });

      this.$store.commit("SET_LAYER_PROPERTIES", {
        layer: this.layer,
        prop: "legends",
        value: values,
      });
    },
  },

  created() {},
  mounted() {
    this.buildLegend();
  },
};
</script>

<style scoped>
.teste {
  border: none !important;
}
</style>
