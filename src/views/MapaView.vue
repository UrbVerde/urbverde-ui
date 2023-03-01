<template>
  <section>
    <HeaderMap :highlightSearch="searchHighlight" />
    <v-row class="d-flex">
      <v-col
        cols="12"
        md="1"
        class="d-flex flex-md-column justify-center fixed"
      >
        
        <img class="my-5 mx-auto" @click="highlightSearch" width="25px" src="@/assets/icons/search-icon.png" alt="" />
        
        <img
          class="my-5 mx-auto"
          width="25px"
          src="@/assets/icons/field-icon.png"
          alt=""
          @click="highlightMap"
        />
        <img
          class="my-5 mx-auto"
          width="25px"
          src="@/assets/icons/field2-icon.png"
          alt=""
        />
        <img
          class="my-5 mx-auto"
          width="25px"
          src="@/assets/icons/field3-icon.png"
          alt=""
          @click="scrollToStats"
        />
        <a
          href="https://github.com/UrbVerde/urbverde-ui"
          target="_blank"
          class="my-5 mx-auto"
        >
          <img width="25px" src="@/assets/icons/downloads-icon.png" alt="" />
        </a>
        <img
          class="my-5 mx-auto"
          width="25px"
          src="@/assets/icons/field5-icon.png"
          alt=""
        />
        <ShareModal />
      </v-col>

      <v-col cols="12" md="3" class="d-flex ml-auto">

        <div class="d-flex flex-column" style="width: 100%">
          <div class="aside__toolbar_scale">
            <label>VISUALIZAR ESCALA :</label>
            <div
              class="d-flex align-center justify-space-around aside__toolbar_btnbox"
            >
              <router-link
                class="aside__toolbar_scale--buttons"
                :class="{
                  category__active: routeScaleValue == 'estadual',
                }"
                :to="{ params: { escala: 'estadual' } }"
                ><span>Estadual</span></router-link
              >

              <router-link
                class="aside__toolbar_scale--buttons"
                :class="{
                  category__active: routeScaleValue == 'intraurbana',
                }"
                :to="{ params: { escala: 'intraurbana' } }"
                ><span>Intra-urbana</span></router-link
              >
            </div>
          </div>

          <div class="aside__toolbar_layers">
            <label>CAMADA PRINCIPAL</label>
            <SidebarControls />
          </div>
        </div>
      </v-col>

      <v-col style="height: 89vh" cols="12" md="8" class="d-flex flex-column">
        <MapaBase :highlightMap="mapHighlight" />
        <div
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
        </div>
        <div
          v-if="this.$route.params.categoria == 'vegetacao'"
          class="d-flex justify-space-around align-center pa-2"
        >
          <div class="d-flex flex-column align-start">
            <span
              ><strong>{{ munVegData[0].nm_mun }}</strong></span
            >
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
          <div class="d-flex justify-center align-center">
            <chart class="mr-2" :size="60" :valor="munVegData[0].b1 * 100" />

            <span><strong>Cobertura Vegetal</strong></span>
          </div>

          <div class="d-flex justify-center align-center">
            <table class="charts-css bar mr-2">
              <tbody>
                <tr style="background-color: #f2ecff">
                  <td
                    :style="`--size: calc(${munVegData[0].b3} / 1); background-color: #01dc82;`"
                  >
                    <span class="data pa-3 mr-auto" style="color: white">
                      <strong>{{ (munVegData[0].b3 * 100).toFixed(2) }}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <span><strong>Desigualdade Socioambiental</strong></span>
          </div>
          <div class="d-flex justify-center align-center">
            <DownloadPdf />
          </div>
        </div>

        <div
          v-if="this.$route.params.categoria == 'pracasparques'"
          class="d-flex justify-space-around align-center pa-2"
          style="background-color: #f2f5f7; border-color: 1px solid #606773"
        >
          <h4 style="color: #606773">
            Área selecionada : <strong>{{ munVegData[0].nm_mun }}</strong>
          </h4>
          <h4 style="color: #606773">
            População Atendida por Praças :
            <strong> {{ munPracaData[0].h5 }}</strong>
          </h4>
          <h4 style="color: #606773">
            Desigualdade de Renda :
            <strong>{{ munPracaData[0].h6 }} </strong>
          </h4>
        </div>

        <div
          v-if="this.$route.params.categoria == 'pracasparques'"
          class="d-flex justify-space-around align-center pa-2"
        >
          <div class="d-flex flex-column align-start">
            <span
              ><strong>{{ munVegData[0].nm_mun }}</strong></span
            >
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
            <span><strong>População Atendida por Praças</strong></span>
            <span>{{ munPracaData[0].h5 }}</span>
          </div>

          <div class="d-flex justify-center align-center">
            <table class="charts-css bar mr-2" style="height: 50px">
              <tbody style="height: 50px">
                <tr style="background-color: #f2ecff; height: 50px">
                  <td
                    :style="`--size: calc(${munPracaData[0].h6} / 100); background-color: #01dc82;`"
                  >
                    <span class="data" style="color: white">
                      <strong>{{ munPracaData[0].h6 }}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex flex-column justify-center align-center">

             <span class="text-center"
              ><strong
                >Desigualdade de Renda
                </strong></span
            >
            <span style="color: #01dc82"
                  ><strong>{{ munPracaData[0].h6 }}</strong></span
                >
              </strong>
            </div>
          </div>
          <div class="d-flex justify-center align-center">
            <DownloadPdf />
          </div>
        </div>

        <div
          v-if="this.$route.params.categoria == 'temperatura'"
          class="d-flex justify-space-around align-center pa-2"
          style="background-color: #f2f5f7; border-color: 1px solid #606773"
        >
          <h4 style="color: #606773">
            Área selecionada : <strong>{{ munVegData[0].nm_mun }}</strong>
          </h4>
          <h4 style="color: #606773">
            Temperatura Média de Superfície :
            <strong> {{ munTempData[0].ch1.toFixed(2) }}ºC</strong>
          </h4>
          <h4 style="color: #606773">
            Diferença de Temperatura :
            <strong>{{ munTempData[0].h5b }} </strong>
          </h4>
        </div>

        <div
          v-if="this.$route.params.categoria == 'temperatura'"
          class="d-flex justify-space-around align-center pa-2"
        >
          <div class="d-flex flex-column align-start">
            <span
              ><strong>{{ munVegData[0].nm_mun }}</strong></span
            >
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

          <div class="d-flex justify-center align-center">
            <table class="charts-css bar mr-2" style="height: 50px">
              <tbody style="height: 50px">
                <tr style="background-color: #f2ecff; height: 50px">
                  <td
                    :style="`--size: calc(${munPracaData[0].h6} / 100); background-color: #01dc82;`"
                  >
                    <span class="data pa-3 mr-auto" style="color: white">
                      <strong>{{ munPracaData[0].h6 }}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="d-flex flex-column justify-center align-center">

             <span class="text-center"
              ><strong
                >Desigualdade de Renda
                </strong></span
            >
            <span style="color: #01dc82"
                  ><strong>{{ munPracaData[0].h6 }}</strong></span
                >
              </strong>
            </div>

           
          </div>

          <div class="d-flex justify-center align-center">
            <DownloadPdf />
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <VegetacaoHighlights
          v-if="this.$route.params.categoria == 'vegetacao'"
        />
        <PracasParquesHighlights
          v-if="this.$route.params.categoria == 'pracasparques'"
        />
        <TemperaturaHighlights
          v-if="this.$route.params.categoria == 'temperatura'"
        />



        <div class="w100-mobile ml-md-auto" style="background-color: #e6f1f2; padding-bottom: 0; width: 90%">          
          <v-card class="" outlined color="#d0e3e3">
            <div class="pl-4 pr-4">
              <v-row>
                <v-col cols="12" md="6">
                  <p style="font-size: 32px; color: #003c3c">
                    <strong>Fique por dentro das atualizações da Urbverde</strong>
                  </p>
                  <p style="font-size: 17px; color: #003c3c">
                    Assine [em breve] nossa Newsletter para mantermos você
                    atualizado sobre novos lançamentos.
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="footer-flower d-flex justify-center align-center"
                >
                  <v-row class="d-flex justify-center align-center">
                    <v-col cols="12" md="8">
                      <v-form v-model="valid" class="mt-4">
                        <v-text-field
                          dense
                          outlined
                          disabled
                          v-model="email"
                          :rules="emailRules"
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-btn disabled color="#01DC82" class="mb-3">
                        Assinar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
            <div style="background-color: white">
              <v-row
                class="d-flex justify-space-between align-center"
                style="padding: 3em 0 3em 0"
              >
                <v-col style="height: 100%">
                  <span class="pl-4"
                    ><img width="30%" src="@/assets/logos/urbverde-logo.png"
                  /></span>
                </v-col>
                <v-col class="d-flex justify-center align-center">
                  <a
                    href="https://www.facebook.com/profile.php?id=100089182436996"
                    target="_blank"
                  >
                    <img
                      width="30px"
                      class="ma-3"
                      src="@/assets/icons/fb-icon.png"
                    />
                  </a>
                  <a href="https://twitter.com/UrbVerdeSP" target="_blank">
                    <img
                      width="30px"
                      class="ma-3"
                      src="@/assets/icons/twitter-icon.png"
                    />
                  </a>
                  <a href="https://www.instagram.com/UrbVerdesp/" target="_blank">
                    <img
                      width="30px"
                      class="ma-3"
                      src="@/assets/icons/instagram-icon.png"
                    />
                  </a>
                </v-col>
              </v-row>
            </div>
          </v-card>          
        </div>
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
      emailRules: [(v) => /.+@.+/.test(v) || "E-mail must be valid"],
      selection: "",
      layerOpacity: 1,
      ano: "",
    };
  },
  methods: {
    highlightSearch () {
      window.scrollTo(0, 0);
      this.searchHighlight = true;
      setTimeout(() => {
      this.$set(this, 'searchHighlight', false);
    }, 2000);      
    },
    highlightMap () {
      window.scrollTo(0, 0);
      this.mapHighlight = true
      setTimeout(() => {
      this.$set(this, 'mapHighlight', false);
    }, 2000);  
    },

    scrollToStats () {
      window.scrollTo(950, 950);
    },


    toogleLayerVisibility: function (layer) {
      this.$store.commit("TOGGLE_LAYER", layer);
    },

    share() {
      const shareData = {
        title: "Plataforma Urbverde",
        text: "Compartilhe a plataforma com amigos/amigas",
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
  },

  computed: {
    routeScaleValue() {
      return this.$route.params.escala;
    },
    routeYearValue() {
      return this.$route.params.ano;
    },

    munTempData() {
      return this.$store.getters.getMunTempData[this.$route.params.ano];
    },
    munVegData() {
      return this.$store.getters.getMunVegData[this.$route.params.ano];
    },
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021];
    },
  },
  watch: {
    "$route.params.categoria": {
      handler: function (categoria) {
        this.$store.getters.layers.forEach((item) => {
          if (item.categoria != "base" && item.visible) {
            this.$store.commit("TOGGLE_LAYER", item);
          }
        });
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
      handler: async function (ano) {
        this.ano = ano;
      },
      deep: true,
      immediate: true,
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

.category__active {
  background-color: #003c3c !important;
  color: white !important;
}

.headernav__categories {
  border-left: 1px solid #ddeaf3;
  display: flex;
  justify-content: space-around;
}

.layer_active {
  background-color: #003c3c;
  color: white;
}

.aside__toolbar_scale {
  label {
    color: #003c3c;
    font-size: 13px;
  }
}

.aside__toolbar_btnbox {
  margin-top: 1em;
  padding-bottom: 1em;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #d0e3e3;
    bottom: 0;
  }
}

.aside__toolbar_scale--buttons {
  border-radius: 14px;
  text-align: center;
  background-color: #e6f1f2;
  color: #003c3c;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 57px;
  padding: 0.5em;

  font-size: 1.2em;
  cursor: pointer;
  & span {
    font-size: 0.8em;
  }
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
</style>
