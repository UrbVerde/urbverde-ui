<template>
  <div style="">
    <v-select
      :items="getPrincipalPracas"
      item-text="name"
      item-value="_id"
      v-model="selectedLayer"
      outlined
    ></v-select>

    <div class="aside__toolbar_layers">
      <label>CAMADAS AUXILIARES</label>
    </div>

    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'estadual'">
      <div v-for="(layer, idx) in getPrincipalPracas" :key="idx">
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
            v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
          />
        </div>
      </div>

      <div class="layer_selector d-flex align-center">
        <div
          class="layer_selector_eye"
          @click="toggleLayerVisibility(pib)"
          :class="{ itemActive: pib.visible }"
        >
          <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
        </div>
        <div class="layer_selector_opacity" style="width: 100%">
          <span>{{ pib.name }}</span>
        </div>
        <input
          :disabled="!pib.visible || pib.type == 'raster'"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          v-model="opacity.pib"
          @input="changeOpacity(pib, 'pib')"
        />
      </div>

      <div class="layer_selector d-flex align-center">
        <div
          class="layer_selector_eye"
          @click="toggleLayerVisibility(idh)"
          :class="{ itemActive: idh.visible }"
        >
          <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
        </div>
        <div
          class="layer_selector_opacity d-flex flex-column"
          style="width: 100%"
        >
          <span>{{ idh.name }}</span>
          <!-- <v-slider
            :disabled="!idh.visible"
            dense
            hide-details
            :max="1"
            :min="0.1"
            :step="0.1"
            color="#01dc82"
            track-color="#c5c5c5"
            v-model="opacity.idh"
            @change="changeOpacity(idh, 'idh')"
          ></v-slider> -->
        </div>
        <input
          :disabled="!idh.visible || idh.type == 'raster'"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          v-model="opacity.idh"
          @input="changeOpacity(idh, 'idh')"
        />
      </div>
      <div class="layer_selector d-flex align-center">
        <div
          class="layer_selector_eye"
          @click="toggleLayerVisibility(gini)"
          :class="{ itemActive: gini.visible }"
        >
          <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
        </div>
        <div
          class="layer_selector_opacity d-flex flex-column"
          style="width: 100%"
        >
          <span>{{ gini.name }}</span>
        </div>

        <input
          :disabled="!gini.visible || gini.type == 'raster'"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          v-model="opacity.gini"
          @input="changeOpacity(gini, 'gini')"
        />
      </div>
    </div>

    <div
      class="sidebar__scroll"
      v-if="this.$route.params.escala == 'intraurbana'"
    >
      <div v-for="(layer, idx) in getPrincipalPracas" :key="idx">
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

      <div v-for="(layer, idx) in getAuxPracasIntraurbano" :key="idx">
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
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            v-model="opacity[layer.name]"
            @input="changeOpacity(layer, `${layer.name}`)"
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
        pib: 1,
        gini: 1,
        idh: 1,
        acessoPopMeso: 1,
        acessoPopMicro: 1,
        "Temperatura - intraurbano": 1,
        Renda: 1,
        "Parques e Praças": 1,
        "Buffer de 400m em torno das praças": 1,
        "Acesso população atendida pelas praças por mesorregião": 1,
        "Acesso população atendida pelas praças por microrregião": 1,
        "M² de praças por Habitante por mesorregião": 1,
        "M² de praças por Habitante por microrregião": 1,
        "% de área ocupada pelos buffers municipais por Mesorregião": 1,
        "% de área ocupada pelos buffers municipais por microrregião": 1,
        "Distribuição espacial das praças por Mesorregião": 1,
        "Distribuição espacial das praças por microrregião": 1,
      },
    };
  },

  mounted() {},

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
    getPrincipalPracas() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "principal_pracas"
      );
    },

    getAuxPracas() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "aux_pracas"
      );
    },

    pib() {
      return this.$store.getters.layers.find(
        (item) => item.name == "Produto Interno Bruto"
      );
    },
    gini() {
      return this.$store.getters.layers.find(
        (item) => item.name == "Coeficiente de Gini"
      );
    },
    idh() {
      return this.$store.getters.layers.find(
        (item) => item.name == "Índice de Desenvolvimento Humano"
      );
    },

    getAuxPracasIntraurbano() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == "aux_pracas_intraurbano"
      );
    },
    getAuxByVariable() {
      return this.$store.getters.layers.filter(
        (item) => item.categoria == this.selectedLayer
      );
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
          this.getAuxPracas.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
          this.getAuxPracasIntraurbano.forEach((item) => {
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
          localStorage.setItem("parquesSelectedLayer", layerId);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    let currentActiveLayer = localStorage.getItem("parquesSelectedLayer");
    if (currentActiveLayer) {
      this.selectedLayer = currentActiveLayer;
    } else {
      localStorage.setItem(
        "parquesSelectedLayer",
        "/Acesso população atendida pelas praças"
      );
      this.selectedLayer = "/Acesso população atendida pelas praças";
    }
  },
};
</script>

<style scoped lang="scss">
.itemActive {
  background-color: #01dc82 !important;
}

.itemCantToggle {
  background-color: #7777c9 !important;
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

.aside__toolbar_layers {
  label {
    color: #003c3c;
    font-size: 13px;
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
</style>
