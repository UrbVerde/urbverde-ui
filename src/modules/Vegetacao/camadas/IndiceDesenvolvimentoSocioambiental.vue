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
      :paint-hover="{ 'fill-color': '#7c99f4' }"
      @featurehover="featurehover"
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="#8cb369">
          <div
            class="d-flex flex-column justify-center align-center"
            style="border-radius: 8px"
          >
            <label>Índice de Desigualdade Socioambiental</label>
            <h3>
              {{ slotProps.features[0].properties.b3.toFixed(2) }}
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
      if (this.escala == "estadual") {
        return {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "b3"],
            0.47,
            "#4575b4",
            0.58,
            "#74add1",
            0.59,
            "#abd9e9",
            0.61,
            "#e0f3f8",
            0.64,
            "#ffffbf",
            0.67,
            "#fee090",
            0.7,
            "#fdae61",
            0.72,
            "#f46d43",
            0.82,
            "#d73027",
          ],
        };
      } else if (this.escala == "intraurbana") {
        return {
          "fill-color": [
            "match",
            ["get", "cd_mun"],
            Number(this.routeId),
            [
              "interpolate",
              ["linear"],
              ["get", "b3"],
              this.munVegData.b3_min,
              "#4575b4",
              this.munVegData.b3_p5,
              "#74add1",
              this.munVegData.b3_p10,
              "#abd9e9",
              this.munVegData.b3_p25,
              "#fee090",
              this.munVegData.b3_mean,
              "#ffffbf",
              this.munVegData.b3_p75,
              "#e0f3f8",
              this.munVegData.b3_p90,
              "#fdae61",
              this.munVegData.b3_p95,
              "#f46d43",
              this.munVegData.b3_max,
              "#d73027",
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

      if (this.$route.params.escala == "estadual") {
        values.push({
          range: true,
          color:
            "linear-gradient(to right,  #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027)",
          value: `0.46 - 0.84`,
        });
      } else {
        values.push({
          range: true,
          color:
            "linear-gradient(to right,  #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027)",
          value: `${this.munVegData.b3_min.toFixed(
            2
          )} - ${this.munVegData.b3_max.toFixed(2)}`,
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
