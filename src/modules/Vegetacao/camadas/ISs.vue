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
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#F4F4F4">
        <!-- <label>Município</label> -->
        <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
        <label>ISs</label>
        <h3>
          {{ slotProps.features[0].properties.iss.toFixed(2) }}
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
    return {};
  },
  computed: {
    munVegData() {
      return this.$store.getters.getMunVegData[this.$route.params.ano][0];
    },
    routeId() {
      return this.$route.params.id;
    },

    escala() {
      return this.$route.params.escala;
    },

    layerPaint() {
      if (this.$route.params.escala == "estadual") {
        return {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "iss"],
            0,
            "#1a9641",
            0.1,
            "#a6d96a",
            0.2,
            "#ffffbf",
            0.3,
            "#fdae61",
            0.4,
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
              ["get", "iss"],
              this.munVegData.iss_min,
              "#1a9641",
              this.munVegData.iss_p5,
              "#63b05f",
              this.munVegData.iss_p10,
              "#98cb7e",
              this.munVegData.iss_p25,
              "#cce59e",
              this.munVegData.iss_mean,
              "#ffffbf",
              this.munVegData.iss_p75,
              "#fda591",
              this.munVegData.iss_p90,
              "#f25b4b",
              this.munVegData.iss_p95,
              "#cc201c",
              this.munVegData.iss_max,
              "#820000",
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
            "linear-gradient(to right, #1a9641, #a6d96a, #ffffbf, #fdae61, #d7191c)",
          value: `0.46 - 0.84`,
        });
      } else if (this.$route.params.escala == "intraurbana") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right, #1a9641, #63b05f, #98cb7e, #cce59e, #ffffbf, #fda591, #f25b4b, #cc201c, #820000)",
          value: `${this.munVegData.iss_min.toFixed(
            2
          )} - ${this.munVegData.iss_max.toFixed(2)}`,
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
