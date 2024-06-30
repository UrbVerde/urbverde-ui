<template>
  <div>
    <p style="margin-bottom: 0.5em;">
      <label >VARIÁVEL :</label>
    </p>
    <v-select
      :items="getPrincipalVegetacao"
      item-text="name"
      item-value="_id"
      v-model="selectedLayer"
      outlined
      hide-details
    ></v-select>

    <!-- Ano -->
    <YearSelector />

    <div class="aside__toolbar_layers"><label>CAMADAS: </label></div>

    <!-- Camadas Escala Estadual -->
    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'estadual'">

      <!-- Camada principal -->
      <div v-for="(layer, idx) in getPrincipalVegetacao" :key="idx">
        <div 
        v-if="layer._id == selectedLayer"
        class="layer_selector d-flex align-center" @click="toggleLayerVisibility(layer)">
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
      <div v-for="(auxLayer, i) in getAuxByVariable" :key="i">
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
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)" @mousedown.stop
            @click.stop />
        </div>
      </div>

      <!-- <div v-for="(auxLayer, i) in getAuxVegEstadual" :key="i">
        <div class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }">
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input :disabled="!auxLayer.visible || auxLayer.type == 'raster'" type="range" min="0.1" max="1" step="0.1"
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)" />
        </div>
      </div> -->

      <!-- RASTER -->
      <!-- <div v-for="(auxLayer, i) in getAuxVeg" :key="i">
        <div class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }">
            <v-icon color="white darken-2"> mdi-eye-outline </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input :disabled="!auxLayer.visible || auxLayer.type == 'raster'" type="range" min="0.1" max="1" step="0.1"
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)" />
        </div>
      </div> -->
    </div>

    <!-- Camadas Escala Intraurbana -->
    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'intraurbana'">
      <div v-for="(layer, idx) in getPrincipalVegetacao" :key="idx">
        <div 
        v-if="layer._id == selectedLayer"
        class="layer_selector d-flex align-center">
        <div class="layer_selector_eye" @click="toggleLayerVisibility(layer)"
            :class="{ itemCantToggle: layer.visible }">
            <v-icon :color="layer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ layer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input type="range" min="0.1" max="1" step="0.1" v-model="opacity[layer.name]"
            @input="changeOpacity(layer, `${layer.name}`)" />
        </div>
      </div>

      <!-- <div class="aside__toolbar_layers"><label>OUTRAS: </label></div> -->
      <div v-for="(auxLayer, i) in getAuxVegEstadual" :key="i">
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
          <input :disabled="!auxLayer.visible || auxLayer.type == 'raster'" type="range" min="0.1" max="1" step="0.1"
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)" />
        </div>
      </div>

      <!-- NÃO SEI O QUE ERA -->
      <!-- <div v-for="(layer, idx) in getVegetacaoIntraurbano" :key="idx">
        <div class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" :class="{ itemActive: layer.visible }">
            <v-icon :color="layer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ layer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input type="range" min="0.1" max="1" step="0.1" v-model="opacity[auxLayer.name]"
            @input="changeOpacity(auxLayer, `${auxLayer.name}`)" />
        </div>
      </div> -->

      <!-- NÃO SEI O QUE ERA -->
      <!-- <div v-for="(layer, idx) in getAuxVegIntraurbano" :key="idx">
        <div v-if="layer.visibleUI" class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" :class="{ itemActive: layer.visible }" @click="toggleLayerVisibility(layer)">
            <v-icon :color="layer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ layer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
        </div>
      </div> -->

      <!-- RASTER NDVI E VEGETAÇÃO -->
      <div v-for="(auxLayer, i) in getAuxVeg" :key="i">
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
          <input :disabled="!auxLayer.visible || auxLayer.type == 'raster'" type="range" min="0.1" max="1" step="0.1"
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)" />
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
        "Percentual de Cobertura Vegetal (PCV) por mesorregião": 0,
        "Percentual de Cobertura Vegetal (PCV) por microrregião": 0,
        "Índice de Cobertura Vegetal (ICV) por mesorregião": 0,
        "Índice de Cobertura Vegetal (ICV) por microrregião": 0,
        "Índice de Desigualdade Socioambiental (IDSA) por mesorregião": 0,
        "Índice de Desigualdade Socioambiental (IDSA) por microrregião": 0,
        "Anual NDVI": 0,
        "Percentual de Cobertura Vegetal (PCV)": 1,
        "Índice de Cobertura Vegetal (ICV)": 1,
        "Índice de Desigualdade Socioambiental (IDSA)": 1,
        ISs: 0,
        ISi: 0,
        ISd: 0,
        Vegetação: 0,
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
          this.getAuxVegEstadual.forEach((item) => {
            if (item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
          this.getAuxVegIntraurbano.forEach((item) => {
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
          localStorage.setItem("vegSelectedLayer", layerId);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    let currentActiveLayer = localStorage.getItem("vegSelectedLayer");
    if (currentActiveLayer) {
      this.selectedLayer = currentActiveLayer;
    } else {
      localStorage.setItem("vegSelectedLayer", "/Percentual de Cobertura Vegetal (PCV)");
      this.selectedLayer = "/Percentual de Cobertura Vegetal (PCV)";
    }
  },
};
</script>

<style scoped lang="scss">
.aside__toolbar_layers {
  label {
    color: #003c3c;
    font-size: 13px;
  }
}

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
  max-width: 95%;

  @media (max-width: 950px) {
    max-width: 100%;
  }
}

.sidebar__scroll {
  max-height: 30.6vh; //50.6vh;
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

.itemCantToggle {
  background-color: #35cc8d !important; //#7777c9 !important;
}


</style>
