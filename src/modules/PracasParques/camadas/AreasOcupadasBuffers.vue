<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="sourceLayer"
    :paint="layerPaint"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
    :opacity="layer.opacity"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#e6f1f2">
        <template v-if="$route.params.escala === 'estadual'">
          <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
          <label>Área urbana atendida pelas praças:</label>
        </template>
        <template v-else>
          <label>Área do setor coberta pelo buffer de 400m:</label>
        </template>
        <h3>{{ slotProps.features[0].properties.a3.toFixed(2) }} %</h3>
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
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021][0];
    },
    layerPaint() {
      if (this.$route.params.escala == "estadual") {
        return {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "a3"],
            8.703525,
            "#d73027",
            13.164806,
            "#fc8d59",
            22.922555,
            "#fee08b",
            35.181479,
            "#ffffbf",
            46.309639,
            "#d9ef8b",
            55.767913,
            "#91cf60",
            62.225301,
            "#1a9850",
          ],
        };
      } else if (this.$route.params.escala == "intraurbana") {
        return {
          "fill-color": [
            "match",
            ["get", "cd_mun"],
            Number(this.routeId),
            [
              "interpolate",
              ["linear"],
              ["get", "a3"],
              5, //this.munPracaData.a3_p5,
              ["to-color", "#d73027"],
              10,// this.munPracaData.a3_p10,
              ["to-color", "#fc8d59"],
              25,// this.munPracaData.a3_p25,
              ["to-color", "#fee08b"],
              50, // this.munPracaData.a3_median,
              ["to-color", "#ffffbf"],
              75, // this.munPracaData.a3_p75,
              ["to-color", "#d9ef8b"],
              90, // this.munPracaData.a3_p90,
              ["to-color", "#91cf60"],
              95, //this.munPracaData.a3_p95,
              ["to-color", "#1a9850"],
            ],
            ["literal", "transparent"],
          ],
        };
      }
    },
    sourceLayer() {
      if (this.$route.params.escala == "estadual") {
        return `public.geodata_pracas_por_municipio_2021`;
      } else if (this.$route.params.escala == "intraurbana") {
        return `public.geodata_pracas_por_setor_2021`;
      }
    },
    layerSource() {
      if (this.$route.params.escala == "estadual") {
        return {
          generateId: true,
          type: "vector",
          tiles: [
            `https://urbverde.iau.usp.br/dados/public.geodata_pracas_por_municipio_2021/{z}/{x}/{y}.pbf?`,
          ],
          minzoom: 0,
          maxzoom: 22,
        };
      } else if (this.$route.params.escala == "intraurbana") {
        return {
          generateId: true,
          type: "vector",
          tiles: [
            `https://urbverde.iau.usp.br/dados/public.geodata_pracas_por_setor_2021/{z}/{x}/{y}.pbf?`,
          ],
          minzoom: 0,
          maxzoom: 22,
        };
      }
    },
  },

  methods: {
    featureclick: function (layer) {
      this.$router.push({
        params: {
          id: layer[0].properties.cd_mun,
        },
      });
    },
    buildLegend() {
      const values = [];
      if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color: "linear-gradient(to left, #1a9850, #91cf60, #d9ef8b, #ffffbf, #fee08b, #fc8d59, #d73027)",
          value: `0 - 100 %`,
        });
      } else if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color: "linear-gradient(to left, #1a9850, #66bd63, #a6d96a, #d9ef8b, #ffffbf, #fee08b, #fdae61, #f46d43, #d73027)",
          value: '0 - 100 %', 
        });
      }
      this.$store.commit("SET_LAYER_PROPERTIES", {
        layer: this.layer,
        prop: "legends",
        value: values,
      });
    },
  },

  watch: {},
  created() { },
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
