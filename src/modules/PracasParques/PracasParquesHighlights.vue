<template>
  <div>
    <v-row class="d-flex mx-auto w100-mobile" style="width: 80%">
      <v-col cols="12">
        <v-row class="d-flex flex-column">
          <span>VOCÊ ESTÁ VISUALIZANDO</span>
          <span style="font-size: 2em; color: #01dc82">Praças e Parques <span style="color: grey">de</span>
            {{ munPracaData.nm_mun }}
            <span style="color: grey">em</span>
             2023 
             <!-- {{this.$route.params.ano }} -->
          </span>
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
                  A posição do seu município em relação todos os entre {{munPracaData.n_rank_estado}} municípios do Estado de São Paulo
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Acesso população atendida pelas praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a1_rank_estado }} °
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">entre {{munPracaData.n_rank_estado}}</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>M² de praças por habitante</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a2_rank_estado }} °
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">entre {{munPracaData.n_rank_estado}}</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>% área ocupada pelos buffers</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a3_rank_estado }} °
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">entre {{munPracaData.n_rank_estado}}</p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Distribuição Espacial das Praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a4_rank_estado }} °
                      </p>
                    </v-col>
                    <v-col>
                      <p style="color: #01dc82; font-size: 0.9em">entre {{munPracaData.n_rank_estado}}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start"><v-card outlined
              class="d-flex flex-column justify-center" style="border-radius: 12px">
              <v-img src="@/assets/mesoreg.png"></v-img>
              <v-container class="d-flex flex-column justify-space-between align-start">
                <v-card-subtitle class="pa-0"><strong>Mesorregiões</strong></v-card-subtitle>
                <v-card-text class="pa-0 mb-2">A posição do seu município em relação aos {{munPracaData.n_rank_meso}} municípios 
                  vizinhos que juntos compõe a mesorregião de {{munPracaData.nm_meso}}
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Acesso população atendida pelas praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a1_rank_meso }} °
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>M² de praças por habitante</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col  style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a2_rank_meso }} °
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_meso }} 
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>% de área Ocupada pelos buffers</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col  style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a3_rank_meso }} ° 
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Distribuição Espacial das Praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col  style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a4_rank_meso }} °
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_meso }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start align-start">
            <v-card outlined class="d-flex flex-column justify-center" style="border-radius: 12px">
              <v-img src="@/assets/microreg.png"></v-img>
              <v-container class="d-flex flex-column justify-space-between align-start">
                <v-card-subtitle class="pa-0"><strong>Microrregiões</strong></v-card-subtitle>
                <v-card-text class="pa-0 mb-2">A posição do seu município em relação aos {{munPracaData.n_rank_micro}} municípios 
                  vizinhos que compõe juntos a microrregião de {{munPracaData.nm_micro}}
                </v-card-text>
                <v-card-text class="pa-0">
                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Acesso população atendida pelas praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a1_rank_micro }} °
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>M² de praças por habitante</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;"> 
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a2_rank_micro }} °
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>% área ocupada pelos buffers</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                        {{ munPracaData.a3_rank_micro }} °
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>

                  <p class="mb-0" style="font-size: 0.9em">
                    <strong>Distribuição Espacial das Praças</strong>
                  </p>
                  <v-row class="d-flex justify-center align-center">
                    <v-col style="padding-right: 0px;">
                      <p style="color: #01dc82; font-size: 2em">
                         {{ munPracaData.a4_rank_micro }} °
                      </p>
                    </v-col>
                    <v-col  style="padding-left: 0px;">
                      <p style="color: #01dc82; font-size: 0.9em">
                        entre {{ munPracaData.n_rank_micro }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-container>
            </v-card>
          </v-col>



          <!-- Highlights -->
          <v-col v-for="card in sortedCards" :key="card.title" cols="12" class="d-flex flex-column">
            <v-card width="100%" outlined class="d-flex flex-column justify-center">
              <v-card-title>
                <div class="text-h6">
                  {{ card.title }}
                  <!-- <span :style="{ color: card.isNegative ? 'red' : '#01dc82' }" style="font-size: 1em">
                    (<strong>{{ card.value }}%</strong>)
                  </span> -->
                </div>
              </v-card-title>
              <v-row class="d-flex">
                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Dentro da vizinhança das praças</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td class="" :style="`--size: calc(${card.b}); background-color: #01dc82;`">
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c">{{ (card.b * 100).toFixed(0) }}%</strong>
                  </div>
                </v-col>

                <v-col cols="6" class="d-flex flex-column">
                  <div class="d-flex flex-column justify-start">
                    <div class="d-flex flex-column justify-center align-start">
                      <span>Fora da vizinhança das praças</span>
                    </div>
                    <div>
                      <table class="charts-css bar mt-4" style="height: 50px">
                        <tbody>
                          <tr style="background-color: #f2ecff" class="d-flex">
                            <td class="" :style="`--size: calc(${card.a}); background-color: #01dc82;`">
                              <span class="data"> </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <strong style="color: #003c3c">{{ (card.a * 100) }}%</strong>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

        </v-row>
      </v-col>

      <v-col cols="12" md="4">
        <v-card width="100%" outlined class="mx-auto">
          <v-img cover width="100%" height="150px" src="@/assets/card-pracasparques.png"></v-img>

          <v-container>
            <v-card-text>
              <p>
                As praças e parques de um municipio atendem principalmente a
                <strong>populaçâo da vizinhança,</strong> definida pela OMS (Organização Mundial
                da Saúde) como um raio de 400m ao redor de cada praça.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn disabled class="">Saiba mais ...</v-btn></v-card-actions>
          </v-container>
        </v-card>

        <!-- <v-card width="100%" outlined class="mx-auto d-flex justify-center align-center mt-5">
          <div class="d-flex flex-column justify-center align-center">
            <chart :size="150" :valor="munPracaData.h5" />
            <v-card-title style="word-break:normal;text-align:center;">População Atendida </v-card-title>
            <span style="color: #01dc82; font-size: 3em"><strong>{{ munPracaData.h5 }} </strong> hab</span>
            <v-card-subtitle>Morando em um raio de 400m de pelo menos uma praça</v-card-subtitle>
          </div>
        </v-card> -->

        <v-card width="100%" outlined class="mx-auto d-flex mt-5 justify-center align-center">
          <div class="d-flex flex-column justify-center align-center">
            <v-card-title>Desigualdade de Renda</v-card-title>
            <span style="color: #01dc82; font-size: 3em"><strong>{{ munPracaData.h6 }}x</strong></span>
            <v-card-subtitle>A renda per capita média da população que vive na vizinhança das
              praças é <strong>{{ 100 * (munPracaData.h6 - 1).toFixed(2) }}% maior </strong> do que
              fora.</v-card-subtitle>
          </div>
        </v-card>

        <v-card width="100%" outlined class="mx-auto d-flex mt-5 justify-center align-center">
          <div class="d-flex flex-column justify-center align-center">
            <v-card-title>Racismo Ambiental</v-card-title>
            <!-- 00 * (this.munPracaData.h12b - this.munPracaData.h12a -->
            <span style="color: #01dc82; font-size: 3em"><strong>{{100*(munPracaData.h12b/munPracaData.h12a).toFixed(3) }}%</strong></span>
            <v-card-subtitle>Da população negra ou indígena vive <strong>fora da vizinhança das praças.</strong>
            </v-card-subtitle>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  computed: {
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021][0];
    },
    vCards() {
      return [
        {
          title: '% de idosos em relação ao total da população',
          value: (100 * (this.munPracaData.h9b - this.munPracaData.h9a)).toFixed(2),
          a: this.munPracaData.h9a.toFixed(2),
          b: this.munPracaData.h9b.toFixed(2)
        },
        {
          title: '% de crianças em relação ao total da população',
          value: (100 * (this.munPracaData.h10b - this.munPracaData.h10a)).toFixed(2),
          a: this.munPracaData.h10a.toFixed(2),
          b: this.munPracaData.h10b.toFixed(2)
        },
        {
          title: '% de mulheres chefes de família em relação ao total da população',
          value: (100 * (this.munPracaData.h11b - this.munPracaData.h11a)).toFixed(2),
          a: this.munPracaData.h11a.toFixed(2),
          b: this.munPracaData.h11b.toFixed(2)
        },
        {
          title: '% de negros ou indígenas em relação ao total da população',
          value: (100 * (this.munPracaData.h12b - this.munPracaData.h12a)).toFixed(2),
          a: this.munPracaData.h12a.toFixed(2),
          b: this.munPracaData.h12b.toFixed(2)
        },
      ];
    },
    sortedCards() {
      // Sort the v-cards based on the value inside the <strong>{{ ... }}</strong>
      return this.vCards.map(card => {
        return {
          ...card,
          isNegative: parseFloat(card.value) < 0,
          chartValue: parseFloat(card.value),
          chartColor: parseFloat(card.value) < 0 ? 'red' : '#01dc82'
        };
      }).sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
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

<style>

body {
  word-break: normal;
}
.negative-diff {
  color: red;
}
</style>
