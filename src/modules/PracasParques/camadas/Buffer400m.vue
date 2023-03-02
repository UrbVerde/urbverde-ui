<template>
  <VmLayer
    :name="layer.name"
    :source="layer.props.source"
    :type="layer.type"
    :zIndex="layer.zIndex"
    :sourceLayer="layer.sourceLayer"
    :paint="layerPaint"
    :opacity="layer.opacity"
    :paint-hover="{ 'fill-color': '#7c99f4' }"
  >
    <template v-slot:popupClick="slotProps">
      <VmPopup color="#f4a259">
        <div style="border-radius: 8px">
          <label>
            Município:
            <h3>
              {{
                slotProps.features &&
                slotProps.features[0] &&
                slotProps.features[0].properties.nm_mun
              }}
            </h3>
          </label>
        </div>
      </VmPopup>
    </template>
  </VmLayer>
</template>

<script>
import VmLayer from "../../Mapa/components/VmLayer.vue";
import VmPopup from "../../Mapa/components/VmPopup.vue";
// import axios from "axios";
export default {
  components: { VmLayer, VmPopup },
  props: ["layer"],
  data() {
    return {
      munId: "",
    };
  },
  computed: {
    layerPaint() {
      return {
        "fill-color": [
          "match",
          ["get", "cd_mun"],
          Number(this.munId),
          ["interpolate", ["linear"], ["get", "cd_mun"], 0, "#FF6F91"],
          ["literal", "transparent"],
        ],
      };
    },
  },

  methods: {},

  created() {},
  watch: {
    "$route.params.id": {
      handler: async function (id) {
        this.munId = id;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style></style>
