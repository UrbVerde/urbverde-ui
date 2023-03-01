<template>
  <div>
    <v-select
      :items="getPrincipalVegetacao"
      item-text="name"
      item-value="_id"
      v-model="selectedLayer"
      outlined
    ></v-select>

    <YearSelector />

    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'estadual'">
      <div v-for="(layer, idx) in getPrincipalVegetacao" :key="idx">
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

      <div
        class="sidebar__scroll"
        v-for="(auxLayer, i) in getAuxByVariable"
        :key="i"
      >
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
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>

      <div v-for="(auxLayer, i) in getAuxVegEstadual" :key="i">
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
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>

      <div v-for="(auxLayer, i) in getAuxVeg" :key="i">
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
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>
    </div>

    <div v-if="this.$route.params.escala == 'intraurbana'">
      <div v-for="(layer, idx) in getPrincipalVegetacao" :key="idx">
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
            :disabled="!layer.visible || layer.type == 'raster'"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            v-model="opacity[layer.name]"
            @input="changeOpacity(layer, `${layer.name}`)"
          />
        </div>
      </div>

      <div v-for="(auxLayer, i) in getAuxVegEstadual" :key="i">
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
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>

      <div v-for="(layer, idx) in getVegetacaoIntraurbano" :key="idx">
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
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>

      <div v-for="(layer, idx) in getAuxVegIntraurbano" :key="idx">
        <div v-if="layer.visibleUI" class="layer_selector d-flex align-center">
          <div
            class="layer_selector_eye"
            :class="{ itemActive: layer.visible }"
            @click="toggleLayerVisibility(layer)"
          >
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
        </div>
      </div>
      <div v-for="(auxLayer, i) in getAuxVeg" :key="i">
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
        "% Cobertura Vegetal (PCV) por mesorregião": 1,
        "% Cobertura Vegetal (PCV) por microrregião": 1,
        "Índice de Cobertura Vegetal (ICV) por mesorregião": 1,
        "Índice de Cobertura Vegetal (ICV) por microrregião": 1,
        "Índice de Desigualdade Socioambiental (IDSA) por mesorregião": 1,
        "Índice de Desigualdade Socioambiental (IDSA) por microrregião": 1,
        "Anual NDVI": 1,
        "% Cobertura Vegetal (PCV)": 1,
        "Índice de Cobertura Vegetal (ICV)": 1,
        "Índice de Desigualdade Socioambiental (IDSA)": 1,
        ISs: 1,
        ISi: 1,
        ISd: 1,
        Vegetação: 1,
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
    getPrincipalVegetacao() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "principal_vegetacao"
      );
    },
    getAuxVegEstadual() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "aux_veg_estadual"
      );
    },

    getAuxVeg() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "aux_veg"
      );
    },
    getVegetacaoIntraurbano() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "principal_veg_intraurbano"
      );
    },
    getAuxVegIntraurbano() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "aux_veg_intraurbano"
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
        if (escala == "intraurbana") {
          this.getAuxByVariable.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
          this.getAuxVegEstadual.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
        }
        if (escala == "estadual") {
          this.getAuxVegIntraurbano.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
        }
        this.getPrincipalVegetacao.forEach((item) => {
          if (item.visible) {
            this.$store.commit("TOGGLE_LAYER", item);
          }
        });
        this.selectedLayer = "";
      },
      deep: true,
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
};
</script>

<style scoped lang="scss">
.itemActive {
  background-color: #01dc82 !important;
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
