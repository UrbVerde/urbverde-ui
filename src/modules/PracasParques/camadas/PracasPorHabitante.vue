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
    @featureclick="featureclick"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#8cb369">
        <label>Município</label>
        <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
        <label>Praças por habitantes</label>
        <h3>{{ slotProps.features[0].properties.a2 }} m²</h3>
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
            ["get", "a2"],
            0,
            ["to-color", "#d53e4f"],
            0.04,
            ["to-color", "#f46d43"],
            0.09,
            ["to-color", "#fdae61"],
            0.21,
            ["to-color", "#fee08b"],
            0.38,
            ["to-color", "#e6f598"],
            0.67,
            ["to-color", "#abdda4"],
            1.14,
            ["to-color", "#66c2a5"],
            1.51,
            ["to-color", "#3288bd"],
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
              ["get", "a2"],
              this.munPracaData.a2_min,
              ["to-color", "#d53e4f"],
              this.munPracaData.a2_mean,
              ["to-color", "#fee08b"],
              this.munPracaData.a2_max,
              ["to-color", "#3288bd"],
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
      if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color: "linear-gradient(to right, #d53e4f, #fee08b, #3288bd)",
          value: `${this.munPracaData.a2_min.toFixed()} - ${this.munPracaData.a2_max.toFixed(
            2
          )} m²`,
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color: "linear-gradient(to right, #d53e4f, #fee08b, #3288bd)",
          value: `0 - 150 m²`,
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
