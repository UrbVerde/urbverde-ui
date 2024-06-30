<template>
  <div>
    <v-row class="d-flex mx-auto container w100-mobile" style="width: 80%">
      <v-col cols="12">
        <v-row class="d-flex flex-column">
          <span>VOCÊ ESTÁ VISUALIZANDO</span>
          <span style="font-size: 2em; color: #01dc82">Vegetação <span style="color: grey">de</span>
            {{ munVegData.nm_mun }}
            <span style="color: grey">em</span>{{ this.$route.params.ano }}</span>
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
            <v-card outlined class="d-flex flex-column justify-center" style="border-radius: 12px">
              <v-img src="@/assets/munsp.png"></v-img>
              <v-container class="d-flex flex-column justify-space-between align-start">
                <v-card-subtitle class="pa-0"><strong>Estado de SP</strong></v-card-subtitle>
                <v-card-text class="pa-0 mb-2">
                  A posição do seu município em relação todos os {{ munVegData.n_rank_estado }} municípios do Estado de São
                  Paulo
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Percentual de Cobertura Vegetal (PCV)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b1_rank_estado }} °
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">entre {{ munVegData.n_rank_estado }}</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Índice de Cobertura Vegetal (ICV)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b2_rank_estado }} °
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">entre {{ munVegData.n_rank_estado }}</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Índice de Desigualdade Socioambiental (IDSA)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b3_rank_estado }} °
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">entre {{ munVegData.n_rank_estado }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start"><v-card outlined
              class="d-flex flex-column justify-start" style="border-radius: 12px">
              <v-img src="@/assets/mesoreg.png"></v-img>
              <v-container class="d-flex flex-column justify-space-between align-start">
                <v-card-subtitle class="pa-0"><strong>Mesorregiões</strong></v-card-subtitle>
                <v-card-text class="pa-0 mb-2">A posição do seu município em relação aos {{ munVegData.n_rank_meso }}
                  municípios
                  vizinhos que juntos compõe a mesorregião de {{ munVegData.nm_meso }}
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Percentual de Cobertura Vegetal (PCV)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b1_rank_meso }} °
                      </p>
                    </v-col>
                    <v-col style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munVegData.n_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Índice de Cobertura Vegetal (ICV)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b2_rank_meso }} °
                      </p>
                    </v-col>
                    <v-col style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munVegData.n_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Índice de Desigualdade Socioambiental (IDSA)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b3_rank_meso }} °
                      </p>
                    </v-col>
                    <v-col style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munVegData.n_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start">
            <v-card outlined class="d-flex flex-column justify-start" style="border-radius: 12px">
              <v-img src="@/assets/microreg.png"></v-img>
              <v-container class="d-flex flex-column justify-space-between align-start">
                <v-card-subtitle class="pa-0"><strong>Microrregiões</strong></v-card-subtitle>
                <v-card-text class="pa-0 mb-2">A posição do seu município em relação aos {{ munVegData.n_rank_micro }}
                  municípios
                  vizinhos que compõe juntos a microrregião de {{ munVegData.nm_micro }}
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Percentual de Cobertura Vegetal (PCV)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b1_rank_micro }} °
                      </p>
                    </v-col>
                    <v-col style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munVegData.n_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Índice de Cobertura Vegetal (ICV)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b2_rank_micro }} °
                      </p>
                    </v-col>
                    <v-col style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munVegData.n_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Índice de Desigualdade Socioambiental (IDSA)</strong>
                  </p>
                  <v-row class="d-flex justify-start align-start">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munVegData.b3_rank_micro }} °
                      </p>
                    </v-col>
                    <v-col style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munVegData.n_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="4">
        <v-card width="100%" outlined class="mx-auto" style="border-radius: 12px">
          <img style="position: absolute; top: -60px; z-index: 5" width="110px" src="@/assets/satelite.png" />
          <v-img src="@/assets/card-background.png"></v-img>

          <v-card-title>O que é o PCV ?</v-card-title>

          <v-card-text>
            <p>
              O <strong>Percentual de Cobertura Vegetal (PCV)</strong> é um valor calculado
              usando satélites que mede o quanto as áreas urbanas são cobertas
              por vegetação, incluindo árvores e gramíneas.
            </p>
          </v-card-text>

          <v-card-title>Você sabia ?</v-card-title>

          <v-card-text>
            <p>
              💡 <strong>Você sabia</strong> que essas métricas podem embasar o
              <strong>plano diretor</strong> do seu municipio, criando diretrizes
              para o <strong>percentual mínimo de cobertura vegetal por tipo de zoneamento urbano</strong>
              e avaliando os resultados ao longo do tempo?
            </p>
            <v-btn text disabled class="text-p">Saiba mais ...</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="8" class="d-flex justify-center align-center">
        <v-row>
          <v-col cols="6">
            <v-card height="250px" width="100%" outlined class="mx-auto d-flex pa-5">
              <chart :size="150" :valor="munVegData.b1 * 100" />
              <div class="d-flex flex-column justify-center align-center ml-4">
                <span><strong>Cobertura Vegetal</strong></span>
                <span>Percentual do Período Selecionado
                  {{ this.$route.params.ano }}</span>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" class="d-flex justify-center align-center"><v-card height="250px" width="100%" outlined
              class="d-flex flex-column pa-5 justify-center">
              <div class="d-flex flex-column justify-center align-center ml-4">
                <span><strong>Desigualdade Socioambiental</strong></span>
                <span>Índice do Período Selecionado ({{
                  this.$route.params.ano
                }})</span>
              </div>
              <div style="height: 50px">
                <table class="charts-css bar mt-4">
                  <tbody>
                    <tr style="background-color: #f2ecff">
                      <td :style="`--size: calc(${munVegData.b3} / 1); background-color: #01dc82;`">
                        <span class="data pa-3 mr-auto" style="color: white">
                          <strong>{{
                            (munVegData.b3 * 100).toFixed(2)
                          }}</strong>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-card></v-col>
          <v-col cols="6" md="4" class="d-flex">
            <v-card outlined class="d-flex flex-column pa-7 justify-center">
              <span style="color: #01dc82; font-size: 2.5em"><strong>{{ munVegData.b1h1 }}</strong></span>
              <span>É o equivalente à cobertura vegetal da área urbana em Campos de
                Futebol</span>
            </v-card>
          </v-col>

          <v-col cols="6" md="4" class="d-flex">
            <v-card outlined class="d-flex flex-column pa-7 justify-center">
              <span style="color: #01dc82; font-size: 2.5em"><strong>{{ munVegData.b1h2 }}%</strong></span>
              <span>Da população mora em setores com PCV abaixo da média
                municipal.
              </span>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex">
            <v-card outlined class="d-flex flex-column pa-7 justify-center">
              <span style="color: #01dc82; font-size: 2.5em"><strong>{{ munVegData.b1h3 }} a {{ munVegData.b1h4
              }}%</strong></span>
              <span>Representa a faixa de variação do PCV na area urbana.
              </span>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="4" md="4" class="d-flex">
        <v-card outlined>
          <v-container class="d-flex flex-column justify-space-between align-start">
            <table id="line-chart" class="charts-css line multiple show-labels">
              <tbody>
                <tr>
                  <th scope="row">2016</th>
                  <td :style="`--start: ${lineChartVegData[2016][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2017][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2016][0].b1 * 100).toFixed() }}
                    </span>
                  </td>

                  <td v-if="setorDataForChart" :style="`--start: ${setorDataForChart[2016][0].b1.toFixed(
                    2
                  )}; --size: ${setorDataForChart[2017][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (setorDataForChart[2016][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2017</th>
                  <td :style="`--start: ${lineChartVegData[2017][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2018][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2017][0].b1 * 100).toFixed() }}</span>
                  </td>

                  <td v-if="setorDataForChart" :style="`--start: ${setorDataForChart[2017][0].b1.toFixed(
                    2
                  )}; --size: ${setorDataForChart[2018][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (setorDataForChart[2017][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2018</th>
                  <td :style="`--start: ${lineChartVegData[2018][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2019][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2018][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td v-if="setorDataForChart" :style="`--start: ${setorDataForChart[2018][0].b1.toFixed(
                    2
                  )}; --size: ${setorDataForChart[2019][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (setorDataForChart[2018][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2019</th>
                  <td :style="`--start: ${lineChartVegData[2019][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2020][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2019][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td v-if="setorDataForChart" :style="`--start: ${setorDataForChart[2019][0].b1.toFixed(
                    2
                  )}; --size: ${setorDataForChart[2020][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (setorDataForChart[2019][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2020</th>
                  <td :style="`--start: ${lineChartVegData[2020][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2020][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td v-if="setorDataForChart" :style="`--start: ${setorDataForChart[2020][0].b1.toFixed(
                    2
                  )}; --size: ${setorDataForChart[2021][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (setorDataForChart[2020][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2021</th>
                  <td :style="`--start: ${lineChartVegData[2021][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2021][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td v-if="setorDataForChart" :style="`--start: ${setorDataForChart[2021][0].b1.toFixed(
                    2
                  )}; --size: ${setorDataForChart[2020][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (setorDataForChart[2021][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <v-card-title class="text-h6" style="color: #003c3c; font-size: 3em; word-break:normal">
              Evolução temporal do PCV (%) no setor clicado vs municipio
            </v-card-title>
            <v-card-actions>
              <v-btn text disabled class="text-p">Saiba mais ...</v-btn></v-card-actions>
          </v-container>
        </v-card></v-col>

      <v-col cols="4" md="4" class="d-flex">
        <v-card outlined>
          <v-container class="d-flex flex-column justify-space-between align-start">
            <table id="line-chart2" class="charts-css line show-labels">
              <tbody>
                <tr>
                  <th scope="row">2016</th>
                  <td :style="`--start: ${lineChartVegData[2016][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2016][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2016][0].b1 * 100).toFixed() }}
                    </span>
                  </td>

                  <td :style="`--start: ${tstChartData[2016][0].c2 / 50
                    }; --size: ${tstChartData[2016][0].c2 / 50}`">
                    <span class="data">
                      {{ tstChartData[2016][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2017</th>
                  <td :style="`--start: ${lineChartVegData[2016][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2017][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2017][0].b1 * 100).toFixed() }}</span>
                  </td>

                  <td :style="`--start: ${tstChartData[2016][0].c2 / 50
                    }; --size: ${tstChartData[2017][0].c2 / 50}`">
                    <span class="data">
                      {{ tstChartData[2017][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2018</th>
                  <td :style="`--start: ${lineChartVegData[2017][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2018][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2018][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td :style="`--start: ${tstChartData[2017][0].c2 / 50
                    }; --size: ${tstChartData[2018][0].c2 / 50}`">
                    <span class="data">
                      {{ tstChartData[2018][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2019</th>
                  <td :style="`--start: ${lineChartVegData[2018][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2019][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2019][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td :style="`--start: ${tstChartData[2018][0].c2 / 50
                    }; --size: ${tstChartData[2019][0].c2 / 50}`">
                    <span class="data">
                      {{ tstChartData[2019][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2020</th>
                  <td :style="`--start: ${lineChartVegData[2019][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2020][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2020][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td :style="`--start: ${tstChartData[2019][0].c2 / 50
                    }; --size: ${tstChartData[2020][0].c2 / 50}`">
                    <span class="data">
                      {{ tstChartData[2020][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2021</th>
                  <td :style="`--start: ${lineChartVegData[2020][0].b1.toFixed(
                    2
                  )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`">
                    <span class="data">
                      {{ (lineChartVegData[2021][0].b1 * 100).toFixed() }}</span>
                  </td>
                  <td :style="`--start: ${tstChartData[2020][0].c2 / 50
                    }; --size: ${tstChartData[2021][0].c2 / 50}`">
                    <span class="data">
                      {{ tstChartData[2021][0].c2.toFixed() }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <v-card-title class="text-h6" style="color: #003c3c; font-size: 3em">
              Evolução temporal do PCV (%) e TST (ºC) no município
            </v-card-title>
            <v-card-actions>
              <v-btn text disabled class="text-p">Saiba mais ...</v-btn></v-card-actions>
          </v-container>
        </v-card></v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import * as turf from "@turf/turf";
export default {
  data() {
    return {
      setorDataForChart: false,
    };
  },
  computed: {
    munVegData() {
      return this.$store.getters.getMunVegData[this.$route.params.ano][0];
    },

    lineChartVegData() {
      return this.$store.getters.getMunVegData;
    },

    tstChartData() {
      return this.$store.getters.getMunTempData;
    },
  },

  methods: {},
  watch: {
    "$route.params.id": {
      handler: function (id) {
        this.$store.dispatch("getMunicipioVegData", this.$route.params.id);
        this.$store.dispatch("getMunicipioTempData", this.$route.params.id);
      },
      deep: true,
      immediate: true,
    },

    "$route.params.setorid": {
      handler: async function (setorid) {
        if (setorid) {
          await axios
            .get(
              `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageodata_vegetacao_por_setor&CQL_FILTER=cd_setor=${setorid}&outputFormat=application%2Fjson`
            )
            .then((response) => {
              let serieHistoricaPorSetor = {
                2016: [],
                2017: [],
                2018: [],
                2019: [],
                2020: [],
                2021: [],
              };
              response.data.features.forEach((item) =>
                serieHistoricaPorSetor[item.properties.ano].push(
                  item.properties
                )
              );

              this.setorDataForChart = serieHistoricaPorSetor;

              let bboxMun = turf.bbox(response.data.features[0].geometry);
              let massCenterMun = turf.centerOfMass(response.data.features[0]);
              window.maplibregl.flyTo({
                center: massCenterMun.geometry.coordinates,
                zoom: 12,
                bearing: 3,
                speed: 0.8,
                curve: 2,
                easing: (t) => t,
                essential: true,
              });
              window.maplibregl.fitBounds([
                [bboxMun[0], bboxMun[1]],
                [bboxMun[2], bboxMun[3]],
              ]);
            })
            .catch((error) => {
              console.error('VegetacaoHihlights.vue - Erro de SobreCarga no Sistema');
              // this.$router.push({ name: 'Home' });
            });
        }
      },
    },
  },
};
</script>

<style scoped lang="scss">
#line-chart {
  height: 200px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f6f6f6;
}

#line-chart2 {
  height: 200px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f6f6f6;
}

body {
  word-break: break-all !important;
}
</style>
