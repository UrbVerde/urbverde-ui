<template>
  <div>
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
        <VmPopup color="#f4a259">
          <div style="border-radius: 8px">
            <label>
              <h3>Nome município:</h3>
              <span style="font-size: 1.2em">{{
                slotProps.features[0].properties.nm_mun
              }}</span>
            </label>
            <label>
              <h3>Produto Interno Bruto:</h3>
              <span style="font-size: 1.2em">{{
                slotProps.features[0].properties.pib.toFixed(2)
              }}</span>
            </label>
            <label>
              <h3>Índice de Desenvolvimento Humano:</h3>
              <span style="font-size: 1.2em">{{
                slotProps.features[0].properties.idh.toFixed(2)
              }}</span>
            </label>
            <label>
              <h3>Coeficiente de Gini:</h3>
              <span style="font-size: 1.2em">{{
                slotProps.features[0].properties.gini.toFixed(2)
              }}</span>
            </label>
          </div>
        </VmPopup>
      </template>
    </VmLayer>
  </div>
</template>

<script>
import VmLayer from "../components/VmLayer.vue";
import VmPopup from "../components/VmPopup.vue";
// import axios from "axios";
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
