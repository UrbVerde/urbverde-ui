<template>
  <VmLayer
    :name="layer.name"
    :source="layerSource"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="sourceLayer"
    :paint="layer.paint"
    :opacity="layer.opacity"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#8cb369">
        <label>Coeficiente de Ilha de Calor</label>
        <h3>
          {{ slotProps.features[0].properties.c1.toFixed(2) }}
        </h3>
        <label>Temperatura Média de Superfície</label>
        <h3>{{ slotProps.features[0].properties.c2.toFixed(2) }} ºC</h3>
        <label>Temperatura Máxima de Superfície</label>
        <h3>{{ slotProps.features[0].properties.c3.toFixed(2) }} ºC</h3>
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

    sourceLayer() {
      return `public.geodata_temperatura_por_microrregiao_${this.$route.params.ano}`;
    },
    layerSource() {
      return {
        generateId: true,
        type: "vector",
        tiles: [
          `https://urbverde.iau.usp.br/dados/public.geodata_temperatura_por_microrregiao_${this.$route.params.ano}/{z}/{x}/{y}.pbf?`,
        ],
        minzoom: 0,
        maxzoom: 22,
      };
    },
  },
  methods: {},
  watch: {},
  created() {},
  mounted() {},
};
</script>

<style scoped>
.teste {
  border: none !important;
}
</style>
