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
      :opacity="layer.opacity"
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="#8cb369">
          <label>Temperatura Média de Superfície</label>
          <h3>{{ slotProps.features[0].properties.c2.toFixed(2) }} ºC</h3>
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
            ["get", "c2"],
            18,
            "#2b83ba",
            22,
            "#abdda4",
            26,
            "#ffffbf",
            30,
            "#fdae61",
            34,
            "#d7191c",
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
              ["get", "c2"],
              this.munTempData.c2_min,
              "#3288bd",
              this.munTempData.c2_p5,
              "#99d594",
              this.munTempData.c2_p10,
              "#e6f598",
              this.munTempData.c2_mean,
              "#ffffbf",
              this.munTempData.c2_p90,
              "#fee08b",
              this.munTempData.c2_p95,
              "#fc8d59",
              this.munTempData.c2_max,
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
    buildLegend() {
      const values = [];
      if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #3288bd, #99d594, #e6f598, #ffffbf, #fee08b, #fc8d59, #d53e4f)",
          value: `${this.munTempData.c2_min.toFixed(
            2
          )} - ${this.munTempData.c2_max.toFixed(2)} ºC`,
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #3288bd, #66c2a5, #abdda4, #e6f598, #fee08b, #fdae61, #f46d43, #d53e4f, #9e0142)",
          value: `18 - 36 ºC`,
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
