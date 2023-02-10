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
      :opacity="layer.opacity"
      :paint-hover="{ 'fill-color': '#7c99f4' }"
      @featurehover="featurehover"
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="#8cib369">
          <div
            class="d-flex flex-column justify-center align-center"
            style="border-radius: 8px"
          >
            <label>ISi</label>
            <h3>
              {{ slotProps.features[0].properties.isi.toFixed(2) }}
            </h3>
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
              0.5,
              "#3288bd",
              1,
              "#d53e4f",
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
    featurehover(e) {
      console.log(e);
    },

    buildLegend() {
      const values = [];

      values.push({
        range: true,
        color: "linear-gradient(to right, #d53e4f, #3288bd)",
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
