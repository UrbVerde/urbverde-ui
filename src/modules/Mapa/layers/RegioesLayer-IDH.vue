<template>
  <VmLayer
    :name="layer.name"
    :source="layer.props.source"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :opacity="layer.opacity"
    :sourceLayer="layer.sourceLayer"
    :paint="layer.paint"
    :paint-click="{ 'fill-color': 'red' }"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
  >
    <template v-slot:popupHover="slotProps">
      <VmPopup color="#e6f1f2">
        <label>
          <!-- <h3>Nome município:</h3> -->
          <h3><span style="font-size: 1.2em">{{
            slotProps.features[0].properties.nm_mun
          }}</span></h3>
        </label>
        <!-- <label>
          <h3>Produto Interno Bruto:</h3>
          <span style="font-size: 1.2em">{{
            slotProps.features[0].properties.pib.toFixed(2)
          }}</span>
        </label> -->
        <label>
          Índice de Desenvolvimento Humano:
          <h3>
            {{slotProps.features[0].properties.idh.toFixed(2)}}
          </h3>
        </label>
        <!-- <label>
          <label>Coeficiente de Gini:</label>
          <h3>
            {{slotProps.features[0].properties.gini.toFixed(2)}}
          </h3>
        </label> -->
      </VmPopup>
    </template>
  </VmLayer>
</template>

<script>
import VmLayer from "../components/VmLayer.vue";
import VmPopup from "../components/VmPopup.vue";

export default {
  components: { VmLayer, VmPopup },
  props: ["layer"],
  data() {
    return {
      bbox: ``,
      loading: false,
      features: false,
    };
  },
  computed: {},

  methods: {},

  watch: {},
  created() {},
};
</script>

<style></style>
