<template>
  <div>
    <v-row class="d-flex mx-auto container w100-mobile" style="width: 80%">
      <v-col cols="12">
        <v-row class="d-flex flex-column">
          <span>VOCÊ ESTÁ VISUALIZANDO</span>
          <span style="font-size: 2em; color: #01dc82"
            >Vegetação <span style="color: grey">de</span>
            {{ munVegData.nm_mun }}
            <span style="color: grey">em</span>
            {{ this.$route.params.ano }}</span
          >
        </v-row>
      </v-col>
    </v-row>

    <v-row class="d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="8" class="d-flex justify-center align-center">
        <v-row>
          <v-col cols="6">
            <v-card
              height="250px"
              width="100%"
              outlined
              class="mx-auto d-flex pa-5"
            >
              <chart :size="150" :valor="munVegData.b1 * 100" />
              <div class="d-flex flex-column justify-center align-center ml-4">
                <span><strong>Cobertura Vegetal</strong></span>
                <span
                  >Percentual do Período Selecionado
                  {{ this.$route.params.ano }}</span
                >
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" class="d-flex justify-center align-center"
            ><v-card
              height="250px"
              width="100%"
              outlined
              class="d-flex flex-column pa-5 justify-center"
            >
              <div class="d-flex flex-column justify-center align-center ml-4">
                <span><strong>Desigualdade Socioambiental</strong></span>
                <span
                  >Índice do Período Selecionado ({{
                    this.$route.params.ano
                  }})</span
                >
              </div>
              <div style="height: 50px">
                <table class="charts-css bar mt-4">
                  <tbody>
                    <tr style="background-color: #f2ecff">
                      <td
                        :style="`--size: calc(${munVegData.b3} / 1); background-color: #01dc82;`"
                      >
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
            </v-card></v-col
          >
          <v-col cols="6" md="4" class="d-flex">
            <v-card outlined class="d-flex flex-column pa-7 justify-center">
              <span style="color: #01dc82; font-size: 2.5em"
                ><strong>{{ munVegData.b1h1 }}</strong></span
              >
              <span
                >É o equivalente à cobertura vegetal da área urbana em Campos de
                Futebol</span
              >
            </v-card>
          </v-col>

          <v-col cols="6" md="4" class="d-flex">
            <v-card outlined class="d-flex flex-column pa-7 justify-center">
              <span style="color: #01dc82; font-size: 2.5em"
                ><strong>{{ munVegData.b1h2 }}%</strong></span
              >
              <span
                >Da população mora em setores com [PCV] abaixo da média
                municipal.
              </span>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex">
            <v-card outlined class="d-flex flex-column pa-7 justify-center">
              <span style="color: #01dc82; font-size: 2.5em"
                ><strong
                  >{{ munVegData.b1h3 }} a {{ munVegData.b1h4 }}%</strong
                ></span
              >
              <span
                >Representa a faixa de variação do [PCV] na area urbana.
              </span>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="4">
        <v-card
          width="100%"
          outlined
          class="mx-auto my-12"
          style="border-radius: 12px"
        >
          <img
            style="position: absolute; top: -60px; z-index: 5"
            width="110px"
            src="@/assets/satelite.png"
          />
          <v-img src="@/assets/card-background.png"></v-img>

          <v-card-title>O que é o PCV ?</v-card-title>

          <v-card-text>
            <p>
              O [Percentual de Cobertura Vegetal (PCV)] é um valor calculado
              usando satélites que mede o quanto as áreas urbanas são cobertas
              por vegetação, inlcuindo árvores e gramíneas.Você sabia?Você sabia
              que essas métricas podem ajudar no plano diretor do seu municipio,
              criando metas e avaliando os resultados ao longo do tempo?
            </p>
          </v-card-text>

          <v-card-title>Você sabia ?</v-card-title>

          <v-card-text>
            <p>
              Você sabia que essas métricas podem ajudar no plano diretor do seu
              municipio, criando metas e avaliando os resultados ao longo do
              tempo?
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="4" md="4" class="d-flex">
        <v-card outlined>
          <v-container
            class="d-flex flex-column justify-space-between align-start"
          >
            <table id="line-chart" class="charts-css line multiple show-labels">
              <tbody>
                <tr>
                  <th scope="row">2016</th>
                  <td
                    :style="`--start: ${lineChartVegData[2016][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2017][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2016][0].b1 * 100).toFixed() }}
                    </span>
                  </td>

                  <td
                    v-if="setorDataForChart"
                    :style="`--start: ${setorDataForChart[2016][0].b1.toFixed(
                      2
                    )}; --size: ${setorDataForChart[2017][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (setorDataForChart[2016][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2017</th>
                  <td
                    :style="`--start: ${lineChartVegData[2017][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2018][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2017][0].b1 * 100).toFixed() }}</span
                    >
                  </td>

                  <td
                    v-if="setorDataForChart"
                    :style="`--start: ${setorDataForChart[2017][0].b1.toFixed(
                      2
                    )}; --size: ${setorDataForChart[2018][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (setorDataForChart[2017][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2018</th>
                  <td
                    :style="`--start: ${lineChartVegData[2018][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2019][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2018][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td
                    v-if="setorDataForChart"
                    :style="`--start: ${setorDataForChart[2018][0].b1.toFixed(
                      2
                    )}; --size: ${setorDataForChart[2019][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (setorDataForChart[2018][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2019</th>
                  <td
                    :style="`--start: ${lineChartVegData[2019][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2020][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2019][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td
                    v-if="setorDataForChart"
                    :style="`--start: ${setorDataForChart[2019][0].b1.toFixed(
                      2
                    )}; --size: ${setorDataForChart[2020][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (setorDataForChart[2019][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2020</th>
                  <td
                    :style="`--start: ${lineChartVegData[2020][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2020][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td
                    v-if="setorDataForChart"
                    :style="`--start: ${setorDataForChart[2020][0].b1.toFixed(
                      2
                    )}; --size: ${setorDataForChart[2021][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (setorDataForChart[2020][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2021</th>
                  <td
                    :style="`--start: ${lineChartVegData[2021][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2021][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td
                    v-if="setorDataForChart"
                    :style="`--start: ${setorDataForChart[2021][0].b1.toFixed(
                      2
                    )}; --size: ${setorDataForChart[2020][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (setorDataForChart[2021][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <v-card-title
              class="text-h6"
              style="color: #003c3c; font-size: 3em"
            >
              Evolução temporal do [PCV] (%) no setor clicado vs municipio
            </v-card-title>
            <v-card-actions>
              <v-btn text disabled class="text-p"
                >Saiba mais ...</v-btn
              ></v-card-actions
            >
          </v-container>
        </v-card></v-col
      >
      <v-col cols="4" md="4" class="d-flex">
        <v-card outlined>
          <v-container
            class="d-flex flex-column justify-space-between align-start"
          >
            <table id="line-chart" class="charts-css line multiple show-labels">
              <tbody>
                <tr>
                  <th scope="row">2016</th>
                  <td
                    :style="`--start: ${lineChartVegData[2016][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2017][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2016][0].b1 * 100).toFixed() }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2017</th>
                  <td
                    :style="`--start: ${lineChartVegData[2017][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2018][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2017][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                </tr>

                <tr>
                  <th scope="row">2018</th>
                  <td
                    :style="`--start: ${lineChartVegData[2018][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2019][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2018][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                </tr>

                <tr>
                  <th scope="row">2019</th>
                  <td
                    :style="`--start: ${lineChartVegData[2019][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2020][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2019][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                </tr>

                <tr>
                  <th scope="row">2020</th>
                  <td
                    :style="`--start: ${lineChartVegData[2020][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2020][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                </tr>
                <tr>
                  <th scope="row">2021</th>
                  <td
                    :style="`--start: ${lineChartVegData[2021][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2021][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>

            <v-card-title
              class="text-h6"
              style="color: #003c3c; font-size: 3em"
            >
              Evolução temporal do [PCV] (%) no município
            </v-card-title>

            <v-card-actions>
              <v-btn text disabled class="text-p"
                >Saiba mais ...</v-btn
              ></v-card-actions
            >
          </v-container>
        </v-card></v-col
      >

      <v-col cols="4" md="4" class="d-flex">
        <v-card outlined>
          <v-container
            class="d-flex flex-column justify-space-between align-start"
          >
            <table id="line-chart" class="charts-css line multiple show-labels">
              <tbody>
                <tr>
                  <th scope="row">2016</th>
                  <td
                    :style="`--start: ${lineChartVegData[2016][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2017][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2016][0].b1 * 100).toFixed() }}
                    </span>
                  </td>

                  <td style="--start: 20.1; --size: 23.2">
                    <span class="data">
                      {{ tstChartData[2016][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2017</th>
                  <td
                    :style="`--start: ${lineChartVegData[2017][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2018][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2017][0].b1 * 100).toFixed() }}</span
                    >
                  </td>

                  <td style="--start: 23.2; --size: 25">
                    <span class="data">
                      {{ tstChartData[2017][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2018</th>
                  <td
                    :style="`--start: ${lineChartVegData[2018][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2019][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2018][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td style="--start: 25; --size: 28">
                    <span class="data">
                      {{ tstChartData[2018][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2019</th>
                  <td
                    :style="`--start: ${lineChartVegData[2019][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2020][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2019][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td style="--start: 28; --size: 32">
                    <span class="data">
                      {{ tstChartData[2019][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <th scope="row">2020</th>
                  <td
                    :style="`--start: ${lineChartVegData[2020][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2020][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td
                    :style="`--start: ${tstChartData[2020][0].c2.toFixed(
                      1
                    )}; --size: ${tstChartData[2021][0].c2.toFixed(1)}`"
                  >
                    <span class="data">
                      {{ tstChartData[2020][0].c2.toFixed(1) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2021</th>
                  <td
                    :style="`--start: ${lineChartVegData[2021][0].b1.toFixed(
                      2
                    )}; --size: ${lineChartVegData[2021][0].b1.toFixed(2)}`"
                  >
                    <span class="data">
                      {{ (lineChartVegData[2021][0].b1 * 100).toFixed() }}</span
                    >
                  </td>
                  <td
                    :style="`--start: ${tstChartData[2021][0].c2.toFixed(
                      1
                    )}; --size: ${tstChartData[2020][0].c2.toFixed(1)}`"
                  >
                    <span class="data">
                      {{ tstChartData[2021][0].c2.toFixed() }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <v-card-title
              class="text-h6"
              style="color: #003c3c; font-size: 3em"
            >
              Evolução temporal do [PCV] (%) e [TMS] (ºC) no município
            </v-card-title>
            <v-card-actions>
              <v-btn text disabled class="text-p"
                >Saiba mais ...</v-btn
              ></v-card-actions
            >
          </v-container>
        </v-card></v-col
      >
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
</style>
