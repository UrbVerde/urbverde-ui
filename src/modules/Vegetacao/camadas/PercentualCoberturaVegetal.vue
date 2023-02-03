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
      @featureclick="featureClicked"
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="#8cb369">
          <div
            class="d-flex flex-column justify-center align-center"
            style="border-radius: 8px"
          >
            <label>Porcentagem de cobertura Vegetal</label>
            <h3>
              {{ (slotProps.features[0].properties.b1 * 100).toFixed(1) }} %
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
    getMinMaxValuesForVeg() {
      return this.$store.getters.getMinMaxVeg;
    },

    munVegData() {
      return this.$store.getters.getMunVegData[this.$route.params.ano][0];
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
            ["get", "b1"],
            0.04,
            "#ffffcc",
            0.45,
            "#006837",
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
              ["get", "b1"],
              0.04,
              "#ffffcc",
              0.45,
              "#006837",
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
          color: "linear-gradient(to right, #ffffcc, #006837)",
          value: `4 - 45 %`,
        });
      } else {
        values.push({
          range: true,
          color: "linear-gradient(to right, #ffffcc, #006837)",
          value: `4 - 45 %`,
        });
      }

      this.$store.commit("SET_LAYER_PROPERTIES", {
        layer: this.layer,
        prop: "legends",
        value: values,
      });
    },

    featureClicked(feature) {
      if (this.$route.params.escala == "intraurbana") {
        this.$emit("idSetor", feature[0].properties.cd_setor);
        this.$router.push({
          params: { setorid: feature[0].properties.cd_setor },
        });
      } else {
        return;
      }
    },
  },

  watch: {
    layer: {
      handler: async function () {},
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
