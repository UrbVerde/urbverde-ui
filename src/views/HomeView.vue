<template>
  <div class="home__box">
    <header class="row home__box_header">
      <v-col cols="6" md="4" class="d-flex justify-center align-center">
        <router-link :to="{ name: 'Home' }"
          ><img width="45%" src="@/assets/logos/urbverde-logo-white.png"
        /></router-link>
      </v-col>
      <v-col>
        <router-link tag="a" :to="{ name: 'About' }">A Urbverde </router-link>
      </v-col>
      <v-col>
        <router-link
          tag="a"
          :to="{
            name: 'Mapa',
            params: {
              id: this.munId || 3548906,
              ano: 2021,
              escala: 'intraurbana',
              categoria: 'pracasparques',
            },
          }"
          >Mapas e Dados
        </router-link>
      </v-col>
      <v-col>
        <router-link tag="a" :to="{ name: 'Home' }">Downloads </router-link>
      </v-col>
      <v-col>
        <router-link tag="a" :to="{ name: 'Contato' }">
          Comunicação</router-link
        >
      </v-col>
    </header>
    <main>
      <section class="main__box">
        <div class="container">
          <h2 class="mx-auto pb-1 pt-1">
            Dados ambientais das cidades de São Paulo agora em suas mãos
          </h2>
          <h4 class="mx-auto">
            Acesse métricas ambientais de 645 municípios paulistas e gere
            relatórios que ajudarão você a entender melhor o que seu município
            precisa
          </h4>

          <v-row class="d-flex justify-center align-start">
            <v-col cols="10" md="5">
              <SearchMun @id="setIdForMun" />
            </v-col>
          </v-row>
        </div>
      </section>

      <section class="map_section_home">
        <div class="container">
          <div class="wrap-map">
            <div class="hoverblock d-none justify-center align-center">
              <v-btn
                :to="{
                  name: 'Mapa',
                  params: {
                    id: this.munId || 3548906,
                    ano: 2021,
                    escala: 'intraurbana',
                    categoria: 'pracasparques',
                  },
                }"
                class="hoverblock_btn"
                color="#e4e2de"
                >Acesse o painel da sua cidade</v-btn
              >
            </div>
            <div class="map">
              <VueMapbox
                mapStyle="https://api.maptiler.com/maps/8fde2eea-8799-479e-8a8d-0989e2c7eb2d/style.json?key=XmSZh88cfG77QlyKTuwa"
                height="450px"
                width="100%"
                ref="mapbox"
                :maxBounds="[-53.97525, -25.47836, -41.22247, -19.79201]"
                :center="[-47.8963723, -22.357474]"
                :interactive="false"
              ></VueMapbox>
            </div>
          </div>
        </div>

        <div class="container" style="padding-bottom: 3em">
          <v-row class="d-flex justify-center">
            <v-col cols="12" md="4">
              <v-card class="pa-4" height="120px">
                <div class="d-flex flex-column">
                  <span style="color: #003c3c"
                    ><strong
                      >A cobertura vegetal desse município equivale a
                      {{ munVegData[0].b1h1 }}
                      campos de futebol</strong
                    ></span
                  >
                  <a style="color: #003c3c" class="mt-2">
                    <DownloadPdf />
                  </a>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4" height="120px">
                <div class="d-flex flex-column">
                  <span style="color: #003c3c"
                    ><strong
                      >{{ munVegData[0].b1h2 }}% da população moram em setores
                      com [ICV] abaixo da média.</strong
                    >
                  </span>
                  <a style="color: #003c3c" class="mt-2">
                    <DownloadPdf />
                  </a>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card
                height="120px"
                class="pa-4"
                style="background-color: #003c3c"
              >
                <div class="d-flex flex-column">
                  <span class="white--text"
                    ><Strong
                      >Acesse outros 23 relatórios disponíveis para a sua
                      região</Strong
                    ></span
                  >

                  <router-link
                    class="mt-3"
                    style="color: #01dc82"
                    tag="a"
                    :to="{
                      name: 'Mapa',
                      params: {
                        id: this.munId ? this.munId : 3548906,
                        ano: 2021,
                        escala: 'intraurbana',
                        categoria: 'pracasparques',
                      },
                    }"
                    >Acesse o Painel de Mapas e Dados
                  </router-link>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div
          style="
            padding-top: 3em;
            padding-bottom: 3em;
            background-color: white;
            margin-top: 3em;
          "
          class="container-fluid d-flex flex-column justify-center align-center"
        >
          <!-- GUITODO verificar logos individualmente - alinhamento -->
          <span class="mb-3"><strong>A URBVERDE É APOIADA POR</strong></span>
          <v-row class="d-flex justify-center align-center rowwrap">
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/usp_brasao.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/ufba.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/ufscar.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/iau.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/eesc.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/fflch.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/zukk.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/run.png" alt="" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/ulht.jpg" alt="" />
            </v-col>
          </v-row>

          <span class="mt-5"><strong>FINANCIAMENTO</strong></span>
          <v-row class="d-flex justify-center align-center">
            <v-col cols="1" class="d-flex justify-center align-center">
              <img width="500px" src="@/assets/logos/prpi.png" alt="" />
            </v-col>
          </v-row>
        </div>
      </section>

      <section style="background-color: #e6f1f2">
        <div class="container">
          <v-row class="d-flex align-center" style="padding-bottom: 3em">
            <v-col cols="6" md="7">
              <h4 style="font-size: 3.5em; color: #003c3c">
                Poucos cliques para ajudar na sua gestão
              </h4>
            </v-col>
            <v-col cols="6" md="5">
              <div>
                <p style="color: #003c3c">
                  A Plataforma UrbVerde foi financiada pelo Edital de Apoio a
                  Projetos Integrados de Pesquisa em Áreas Estratégicas (PIPAE)
                  da Pró-Reitoria de Pesquisa da Universidade de São Paulo.
                </p>
                <v-btn large color="#01dc82" class="white--text">
                  <router-link
                    tag="a"
                    :to="{
                      name: 'Mapa',
                      params: {
                        id: this.munId ? this.munId : 3548906,
                        ano: 2021,
                        escala: 'intraurbana',
                        categoria: 'pracasparques',
                      },
                    }"
                    >Acesse a Plataforma
                  </router-link>
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-row class="d-flex align-center" style="padding-top: 3em">
            <v-col cols="12" md="7">
              <v-card height="400px">
                <router-link
                  :to="{
                    name: 'Mapa',
                    params: {
                      id: this.munId || 3548906,
                      ano: 2021,
                      escala: 'intraurbana',
                      categoria: 'vegetacao',
                    },
                  }"
                >
                  <v-img
                    class="white--text align-start"
                    height="100%"
                    src="@/assets/home/home-card-01.png"
                  >
                    <v-card-title>Dados sobre vegetação</v-card-title>
                    <v-card-subtitle
                      ><router-link
                        tag="a"
                        :to="{
                          name: 'Mapa',
                          params: {
                            id: this.munId ? this.munId : 3548906,
                            ano: 2021,
                            escala: 'intraurbana',
                            categoria: 'vegetacao',
                          },
                        }"
                        >Acesse o Mapa
                      </router-link></v-card-subtitle
                    >
                  </v-img>
                </router-link>
              </v-card>
            </v-col>
            <v-col cols="12" md="5">
              <v-card height="400px">
                <router-link
                  :to="{
                    name: 'Mapa',
                    params: {
                      id: this.munId || 3548906,
                      ano: 2021,
                      escala: 'intraurbana',
                      categoria: 'pracasparques',
                    },
                  }"
                >
                  <v-img
                    class="white--text align-start"
                    height="100%"
                    src="@/assets/home/home-card-04.png"
                  >
                    <v-card-title>Praças e Parques</v-card-title>
                    <v-card-subtitle
                      ><router-link
                        tag="a"
                        :to="{
                          name: 'Mapa',
                          params: {
                            id: this.munId || 3548906,
                            ano: 2021,
                            escala: 'intraurbana',
                            categoria: 'pracasparques',
                          },
                        }"
                        >Acesse o Mapa
                      </router-link></v-card-subtitle
                    >
                  </v-img>
                </router-link>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="d-flex align-center" style="padding-bottom: 3em">
            <v-col cols="12" md="5">
              <v-card height="400px">
                <router-link
                  :to="{
                    name: 'Mapa',
                    params: {
                      id: this.munId || 3548906,
                      ano: 2021,
                      escala: 'intraurbana',
                      categoria: 'temperatura',
                    },
                  }"
                >
                  <v-img
                    class="white--text align-start"
                    height="100%"
                    src="@/assets/home/home-card-03.png"
                  >
                    <v-card-title>Temperatura na sua região</v-card-title>
                    <v-card-subtitle
                      ><router-link
                        tag="a"
                        :to="{
                          name: 'Mapa',
                          params: {
                            id: this.munId || 3548906,
                            ano: 2021,
                            escala: 'intraurbana',
                            categoria: 'temperatura',
                          },
                        }"
                        >Acesse o Mapa
                      </router-link></v-card-subtitle
                    >
                  </v-img>
                </router-link>
              </v-card>
            </v-col>
            <v-col cols="12" md="7">
              <v-card height="400px">
                <v-img
                  class="white--text align-start"
                  height="100%"
                  src="@/assets/home/home-card-02.png"
                >
                  // GUITODO - rota p dashboard
                  <v-container>
                    <p style="font-size: 2em; margin: 2em 0 0 2em">
                      <strong
                        >Compare, crie relatórios <br />
                        e baixe as informações <b r />
                        <span style="color: #01dc82">do seu município</span>.
                      </strong>
                    </p>

                    <v-row class="d-flex justify-start align-start mt-auto">
                      <v-col cols="10" md="7">
                        <div style="margin: 2em 0 0 3em">
                          <SearchMun />
                        </div>
                      </v-col> </v-row
                  ></v-container>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center" style="padding-top: 3em">
            <v-col cols="6" md="7">
              <h4 style="font-size: 3.5em; color: #003c3c">
                Informe-se para decidir, pesquisar e compartilhar
              </h4>
            </v-col>
            <v-col cols="6" md="5">
              <div>
                <p style="font-size: 1.2em; color: #003c3c">
                  As informações contidas na plataforma Urbverde permitem a
                  compreensão de características dos municípios paulistas
                  através de métricas e indicadores socioambientais e procura
                  auxiliar diversos segmentos da sociedade na elaboração de
                  estudos, planos e análises espaço-temporais sobre eventos
                  climáticos, cobertura da vegetação, espaços públicos e áreas
                  verdes urbanas.
                </p>
                <v-btn large color="#01dc82">
                  <router-link
                    :to="{
                      name: 'Mapa',
                      params: {
                        id: this.munId ? this.munId : 3548906,
                        ano: 2021,
                        escala: 'intraurbana',
                        categoria: 'pracasparques',
                      },
                    }"
                    >Acesse a Plataforma
                  </router-link>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </section>

      <section style="background-color: #e6f1f2">
        <div class="container">
          <v-row class="d-flex justify-center">
            <v-col cols="12" md="4" class="d-flex justify-center align-center">
              <div class="flower-card">
                <v-img
                  class="align-end"
                  color="#d0e3e3"
                  src="@/assets/home/home-card-05.png"
                >
                  <p class="mb-0" style="color: #003c3c; font-size: 2em">
                    <strong>Gestores</strong>
                  </p>
                  <p style="color: #003c3c; font-size: 2em">
                    <strong> Públicos</strong>
                  </p>
                  <p>
                    Aos gestores públicos e secretarias municipais de urbanismo
                    e meio ambiente, as informações poderão nortear a elaboração
                    de planos diretores e planos de arborização, assim como
                    apoiar análises e estudos para o cumprimeto das metas do
                    Programa Município VerdeAzul.
                  </p>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-center align-center">
              <div class="flower-card">
                <v-img
                  class="align-end"
                  color="#d0e3e3"
                  src="@/assets/home/home-card-05.png"
                >
                  <p class="mb-0" style="color: #003c3c; font-size: 2em">
                    <strong>Alunos e</strong>
                  </p>
                  <p style="color: #003c3c; font-size: 2em">
                    <strong> professores</strong>
                  </p>
                  <p>
                    Para alunos e professores, as informações permitirão a
                    observância da distribuição espacial de estatísticas e
                    indicadores socioambientais em distintas escalas e
                    temporalidades.
                  </p>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-center align-center">
              <div class="flower-card">
                <v-img
                  class="align-end"
                  color="#d0e3e3"
                  src="@/assets/home/home-card-05.png"
                >
                  <p class="mb-0" style="color: #003c3c; font-size: 2em">
                    <strong>Jornalistas e</strong>
                  </p>
                  <p style="color: #003c3c; font-size: 2em">
                    <strong> pesquisadores</strong>
                  </p>
                  <p>
                    Para jornalistas e pesquisadores, a plataforma permitirá
                    gerar publicações em mídias digitais e periódicos
                    científicos com dados autalizados sobre contextos ambientais
                    das cidades paulistas.
                  </p>
                </v-img>
              </div>
            </v-col>
          </v-row>
        </div>
      </section>

      <section style="background-color: #e6f1f2">
        <div
          class="container-fluid d-flex flex-column justify-center align-center"
        >
          <span class=""><strong>FINANCIAMENTO</strong></span>
          <v-row class="d-flex justify-center align-center">
            <v-col cols="1" class="d-flex justify-center align-center">
              <img
                width="500px"
                src="@/assets/logos/prpi-removebg-preview.png"
                alt=""
              />
            </v-col>
          </v-row>
          <span class="mb-3 mt-5"
            ><strong>A URBVERDE É APOIADA POR</strong></span
          >
          <v-row class="d-flex justify-center align-center">
            <v-col cols="1">
              <img
                width="100%"
                src="@/assets/logos/usp_brasao-removebg-preview.png"
                alt=""
              />
            </v-col>
            <v-col cols="1">
              <img
                width="100%"
                src="@/assets/logos/ufba-removebg-preview.png"
                alt=""
              />
            </v-col>
            <v-col cols="1">
              <img
                width="100%"
                src="@/assets/logos/ufscar-removebg-preview.png"
                alt=""
              />
            </v-col>
            <v-col cols="1">
              <img
                width="100%"
                src="@/assets/logos/iau-removebg-preview.png"
                alt=""
              />
            </v-col>
            <v-col cols="1">
              <img
                width="100%"
                src="@/assets/logos/eesc-removebg-preview.png"
                alt=""
              />
            </v-col>
            <v-col cols="1">
              <img
                width="100%"
                src="@/assets/logos/fflch-removebg-preview.png"
                alt=""
              />
            </v-col>

            <v-col cols="1">
              <img width="100%" src="@/assets/logos/run.png" alt="" />
            </v-col>
            <v-col cols="1">
              <img width="300px" src="@/assets/logos/ulht.jpg" alt="" />
            </v-col>
          </v-row>
          <span class="mt-5"><strong>DESENVOLVIMENTO</strong></span>
          <v-row class="d-flex justify-center align-center">
            <img src="@/assets/logos/zukk-removebg-preview.png" alt="" />
          </v-row>
        </div>
      </section>

      <section style="background-color: #e6f1f2; padding-bottom: 0">
        <div class="container pb-0">
          <v-card class="footerCard" outlined color="#d0e3e3">
            <v-img
              height="500px"
              src="@/assets/home/home-card-06.png"
              class="justify-center align-center"
            >
              <v-card-title
                class="align-center justify-center white--text"
                style="font-size: 2.5em; padding: 1em"
              >
                Agora é a sua vez de entender mais sobre onde você vive
              </v-card-title>
              <div class="mx-auto" style="width: 300px">
                <SearchMun :goToMap="true" />
              </div>
            </v-img>
            <div class="pl-4 pr-4">
              <v-row>
                <v-col cols="12" md="6">
                  <p style="font-size: 32px; color: #003c3c">
                    <strong
                      >Fique por dentro das atualizações da Urbverde</strong
                    >
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
                  <a
                    href="https://www.instagram.com/UrbVerdesp/"
                    target="_blank"
                  >
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
      </section>
    </main>
  </div>
