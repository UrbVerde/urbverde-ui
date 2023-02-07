<template>
  <div>
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
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="#8cb369">
          <div
            class="d-flex flex-column justify-center align-center"
            style="border-radius: 8px"
          >
            <label>Índice de Cobertura Vegetal</label>
            <h3>{{ slotProps.features[0].properties.b2.toFixed(2) }} m²/pop</h3>
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
            "#f46d43",
            2500,
            "#fdae61",
            5000,
            "#fee08b",
            7500,
            "#ffffbf",
            10000,
            "#d9ef8b",
            12500,
            "#a6d96a",
            15000,
            "#66bd63",
            17500,
            "#1a9850",
            20000,
            "#006837",
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
              42,
              "#fdae61",
              5000,
              "#efb746",
              10000,
              "#d7c22b",
              15000,
              "#b4cd16",
              20000,
              "#83d81f",
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
    buildLegend() {
      const values = [];

      if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #f46d43, #fdae61, #fee08b, #ffffbf, #d9ef8b, #a6d96a, #66bd63, #1a9850, #006837)",
          value: `42 - 20.000 m²/pop`,
        });
      } else if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #fdae61, #efb746, #d7c22b, #b4cd16, #83d81f)",
          value: `42 - 20.000 m²/pop`,
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
