<template>
  <VmLayer
    ref="layerTemp"
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
      <VmPopup color="#8cb369">
        <label>Município</label>
        <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
        <label>Coeficiente de Ilha de Calor</label>
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
      ano: "",
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
      if (this.$route.params.escala == "estadual") {
        return {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "c1"],
            0,
            "#3288bd",
            2.8,
            "#99d594",
            4.5,
            "#e6f598",
            19,
            "#fee08b",
            36,
            "#fc8d59",
            44,
            "#d53e4f",
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
              ["get", "c1"],
              this.munTempData.c1_min,
              "#3288bd",
              this.munTempData.c1_p5,
              "#99d594",
              this.munTempData.c1_p10,
              "#e6f598",
              this.munTempData.c1_mean,
              "#ffffbf",
              this.munTempData.c1_p90,
              "#fee08b",
              this.munTempData.c1_p95,
              "#fc8d59",
              this.munTempData.c1_max,
              "#d53e4f",
            ],
            ["literal", "transparent"],
          ],
        };
      }
    },
    sourceLayer() {
      if (this.$route.params.escala == "estadual") {
        return `public.geodata_temperatura_por_municipio_${this.ano}`;
      } else if (this.$route.params.escala == "intraurbana") {
        return `public.geodata_temperatura_por_setor_${this.ano}`;
      }
    },
    layerSource() {
      if (this.$route.params.escala == "estadual") {
        return {
          generateId: true,
          type: "vector",
          tiles: [
            `https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_municipio_${this.ano}/{z}/{x}/{y}.pbf?`,
          ],
          minzoom: 0,
          maxzoom: 22,
        };
      } else if (this.$route.params.escala == "intraurbana") {
        return {
          generateId: true,
          type: "vector",
          tiles: [
            `https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_setor_${this.ano}/{z}/{x}/{y}.pbf?`,
            // `https://urbverde.iau.usp.br/dados/public.geodata_setores_temperatura_${this.ano}/{z}/{x}/{y}.pbf?`,
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
            "linear-gradient(to right, #3288bd, #99d594, #e6f598, #ffffbf, #fee08b, #fc8d59, #d53e4f)",
          value: `${this.munTempData.c1_min.toFixed(
            2
          )} - ${this.munTempData.c1_max.toFixed(2)}`,
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #3288bd, #99d594, #e6f598, #fee08b, #fc8d59, #d53e4f)",
          value: `0 - 100`,
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
        let currentActiveLayer = sessionStorage.getItem("selectedLayer");
        this.$store.commit("TOGGLE_LAYER", { _id: currentActiveLayer });
      },
      deep: true,
      immediate: true,
    },
  },
  updated() {},
};
</script>

<style scoped></style>
