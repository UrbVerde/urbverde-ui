<!-- Template da Página de Contato-->

<template>
  <div class="home__box">

    <!-- Imagem de Fundo com efeito Explodindo -->
    <div class="bg" :style="{ backgroundSize: bgSize, backgroundPosition: bgPosition }"></div>

    <!-- NavBar -->
    <HeaderHome />

    <!-- Conteúdo -->
    <main>

      <!-- Frase de Abertura -->
      <section class="main__box">
        <div class="container">
          <h2 class="pb-1 pt-1 align-start">
            Como podemos ajudar você <br> a entender melhor seu município?
          </h2>
        </div>
      </section>

      <!-- Formulario -->
      <section class="map_section_home" style="padding-bottom:0;">
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
                    <p>Butantã, São Paulo - SP </p>
                    <p>Email:
                      <a style="color:#003C3C" href="mailto:comunica.urbverde@usp.br">
                        comunica.urbverde@usp.br </a>

                      <button @click="copyToClipboard($event, 'comunica.urbverde@usp.br')" :class="{ 'copied': copied }">
                        <span v-if="!copied" class="mdi mdi-content-copy "></span>
                        <span v-if="copied" class="mdi mdi-check-circle"></span>
                        <span :class="{ 'fade-out': copied }" class="small-text">{{ buttonText }}</span>
                      </button>

                    </p>

                  <!-- <p> Whatsapp:
                      <a style="color:#003C3C"
                        href="https://web.whatsapp.com/send?phone=5511916709802&text=Ol%C3%A1%2C%20estou%20entrando%20atrav%C3%A9s%20do%20portal%20UrbVerde.%0A%28https%3A%2F%2Furbverde.iau.usp.br%29">
                        +55 11 91670-9802
                      </a>

                      <button id="copy-button" @click="copyToClipboard">
                        <span v-if="!copied" class="mdi mdi-content-copy"></span>
                        <span v-if="copied" class="mdi mdi-check-circle"></span>
                        <span>{{ buttonText }}</span>
                                  </button>
                                </p> -->
                    <v-btn color="#003C3C" class="pa-3"
                      href="https://web.whatsapp.com/send?phone=5511916709802&text=Bom dia, "
                      target="_blank">
                      <p class="mb-0 white--text">Whatsapp</p>
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <p>Fale Conosco</p>
                    <v-form ref="form" v-model="valid">
                      <v-text-field v-model="Nome" label="Nome"></v-text-field>

                      <!-- <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field> -->

                      <v-text-field v-model="assunto" label="Assunto"></v-text-field>

                      <v-text-field v-model="mensagem" label="Mensagem"></v-text-field>

                      <v-btn color="#003C3C" class="white--text" :href="`mailto:comunica.urbverde@usp.br?subject=${assunto + '---' + Nome + '---' + email
                        }&body=${mensagem}`">
                        Enviar
                      </v-btn>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <section style="background-color: #e6f1f2; padding-top:0; padding-bottom: 0">
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
  name: "HomeView",
  components: { VueMapbox },
  data() {
    return {
      copied: false,
      buttonText: "Copiar",
      emailAddress: "comunica.urbverde@usp.br",
      scrollY: 0,
      valid: true,
      Nome: "",
      mensagem: "",
      assunto: "",
      NomeRules: [(v) => !!v || "Nome é obrigatório"],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
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
    // munVegData() {
    //   return this.$store.getters.getMunVegData[this.$route.params.ano][0];
    // },
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    handleScroll() {
      this.scrollY = window.scrollY;
    },
copyToClipboard(event, textToCopy) {
  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  this.copied = true;
  this.buttonText = "Copiado!";

  setTimeout(() => {
    this.buttonText = "";
    setTimeout(() => {
      this.copied = false;
    }, 100); // Wait for the fade-out transition to complete
  }, 2000);

  event.target.addEventListener("mouseover", () => {
    this.copied = false;
  });
}


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
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css');

.small-text {
  font-size: 13px;
  // align-items: center;
  align-self: bottom;
}

button .fade-out {
  opacity: 0;
  transition: opacity 0.5s ease-out 1.5s; /* Delayed fade-out */
}

button .mdi {
  margin-right: 4px;
  margin-left: 5px;
  // font-size: 15px;
}

a {
  text-decoration: none;
  color: #e6f1f2;
  // -webkit-filter: drop-shadow(5px 5px 7px rgba(0, 0, 0, 0.6));
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
  left: 0;
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
  padding-bottom: 14em;

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

// .home__box {
//   &_header {
//     padding: 1em;
//     background-color: #003c3c;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }
// }

.map_section_home {
  position: relative;
  background-color: #e6f1f2;
  padding-top: 2em;
  // padding-bottom: 1em;
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

header {
  padding: 2em 6em;
  font-size: 1.0em;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flower-card {
  width: 290px;
  height: 290px;
}

.wrap-map {
  position: relative;
  height: 205px;
  top: -220px;
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

.form__contact {
  padding: 4em;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-top: -3.5em;
  padding-bottom: 1em;
}
</style>
