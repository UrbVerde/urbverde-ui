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
            "#ffdaae",
            1000,
            "#fedcad",
            2000,
            "#fcdeac",
            3000,
            "#fae1a9",
            4000,
            "#f6e3a6",
            5000,
            "#f2e5a3",
            6000,
            "#ede89f",
            7000,
            "#e7ea9a",
            8000,
            "#e0ed94",
            9000,
            "#d8ef8d",
            10000,
            "#cef186",
            11000,
            "#c4f47e",
            12000,
            "#b8f675",
            13000,
            "#aaf86a",
            14000,
            "#9af95f",
            15000,
            "#87fb51",
            16000,
            "#70fd42",
            17000,
            "#50fe2d",
            18000,
            "#00ff00",
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
              "#ffdaae",
              200,
              "#ffdbae",
              300,
              "#feddad",
              400,
              "#fddeac",
              500,
              "#fbe0aa",
              600,
              "#f9e1a9",
              700,
              "#f7e3a7",
              800,
              "#f4e4a5",
              900,
              "#f2e6a2",
              1000,
              "#eee7a0",
              2000,
              "#ebe99c",
              3000,
              "#e7ea99",
              4000,
              "#e2ec95",
              5000,
              "#ddee92",
              6000,
              "#d8ef8d",
              7000,
              "#d2f189",
              8000,
              "#ccf284",
              9000,
              "#c5f37e",
              10000,
              "#bdf579",
              11000,
              "#b5f672",
              12000,
              "#acf76c",
              13000,
              "#a2f965",
              14000,
              "#98fa5d",
              15000,
              "#8cfb55",
              16000,
              "#7efc4b",
              17000,
              "#6efd40",
              18000,
              "#5bfe34",
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

      if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #ffdaae,#ffdbae,#feddad,#fddeac,#fbe0aa,#f9e1a9,#f7e3a7,#f4e4a5,#f2e6a2,#eee7a0,#ebe99c,#e7ea99,#e2ec95,#ddee92,#d8ef8d,#d2f189,#ccf284,#c5f37e,#bdf579,#b5f672,#acf76c,#a2f965,#98fa5d,#8cfb55,#7efc4b,#6efd40,#5bfe34)",
          value: "42 - 18.000 m²/pop",
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #ffdaae, #fedcad, #fcdeac, #fae1a9, #f6e3a6, #f2e5a3, #ede89f, #e7ea9a, #e0ed94, #d8ef8d, #cef186, #c4f47e, #b8f675, #aaf86a, #9af95f, #87fb51, #70fd42, #50fe2d, #00ff00)",
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
