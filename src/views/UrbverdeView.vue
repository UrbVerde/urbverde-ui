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
              id: this.$route.params.id || 3541109,
              ano: 2016,
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
          <h2 class="pb-1 pt-1 align-start">
            Democratizar o acesso à informação com responsabilidade
          </h2>
          <h4 class="align-start">
            A Urb Verde é uma plataforma de monitoramento ambiental para todos
            os 645 municípios do estado de São Paulo com indicadores
            socioambientais atualizados na promoção e suporte à decisão para
            políticas públicas e estudos!
          </h4>
        </div>
      </section>

      <section class="map_section_home">
        <div class="container">
          <div class="wrap-map">
            <div class="map mx-auto">
              <img width="100%" class="mx-auto" src="@/assets/equipe.png" />
            </div>
          </div>
        </div>

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

      <section style="background-color: #e6f1f2">
        <div class="container">
          <v-row class="d-flex align-center" style="padding-bottom: 3em">
            <v-col cols="6" md="7">
              <h4 style="font-size: 3.5em; color: #003c3c">
                Técnica e pesquisa na compreensão das desigualdades territoriais
              </h4>
            </v-col>
            <v-col cols="6" md="5">
              <div style="color: #003c3c">
                <p>
                  A UrbVerde surgiu da necessidade do desenvolvimento de uma
                  plataforma de dados geoespaciais proveniente de uma
                  metodologia de monitoramento anual das desigualdades
                  socioespaciais na distribuição das áreas verdes urbanas.
                </p>
                <p>
                  Para tanto, serão utilizadas técnicas de sensoriamento remoto
                  e machine learning, assim como o suporte da plataforma baseada
                  em cloud computing e programação em Java Script: Google Earth
                  Engine (GEE).
                </p>
              </div>
            </v-col>
          </v-row>
        </div>
      </section>

      <section style="background-color: #e6f1f2">
        <div class="container" style="max-width: 800px">
          <v-row class="d-flex justify-start align-start"
            ><v-col cols="6"
              ><strong>Instituições participantes </strong></v-col
            >
            <v-col cols="6"
              ><p style="color: #003c3c">
                Universidade de São Paulo (IAU-FFLCH-EESC)
              </p>
              <p style="color: #003c3c">Universidade Federal da Bahia</p>
              <p style="color: #003c3c">Universidade Federal de São Carlos</p>
              <p style="color: #003c3c">
                Universidade Lusófona de Humanidades e Tecnologias
              </p>
              <p style="color: #003c3c">Zukk – Inovação Geoespacial</p>
              <p style="color: #003c3c">
                Rede Cyted RUN - Rios Urbanos Naturalizados
              </p>
            </v-col></v-row
          >
          <v-row
            v-for="(item, idx) in tableValues"
            :key="idx"
            class="d-flex justify-start align-start"
          >
            <v-col cols="6">
              <strong> {{ item.name }} </strong></v-col
            >
            <v-col cols="6"
              ><p style="color: #003c3c">{{ item.values }}</p></v-col
            >
          </v-row>
        </div>
      </section>

      <section style="background-color: #e6f1f2">
        <div class="container" style="max-width: 800px">
          <span style="font-size: 2em; color: #003c3c">
            <strong><p style="margin-left: 12px">Equipe</p></strong>
          </span>

          <v-row class="d-flex justify-start align-start">
            <v-col cols="6"><strong>Coordenação Geral</strong> </v-col>

            <v-col cols="6"
              ><p><strong>Marcel Fantin</strong></p>
            </v-col></v-row
          >
          <v-row>
            <v-col cols="6"><strong>Coordenação Executiva </strong></v-col>

            <v-col cols="6"
              ><p style="color: #003c3c">Julio Cesar Pedrassoli</p>
              <p style="color: #003c3c">Rubia Gomes Morato</p>
              <p style="color: #003c3c">Fernando Shinji Kawakubo</p>
              <p style="color: #003c3c">Marcos Roberto Martines</p>
              <p style="color: #003c3c">Manoel Antonio Lopes Rodrigues Alves</p>
              <p style="color: #003c3c">Marcelo Montaño</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6"><strong>Coordenação técnica</strong> </v-col>
            <v-col cols="6"
              ><p style="color: #003c3c">Joice Genaro Gomes</p>
              <p style="color: #003c3c">Daniel José de Andrade</p></v-col
            ></v-row
          >
          <v-row>
            <v-col cols="6"
              ><strong>Coordenação de desenvolvimento do sistema</strong></v-col
            >
            <v-col cols="6"
              ><p style="color: #003c3c">Darcy Fernandez</p>
            </v-col></v-row
          >
        </div>
      </section>

      <section style="background-color: #e6f1f2">
        <div class="container" style="max-width: 800px">
          <span style="font-size: 2em; color: #003c3c">
            <strong><p style="margin-left: 12px">Equipes Temáticas</p></strong>
          </span>

          <v-row
            v-for="(item, idx) in equipesInfos"
            :key="idx"
            class="d-flex justify-start align-start"
          >
            <v-col cols="6"
              ><strong
                ><p style="color: #003c3c">
                  <strong>{{ item.name }}</strong>
                </p></strong
              ></v-col
            >

            <v-col cols="6"
              ><p
                style="color: #003c3c"
                v-for="(p, idx) in item.values"
                :key="idx"
              >
                {{ p }}
              </p>
            </v-col></v-row
          >
        </div>
      </section>

      <section style="background-color: #e6f1f2">
        <div class="container">
          <v-row class="d-flex justify-start align-start">
            <v-col cols="4">
              <v-card class="mx-auto" color="#d0e3e3" outlined>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                  height="200px"
                ></v-img>

                <v-card-title> Acesse o relatório metodológico </v-card-title>

                <v-card-subtitle
                  >Nele você encontra as diversas metodologias utilizadas para
                  cada camada da UrbVerde.
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text color="">
                    <a
                      style="color: red"
                      href="https://drive.google.com/drive/folders/1aHembEq2eKsdzVfW89sIwC8gLWZ9R2od"
                      ><strong>Leia o post ...</strong></a
                    >
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="4">
              <v-card class="mx-auto" color="#d0e3e3" outlined>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                  height="200px"
                ></v-img>

                <v-card-title>
                  Acesse o relatório de infraestrutura dos municípios paulistas.
                </v-card-title>

                <v-card-subtitle
                  >Nele você encontra os resultados de um questionário aplicado
                  aos representantes municipais da temática ambiental visando
                  (re)conhecer a realidade e a diversidade dos diferentes
                  municípios paulistas no que tange a existência de ferramentas
                  para o acompanhamento do tema ambiental.
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text color="">
                    <a
                      style="color: red"
                      href="https://drive.google.com/drive/folders/1aHembEq2eKsdzVfW89sIwC8gLWZ9R2od"
                      ><strong>Leia o post ...</strong></a
                    >
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="4">
              <v-card class="mx-auto" color="#d0e3e3" outlined>
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                  height="200px"
                ></v-img>

                <v-card-title>
                  Acesse o manifesto por uma política estadual de áreas verdes
                  urbanas.
                </v-card-title>

                <v-card-subtitle
                  >Nesse manifesto chamamos a todas e todos para inciarmos um
                  debate sobre a necessidade de construirmos uma política
                  pública visando a retomada verde nos municípios paulistas.
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text color="">
                    <a
                      style="color: red"
                      href="https://drive.google.com/drive/folders/1aHembEq2eKsdzVfW89sIwC8gLWZ9R2od"
                      ><strong>Leia o post ...</strong></a
                    >
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="container d-flex justify-center align-center">
            <v-btn class="mt-5 pa-3 white--text" large color="#003C3C">
              Acesse o Blog da Urbverde</v-btn
            >
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
        <div class="container-fluid pb-0">
          <v-card class="footerCard" outlined color="#d0e3e3">
            <div class="pl-4 pr-4">
              <v-row>
                <v-col cols="12" md="6">
                  <p class="pt-2" style="font-size: 32px; color: #003c3c">
                    <strong
                      >Fique por dentro das atualizações da Urbverde</strong
                    >
                  </p>
                  <p style="font-size: 17px; color: #003c3c">
                    Assine nossa Newsletter para mantermos você atualizado sobre
                    novos lançamentos.
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
                          v-model="email"
                          :rules="emailRules"
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-btn color="#01DC82" class="mb-3"> Assinar </v-btn>
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
                  <img
                    width="30px"
                    class="ma-3"
                    src="@/assets/icons/fb-icon.png"
                  />
                  <img
                    width="30px"
                    class="ma-3"
                    src="@/assets/icons/twitter-icon.png"
                  />
                  <img
                    width="30px"
                    class="ma-3"
                    src="@/assets/icons/instagram-icon.png"
                  />
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
      valid: false,
      email: "",
      emailRules: [
        // v => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      tableValues: [
        {
          name: "Reitor da USP",
          values: "Carlos Gilberto Carlotti Junior",
        },
        {
          name: "Pró-Reitoria de Pesquisa e Inovação da USP",
          values: "Paulo Alberto Nussenzveig",
        },
        {
          name: "Diretor do Instituto de Arquitetura e Urbanismo da USP",
          values: "Joubert José Lancha",
        },
        {
          name: "Vice-Diretor do Instituto de Arquitetura e Urbanismo da USP",
          values: "Miguel Antonio Buzzar",
        },
        {
          name: "Presidente da Comissão de Pesquisa do Instituto de Arquitetura e Urbanismo da USP",
          values: "Paulo César Castral",
        },
      ],
      equipesInfos: [
        {
          name: "Vegetação urbana",
          values: [
            "Daniel José de Andrade",
            "Breno Malheiros de Melo",
            "Vitor Antonio de Almeida Lacerda",
            "Leonardo Fernandes Cesar",
            "Thiago Vital do Carmo",
          ],
        },
        {
          name: "Temperatura de superfície",
          values: [
            "Daniel José de Andrade",
            "Gustavo Paixão Menezes",
            "Edmilson dos Santos Rodrigues Junior",
            "Eduardo Félix Justiniano",
            "Vitor Antonio de Almeida Lacerda",
          ],
        },
        {
          name: "Parques, praças e áreas verdes urbanas",
          values: [
            "Joice Genaro Gomes",
            "Julio Cesar Pedrassoli",
            "Marcel Fantin",
            "Natalia Maria Canhete",
            "Leonardo Meneghetti Sani",
            "Ana Carolina Pereira",
          ],
        },
        {
          name: "Desenvolvimento do sistema",
          values: [
            "Darcy Fernandez",
            "Guilherme Felix",
            "Lucas Amorim",
            "Renato Oliveira",
            "Leilane Ramalho",
            "Gustavo Paixão Menezes",
            "Vitor Antonio de Almeida Lacerda",
          ],
        },
        {
          name: "Relações internacionais",
          values: ["Manoel Antonio Lopes Rodrigues Alves", "Nagayamma Aragão"],
        },
        {
          name: "Design e prototipagem",
          values: [
            "Ruan Willian",
            "Vitor Antonio de Almeida Lacerda",
            "Gustavo Paixão Menezes",
          ],
        },
        {
          name: "Avaliação pós-implementação",
          values: ["Augusto Cesar Oyama"],
        },
      ],
    };
  },
  computed: {},
  methods: {},
  async created() {
    await this.$store.dispatch("getMunicipioVegData");
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
    font-size: 4em;
  }
  h4 {
    font-size: 1.5em;
    padding-bottom: 1em;
  }
}

.wrap-map {
  position: relative;
  height: 300px;
  top: -50px;
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
</style>
