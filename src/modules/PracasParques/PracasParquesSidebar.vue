<!-- src/modules/PracasParques/PracasParquesSidebar.vue -->
 <template>
  <div>

    <p style="margin-bottom: 0.5em;">
      <label >VARIÁVEL :</label>
    </p>
    <v-select
      :items="getPrincipalPracas"
      item-text="name"
      item-value="_id"
      v-model="selectedLayer"
      outlined
    ></v-select>

    <!-- Ano -->
    <!-- <YearSelector /> -->

    <div class="aside__toolbar_layers"><label>CAMADAS: </label></div>

    <!-- Camadas na Escala Estadual -->
    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'estadual'">
      <!-- Variáveis -->
      <div v-for="(layer, idx) in getPrincipalPracas" :key="idx">
        <div 
        v-if="layer._id == selectedLayer"
        class="layer_selector d-flex align-center" @click="toggleLayerVisibility(layer)">
          <div class="layer_selector_eye" :class="{ itemCantToggle: layer.visible }">
            <v-icon :color="layer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ layer.visible ? 'mdi-eye-outline': 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <!-- Opacidade -->
          <input :disabled="!layer.visible" type="range" min="0" max="1" step="0.1" :key="idx"
            v-model="opacity[layer.name]" @input="changeOpacity(layer, `${layer.name}`)"
            @mousedown.stop
            @click.stop />
        </div>
      </div>

      <!-- <div class="aside__toolbar_layers"><label>OUTRAS: </label></div> -->
      <div v-for="(auxLayer, i) in getAuxPracas" :key="i">
        <div class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" @click="toggleLayerVisibility(auxLayer)"
            :class="{ itemActive: auxLayer.visible }">
            <v-icon :color="auxLayer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ auxLayer.visible ? 'mdi-eye-outline': 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ auxLayer.name }}</span>
          </div>
          <input :disabled="!auxLayer.visible" type="range" min="0" max="1" step="0.1" :key="i"
            v-model="opacity[auxLayer.name]" @input="changeOpacity(auxLayer, `${auxLayer.name}`)" 
            @mousedown.stop
            @click.stop />
        </div>
      </div>

    </div>

    <!-- Camadas na Escala Intraurbana -->
    <div class="sidebar__scroll" v-if="this.$route.params.escala == 'intraurbana'">
      <div v-for="(layer, idx) in getPrincipalPracas" :key="layer._id">
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
          <input :disabled="!layer.visible" type="range" min="0" max="1" step="0.1" :key="idx"
            v-model="opacity[layer.name]" @input="changeOpacity(layer, `${layer.name}`)"
            @mousedown.stop
            @click.stop />
        </div>
      </div>

      <!-- <div class="aside__toolbar_layers"><label>OUTRAS: </label></div> -->
      <div v-for="(layer, idx) in getAuxPracasIntraurbano" :key="layer._id">
        <div v-if="layer.visibleUI" 
        class="layer_selector d-flex align-center">
          <div class="layer_selector_eye" :class="{ itemActive: layer.visible }" @click="toggleLayerVisibility(layer)">
            <v-icon :color="layer.visible ? 'white darken-2' : '#003C3C darken-2'">
              {{ layer.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
            </v-icon>
          </div>
          <div class="layer_selector_opacity" style="width: 100%">
            <span>{{ layer.name }}</span>
          </div>
          <input :disabled="!layer.visible" type="range" min="0" max="1" step="0.1" :key="idx"
            v-model="opacity[layer.name]" @input="changeOpacity(layer, `${layer.name}`)"
            @mousedown.stop
            @click.stop />
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
        "População atendida pelas praças": 1,
        "Área atendida pelas praças": 1,
        "Área de praças por Habitante": 1,
        "Distância Média até as praças": 1,
        "Produto Interno Bruto": 0,
        "Coeficiente de Gini": 0,
        "Índice de Desenvolvimento Humano": 0,
        "Mancha Urbana": 0,
        // acessoPopMeso: 1,
        // acessoPopMicro: 1,
        "Temperatura de Superfície (2016-2021)": 0,
        "Renda": 0,
        "Parques e Praças": 0,
        "Buffer de 400m ao redor das praças": 0,
        // "Acesso população atendida pelas praças por mesorregião": 1,
        // "Acesso população atendida pelas praças por microrregião": 1,
        // "M² de praças por Habitante por mesorregião": 1,
        // "M² de praças por Habitante por microrregião": 1,
        // "% de área ocupada pelos buffers municipais por Mesorregião": 1,
        // "% de área ocupada pelos buffers municipais por microrregião": 1,
        // "Distribuição espacial das praças por Mesorregião": 1,
        // "Distribuição espacial das praças por microrregião": 1,
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
        "/População atendida pelas praças"
      );
      this.selectedLayer = "/População atendida pelas praças";
    }
  },
};
</script>

<style scoped lang="scss">
.itemActive {
  background-color: #01dc82 !important;
}

.itemCantToggle {
  // background-color: #7777c9 !important;
  // background-color: #003c3c !important;
  background-color: #01dc82 !important
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
  label {
    color: #003c3c;
    font-size: 13px;
  }
}

.sidebar__scroll {
  max-height: 43vh; //50+18vh;
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
