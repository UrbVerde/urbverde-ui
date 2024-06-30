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
    @featureclick="featureclick"
  >
    <template v-slot:popupHover="slotProps">
      <!-- <VmPopup color="#8cb369"> -->
      <VmPopup color="#e6f1f2">
        <!-- <label>Município</label> -->
        <template v-if="$route.params.escala === 'estadual'">
          <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
          <label>Distância Média até uma praça:</label>
        </template>
        <template v-else>
          <label>Distância Média até uma praça no setor:</label>
        </template>
        <h3>{{ slotProps.features[0].properties.a4.toFixed(2) }} m</h3>
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
            ["get", "a4"],
            1.230115,
            "#1a9850",
            1.696049,
            "#91cf60",
            2.834390,
            "#d9ef8b",
            7.451875,
            "#ffffbf",
            18.978550,
            "#fee08b",
            35.078560,
            "#fc8d59",
            46.769281,
            "#d73027",
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
              ["get", "a4"],
              this.munPracaData.a4_min,
              "#1a9850",
              this.munPracaData.a4_p5,
              "#66bd63",
              this.munPracaData.a4_p10,
              "#a6d96a",
              this.munPracaData.a4_p25,
              "#d9ef8b",
              this.munPracaData.a4_median,
              "#ffffbf",
              this.munPracaData.a4_p75,
              "#fee08b",
              this.munPracaData.a4_p90,
              "#fdae61",
              this.munPracaData.a4_p95,
              "#f46d43",
              this.munPracaData.a4_max,
              "#d73027",
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
          color:
            "linear-gradient(to right, #1a9850, #91cf60, #d9ef8b, #ffffbf, #fee08b, #fc8d59, #d73027)",
          value: `metros (m)`,
        });
      } else if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #1a9850, #66bd63, #a6d96a, #d9ef8b, #ffffbf, #fee08b, #fdae61, #f46d43, #d73027)",
          value: `${this.munPracaData.a4_min.toFixed(
            2
          )} - ${this.munPracaData.a4_max.toFixed(2)} m`,
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
