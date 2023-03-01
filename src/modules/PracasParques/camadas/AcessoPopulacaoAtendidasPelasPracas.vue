<template>
  <div>
    <VmLayer
      :name="layer.name"
      :source="layerSource"
      :type="layer.type"
      :zIndex="layer.zIndex"
      :sourceLayer="sourceLayer"
      :paint="layerPaint"
      :opacity="layer.opacity"
      :paint-hover="{ 'fill-color': '#7c99f4' }"
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="#8cb369">
          <label>Município</label>
          <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
          <label>Acesso população atendida pelas praças</label>
          <h3>{{ slotProps.features[0].properties.a1.toFixed(2) }}%</h3>
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
            19.74,
            ["to-color", "#f46d43"],
            27.88,
            ["to-color", "#fdae61"],
            48.29,
            ["to-color", "#fee08b"],
            66.95,
            ["to-color", "#e6f598"],
            80.68,
            ["to-color", "#abdda4"],
            91.47,
            ["to-color", "#66c2a5"],
            163,
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
    buildLegend() {
      const values = [];
      if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color: "linear-gradient(to right, #d53e4f, #fee08b, #3288bd)",
          value: `${this.munPracaData.a1_min.toFixed(
            2
          )} - ${this.munPracaData.a1_max.toFixed(2)} %`,
        });
      } else if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #d53e4f, #f46d43, #fdae61, #fee08b, #e6f598, #abdda4, #66c2a5, #3288bd)",
          value: `0 - 163 %`,
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
      handler: function () {
        window.maplibregl.repaint();
        console.log(this.layer);
      },
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
