<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="sourceLayer"
    :paint="{
      'fill-color': layerPaint['fill-color'],
      'fill-opacity': layer.opacity,
    }"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
    @featurehover="featurehover"
    @featureclick="featureclick"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#e6f1f2">
        <!-- <label>Município</label> -->
        <template v-if="$route.params.escala === 'estadual'">
          <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
          <label>Índice de Cobertura Vegetal:</label>
        </template>
        <template v-else>
          <!-- {{ slotProps.features[0].properties.cd_setor }} -->
          <label>Índice de Cobertura Vegetal no setor:</label>
        </template>
        <h3>{{ slotProps.features[0].properties.b2.toFixed(2) }} m²/hab</h3>
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
    munVegData() {
      return this.$store.getters.getMunVegData[this.$route.params.ano][0];
    },
    routeId() {
      return this.$route.params.id;
    },

    layerPaint() {
      if (this.$route.params.escala == "estadual") {
        return {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "b2"],
            42,
            "#ffffe5",
            442,
            "#f7fcb9",
            611,
            "#d9f0a3",
            942,
            "#addd8e",
            1426,
            "#78c679",
            2325,
            "#41ab5d",
            3867,
            "#238443",
            5204,
            "#006837",
            19735,
            "#004529",
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
              ["get", "b2"],
              this.munVegData.b2_min,
              "#ffffe5",
              this.munVegData.b2_p5,
              "#f7fcb9",
              this.munVegData.b2_p10,
              "#d9f0a3",
              this.munVegData.b2_p25,
              "#addd8e",
              this.munVegData.b2_median,
              "#78c679",
              this.munVegData.b2_p75,
              "#41ab5d",
              this.munVegData.b2_p90,
              "#238443",
              this.munVegData.b2_p95,
              "#006837",
              this.munVegData.b2_max,
              "#004529",
            ],
            ["literal", "transparent"],
          ],
        };
      }
    },
    sourceLayer() {
      if (this.$route.params.escala == "estadual") {
        return `public.geodata_vegetacao_por_municipio_${this.$route.params.ano}`;
      } else if (this.$route.params.escala == "intraurbana") {
        return `public.geodata_vegetacao_por_setor_${this.$route.params.ano}`;
      }
    },
    layerSource() {
      if (this.$route.params.escala == "estadual") {
        return {
          generateId: true,
          type: "vector",
          tiles: [
            `https://urbverde.iau.usp.br/dados/public.geodata_vegetacao_por_municipio_${this.$route.params.ano}/{z}/{x}/{y}.pbf?`,
          ],
          minzoom: 0,
          maxzoom: 22,
        };
      } else if (this.$route.params.escala == "intraurbana") {
        return {
          generateId: true,
          type: "vector",
          tiles: [
            `https://urbverde.iau.usp.br/dados/public.geodata_vegetacao_por_setor_${this.$route.params.ano}/{z}/{x}/{y}.pbf?`,
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

      if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #ffffe5, #f7fcb9, #d9f0a3, #addd8e, #78c679, #41ab5d, #238443, #006837, #004529)",
          value: `${this.munVegData.b2_min.toFixed(
            2
          )} - ${this.munVegData.b2_max.toFixed(2)} m²/pop`,
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #ffffe5, #f7fcb9, #d9f0a3, #addd8e, #78c679, #41ab5d, #238443, #006837, #004529)",
          value: `42 - 18.000 m²/pop`,
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