</template>

<script>
import VueMapbox from "../modules/Mapa/components/VueMapbox.vue";
export default {
  name: "HomeView",
  components: { VueMapbox },
  data() {
    return {
      munId: "",
      valid: false,
      email: "",
      emailRules: [
        // v => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || "E-mail precisa ser válido",
      ],
    };
  },
  computed: {
    munVegData() {
      return this.$store.getters.getMunVegData[2021];
    },
  },
  watch: {
    munId: {
      handler: function () {
        this.$store.dispatch("getMunicipioVegData", this.munId);
        this.$store.dispatch("getMunicipioPracaData", this.munId);
        this.$store.dispatch("getMunicipioTempData", this.munId);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    setIdForMun(e) {
      this.munId = e;
    },
  },
  created() {
    this.$store.dispatch("getMunicipioVegData", 3501608);
    this.$store.dispatch("getMunicipioPracaData", 3501608);
    this.$store.dispatch("getMunicipioTempData", 3501608);
  },
};
</script>

<style lang="scss" scoped>
.footer-flower {
  background-image: url("@/assets/home/home-card-05.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

a {
  text-decoration: none;
  color: white;
}

.home__box {
  &_header {
    padding: 1em;
    background-color: #003c3c;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.map_section_home {
  padding: 0;
  padding-bottom: 3em;
  position: relative;
  background-color: #e6f1f2;
}

.main__box {
  background-color: #003c3c;
  color: white;
  position: relative;
  width: 100%;
  background-image: url("@/assets/home_background.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  h2 {
    padding: 1em;
    text-align: center;
    font-size: 4em;
  }
  h4 {
    padding: 1em;
    text-align: center;
    font-size: 1.5em;
  }
}

.wrap-map {
  position: relative;
  height: 450px;
  top: -50px;

  &:hover > .hoverblock {
    display: flex !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(228, 226, 222, 0.3);
    z-index: 20;
  }

  &:hover > .map {
    z-index: 10;
  }
}
.map {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
}
.flower-card {
  width: 290px;
  height: 290px;
}

.footerCard {
  border-color: #d0e3e3 !important;
}

.rowwrap {
  flex-wrap: wrap;
}

.hoverblock_btn {
  color: #01be7e !important;
}
</style>
