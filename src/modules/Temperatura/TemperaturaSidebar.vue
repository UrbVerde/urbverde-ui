<template>
  <div>
    <v-select
      :items="getPrincipalTemperatura"
      item-text="name"
      item-value="_id"
      v-model="selectedLayer"
      outlined
    ></v-select>

    <YearSelector />

    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'estadual'">
      <div v-for="(layer, idx) in getPrincipalTemperatura" :key="idx">
        <div
          v-if="layer._id == selectedLayer"
          class="layer_selector d-flex align-center"
        >
          <div
            class="layer_selector_eye"
            :class="{ itemCantToggle: layer.visible }"
          >
            <v-icon color="white darken-2"> mdi-led-on </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            :key="idx"
            v-model="opacity.principalLayerOpacity"
            @input="changeOpacity(layer, 'principalLayerOpacity')"
          />
        </div>
      </div>

      <div v-for="(auxLayer, i) in getAuxByVariable" :key="i">
        <div class="layer_selector d-flex align-center">
          <div
            class="layer_selector_eye"
            @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }"
          >
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input
            :disabled="!auxLayer.visible || auxLayer.type == 'raster'"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            :key="i"
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>

      <div v-for="(auxLayer, i) in getAuxTemperatura" :key="i">
        <div class="layer_selector d-flex align-center">
          <div
            class="layer_selector_eye"
            @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }"
          >
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input
            :disabled="!auxLayer.visible || auxLayer.type == 'raster'"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            :key="i"
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>
    </div>

    <div
      class="sidebar__scroll"
      v-if="this.$route.params.escala == 'intraurbana'"
    >
      <div v-for="(layer, idx) in getPrincipalTemperatura" :key="idx">
        <div
          v-if="layer._id == selectedLayer"
          class="layer_selector d-flex align-center"
        >
          <div
            class="layer_selector_eye"
            :class="{ itemCantToggle: layer.visible }"
          >
            <v-icon color="white darken-2"> mdi-led-on </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            :key="idx"
            v-model="opacity.principalLayerOpacity"
            @input="changeOpacity(layer, 'principalLayerOpacity')"
          />
        </div>
      </div>

      <div v-for="(auxLayer, i) in getAuxTemperaturaIntraurbano" :key="i">
        <div class="layer_selector d-flex align-center">
          <div
            class="layer_selector_eye"
            @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }"
          >
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input
            :disabled="!auxLayer.visible || auxLayer.type == 'raster'"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            :key="i"
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedLayer: "",
      opacity: {
        principalLayerOpacity: 1,
      },
    };
  },

  methods: {
    toggleLayerVisibility: function (layer) {
      this.$store.commit("TOGGLE_LAYER", layer);
    },
    changeOpacity(layer, val) {
      this.$store.commit("SET_LAYER_PROPERTIES", {
        layer,
        prop: "opacity",
        value: Number(this.opacity[val]),
      });
    },
  },
  computed: {
    getPrincipalTemperatura() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "principal_temperatura"
      );
    },
    getAuxTemperatura() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "aux_temperatura"
      );
    },
    getAuxTemperaturaIntraurbano() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "aux_temperatura_intraurbano"
      );
    },

    getAuxByVariable() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == this.selectedLayer
      );
    },
    layersBeforeYearUpdate() {
      return this.$store.getters.getPreviousLayers;
    },

    layers() {
      return this.$store.getters.layers;
    },
  },
  watch: {
    "$route.params.escala": {
      handler: function (escala, oldescala) {
        if (escala !== oldescala) {
          this.getAuxByVariable.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
          this.getAuxTemperatura.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
          this.getAuxTemperaturaIntraurbano.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
        } else {
          return;
        }
      },
      deep: true,
      immediate: true,
    },

    "$route.params.ano": {
      handler: function (ano, oldano) {
        if (ano !== oldano) {
          let ids = [];
          this.layers
            .filter((item) => item.visible == true)
            .forEach((item) => {
              ids.push(layer._id);
            });
          this.$store.commit("SET_PREVIOUS_LAYERS", ids);
        } else {
          return;
        }
      },
      deep: true,
      immediate: true,
    },
    selectedLayer: {
      handler: function (layerId, oldLayerId) {
        if (oldLayerId == undefined) {
          return this.$store.commit("TOGGLE_LAYER", { _id: layerId });
        } else {
          this.$store.commit("TOGGLE_LAYER", { _id: layerId });
          this.$store.commit("TOGGLE_LAYER", { _id: oldLayerId });
          localStorage.setItem("tempSelectedLayer", layerId);
        }
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    let currentActiveLayer = localStorage.getItem("tempSelectedLayer");
    if (currentActiveLayer) {
      this.selectedLayer = currentActiveLayer;
    } else {
      localStorage.setItem(
        "tempSelectedLayer",
        "/Coeficiente de Ilha de Calor"
      );
      this.selectedLayer = "/Coeficiente de Ilha de Calor";
    }
  },
};
</script>

<style scoped lang="scss">
.itemActive {
  background-color: #01dc82 !important;
}

.aside__toolbar_layers {
  margin-top: 1em;
  label {
    color: #003c3c;
    font-size: 13px;
  }
}

input[type="range"] {
  color: #b8b8b8;
  width: 20%;
}

.v-select {
  max-width: 100%;
}

.v-input--is-label-active {
  max-width: 250px;
  @media (max-width: 950px) {
    max-width: 100%;
  }
}

.sidebar__scroll {
  max-height: 350px;
  overflow: scroll;
  overflow-x: hidden;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #35cc8d;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #8bc9af;
}

.itemCantToggle {
  background-color: #7777c9 !important;
}
</style>
