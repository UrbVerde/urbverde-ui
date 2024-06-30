<!-- TEMPLATE da Página Equipe/Sobre Nós -->
<template>
  <div class="home__box">

    <!-- Imagem de Fundo com efeito Explodindo -->
    <div class="bg" :style="{ backgroundSize: bgSize, backgroundPosition: bgPosition }"></div>

    <!-- Menus superiores -->
    <HeaderHome />

    <!-- Conteúdo -->
    <main>
      <!-- Frase de Abertura (Sintetizar) -->
      <section class="main__box">
        <div class="container">
          <h2 class="pb-1 pt-1 align-start" style=" word-break: normal;">
            Democratizar o acesso à informação com responsabilidade
          </h2>
          <h4 class="mx-auto" style="width:77%;">
            A UrbVerde é uma plataforma de monitoramento ambiental com <br>
            indicadores socioambientais atualizados anualmente, voltados <br>
            para o debate e suporte à decisão em políticas públicas!
          </h4>
        </div>
      </section>

      <!-- Fotos da Equipe -->
      <section class="second_section_home">
        <div class="container">
          <div class="wrap-map">
            <div class="map mx-auto">
              <img width="100%" class="mx-auto" src="@/assets/equipe2.png" />
            </div>
          </div>
        </div>

        <!-- Histórico -->
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
                    A UrbVerde surge da necessidade do desenvolvimento de uma
                    plataforma de dados geoespaciais proveniente de uma
                    metodologia de monitoramento anual das desigualdades
                    socioespaciais na distribuição das áreas verdes urbanas.
                  </p>
                  <p>
                    Para tanto, são utilizadas técnicas de sensoriamento remoto
                    e machine learning, assim como o suporte da plataforma baseada
                    em cloud computing e programação em Java Script: Google Earth
                    Engine (GEE).
                  </p>
                </div>
              </v-col>
            </v-row>
          </div>
        </section>

        <!-- Créditos de Filme - Geral -->
        <section style="background-color: #e6f1f2">
          <div class="container" style="max-width: 800px">
            <v-row class="d-flex justify-start align-start"><v-col cols="6"><strong>Instituições participantes
                </strong></v-col>
              <v-col cols="6">
                <p style="color: #003c3c">
                  Universidade de São Paulo (IAU-FFLCH-EESC)
                </p>
                <p style="color: #003c3c">Universidade Federal da Bahia</p>
                <p style="color: #003c3c">Universidade Federal de São Carlos</p>
                <p style="color: #003c3c">
                  Universidade Lusófona de Humanidades e Tecnologias
                </p>
                <p style="color: #003c3c">Zukk – Inovação Geoespacial</p>
                <p style="color: #003c3c">
                  Rede Cyted RUN – Rios Urbanos Naturalizados
                </p>
                <p style="color: #003c3c">
                  Consórcio Intermunicipal Grande ABC
                </p>
                <p style="color: #003c3c">
                  Prefeitura de Diadema
                </p>
                <p style="color: #003c3c">
                  Prefeitura de São Vicente
                </p>
                <p style="color: #003c3c">
                  Fundação de Amparo à Pesquisa do Estado de São Paulo – FAPESP
                </p>
                <p style="color: #003c3c">
                  Conselho Nacional de Desenvolvimento Científico e Tecnológico – CNPq
                </p>
              </v-col></v-row>
            <v-row v-for="(item, idx) in tableValues" :key="idx" class="d-flex justify-start align-start">
              <v-col cols="6">
                <strong> {{ item.name }} </strong></v-col>
              <v-col cols="6">
                <p style="color: #003c3c">{{ item.values }}</p>
              </v-col>
            </v-row>
          </div>
        </section>

        <!-- Créditos de Filme - Professores -->
        <section style="background-color: #e6f1f2">
          <div class="container" style="max-width: 800px">
            <span style="font-size: 2em; color: #003c3c" class="mb-5">
              <strong>
                <p style="margin-left: 12px">Equipe</p>
              </strong>
            </span>

            <v-row class="d-flex justify-start align-start">
              <v-col cols="6"><strong>Coordenação Geral</strong> </v-col>

              <v-col cols="6">
                <p style="color: #003c3c">
                  Marcel Fantin
                  &nbsp;
                  <a href="https://orcid.org/0000-0003-3069-8019">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="https://lattes.cnpq.br/0466568768012496">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p>
              </v-col></v-row>
            <v-row>
              <v-col cols="6"><strong>Coordenação Executiva </strong></v-col>

              <v-col cols="6">
                <!-- <p style="color: #003c3c">
                  Julio Cesar Pedrassoli
                  &nbsp;
                  <a href="https://orcid.org/0000-0001-9762-102X">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="https://lattes.cnpq.br/1919320488302240">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p> -->
                <p style="color: #003c3c">Rubia Gomes Morato
                  &nbsp;
                  <a href="https://orcid.org/0000-0001-6135-4302">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="https://lattes.cnpq.br/6900518116634499">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p>
                <p style="color: #003c3c">Fernando Shinji Kawakubo
                  &nbsp;
                  <a href="https://orcid.org/0000-0002-2045-6318">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="https://lattes.cnpq.br/5632988444815474">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p>
                <p style="color: #003c3c">Marcos Roberto Martines
                  &nbsp;
                  <a href="https://orcid.org/0000-0002-7464-2431">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="https://lattes.cnpq.br/5317839291904450">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p>
                <p style="color: #003c3c">Manoel Antonio Lopes Rodrigues Alves
                  &nbsp;
                  <a href="https://orcid.org/0000-0002-6935-0477">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="http://lattes.cnpq.br/7815309672113678">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p>
                <p style="color: #003c3c">Marcelo Montaño
                  &nbsp;
                  <a href="https://orcid.org/0000-0003-0001-8801">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="https://lattes.cnpq.br/6489417071120295">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6"><strong>Coordenação técnica</strong> </v-col>
              <v-col cols="6">
                <p style="color: #003c3c">Mariana Mendes
                  &nbsp;
                  <a href="https://orcid.org/">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="http://lattes.cnpq.br/">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p>
                <!-- <p style="color: #003c3c">Daniel José de Andrade
                  &nbsp;
                  <a href="https://orcid.org/">
                    <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
                      width="16" height="16" target="_blank" />
                  </a>
                  &nbsp;
                  <a href="http://lattes.cnpq.br/">
                    <img alt="Lattes CNPQ" src="https://ppgmvci.ufsc.br/files/2020/05/icon-lattes-100x100.png" width="16"
                      height="16" target="_blank" />
                  </a>
                </p> -->
              </v-col></v-row>
            <v-row>
              <v-col cols="6"><strong>Coordenação de desenvolvimento do sistema</strong></v-col>
              <v-col cols="6">
                <p style="color: #003c3c">Darcy Fernandez</p>
              </v-col></v-row>
          </div>
        </section>

        <!-- Créditos de Filme - Participantes -->
        <section style="background-color: #e6f1f2">
          <div class="container" style="max-width: 800px">
            <span style="font-size: 2em; color: #003c3c" class="mb-5">
              <strong>
                <p style="margin-left: 12px">Equipes Temáticas</p>
              </strong>
            </span>

            <v-row v-for="(item, idx) in equipesInfos" :key="idx" class="d-flex justify-start align-start">
              <v-col cols="6"><strong>
                  <p style="color: #003c3c">
                    <strong>{{ item.name }}</strong>
                  </p>
                </strong></v-col>

              <v-col cols="6">
                <p style="color: #003c3c" v-for="(p, idx) in item.values" :key="idx">
                  {{ p }}
                </p>
              </v-col></v-row>
          </div>
        </section>

        <!-- Relatórios -->
        <!-- <section style="background-color: #e6f1f2">
        <div class="container">
          <v-row class="d-flex justify-start align-start">
            <v-col cols="4">
              <v-card class="mx-auto" color="#d0e3e3" outlined>
                <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>

                <v-card-title> Acesse o relatório metodológico </v-card-title>

                <v-card-subtitle>Nele você encontra as diversas metodologias utilizadas para
                  cada camada da UrbVerde.
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text color="">
                    <a style="color: red"
                      href="https://drive.google.com/drive/folders/1aHembEq2eKsdzVfW89sIwC8gLWZ9R2od"><strong>Leia o post
                        ...</strong></a>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="4">
              <v-card class="mx-auto" color="#d0e3e3" outlined>
                <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>

                <v-card-title>
                  Acesse o relatório de infraestrutura dos municípios paulistas.
                </v-card-title>

                <v-card-subtitle>Nele você encontra os resultados de um questionário aplicado
                  aos representantes municipais da temática ambiental visando
                  (re)conhecer a realidade e a diversidade dos diferentes
                  municípios paulistas no que tange a existência de ferramentas
                  para o acompanhamento do tema ambiental.
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text color="">
                    <a style="color: red"
                      href="https://drive.google.com/drive/folders/1aHembEq2eKsdzVfW89sIwC8gLWZ9R2od"><strong>Leia o post
                        ...</strong></a>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="4">
              <v-card class="mx-auto" color="#d0e3e3" outlined>
                <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>

                <v-card-title>
                  Acesse o manifesto por uma política estadual de áreas verdes
                  urbanas.
                </v-card-title>

                <v-card-subtitle>Nesse manifesto chamamos a todas e todos para inciarmos um
                  debate sobre a necessidade de construirmos uma política
                  pública visando a retomada verde nos municípios paulistas.
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text color="">
                    <a style="color: red"
                      href="https://drive.google.com/drive/folders/1aHembEq2eKsdzVfW89sIwC8gLWZ9R2od"><strong>Leia o post
                        ...</strong></a>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="container d-flex justify-center align-center">
            <v-btn class="mt-5 pa-3 white--text" large color="#003C3C">
              Acesse o Blog da Urbverde</v-btn>
          </v-row>
        </div>
                </section> -->

        <!-- Financiamento -->
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
      </section>

      <!-- Footer -->
      <section style="background-color: #e6f1f2; padding-bottom: 0">
        <div class="container pb-0">
          <v-card class="footerCard" outlined color="#d0e3e3">
            <!-- NEWSLETTER -->
            <NewsLetter />

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
import VueMapbox from "../modules/Mapa/components/VueMapbox.vue";
export default {
  name: "Sobre",
  components: { VueMapbox },
  data() {
    return {
      scrollY: 0,
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
            // "Daniel José de Andrade",
            "Rodrigo Hitoshi",
            "Breno Malheiros de Melo",
            "Eduardo Félix Justiniano",
            "Fernando Shinji Kawakubo",
            // "Vitor Antonio de Almeida Lacerda",
            // "Leonardo Fernandes Cesar",
            // "Thiago Vital do Carmo",
          ],
        },
        {
          name: "Mobilidade e Clima",
          values: [
            // "Daniel José de Andrade",
            "Gustavo Paixão Menezes",
            "Yutaka Fábio Takesaki",
            "Edmilson dos Santos Rodrigues Junior",
            "Eduardo Félix Justiniano",
            "Vitor Antonio de Almeida Lacerda",
          ],
        },
        {
          name: "Parques, praças e áreas verdes urbanas",
          values: [
            //"Joice Genaro Gomes",
            //"Julio Cesar Pedrassoli",
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
            "Guilherme Bueno",
            "Ana Lívia Magalhães Garbin",
          ],
        },
        {
          name: "Relações internacionais",
          values: ["Manoel Antonio Lopes Rodrigues Alves", "Nagayamma Aragão"],
        },
        {
          name: "Design e prototipagem",
          values: [
            "Gabriel Bo",
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
  computed: {
    bgSize() {
      return `${60 + this.scrollY / 10}%`; // calculate the zoom level based on scroll position
    },
    bgPosition() {
      return `center ${this.scrollY / 10}px`;
    },
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    },
  },

  watch: {
  },

  async created() {
    window.addEventListener("scroll", this.handleScroll);
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: white;
}

.home__box {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #003c3c;
  // opacity: 0.4;
}

.bg {
  position: absolute;
  top: 5em;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/home_background3.png");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 60%;
  opacity: 0.45;
  z-index: 0;
  transition: all 0.3s ease-out;
}

.main__box {
  background-color: transparent; //#003c3c;
  color: white;
  position: relative;
  width: 100%;
  padding-top: 1.4em;
  // padding-bottom: 15em;

  h2 {
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
    -webkit-filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.45))
  }

  h4 {
    margin-bottom: 0.5em;
    color: #BFD4E4;
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    // padding: 1em;
    text-align: center;
    font-size: 1.60em;
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))
  }
}

.second_section_home {
  position: relative;
  background-color: #e6f1f2;
  padding-top: 3em;
  padding-bottom: 1em;
  z-index: 1;
}

.footer-flower {
  background-image: url("@/assets/home/home-card-05.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.footerCard {
  border-color: #d0e3e3 !important;
}

.wrap-map {
  position: relative;
  height: 190px;
  top: -90px;
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
</style>
