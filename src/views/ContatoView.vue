<template>
  <div class="home__box">
    <header class="row home__box_header">
      <v-col cols="6" md="4" class="d-flex justify-center align-center">
        <router-link tag="a" :to="{ name: 'Home' }">URBVERDE </router-link>
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
            Como podemos ajudar você a entender melhor seu município?
          </h2>
        </div>
      </section>

      <section class="map_section_home">
        <div class="container">
          <div class="wrap-map">
            <div class="map mx-auto">
              <v-card outlined color="#D9D9D9" class="form__contact">
                <v-row>
                  <v-col cols="6">
                    <p>
                      A equipe Urbverde está aberta para responder perguntas,
                      sugestões e críticas sobre a ferramenta.
                    </p>
                    <p>Av. Prof. Lineu Prestes, 338</p>
                    <p>Butantã, São Paulo - SP, +55 12 0000-0000</p>
                    <p>comunica.urbverde@usp.br</p>
                    <v-btn color="#003C3C" class="pa-3"
                      ><p class="mb-0 white--text">Chame no Whatsapp</p>
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <p>Fale Conosco</p>
                    <v-form ref="form" v-model="valid">
                      <v-text-field
                        v-model="Nome"
                        :rules="NomeRules"
                        label="Nome"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="assunto"
                        :rules="assuntoRules"
                        label="Assunto"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="telefone"
                        :rules="telefoneRules"
                        label="Telefone"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="Mensagem"
                        label="Mensagem"
                        required
                      ></v-text-field>

                      <v-btn
                        :disabled="!valid"
                        color="success"
                        class="mr-4"
                        @click="validate"
                      >
                        Submeter
                      </v-btn>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>
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
                <SearchMun />
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
      valid: true,
      Nome: "",
      mensagem: "",
      NomeRules: [(v) => !!v || "Nome é obrigatório"],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
      ],
    };
  },
  computed: {
    munVegData() {
      return this.$store.getters.getMunVegData[this.$route.params.ano][0];
    },
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
  },
  async created() {},
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
    max-width: 50%;
  }
  h4 {
    font-size: 1.5em;
    padding-bottom: 1em;
  }
}

.footerCard {
  border-color: #d0e3e3 !important;
}

.form__contact {
  padding: 4em;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-top: -4em;
}
</style>
