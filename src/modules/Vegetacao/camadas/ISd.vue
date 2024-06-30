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
          {{ slotProps.features[0].properties.isd.toFixed(2) }}
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
            ["get", "isd"],
            0.23,
            "#1a9641",
            0.3,
            "#63b05f",
            0.31,
            "#98cb7e",
            0.32,
            "#cce59e",
            0.33,
            "#ffffbf",
            0.35,
            "#fda591",
            0.37,
            "#f25b4b",
            0.38,
            "#cc201c",
            0.45,
            "#820000",
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
              ["get", "isd"],
              this.munVegData.isd_min,
              "#1a9641",
              this.munVegData.isd_p5,
              "#63b05f",
              this.munVegData.isd_p10,
              "#98cb7e",
              this.munVegData.isd_p25,
              "#cce59e",
              this.munVegData.isd_mean,
              "#ffffbf",
              this.munVegData.isd_p75,
              "#fda591",
              this.munVegData.isd_p90,
              "#f25b4b",
              this.munVegData.isd_p95,
              "#cc201c",
              this.munVegData.isd_max,
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

      values.push({
        range: true,
        color:
          "linear-gradient(to right, #1a9641, #63b05f, #98cb7e, #cce59e, #ffffbf, #fda591, #f25b4b, #cc201c, #820000)",
        value: `0 - 0.5`,
        quantity: `${this.munVegData.nm_mun}`,
      });

      this.$store.commit("SET_LAYER_PROPERTIES", {
        layer: this.layer,
        prop: "legends",
        value: values,
      });
    },
  },

  watch: {
    "$route.params.ano": {
      handler: function () {},
    },
  },
  created() {
    this.$store.commit("SET_CURRENT_STATE", this.layer);
  },
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
