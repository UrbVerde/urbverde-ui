<template>
  <div>
    <v-row class="container d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="12">
        <v-row class="d-flex flex-column">
          <span>VOCÊ ESTÁ VISUALIZANDO</span>

          <span style="font-size: 2em; color: #01dc82"
            >Temperatura <span style="color: grey">de</span>
            {{ munTempData.nm_mun }}
            <span style="color: grey">em</span> 2021</span
          >
          <div class="d-flex flex-column justify-start align-start"></div>
        </v-row>
      </v-col>
      <v-col cols="12">
        <p class="mb-0" color="#003C3C">
          RANKING COMPARATIVO EM RELAÇÃO A OUTRAS REGIÕES
        </p>
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
                  >A posição do seu município em relação todos os 645 municípios
                  do Estado de São Paulo
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Coeficiente de Ilhas de Calor</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c1_rank_estado }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 645</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Temperatura Média de Superfície</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c2_rank_estado }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 645</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Temperatura Máxima de Superfície</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c3_rank_estado }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 645</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start">
            <v-card
              outlined
              class="d-flex flex-column justify-start"
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
                    <strong>Coeficiente de Ilhas de Calor</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c1_rank_micro }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 21</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Temperatura Média de Superfície</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c2_rank_micro }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 21</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Temperatura Máxima de Superfície</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c3_rank_micro }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 21</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start"
            ><v-card
              outlined
              class="d-flex flex-column justify-start"
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
                    <strong>Coeficiente de Ilhas de Calor</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c1_rank_meso }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 56</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Temperatura Média de Superfície</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c2_rank_meso }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 56</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Temperatura Máxima de Superfície</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col>
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munTempData.c3_rank_meso }}
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">de 56</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          width="100%"
          outlined
          class="mx-auto"
          style="border-radius: 12px"
        >
          <img
            style="position: absolute; top: -60px; z-index: 5"
            width="110px"
            src="@/assets/satelite.png"
          />
          <v-img src="@/assets/card-temperatura.png"></v-img>

          <v-card-text>
            <p>
              As ilhas de calor urbano (ICU) são um fenômeno percebido nas áreas
              mais quentes da cidade, onde as temperaturas de superficie ficam
              mais altas pelo excesso de materiais escuros que retêm mais calor,
              como o asfalto e o concreto, prejudicando a`qualidade de vida da
              população
            </p>
            <p>
              💡 Você sabia que árvores e rios refrescam o microclima e são a
              melhor solução para adaptar as cidades aos efeitos das mudanças
              climáticas?
            </p>
            <DownloadPdf />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="8" class="d-flex flex-column justify-start align-start">
        <p class="align-self-start ml-4">
          PERCENTUAL DE POPULAÇÕES QUE VIVEM NAS ÁREAS MAIS QUENTES
        </p>
        <v-row class="d-flex justify-start align-start">
          <v-col cols="12" md="6">
            <v-card
              outlined
              class="d-flex flex-column justify-start"
              style="border-radius: 12px"
            >
              <v-card-title>
                <div class="text-h6">Temperatura Média de Superfície</div>
              </v-card-title>

              <v-card-subtitle>
                Percentual do Período ({{ this.$route.params.ano }})
              </v-card-subtitle>

              <v-container>
                <div style="height: 50px">
                  <table class="charts-css bar">
                    <tbody>
                      <tr style="background-color: #f2ecff" class="d-flex">
                        <td
                          class=""
                          :style="`--size: calc(${munTempData.ch1} / 100); background-color: #01dc82;`"
                        >
                          <span class="data"></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <strong style="color: #003c3c"
                  >{{ munTempData.ch1.toFixed() }} %</strong
                >
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              outlined
              class="d-flex flex-column justify-start"
              style="border-radius: 12px"
            >
              <v-card-title>
                <div class="text-h6">Diferença de temperatura</div>
              </v-card-title>

              <v-card-subtitle>
                Percentual do Período ({{ this.$route.params.ano }})
              </v-card-subtitle>

              <v-container>
                <div style="height: 50px">
                  <table class="charts-css bar">
                    <tbody>
                      <tr style="background-color: #f2ecff" class="d-flex">
                        <td
                          class=""
                          :style="`--size: calc(${munTempData.h5b} / 100); background-color: #01dc82;`"
                        >
                          <span class="data"> </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <strong style="color: #003c3c"
                  >{{ munTempData.h5b.toFixed() }}%</strong
                >
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              outlined
              class="d-flex flex-column justify-start"
              style="border-radius: 12px"
            >
              <v-card-title>
                <div class="text-h6">Idosos</div>
              </v-card-title>

              <v-card-subtitle>
                Percentual que vive nas áreas mais quentes
              </v-card-subtitle>

              <v-container>
                <div class="d-flex flex-column">
                  <div>
                    <span>% Idosos no município</span>
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h9a}); background-color: #01dc82;`"
                            >
                              <span class="data"></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munTempData.h9a * 100).toFixed() }}%</strong
                    >
                  </div>

                  <div class="mt-3">
                    <span>% Idosos atingidos no município</span>
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h9b}); background-color: #01dc82;`"
                            >
                              <span class="data"></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munTempData.h9b * 100).toFixed() }}%</strong
                    >
                  </div>
                </div>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              outlined
              class="d-flex flex-column justify-start"
              style="border-radius: 12px"
            >
              <v-card-title>
                <div class="text-h6">Crianças</div>
              </v-card-title>

              <v-card-subtitle>
                Percentual que vive nas áreas mais quentes
              </v-card-subtitle>

              <v-container>
                <div class="d-flex flex-column">
                  <div>
                    <span>% Crianças no município</span>
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h10a}); background-color: #01dc82;`"
                            >
                              <span
                                class="data mr-auto ml-2"
                                style="color: white; white-space: nowrap"
                              >
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munTempData.h10a * 100).toFixed() }}%</strong
                    >
                  </div>

                  <div class="mt-3">
                    <span>% Crianças atingidos no município</span>
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h10b}); background-color: #01dc82;`"
                            >
                              <span
                                class="data mr-auto ml-2"
                                style="color: white; white-space: nowrap"
                              >
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munTempData.h10b * 100).toFixed() }}%</strong
                    >
                  </div>
                </div>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              outlined
              class="d-flex flex-column justify-start"
              style="border-radius: 12px"
            >
              <v-card-title>
                <div class="text-h6">Mulheres Chefes de Família</div>
              </v-card-title>

              <v-card-subtitle>
                Percentual que vive nas áreas mais quentes
              </v-card-subtitle>

              <v-container>
                <div class="d-flex flex-column">
                  <div>
                    <span>% Mulheres chefes de família no município</span>
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h11a}); background-color: #01dc82;`"
                            >
                              <span
                                class="data mr-auto ml-2"
                                style="color: white; white-space: nowrap"
                              >
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong>{{ (munTempData.h11a * 100).toFixed() }}%</strong>
                  </div>

                  <div class="mt-3">
                    <span
                      >% Mulheres chefe de família atingidas no município</span
                    >
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h11b}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munTempData.h11b * 100).toFixed() }}%</strong
                    >
                  </div>
                </div>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              outlined
              class="d-flex flex-column justify-start"
              style="border-radius: 12px"
            >
              <v-card-title>
                <div class="text-h6">Negros e Indígenas</div>
              </v-card-title>

              <v-card-subtitle>
                Percentual que vive nas áreas mais quentes
              </v-card-subtitle>

              <v-container>
                <div class="d-flex flex-column">
                  <div>
                    <span>% Negros ou Indígenas no município</span>
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h12a}); background-color: #01dc82;`"
                            >
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munTempData.h12a * 100).toFixed() }}%</strong
                    >
                  </div>

                  <div class="mt-3">
                    <span>% Negros ou indígenas atingidas no município</span>
                    <div style="height: 50px">
                      <table class="charts-css bar">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td
                              class=""
                              :style="`--size: calc(${munTempData.h12b}); background-color: #01dc82;`"
                            >
                              <span
                                class="data mr-auto ml-2"
                                style="color: white; white-space: nowrap"
                              >
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c"
                      >{{ (munTempData.h12b * 100).toFixed() }}%</strong
                    >
                  </div>
                </div>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    munTempData() {
      return this.$store.getters.getMunTempData[this.$route.params.ano][0];
    },
  },
  methods: {},
};
</script>

<style></style>
