<template>
  <section>
    <v-row class="d-flex">

      <v-col cols="12" md="3" class="d-flex ml-auto flex-column" style="
        width: 100%; height: 98vh; 
        background: var(--Gray-White, #FFF); box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);
        display: flex;
        padding: 15px 24px 16px 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        flex: 1 0 0;
        align-self: stretch;
      ">

        <router-link :to="{ name: 'Home' }">
          <img width="70%" src="@/assets/logos/urbverde-logo.png" />
        </router-link>

        <div class="d-flex flex-column" style="width: 100%;">
          <label>ESCALA</label>
          <!-- <div class="aside__toolbar_scale"> -->
          <!-- <div class="d-flex align-center justify-space-around aside__toolbar_btnbox"> -->
          <router-link class="aside__toolbar_scale--buttons" :class="{
          category__active: routeScaleValue == 'estadual',
        }" :to="{ params: { escala: 'estadual' } }"><span>Estadual</span></router-link>

          <router-link class="aside__toolbar_scale--buttons" :class="{
          category__active: routeScaleValue == 'intraurbana',
        }" :to="{ params: { escala: 'intraurbana' } }"><span>Municipal</span></router-link>
          <!-- </div> -->
        </div>


        <div>
          <label>MUNICÍPIO</label>
          <!-- <label>{{ this.$route.params.escala == 'estadual' ? 'MUNICIPIO' : 'ESTADO' }}</label> -->
          <!-- <v-col cols="10" md="5" :class="{ highlight: highlightSearch }"> -->
          <v-autocomplete v-model="municipioSelected" :items="municipios" label="Ex: São Carlos"></v-autocomplete>
          <!-- </v-col> -->
        </div>

        <div style="display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          flex: 1 0 0;
          align-self: stretch;">
          <label>CATEGORIAS</label>
          <ul>
            <li>Temperatura</li>
            <li>Vegetação</li>
            <li>Praças e Parques</li>
            <li>Hidrografia</li>
            <li>Emissões</li>
            <li>IBGE</li>
          </ul>

        </div>

        <div
          style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
          <div
            style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 8px; padding-bottom: 8px; background: rgba(255, 255, 255, 0); justify-content: flex-start; align-items: center; gap: 4px; display: inline-flex">
            <div
              style="flex: 1 1 0; height: 24px; justify-content: flex-start; align-items: center; gap: 16px; display: flex">
              <div
                style="background: rgba(255, 255, 255, 0); flex-direction: column; justify-content: center; align-items: center; display: inline-flex">
                <div style="width: 24px; height: 24px; position: relative">
                  <img style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute"
                    src="https://via.placeholder.com/24x24" />
                </div>
              </div>
              <div
                style="flex: 1 1 0; background: rgba(255, 255, 255, 0); flex-direction: column; justify-content: center; align-items: flex-start; display: inline-flex">
                <div
                  style="align-self: stretch; color: #ADB5BD; font-size: 16px; font-family: Inter; font-weight: 400; line-height: 24px; word-wrap: break-word">
                  Temperatura</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Camada Principal e Auxiliares -->
        <!-- <div class="aside__toolbar_layers">
            <SidebarControls />
          </div> -->

        </div>
      </v-col>

      <!-- Mapa e Barra inferior -->
      <v-col style="height: 83vh" cols="12" md="9" class="d-flex flex-column ma-0 pa-0">

        Texto

        <MapaBase :key="this.$route.params.categoria" :highlightMap="mapHighlight" />


        <!-- Praças e Parques -->
        <div v-if="this.$route.params.categoria == 'pracasparques'"
          class="d-flex justify-space-around align-center pa-2">
          <div class="d-flex flex-column align-start">
            <span><strong>{{ munPracaData ? munPracaData[0].nm_mun : "..." }}</strong></span>
            <div class="d-flex justify-center align-center">
              <span>
                {{
          this.$route.params.escala == "estadual"
            ? "Estadual"
            : "Intra-urbano"
        }}
              </span>
              <span class="ml-3">{{ this.$route.params.ano }}</span>
            </div>
          </div>

          <div class="d-flex flex-column justify-center align-center">
            <span><strong>População Atendida </strong></span>
            <span> {{ munPracaData ? Math.round(munPracaData[0].h5 / 100) + '%' : "..." }}</span>
          </div>

          <div class="d-flex flex-column justify-center align-center">
            <span class="text-center"><strong>Desigualdade de Renda</strong></span>
            <span>{{ munPracaData ? Math.round((munPracaData[0].h6 - 1) * 100) + '%' : "..." }}</span>
          </div>

          <div class="d-flex justify-center align-center">
            <DownloadPdf />
          </div>

        </div>

        <!-- Vegetação -->
        <!-- <div
          v-if="this.$route.params.categoria == 'vegetacao'"
          class="d-flex justify-space-around align-center pa-2"
          style="background-color: #f2f5f7; border-color: 1px solid #606773"
        >
          <h4 style="color: #606773">
            Área selecionada : <strong>{{ munVegData[0].nm_mun }}</strong>
          </h4>
          <h4 style="color: #606773">
            Cobertura Vegetal :
            <strong> {{ (munVegData[0].b1 * 100).toFixed(2) }}%</strong>
          </h4>
          <h4 style="color: #606773">
            Desigualdade Socioambiental :
            <strong>{{ (munVegData[0].b3 * 100).toFixed(2) }} </strong>
          </h4>
        </div> -->
        <div v-if="this.$route.params.categoria == 'vegetacao'" class="d-flex justify-space-around align-center pa-2">
          <div class="d-flex flex-column align-start">
            <span>
              <strong>{{ munVegData[0].nm_mun }}</strong>
            </span>
            <div class="d-flex justify-center align-center">
              <span>
                {{
          this.$route.params.escala == "estadual"
            ? "Estadual"
            : "Intra-urbano"
        }}
              </span>
              <span class="ml-3">
                {{ this.$route.params.ano }}
              </span>
            </div>
          </div>

          <div class="vertical-line"></div>

          <div class="d-flex flex-column justify-center align-center">
            <span class="text-center"><strong>Cobertura Vegetal</strong></span>
            <!-- <chart class="mr-2" :size="60" :valor="munVegData[0].b1 * 100" /> -->
            <span>{{ (munVegData[0].b1 * 100).toFixed(1) }}%</span>
          </div>

          <div class="vertical-line"></div>

          <div class="d-flex flex-column justify-center align-center"></div>
          <!-- <div class="d-flex justify-center align-center"> -->
          <!-- <table class="charts-css bar mr-2">
              <tbody>
                <tr style="background-color: #f2ecff">
                  <td :style="`--size: calc(${munVegData[0].b3} / 1); background-color: #01dc82;`">
                    <span class="data pa-3 mr-auto" style="color: white">
                      <strong>{{ (munVegData[0].b3 * 100).toFixed(2) }}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>-->
          <span class="text-center"><strong> Desigualdade Socioambiental </strong>
            <br>
            <span>{{ munVegData[0].b3.toFixed(2) }}</span>
          </span>


          <div class="vertical-line"></div>

          <div class="d-flex justify-center align-center">
            <DownloadPdf />
          </div>
        </div>
        <!-- </div> -->


        <!-- Temperatura -->
        <!-- <div
          v-if="this.$route.params.categoria == 'temperatura'"
          class="d-flex justify-space-around align-center pa-2"
          style="background-color: #f2f5f7; border-color: 1px solid #606773"
        >
          <h4 style="color: #606773">
            Temperatura Média de Superfície :
            <strong> {{ munTempData[0].ch1.toFixed(2) }}ºC</strong>
          </h4>
          <h4 style="color: #606773">
            Diferença de Temperatura :
            <strong>{{ munTempData[0].h5b }} </strong>
          </h4>
        </div> -->
        <div v-if="this.$route.params.categoria == 'temperatura'" class="d-flex justify-space-around align-center pa-2">
          <div class="d-flex flex-column align-start">
            <span><strong>{{ munTempData[0].nm_mun }}</strong></span>
            <div class="d-flex justify-center align-center">
              <span>
                {{
          this.$route.params.escala == "estadual"
            ? "Estadual"
            : "Intra-urbano"
        }}
              </span>
              <span class="ml-3">{{ this.$route.params.ano }}</span>
            </div>
          </div>

          <div class="d-flex flex-column justify-center align-center">
            <span class="text-center"><strong>Temperatura de Superfície</strong></span>
            <span>{{ munTempData[0].ch1.toFixed(2) }}ºC</span>
            <!-- style="color: #01dc82"><strong>{ -->
          </div>

          <div class="d-flex flex-column justify-center align-center">
            <span class="text-center"><strong>Amplitude Máxima</strong></span>
            <span>{{ munTempData[0].h5b }}ºC</span>
          </div>

          <div class="d-flex justify-center align-center">
            <DownloadPdf />
          </div>
        </div>
      </v-col>

      <!-- Rankings/Highligts/Gráficos -->
      <v-col cols="12">
        <VegetacaoHighlights v-if="this.$route.params.categoria == 'vegetacao'" />
        <PracasParquesHighlights v-if="this.$route.params.categoria == 'pracasparques'" />
        <TemperaturaHighlights v-if="this.$route.params.categoria == 'temperatura'" />
      </v-col>

    </v-row>
  </section>
</template>

<script>
import MapaBase from "@/modules/Mapa/MapaBase.vue";

export default {
  name: "MapaView",
  components: { MapaBase },
  data() {
    return {
      searchHighlight: '',
      mapHighlight: '',
      valid: false,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
      ],
      selection: "",
      layerOpacity: 1,
      ano: "",
    };
  },
  methods: {
    highlightSearch() {
      window.scrollTo(0, 0);
      this.searchHighlight = true;
      setTimeout(() => {
        this.$set(this, 'searchHighlight', false);
      }, 2000);
    },
    highlightMap() {
      window.scrollTo(0, 0);
      this.mapHighlight = true
      setTimeout(() => {
        this.$set(this, 'mapHighlight', false);
      }, 2000);
    },

    scrollToStats() {
      window.scrollTo(950, 950);
    },

    scrollToGraphs() {
      window.scrollTo(950, 1510);
    },

    toogleLayerVisibility: function (layer) {
      this.$store.commit("TOGGLE_LAYER", layer);
    },

    share() {
      const shareData = {
        title: "Plataforma Urbverde",
        text: "Compartilhe a plataforma com seus amigos",
        url: "https://urbverde.iau.usp.br",
      };

      if (navigator.share) {
        navigator
          .share(shareData)
          .then(() => {
            console.log("Compartilhado com sucesso");
          })
          .catch(console.error);
      } else {
        console.log("não tem navigator.share");
      }
    },

    toggleTwice(element) {
      return new Promise((resolve, reject) => {
        const currentState = this.layers.filter((item) => item.visible === true);
        this.$store.commit("TOGGLE_LAYER", { _id: element });
        setTimeout(() => {
          const nextState = this.layers.filter((item) => item.visible === true);
          if (currentState !== nextState) {
            this.$store.commit("TOGGLE_LAYER", { _id: element });
          }
          resolve();
        }, 500);
      });
    }
  },

  computed: {
    routeScaleValue() {
      return this.$route.params.escala;
    },
    routeYearValue() {
      return this.$route.params.ano;
    },

    munTempData() {
      return this.$store.getters.getMunTempData[this.$route.params.ano] || null;
    },
    munVegData() {
      return this.$store.getters.getMunVegData[this.$route.params.ano] || null;
    },
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021] || null;
    },
    layers() {
      return this.$store.getters.layers || null;
    }
  },
  watch: {
    "$route.params.categoria": {
      handler: function (categoria, oldcategoria) {
        if (categoria == oldcategoria) {
          return
        } else {
          this.$store.getters.layers.forEach((item) => {
            if (item.categoria != "base" && item.visible) {
              this.$store.commit("TOGGLE_LAYER", item);
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
    "$route.params.id": {
      handler: async function (id) {
        this.$store.dispatch("getMunicipioVegData", id);
        this.$store.dispatch("getMunicipioPracaData", id);
        this.$store.dispatch("getMunicipioTempData", id);
      },
      deep: true,
    },
    "$route.params.ano": {
      handler: async function (ano, oldAno) {
        this.ano = ano;
        if (ano !== oldAno) {
          this.$store.getters.layersAtivos.forEach((camada) => {
            this.toggleTwice(camada)
          })
        } else {
          return
        }
      },
      deep: true,
    },
  },
  created() {
    this.$store.dispatch("getMunicipioVegData", this.$route.params.id);
    this.$store.dispatch("getMunicipioPracaData", this.$route.params.id);
    this.$store.dispatch("getMunicipioTempData", this.$route.params.id);
  },
};
</script>

<style lang="scss" scoped>
section {
  padding: 0;
  margin: 0;
  height: 100%;
}

a {
  text-decoration: none;
  color: #003c3c;
}

label {
  color: var(--Gray-600, #6C757D);
  /* Components/Dropdowns/Item Header */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16.8px;
  /* 120% */

}

.top {
  display: flex;
  height: 70px;
  // padding: 0px 24px;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  align-self: stretch;
}

.logo {
  background: var(--Gray-White, #FFF);
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.13) inset;
  padding-top: 15px;
  padding-bottom: 15px;
  // display: flex; 
  // align-items: center; 
  // gap: 4px; 
  // flex: 1 0 0;
}

.fixed {
  position: fixed;
  height: 89vh;
  z-index: 100;
  background-color: white;

  @media (max-width: 921px) {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
}

.vertical-line {
  border-right: 2px solid white; //#ddeaf3;
  height: 100%;
  /* Ensure the line spans the full height */
}

.verticalcolumn__menu_item {
  display: grid;
  place-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #d3d3d3;
  }
}

.category__active {
  background-color: #003c3c !important;
  color: white !important;
}

.headernav__categories {
  margin-left: 5px;
  border-left: 1px solid #ddeaf3;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.layer_active {
  background-color: #003c3c;
  color: white;
}

.aside__toolbar_layers {
  margin-top: 1em;

  label {
    color: #003c3c;
    font-size: 13px;
  }
}

.aside__toolbar_period {
  label {
    color: #003c3c;
    font-size: 13px;
  }

  a {
    width: 20%;
  }
}

.yearitem {
  height: 3px;
  width: 100%;
  background-color: #d0e3e3;
  position: relative;
  margin-top: 25px;

  img {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
  }
}

.itemActive {
  background-color: #01dc82 !important;
}

.v-select__selections {
  color: "blue";
}

.border-helper {
  border: 2px solid #e6f1f2;
  border-radius: 8px;
  padding: 2em;
}

.aside__toolbar_scale {
  display: flex;
  padding: 24px 24px 32px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

// .aside__toolbar_btnbox {
//   margin-top: 0.5em;
//   padding-bottom: 1em;
//   position: relative;
// }
// &::before {
//   content: "";
//   position: absolute;
//   width: 100%;
//   height: 1px;
//   background-color: #d0e3e3;
//   bottom: 0;
// }

// .aside__toolbar_scale--buttons {
//   border-radius: 14px;
//   text-align: center;
//   background-color: #e6f1f2;
//   color: #003c3c;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 57px;
//   padding: 1em;

//   font-size: 1.2em;
//   cursor: pointer;

//   & span {
//     font-size: 0.8em;
//   }
// }</style>./MapaView.vue.copy