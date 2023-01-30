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

    <div v-if="this.$route.params.escala == 'estadual'">
      <div v-for="(layer, idx) in getPrincipalTemperatura" :key="idx">
        <div
          v-if="layer._id == selectedLayer"
          class="layer_selector d-flex align-center"
        >
          <div
            class="layer_selector_eye"
            :class="{ itemActive: layer.visible }"
          >
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input
            :disabled="!layer.visible || layer.type == 'raster'"
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
            :key="idx"
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
            :key="idx"
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>
    </div>

    <div v-if="this.$route.params.escala == 'intraurbana'">
      <div v-for="(layer, idx) in getPrincipalTemperatura" :key="idx">
        <div
          v-if="layer._id == selectedLayer"
          class="layer_selector d-flex align-center"
        >
          <div
            class="layer_selector_eye"
            :class="{ itemActive: layer.visible }"
          >
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input
            :disabled="!layer.visible || layer.type == 'raster'"
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
            :key="idx"
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
  },
  watch: {
    "$route.params.escala": {
      handler: function (escala, oldEscala) {
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
        this.getPrincipalTemperatura.forEach((item) => {
          if (item.visible) {
            this.$store.commit("TOGGLE_LAYER", item);
          }
        });
        this.getAuxTemperaturaIntraurbano.forEach((item) => {
          if (item.visible) {
            this.$store.commit("TOGGLE_LAYER", item);
          }
        });
        this.selectedLayer = "";
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
        }
      },
    },
  },

  created() {
    this.$store.getters.layers((item) => {
      if (item.categoria != "base" && item.visible) {
        this.$store.commit("TOGGLE_LAYER", { _id: layerId });
      }
    });
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
</style>
