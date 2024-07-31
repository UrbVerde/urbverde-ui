<template>
  <div class="home__box">
    <HeaderHome />
    <main>
      <section class="main__box">
        <img src="" class="bg" :style="{ backgroundSize: bgSize, backgroundPosition: bgPosition }" />
        <div class="container">
          <h2 class="mx-auto pb-1 pt-1">
            Dados ambientais de cada cidade agora em suas mãos!
          </h2>
          <h4 class="mx-auto">
            Encontre métricas para 645 municípios paulistas e gere relatórios para entender melhor do que sua cidade mais precisa
          </h4>
          <v-row class="d-flex justify-center align-start" style="padding-top:1em; ">
            <v-col cols="10" md="4">
              <SearchMun @id="setIdForMun" :goToMap="false" :items="municipios" :currentuserlocation="this.userCity" />
            </v-col>
            <v-btn regular color="#01DC82" class="mb-0" style="margin-top:1em" @click="searchMun()">
              Buscar
            </v-btn>
          </v-row>
        </div>
      </section>

      <!-- MAPA HOME -->
      <!-- <section class="map_section_home">
        <div class="container">
          <div class="wrap-map">
            <div class="hoverblock d-none justify-center align-center">
              <v-btn :to="{
                name: 'Mapa',
                params: {
                  id: this.munId || 3548906,
                  ano: 2021,
                  escala: 'intraurbana',
                  categoria: 'pracasparques',
                },
              }" class="hoverblock_btn" color="#e4e2de">Acesse o painel da sua cidade</v-btn>
            </div>
            <div class="map">
              <VueMapbox
                mapStyle="https://api.maptiler.com/maps/8fde2eea-8799-479e-8a8d-0989e2c7eb2d/style.json?key=XmSZh88cfG77QlyKTuwa"
                height="500px" width="100%" :center="[-47.89684923006866, -22.007132097516873]" :zoom="15"
                :interactive="false" :rotate="true"></VueMapbox>
            </div>
          </div>
        </div> -->
      <!-- <div class="container">
          <v-row class="d-flex justify-center">

            <v-col cols="12" md="4">
              <v-card class="pa-4" height="120px" style="z-index:1">
                <div class="d-flex flex-column">
                  <span style="color: #003c3c; align: center; display: ;">
                    📝 Em <strong>{{ this.userCity }}</strong> existem
                    <strong>{{ munPracaData[0].ah1 }} praças já cadastradas </strong> pela plataforma UrbVerde.
                    <br>
                    <span style="float: right; padding:5px; font-size: 0.75em; font-style: italic; color: #003c3c">
                      *Dados: OpenStreetMaps
                    </span>
                  </span>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="pa-4" height="120px" style="z-index:1;">
                <div class="d-flex flex-column">
                  <span style="color: #003c3c">
                    <strong> 👤 {{ munVegData[0].b1h2 }}%</strong> da população
                    <strong> mora em setores com Percentual de Cobertura Vegetal (PCV)</strong> abaixo da média municipal.
                    <span style="float: right; padding:5px; font-size: 0.75em; font-style: italic; color: #003c3c">
                      *Dados: Censo 2010 (IBGE), Landsat8
                    </span>
                  </span>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="pa-4" height="120px" style="z-index:1;">
                <div class="d-flex flex-column">
                  <span style="color: #003c3c">
                    <strong> 🌡️ {{ munTempData[0].h5b }}ºC </strong> é a variação entre as
                    Temperaturas de Superfície (TST) mais quentes e mais frias do municipio.
                    <br>
                    <span style="float: right; padding:5px; font-size: 0.75em; font-style: italic; color: #003c3c">
                      *Dados: Landsat8
                    </span>
                  </span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div> -->
      <!-- </section> -->

      <!-- APOIADA POR -->
      <!-- <section>
        <div style="background-color: blue;" class="container-fluid d-flex flex-column justify-center align-center">
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
              <img width="100%" src="@/assets/logos/ulht.jpg" alt="" />
            </v-col>
          </v-row>

          <span class="mt-5"><strong>FINANCIAMENTO</strong></span>
          <v-row class="d-flex justify-center align-center">
            <v-col cols="1" class="d-flex justify-center align-center">
              <img width="500px" src="@/assets/logos/prpi.png" alt="" />
            </v-col>
          </v-row>
        </div>
            </section> -->

      <!-- Segunda Sessão - Poucos Cliques-->
      <section class="second_section_home">
        <div class="container">

          <!-- Poucos Cliques -->
          <v-row class="d-flex align-center" style="padding-bottom: 1em">
            <v-col cols="6" md="7">
              <h4 style="font-size: 3.5em; color: #003c3c">
                Poucos cliques para ajudar na sua gestão
              </h4>
            </v-col>
            <v-col cols="6" md="5">
              <div>
                <p style="color: #003c3c">
                  A Plataforma UrbVerde, inicialmente financiada pelo Edital de Apoio a Projetos Integrados de Pesquisa em Áreas Estratégicas (PIPAE) da Pró-Reitoria de Pesquisa e Inovação da Universidade de São Paulo (PRPI/USP), e atualmente conta com financiamento do Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq) e do <strong>Programa de Pesquisa em Políticas Públicas da Fundação de Amparo à Pesquisa do Estado de São Paulo (FAPESP).</strong>
                </p>
                <v-btn regular color="#01DC82" class="mb-0">
                  <router-link style="color: #003c3c; text-decoration: none;" :to="{
                    name: 'Mapa',
                    params: {
                      id: this.munId ? this.munId : 3548906,
                      ano: 2021,
                      escala: 'intraurbana',
                      categoria: 'pracasparques',
                    },
                  }"><a style="color: #003c3c;">Acesse a Plataforma</a>
                  </router-link>
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <!-- Quadros Vegetação e Praças -->
          <v-row class="d-flex align-center" style="padding-top: 0em">
            <v-col cols="12" md="7">
              <v-card height="300px">
                <router-link :to="{
                  name: 'Mapa',
                  params: {
                    id: this.munId || 3548906,
                    ano: 2021,
                    escala: 'intraurbana',
                    categoria: 'vegetacao',
                  },
                }">
                  <v-img class="white--text align-start" height="100%" src="@/assets/home/home-card-01.png">
                    <v-card-title>
                      <router-link :to="{
                        name: 'Mapa',
                        params: {
                          id: this.munId ? this.munId : 3548906,
                          ano: 2021,
                          escala: 'intraurbana',
                          categoria: 'vegetacao',
                        },
                      }"><a>Dados de Vegetação</a>
                      </router-link></v-card-title>
                  </v-img>
                </router-link>
              </v-card>
            </v-col>
            <v-col cols="12" md="5">
              <v-card height="300px">
                <router-link :to="{
                  name: 'Mapa',
                  params: {
                    id: this.munId || 3548906,
                    ano: 2021,
                    escala: 'intraurbana',
                    categoria: 'pracasparques',
                  },
                }">
                  <v-img class="white--text align-start" height="100%" src="@/assets/home/home-card-04.png">
                    <v-card-title>
                      <router-link :to="{
                        name: 'Mapa',
                        params: {
                          id: this.munId || 3548906,
                          ano: 2021,
                          escala: 'intraurbana',
                          categoria: 'pracasparques',
                        },
                      }"><a>Praças e Parques</a>
                      </router-link></v-card-title>
                  </v-img>
                </router-link>
              </v-card>
            </v-col>
          </v-row>

          <!-- Quadros Temperatura e Botão -->
          <v-row class="d-flex align-center" style="padding-bottom: 3em">
            <v-col cols="12" md="5">
              <v-card height="300px">
                <router-link :to="{
                  name: 'Mapa',
                  params: {
                    id: this.munId || 3548906,
                    ano: 2021,
                    escala: 'intraurbana',
                    categoria: 'temperatura',
                  },
                }">
                  <v-img class="white--text align-start" height="100%" src="@/assets/home/home-card-03.png">
                    <v-card-title>
                      <router-link :to="{
                        name: 'Mapa',

                        params: {
                          id: this.munId || 3548906,
                          ano: 2021,
                          escala: 'intraurbana',
                          categoria: 'temperatura',
                        },
                      }"><a>Temperatura de Superfícies</a>
                      </router-link></v-card-title>
                  </v-img>
                </router-link>
              </v-card>
            </v-col>
            <v-col cols="12" md="7">
              <v-card height="300px">
                <v-img class="white--text align-start" height="100%" src="@/assets/home/home-card-02.png">
                  <v-container>
                    <p style="font-size: 2em; margin: 1em 0 0 2em">
                      <strong>Compare, crie relatórios <br />
                        e baixe as informações <b r />
                        <span style="color: #01dc82">do seu município</span>.
                      </strong>
                    </p>

                    <v-row class="d-flex justify-start align-start mt-auto">
                      <v-col cols="10" md="7">
                        <div style="margin: 1em 0 0 3.4em">
                          <SearchMun :goToMap="true" />
                        </div>
                      </v-col> </v-row>
                  </v-container>
                </v-img>
              </v-card>
            </v-col>
          </v-row>

          <!-- PÚBLICO -->
          <v-row class="d-flex align-center" style="padding-top: 3em">
            <v-col cols="6" md="7">
              <h4 style="font-size: 3.5em; color: #003c3c">
                Informe-se para decidir, pesquisar e compartilhar
              </h4>
            </v-col>
            <v-col cols="6" md="5">
              <div>
                <p style="font-size: 1em; color: #003c3c">
                  As informações contidas na plataforma Urbverde permitem a
                  compreensão de características dos municípios paulistas
                  através de métricas e indicadores socioambientais e procura
                  auxiliar diversos segmentos da sociedade na elaboração de
                  estudos, planos e análises espaço-temporais sobre eventos
                  climáticos, cobertura da vegetação, espaços públicos e áreas
                  verdes urbanas.
                </p>
                <v-btn large color="#01dc82">
                  <router-link style="color: #003c3c; text-decoration: none;" :to="{
                    name: 'Mapa',
                    params: {
                      id: this.munId ? this.munId : 3548906,
                      ano: 2021,
                      escala: 'intraurbana',
                      categoria: 'pracasparques',
                    },
                  }">Acesse a Plataforma
                  </router-link>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </section>

      <!-- PÚBLICOS - FUTURO TESTEMUNHOS -->
      <section style="background-color: #e6f1f2">
        <div class="container">
          <v-row class="d-flex justify-center">
            <v-col cols="12" md="4" class="d-flex justify-center align-center">
              <div class="flower-card">
                <v-img class="align-end" color="#d0e3e3" src="@/assets/home/home-card-05.png">
                  <p class="mb-0" style="color: #003c3c; font-size: 2em">
                    <strong>Gestores Públicos</strong>
                  </p>
                  <p></p>
                  <p style="text-align: justify;">
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
                <v-img class="align-end" color="#d0e3e3" src="@/assets/home/home-card-05.png">
                  <p class="mb-0" style="color: #003c3c; font-size: 2em">
                    <strong>Alunos e professores</strong>
                  </p>
                  <p></p>
                  <p style="text-align: justify;">
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
                <v-img class="align-end" color="#d0e3e3" src="@/assets/home/home-card-05.png">
                  <p class="mb-0" style="color: #003c3c; font-size: 2em">
                    <strong>Jornalistas e pesquisadores</strong>
                  </p>
                  <p></p>
                  <p style="text-align: justify;">
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

      <!-- FINANCIAMENTO/ATORES -->
      <section style="background-color: #e6f1f2">
        <div class="container-fluid d-flex flex-column justify-center align-center">
          <span class="mb-3 mt-5"><strong>FINANCIAMENTO</strong></span>
          <v-row class="d-flex justify-center align-center">
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="100%" src="@/assets/logos/prpi-removebg-preview.png"
                alt="PRPi USP - Pró-Reitoria de Pesquisa e Inovação" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="90%" src="@/assets/logos/CNPq_v2017_rgb.png"
                alt="CNPQ - Conselho Nacional de Desenvolvimento Científico e Tecnológico" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="100%" src="@/assets/logos/logo_fapesp.png"
                alt="FAPESP - Fundação de Amparo à Pesquisa do Estado de São Paulo" />
            </v-col>

          </v-row>
          <span class="mb-3 mt-5"><strong>A URBVERDE É DESENVOLVIDA POR</strong></span>
          <v-row class="d-flex justify-center align-center">
            <v-col cols="6" md="2" class="d-flex justify-center align-center">
              <img width="100%" src="@/assets/logos/USP University of Sao Paulo.png"
                alt="USP – Universidade de São Paulo " />
            </v-col>
            <v-col cols="6" md="2" class="d-flex justify-center align-center">
              <img width="100%" src="@/assets/logos/logo_principal_assinatura03_preto.png"
                alt="Instituto de Arquitetura e Urbanismo da Universidade de São Paulo (IAU-USP)" />
            </v-col>
            <v-col cols="6" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/eesc-removebg-preview.png"
                alt="Escola de Engenharia de São Carlos da Universidade de São Paulo" />
            </v-col>
            <v-col cols="6" md="2" class="d-flex justify-center align-center">
              <img width="45%" src="@/assets/logos/fflch-removebg-preview.png"
                alt="Faculdade de Filosofia, Letras e Ciências Humanas da Universidade de São Paulo (FFLCH-USP)" />
            </v-col>
            <v-col cols="6" md="2" class="d-flex justify-center align-center">
              <img width="60%" src="@/assets/logos/ufba-removebg-preview.png" alt="Zukk - Inovação Geoespacial" />
            </v-col>
            <v-col cols="6" md="2" class="d-flex justify-center align-center">
              <img width="100%" src="@/assets/logos/ufscar-removebg-preview.png" alt="Zukk - Inovação Geoespacial" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="40%" src="@/assets/logos/unitau.png" alt="Zukk - Inovação Geoespacial" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="70%" src="@/assets/logos/uniara.png" alt="Zukk - Inovação Geoespacial" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="90%" src="@/assets/logos/run.png" alt="Rede RUN de Rios Urbanos Naturalizados" />
            </v-col>
            <v-col cols="4" md="3" class="d-flex justify-center align-center">
              <img width="100%" src="@/assets/logos/ulht-removebg-preview.png" alt="Universidade Lusófona" />
            </v-col>
            <v-col cols="6" md="2" class="d-flex justify-center align-center">
              <img width="50%" src="@/assets/logos/zukk-removebg-preview.png" alt="Zukk - Inovação Geoespacial" />
            </v-col>
          </v-row>

          <span class="mt-5"><strong>PARCEIROS</strong></span>
          <v-row class="d-flex justify-center align-center">
            <v-col cols="4" md="3" class="d-flex justify-center align-center">
              <img width="100%" src="@/assets/logos/logo-instituto-polis.png"
                alt=" Pólis - Instituto de Estudos, Formação e Assessoria em Políticas Sociai" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="60%" src="@/assets/logos/logo-consorcio-abc.jpg" alt="Consórcio Intermunicipal Grande ABC" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="60%" src="@/assets/logos/diadema.png" alt="Prefeitura de Diadema" />
            </v-col>
            <v-col cols="4" md="2" class="d-flex justify-center align-center">
              <img width="80%" src="@/assets/logos/svicente.png" alt="Prefeitura rivee São Vicente" />
            </v-col>
          </v-row>
        </div>
      </section>

      <!-- FOOTER -->
      <section style="background-color: #e6f1f2; padding-bottom: 0">
        <div class="container pb-0">
          <v-card class="footerCard" outlined color="#d0e3e3">
            <v-img height="500px" src="@/assets/home/home-card-06.png" class="justify-center align-center">
              <v-card-title class="align-center justify-center white--text" style="font-size: 2.5em; padding: 1em; line-height: 150%; text-align: center;   color: #e6f1f2;
                -webkit-filter: drop-shadow(0px 0px 4px rgba(0,0,0,0.5));">
                Agora é a sua vez de entender mais <br> sobre o lugar em que você vive
              </v-card-title>
              <div class="mx-auto" style="width: 300px">
                <SearchMun :goToMap="true" />
              </div>
            </v-img>


            <!-- Newsletter -->
            <NewsLetter />

            <!-- Footer -->
            <div style="background-color: white">
              <v-row class="d-flex justify-space-between align-center" style="padding: 3em 0 3em 0">
                <v-col style="height: 100%">
                  <span class="pl-4"><img width="30%" src="@/assets/logos/urbverde-logo.png" /></span>
                </v-col>
                <v-col class="d-flex justify-center align-center">
                  <a href="https://www.facebook.com/profile.php?id=100089182436996" target="_blank">
                    <img width="30px" class="ma-3" src="@/assets/icons/fb-icon.png" />
                  </a>
                  <a href="https://twitter.com/UrbVerdeSP" target="_blank">
                    <img width="30px" class="ma-3" src="@/assets/icons/twitter-icon.png" />
                  </a>
                  <a href="https://www.instagram.com/urb.verde/" target="_blank">
                    <img width="30px" class="ma-3" src="@/assets/icons/instagram-icon.png" />
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
import axios from "axios";
import municipios from "@/modules/Mapa/municipios.js";
import VueMapbox from "../modules/Mapa/components/VueMapbox.vue";


