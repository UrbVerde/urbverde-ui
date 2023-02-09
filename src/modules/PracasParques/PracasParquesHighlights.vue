<template>
  <div>
    <v-row class="d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="12">
        <v-row class="d-flex flex-column">
          <span>VOCÊ ESTÁ VISUALIZANDO</span>
          <span style="font-size: 2em; color: #01dc82"
            >Praças e Parques <span style="color: grey">de</span>
            {{ munPracaData.nm_mun }}
            <span style="color: grey">em</span> 2021</span
          >
        </v-row>
      </v-col>
      <v-col cols="12">
        <p>RANKING COMPARATIVO EM RELAÇÃO A OUTRAS CIDADES</p>
      </v-col>
    </v-row>

    <v-row class="d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="8">
        <v-row>
          <v-col cols="12" md="4" class="d-flex justify-start align-start">
            <v-card
              outlined
              class="d-flex flex-column justify-center"
              style="border-radius: 12px"
            >
              <v-img src="@/assets/munsp.png"></v-img>
              <v-container
                class="d-flex flex-column justify-space-between align-start"
              >
                <v-card-subtitle class="pa-0"
                  ><strong>Estado de SP</strong></v-card-subtitle
                >
                <v-card-text class="pa-0 mb-2"
                  >A posição do seu município em relação aos 645 municípios do
                  Estado de São Paulo
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Acesso população atendida pelas praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a1_rank_estado }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 645</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>M² de praças por habitante</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a2_rank_estado }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 645</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>% área ocupada pelos buffers</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a3_rank_estado }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 645</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Distribuição Espacial das Praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a4_rank_estado }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start">
            <v-card
              outlined
              class="d-flex flex-column justify-center"
              style="border-radius: 12px"
            >
              <v-img src="@/assets/microreg.png"></v-img>
              <v-container
                class="d-flex flex-column justify-space-between align-start"
              >
                <v-card-subtitle class="pa-0"
                  ><strong>Microrregiões</strong></v-card-subtitle
                >
                <v-card-text class="pa-0 mb-2"
                  >A posição do seu município em relação aos municípios que
                  compõe a mesma microrregião
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Acesso população atendida pelas praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a1_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>M² de praças por habitante</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a2_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>% área ocupada pelos buffers</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a3_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Distribuição Espacial das Praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a4_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start"
            ><v-card
              outlined
              class="d-flex flex-column justify-center"
              style="border-radius: 12px"
            >
              <v-img src="@/assets/mesoreg.png"></v-img>
              <v-container
                class="d-flex flex-column justify-space-between align-start"
              >
                <v-card-subtitle class="pa-0"
                  ><strong>Mesorregiões</strong></v-card-subtitle
                >
                <v-card-text class="pa-0 mb-2"
                  >A posição do seu município em relação aos municípios que
                  compõe a mesma mesorregião.
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Acesso população atendida pelas praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a1_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>M² de praças por habitante</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a2_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>% de Área Ocupada pelos Buffers</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a3_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Distribuição Espacial das Praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a4_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              width="100%"
              outlined
              class="d-flex flex-column justify-center"
            >
              <v-card-title>
                <div class="text-h6">
                  % de idosos em relação ao total da população
                </div>
              </v-card-title>

              <v-row class="d-flex">
                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Dentro da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h9b.toFixed(
                                2
                              )} / 1); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munPracaData.h9b * 100).toFixed(2) }}%</strong
                    >
                  </div>
                </v-col>

                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Fora da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h9a.toFixed(
                                2
                              )} / 1); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munPracaData.h9a * 100).toFixed(2) }}%</strong
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              width="100%"
              outlined
              class="d-flex flex-column justify-center"
            >
              <v-card-title>
                <div class="text-h6">
                  % de crianças em relação ao total da população
                </div>
              </v-card-title>

              <v-row class="d-flex">
                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Dentro da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h10b.toFixed(
                                2
                              )}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munPracaData.h10b * 100).toFixed(2) }} %</strong
                    >
                  </div>
                </v-col>

                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Fora da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h10a.toFixed(
                                2
                              )}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ munPracaData.h10a.toFixed(2) * 100 }}%</strong
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              width="100%"
              outlined
              class="d-flex flex-column justify-center"
            >
              <v-card-title>
                <div class="text-h6">
                  % de mulheres chefes de família em relação ao total da
                  população
                </div>
              </v-card-title>

              <v-card-subtitle>
                <div class="text-p">
                  Para cada mulher que vive na vizinhança das praças, existem 3x
                  mais mulheres que são responsáveis pelo sustento da casa e dos
                  filhos e não tem acesso às praças.
                </div>
              </v-card-subtitle>

              <v-row class="d-flex">
                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Dentro da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h11b.toFixed(
                                2
                              )}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munPracaData.h11b * 100).toFixed() }} %</strong
                    >
                  </div>
                </v-col>

                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Fora da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h11a.toFixed(
                                2
                              )}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munPracaData.h11a * 100).toFixed() }}%</strong
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              width="100%"
              outlined
              class="d-flex flex-column justify-center"
            >
              <v-card-title>
                <div class="text-h6">
                  % de negros ou indígenas em relação ao total da população
                  (Racismo Ambiental)
                </div>
              </v-card-title>

              <v-card-subtitle>
                <div class="text-p">
                  No entorno das praças, a população branca é 5x maior do que a
                  população não branca (negros e indigenas).
                </div>
              </v-card-subtitle>

              <v-row class="d-flex">
                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Dentro da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h12b.toFixed(
                                2
                              )}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munPracaData.h12b * 100).toFixed() }} %</strong
                    >
                  </div>
                </v-col>

                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Fora da vizinhança da praça</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munPracaData.h12a.toFixed(
                                2
                              )}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munPracaData.h12a * 100).toFixed() }}%</strong
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4">
        <v-card width="100%" outlined class="mx-auto">
          <v-img
            cover
            width="100%"
            height="150px"
            src="@/assets/card-pracasparques.png"
          ></v-img>

          <v-container>
            <v-card-text>
              <p>
                As praças e parques de um municipio atendem principalmente a
                populaçâo da vizinhança, definida pela OMS (Organização Mundial
                da Saúde) como um raio de 400m ao redor de cada praça.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn class="">Saiba mais ...</v-btn></v-card-actions
            >
          </v-container>
        </v-card>

        <v-card
          width="100%"
          outlined
          class="mx-auto d-flex justify-center align-center mt-5"
        >
          <div class="d-flex flex-column justify-center align-center">
            <chart :size="150" :valor="munPracaData.h5" />
            <v-card-title>População Atendida por Praças</v-card-title>
            <v-card-subtitle>Pelo menos num raio de 400m</v-card-subtitle>
          </div>
        </v-card>

        <v-card
          width="100%"
          outlined
          class="mx-auto d-flex mt-5 justify-center align-center"
        >
          <div class="d-flex flex-column justify-center align-center">
            <span style="color: #01dc82; font-size: 3em"
              ><strong>{{ munPracaData.h6 }}x</strong></span
            >
            <v-card-title>Desigualdade de Renda</v-card-title>
            <v-card-subtitle
              >A renda per capita média da população que vive na vizinhança das
              praças é {{ munPracaData.h6 }} vezes maior do que
              fora.</v-card-subtitle
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {};
  },
  computed: {
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021][0];
    },
  },
  methods: {},
  watch: {
    "$route.params.id": {
      handler: async function (id) {
        this.$store.dispatch("getMunicipioPracaData", id);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch("getMunicipioPracaData", this.$route.params.id);
  },
};
</script>

<style></style>
