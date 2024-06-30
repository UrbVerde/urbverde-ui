<template>
  <div>
    <!-- <label>ANO :</label> -->
    <label>VARIÁVEL :</label>
    <!-- style="display: none;" -->
    <v-select :items="getPrincipalTemperatura" item-text="name" item-value="_id" v-model="selectedLayer" outlined
      hide-details></v-select>

    <YearSelector />


    <div class="aside__toolbar_layers"><label>CAMADAS: </label></div>

    <!-- Camadas Escala Estadual -->
    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'estadual'">
      <!-- Variáveis -->
      <div v-for="(layer, idx) in getPrincipalTemperatura" :key="idx">
        <div class="layer_selector d-flex align-center" @click="toggleLayerVisibility(layer)">
          <div class="layer_selector_eye" :class="{ itemCantToggle: layer.visible }">
            <v-icon :color="layer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ layer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <!-- Opacidade -->
          <input :disabled="!layer.visible" type="range" min="0" max="1" step="0.1" :key="idx"
            v-model="opacity[layer.name]" @input="changeOpacity(layer, `${layer.name}`)" @mousedown.stop @click.stop />
        </div>
      </div>

      <!-- <div class="aside__toolbar_layers"><label>OUTRAS: </label></div> -->
      <!-- <div class="aside__toolbar_layers"><label>OUTRAS: </label></div>
      <div v-for="(auxLayer, i) in getAuxByVariable" :key="i">
        {{auxLayer,i}}
        <div class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }">
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input :disabled="!auxLayer.visible || auxLayer.type == 'raster'" type="range" min="0.1" max="1" step="0.1"
            :key="i" v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)" />
        </div>
      </div> -->

      <div v-for="(auxLayer, i) in getAuxTemperatura" :key="i">
        <div class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }">
            <v-icon :color="auxLayer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ auxLayer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input :disabled="!auxLayer.visible" type="range" min="0" max="1" step="0.1" :key="i"
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
            @mousedown.stop="handleOpacityMarkerClick($event, layer)"
            @click.stop="handleOpacityMarkerClick($event, layer)" />
        </div>
      </div>
    </div>

    <!-- Camadas Escala Intraurbana -->
    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'intraurbana'">
      <div v-for="(layer, idx) in getPrincipalTemperatura" :key="idx">
        <div class="layer_selector d-flex align-center" @click="toggleLayerVisibility(layer)">
          <div class="layer_selector_eye" :class="{ itemCantToggle: layer.visible }">
            <v-icon :color="layer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ layer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input :disabled="!layer.visible" type="range" min="0" max="1" step="0.1" :key="idx"
            v-model="opacity[layer.name]" @input="changeOpacity(layer, `${layer.name}`)"
            @mousedown.stop="handleOpacityMarkerClick($event, layer)"
            @click.stop="handleOpacityMarkerClick($event, layer)" />
        </div>
      </div>

      <!-- <div class="aside__toolbar_layers"><label>OUTRAS: </label></div> -->

      <div v-for="(auxLayer, i) in getAuxTemperaturaIntraurbano" :key="i">
        <div class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" :class="{ itemActive: auxLayer.visible }"
            @click="toggleLayerVisibility(auxLayer)">
            <v-icon :color="auxLayer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ auxLayer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input :disabled="!auxLayer.visible" type="range" min="0" max="1" step="0.1" :key="i"
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)"
            @mousedown.stop="handleOpacityMarkerClick($event, layer)"
            @click.stop="handleOpacityMarkerClick($event, layer)" />
        </div>
      </div>


      <!-- Ano -->
      <!-- <YearSelector /> -->

    </div>
  
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedLayer: "",
      opacity: {
        "Coeficiente de Ilha de Calor": 1,
        // "Temperatura Média de Superfície": 0,
        "Temperatura Máxima de Superfície": 0,
        "Raster de Temperatura Anual": 0,
        "Temperatura de Superfície (2016-2021)": 0,
      },
    };
  },

  methods: {
    toggleLayerVisibility: function (layer) {
      if (!layer.visible && this.opacity[layer.name] === 0) {
        this.opacity[layer.name] = 1;
        this.changeOpacity(layer, layer.name);
      } else if (layer.visible && this.opacity[layer.name] === 1) {
        this.opacity[layer.name] = 0;
        this.changeOpacity(layer, layer.name);
      }
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

.itemCantToggle {
  background-color: #35cc8d !important; // #7777c9 
}

input[type="range"] {
  color: #b8b8b8;
  width: 20%;
}

.v-select {
  max-width: 100%;
}

.v-input--is-label-active {
  max-width: 95%;

  @media (max-width: 950px) {
    max-width: 100%;
  }
}

.aside__toolbar_layers {
  margin-top: 0px !important;

  label {
    color: #003c3c;
    font-size: 13px;
  }
}

.sidebar__scroll {
  max-height: 50vh;
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
  // background: #35cc8d;
  background: #ddeaf3;
  // background: #003c3c;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  // background: #8bc9af;
  background: #35cc8d;
}
</style>