export default {
  name: "HomeView",
  components: { VueMapbox },
  data() {
    return {
      scrollY: 0,
      municipios: municipios,
      userCity: "São Carlos",
      munId: "3548906",
    };
  },

  computed: {
    // municipios() {
    //   return require('@/modules/Mapa/municipios.js').default;
    // },
    bgSize() {
      return `${60 + this.scrollY / 10}%`;       // calculate the zoom level based on scroll position
    },
    bgPosition() {
      return `center ${this.scrollY / 10}px`;
    },
    munVegData() {
      return this.$store.getters.getMunVegData[2021];
    },
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021];
    },
    munTempData() {
      return this.$store.getters.getMunTempData[2021];
    },
    getUrl() {
      return String(window.location.href);
    },
  },

  methods: {
    setIdForMun(e) {
      this.munId = e;
      console.log("setIdForMun() -> munId:" + this.munId)
    },
    async getUserCity() {
      try {
        const response = await axios.get('https://api.ipdata.co/?api-key=fca7ec8cb54f07bfacf5cb76321d92aef545786dc5699a77c09f3f31');
        const city = response.data.city;
        console.log('Sua Localização Estimada em:', city);

        if (municipios.includes(city)) {
          this.userCity = city;
        } else {
          console.log(city + ' não encontrada na lista de municipios');
          // Handle the case when the city is not found in the municipios list
        }

      } catch (error) {
        console.error('error');
      }
    },
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    searchMun() {
      console.log("searchMun() -> munId:" + this.munId)
      // this.$emit("id", this.munId);
      this.$router.push({
        name: "Mapa",
        params: {
          id: this.munId,
          ano: 2021,
          escala: "intraurbana",
          categoria: "pracasparques",
        },
      });
    }
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

  async created() {
    await this.getUserCity();
    window.addEventListener("scroll", this.handleScroll);
    this.$store.dispatch("getMunicipioVegData", 3548906);
    this.$store.dispatch("getMunicipioPracaData", 3548906);
    this.$store.dispatch("getMunicipioTempData", 3548906);
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },

};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: white !important;
}

