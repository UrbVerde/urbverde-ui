<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="sourceLayer"
    :paint="layerPaint"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
    @featurehover="featurehover"
    :opacity="layer.opacity"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#8cb369">
        <label>Coeficiente de Ilha de Calor por Mesorregião</label>
        <h3>
          {{ slotProps.features[0].properties.c1.toFixed(2) }}
        </h3>
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
    return {
      escala: "",
      ano: "",
      categoria: "",
    };
  },
  computed: {
    munTempData() {
      return this.$store.getters.getMunTempData[this.$route.params.ano][0];
    },
    routeId() {
      return this.$route.params.id;
    },
    layerPaint() {
      return {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "c1"],
          0,
          "#4575b4",
          10,
          "#d73027",
        ],
      };
    },
    sourceLayer() {
      return `public.geodata_vegetacao_por_mesorregiao_${this.ano}`;
    },

    layerSource() {
      return {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geodata_vegetacao_por_mesorregiao_${this.ano}/{z}/{x}/{y}.pbf?`,
          // `https://urbverde.iau.usp.br/dados/public.dados_e_geom_temperatura_por_municipio/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      };
    },
  },

  methods: {
    featurehover(e) {},
    buildLegend() {
      const values = [];

      if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color: "linear-gradient(to right, #4575b4, #d73027)",
          value: `${this.munTempData.c1_min.toFixed(
            2
          )} - ${this.munTempData.c1_max.toFixed(2)}`,
          quantity: `${this.munTempData.nm_mun}`,
        });
      } else {
        values.push({
          range: true,
          color: "linear-gradient(to right, #4575b4, #d73027)",
          value: `0 - 1.65`,
          quantity: `${this.munTempData.nm_mun}`,
        });
      }

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
  watch: {
    "$route.params.ano": {
      handler: async function (ano) {
        this.ano = ano;
      },
      deep: true,
      immediate: true,
    },

    // "$route.params.categoria": {
    //   handler: async function (categoria) {
    //     window.maplibregl.removeLayer(this.layer);
    //   },

    // },
  },
  updated() {},
};
</script>

<style scoped></style>
