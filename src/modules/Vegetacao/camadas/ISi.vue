<template>
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
    :opacity="layer.opacity"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#F4F4F4">
        <!-- <label>Município</label> -->
        <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
        <label>ISi</label>
        <h3>
          {{ slotProps.features[0].properties.isi.toFixed(2) }}
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
            ["get", "isi"],
            0.5,
            "#3288bd",
            1,
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
              ["get", "isi"],
              this.munVegData.isi_min,
              "#1a9641",
              this.munVegData.isi_p5,
              "#63b05f",
              this.munVegData.isi_p10,
              "#98cb7e",
              this.munVegData.isi_p25,
              "#cce59e",
              this.munVegData.isi_max,
              "#820000",
            ],
            ["literal", "transparent"],
          ],
        };
      }
    },
    sourceLayer() {
      if (this.escala == "estadual") {
        return `public.geodata_vegetacao_por_municipio_${this.$route.params.ano}`;
      } else if (this.escala == "intraurbana") {
        return `public.geodata_vegetacao_por_setor_${this.$route.params.ano}`;
      }
    },
    layerSource() {
      if (this.escala == "estadual") {
        return {
          generateId: true,
          type: "vector",
          tiles: [
            `https://urbverde.iau.usp.br/dados/public.geodata_vegetacao_por_municipio_${this.$route.params.ano}/{z}/{x}/{y}.pbf?`,
          ],
          minzoom: 0,
          maxzoom: 22,
        };
      } else if (this.escala == "intraurbana") {
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
          "linear-gradient(to right, #1a9641, #63b05f, #cce59e, #ffffbf, #820000)",
        value: `0.5 - 1`,
      });

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