.second_section_home {
  position: relative;
  background-color: #e6f1f2;
  padding-top: 3.5em;
  padding-bottom: 1em;
  z-index: 1;
}

.home__box {
  position: relative;
  width: 100%;
  // height: 100%;
  background-color: #003c3c;
}

.main__box {
  // background-color: #003c3c;
  color: white;
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 1.4em;
  // padding-bottom: 2.8em;

  .bg {
    position: absolute;
    background-image: url("@/assets/home_background3.png");
    background-repeat: no-repeat;
    background-position: top center;
    background-size: 60%;
    opacity: 0.30;
    transition: all 0.3s ease-out;
    min-height: 150%;
    width: 100%;
    top: -2em; //3.8em;
    z-index: 0;
    // top: 7em; //distancia da ponta da folha até o cabeçalho
  }

  h2 {
    word-break: normal;
    width: 70%;
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 3.55em;
    line-height: 120%;
    text-align: center;
    color: #E6F1F2;
    // padding: 1em;
    margin-bottom: 0.5em;
    text-align: center;
    -webkit-filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.45));
    z-index: 10 !important;
  }

  h4 {
    width: 70%;
    z-index: 2;
    margin-bottom: 0.5em;
    color: #BFD4E4;
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    // padding: 1em;
    text-align: center;
    font-size: 1.60em;
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5));
    z-index: 10 !important;
  }
}

.map_section_home {
  height: 330px;
  position: relative;
  background-color: #e6f1f2; //#003c3c; 
  padding-top: 0em;
  padding-bottom: 0em;
}

.wrap-map {
  overflow: hidden;
  border-radius: 2em;
  height: 430px; //esse é o tamanho do mapa
  position: relative;
  // height: 330px; //260px
  top: -4em; //isso é o que faz o mapa subir

  &:hover>.hoverblock {
    display: flex !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 4;
    transition: all 1 ease-in;
  }

  // &:hover>.map {
  //   z-index: 0;
  // }
}

.map {
  position: absolute;
  z-index: 3;
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

// .footer-flower {
//   background-image: url("@/assets/home/home-card-05.png");
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: cover;
// }

// .rowwrap {
//   flex-wrap: wrap;
// }

// .hoverblock_btn {
//   color: #01be7e !important;
// }
</style>
