<template>
  <div>
    <VmLayer
      :name="layer.name"
      :source="layer.props.source"
      :type="layer.type"
      :zIndex="layer.zIndex"
      :sourceLayer="layer.sourceLayer"
      :paint="paintLayer"
      :paint-hover="{ 'fill-color': '#7c99f4' }"
      @featureclick="featureclick"
    >
      <template v-slot:popupHover="slotProps">
        <VmPopup color="#f4a259">
          <label>
            Nome município:
            <h3>{{ slotProps.features[0].properties.nm_mun }}</h3>
          </label>
        </VmPopup>
      </template>
    </VmLayer>
  </div>
</template>

<script>
import VmLayer from "../components/VmLayer.vue";
import VmPopup from "../components/VmPopup.vue";
import axios from "axios";
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
  computed: {
    paintLayer() {
      return {
        "fill-color": "transparent",
        "fill-outline-color": "#7c99f4",
        "fill-opacity": 0.3,
      };
    },
  },

  methods: {
    featureclick: function (layer) {
      this.$router.push({
        params: {
          id: layer[0].properties.cd_mun,
        },
      });
    },
  },

  watch: {
    "$route.params.escala": {
      handler: function (escala) {
        if (escala == "estadual") {
          window.maplibregl.setZoom(3);
        } else if (escala == "intraurbana") {
          axios
            .get(
              `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageom_municipios&CQL_FILTER=cd_mun=${this.$route.params.id}outputFormat=application%2Fjson`
            )
            .then((response) => {
              response.data.features.forEach((item) => console.log(item));
            });
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style></style>
