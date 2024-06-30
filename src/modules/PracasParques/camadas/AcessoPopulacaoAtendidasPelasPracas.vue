<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="sourceLayer"
    :paint="layerPaint"
    :opacity="layer.opacity"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
    @featureclick="featureclick"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#e6f1f2">
        <!-- <label>Setor {{ slotProps.features[0].properties.cd_setor }} - IBGE 2020</label> -->
        <template v-if="$route.params.escala === 'estadual'">
          <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
          <label> População atendida por pelo menos uma praça:</label>
          <h3>{{ slotProps.features[0].properties.a1.toFixed(0) }}% </h3>
        </template>
        <template v-else>
          <label> População no setor atendida por pelo menos uma praça:</label>
          <h3>{{ slotProps.features[0].properties.a1.toFixed(0) }} habitantes</h3>
        </template>
        
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
            ["get", "a1"],
            0,
            ["to-color", "#d53e4f"],
            14.3,
            ["to-color", "#f46d43"],
            28.6,
            ["to-color", "#fdae61"],
            42.9,
            ["to-color", "#fee08b"],
            57.9,
            ["to-color", "#e6f598"],
            71.5,
            ["to-color", "#abdda4"],
            85.8,
            ["to-color", "#66c2a5"],
            100,
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
              ["get", "a1"],
              this.munPracaData.a1_min,
              ["to-color", "#d53e4f"],
              this.munPracaData.a1_mean,
              ["to-color", "#fee08b"],
              this.munPracaData.a1_max,
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
          value: `${this.munPracaData.a1_min.toFixed(
            2
          )} - ${this.munPracaData.a1_max.toFixed(0)} hab`,
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4, #66c2a5, #3288bd)",
          value: `0 - 100 %`,
        });
      }
      this.$store.commit("SET_LAYER_PROPERTIES", {
        layer: this.layer,
        prop: "legends",
        value: values,
      });
    },
  },

  watch: {
    "$route.params.id": {
      handler: function () {},
      deep: true,
      immediate: true,
    },
  },
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
