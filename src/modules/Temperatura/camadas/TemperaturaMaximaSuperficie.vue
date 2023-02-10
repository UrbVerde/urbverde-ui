<template>
  <div>
    <VmLayer
      ref="layerTemp"
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
          <div style="border-radius: 8px">
            <label>Temperatura Máxima de Superfície</label>
            <h3>{{ slotProps.features[0].properties.c3.toFixed(2) }} ºC</h3>
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
      if (this.$route.params.escala == "estadual") {
        return {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "c3"],
            27,
            "#3288bd",
            32,
            "#99d594",
            37,
            "#e6f598",
            42,
            "#fee08b",
            47,
            "#fc8d59",
            52,
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
              ["get", "c3"],
              this.munTempData.c3_min,
              "#3288bd",
              this.munTempData.c3_p5,
              "#99d594",
              this.munTempData.c3_p10,
              "#e6f598",
              this.munTempData.c3_mean,
              "#ffffbf",
              this.munTempData.c3_p90,
              "#fee08b",
              this.munTempData.c3_p95,
              "#fc8d59",
              this.munTempData.c3_max,
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
          ],
          minzoom: 0,
          maxzoom: 22,
        };
      }
    },
  },

  methods: {
    featurehover(e) {},
    buildLegend() {
      const values = [];

      if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #3288bd, #99d594, #e6f598, #ffffbf, #fee08b, #fc8d59, #d53e4f)",
          value: `${this.munTempData.c3_min.toFixed(
            2
          )} - ${this.munTempData.c3_max.toFixed(2)}`,
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #3288bd, #99d594, #e6f598, #fee08b, #fc8d59, #d53e4f)",
          value: `27 - 52 ºC`,
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
