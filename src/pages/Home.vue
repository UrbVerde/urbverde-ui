<template>
  <div class="homepage">
    <TawkTo />

    <!-- Navbar -->
    <header class="no-transform"
            data-aos="fade"
            data-aos-delay="100"
            data-aos-duration="400">
      <NavbarHomepage />
    </header>

    <main>
      <!-- Content -->
      <section class="content">

        <!-- Background fixo e atrás dos contents -->
        <div class="image-background-wrapper"
             data-aos="fade"
             data-aos-duration="750"
             data-aos-delay="300">
          <div class="image-background">
            <img src="@/assets/images/homepage/homepage-background.svg" alt="Paisagem natural com pessoas plantando árvores para um futuro sustentável" />
          </div>
        </div>

        <!-- Hero content -->
        <section class="hero-content container">
          <header class="hero-top"
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                  data-aos-delay="500">
            <div class="hero-text">
              <h1>
                <span class="h1-text heading-h1">Mapeando um Futuro </span>
                <transition name="fade" mode="out-in">
                  <span class="h1-lasttext heading-h1" :key="currentWord">{{ currentWord }}</span>
                </transition>
              </h1>
              <h4 class="subtitle body-normal-medium">
                Acesse dados sociais e ambientais completos de seu município,
                de forma totalmente gratuita!
              </h4>
            </div>
            <form class="search">
              <div class="search-button">
                <BuscaSimples @location-updated="onLocationUpdated" />
              </div>
              <router-link to="/mapa" class="button-primary-link">
                <PrimaryButton
                  label="Acessar"
                  :filled="true"
                  iconType="bootstrap"
                  icon="bi bi-arrow-right"
                  iconPosition="right"
                />
              </router-link>

            </form>
          </header>

          <section class="wrapper-platform">

            <!-- Imagem da plataforma -->
            <router-link
              to="/mapa"
              class="platform-link"
              aria-label="Acessar a plataforma da UrbVerde"
              data-aos="fade-up"
              data-aos-delay="1500"
              data-aos-duration="750"
            >
              <div
                class="platform"
                @mousemove="handleMouseMove"
                @mouseleave="resetZoom"
              >
                <div class="overlay"></div>
                <img
                  ref="zoomImage"
                  src="@/assets/images/homepage/platform.svg"
                  alt="Interface da plataforma UrbVerde exibindo dados ambientais"
                />
              </div>
            </router-link>

            <!-- Cards de comentários sobre a UrbVerde -->
            <div class="wrapper-cards">
              <article>
                <CardComments
                  quoteBeforeHighlight="Iniciativas como a UrbVerde [...] fornecem a esperança de que "
                  highlight="o mundo ainda tem jeito"
                  quoteAfterHighlight="."
                  :imageSrc="homepageImages.nalini.src"
                  :imageAlt="homepageImages.nalini.alt"
                  author="José Renato Nalini"
                  role="Secretário Executivo de São Paulo"
                />
              </article>
              <article>
                <CardComments
                  quoteBeforeHighlight="A UrbVerde foi desenvolvida para fornecer dados ao "
                  highlight="poder público e aos cidadãos"
                  quoteAfterHighlight="."
                  :imageSrc="homepageImages.juliana.src"
                  :imageAlt="homepageImages.juliana.alt"
                  author="Juliana Domingos de Lima"
                  role="Jornalista do Estadão"
                />
              </article>
              <article>
                <CardComments
                  quoteBeforeHighlight="É uma "
                  highlight="plataforma que caiu do céu"
                  quoteAfterHighlight=" [...] ajuda a ler a cidade de uma forma clara."
                  :imageSrc="homepageImages.marcela.src"
                  :imageAlt="homepageImages.marcela.alt"
                  author="Marcela Cury Petenusci"
                  role="Professora de Ribeirão Preto"
                />
              </article>
            </div>
          </section>
        </section>

        <!-- Institutes content-->
        <section class="institutes container">
          <header class="institutes-header">
            <h2 class="heading-h2">
              Da universidade para a sociedade
            </h2>
            <h4 class="body-normal-medium">
              A UrbVerde é fruto de uma colaboração entre diversas instituições públicas,
              por meio do financiamento do CNPq e do PPPP da FAPESP.
              <a href="#" class="body-normal-medium">
                Leia mais
                <i class="bi bi-arrow-up-right"></i>
              </a>
            </h4>
          </header>

          <div class="institutes-logo-carousel">
            <div class="logo-track">
              <!-- Primeira lista de logos -->
              <div class="logo-item" v-for="(logo, index) in logos" :key="`original-${index}`">
                <img :src="logo.src" :alt="logo.alt" loading="lazy" />
              </div>
              <!-- Segunda lista de logos para criar o loop contínuo -->
              <div class="logo-item" v-for="(logo, index) in logos" :key="`duplicate-${index}`">
                <img :src="logo.src" :alt="logo.alt" loading="lazy" />
              </div>
            </div>
          </div>

          <!-- Lista de prêmios -->
          <div>
            <HomeAwards :awards="awardsList" />
          </div>

        </section>
      </section>

      <!-- Products content -->
      <section class="products">
        <div class="title container">
          <h2 class="heading-h2">
            Ferramentas para uma gestão sustentável
          </h2>
        </div>

        <div class="products-content container">
          <div>
            <HomeProduct
              :imageBgSrc="homepageImages.productBg1.src"
              :imageBgAlt="homepageImages.productBg1.alt"
              :imageFrontSrc="homepageImages.productBg2.src"
              :imageFrontAlt="homepageImages.productBg2.alt"
              title="Mapas ambientais e sociais"
              description="Explore mapas detalhados sobre vegetação, temperatura, parques e praças para entender melhor a sua cidade!"
              buttonLabel="Acessar"
              :filled="false"
              :icon=" 'bi bi-arrow-right' "
              :iconType=" 'bootstrap' "
              buttonRoute="/mapa"
            />
          </div>
          <div>
            <HomeProduct
              :imageBgSrc="homepageImages.productBg3.src"
              :imageBgAlt="homepageImages.productBg3.alt"
              :imageFrontSrc="homepageImages.productBg4.src"
              :imageFrontAlt="homepageImages.productBg2.alt"
              title="Dados estatísticos completos"
              description="Descubra informações completas sobre seu município e compare com todo o Brasil!"
              buttonLabel="Acessar"
              :filled="false"
              :icon=" 'bi bi-arrow-right' "
              :iconType=" 'bootstrap' "
              buttonRoute="/mapa"
            />
          </div>
        </div>
      </section>

      <!-- Mission and Urbverde Educa content -->
      <section class="mission-educa container">
        <div class="mission">
          <div class="label-content">
            <p class="heading-h5">
              Nossa missão é gerar dados <strong>socioambientais acessíveis e gratuitos</strong>
              para todo o Brasil, para ajudar cidadãos e gestores a tomar
              decisões conscientes e enfrentar os desafios climáticos
            </p>
            <router-link to="/sobre" class="button-primary-link">
              <PrimaryButton
                label="Saiba quem somos"
                :filled="false"
                iconType="bootstrap"
                icon="bi bi-arrow-right"
                iconPosition="right"
              />
            </router-link>
          </div>
          <img src="@/assets/images/homepage/urbverde-mission.png">
        </div>
        <div class="educa">
          <div class="title">
            <h2 class="heading-h2">
              Explore mais tópicos no UrbVerde Educa
            </h2>
            <a
              href="https://urbverde-educa.tawk.help/"
              target="_blank"
              rel="noopener noreferrer"
              class="button-primary-link"
            >
              <PrimaryButton
                label="Explore todos os artigos"
                :filled="false"
                iconType="bootstrap"
                icon="bi bi-arrow-right"
                iconPosition="right"
              />
            </a>
          </div>
          <div class="educa-topics">

            <!--Link para Reportagens e notícias-->
            <a
              href="https://urbverde-educa.tawk.help/category/urbverde-nas-m%C3%ADdias"
              target="_blank"
              rel="noopener noreferrer"
            >
              <UrbVerdeEducaTopics
                :imageSrc="homepageImages.marcel.src"
                :imageAlt="homepageImages.marcel.alt"
                title="Reportagens e notícias"
              />
            </a>

            <!--Documentos-->
            <a
              href="https://urbverde-educa.tawk.help/category/documentos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <UrbVerdeEducaTopics
                :imageSrc="homepageImages.notebook.src"
                :imageAlt="homepageImages.notebook.alt"
                title="Documentos"
              />
            </a>

            <!--Métodologias-->
            <a
              href="https://urbverde-educa.tawk.help/category/categorias-e-camadas"
              target="_blank"
              rel="noopener noreferrer"
            >
              <UrbVerdeEducaTopics
                :imageSrc="homepageImages.edu.src"
                :imageAlt="homepageImages.edu.alt"
                title="Metodologias"
              />
            </a>

            <!--Principais dúvidas-->
            <a
              href="https://urbverde-educa.tawk.help/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <UrbVerdeEducaTopics
                :imageSrc="homepageImages.breno.src"
                :imageAlt="homepageImages.breno.alt"
                title="Principais dúvidas"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- CTA content -->
      <section>
        <HomeCta
          @location-updated="onLocationUpdated"
          :title="'Conheça mais sobre sua cidade!'"
          :buttonLabel="'Acessar'"
          :buttonRoute="'/mapa'"
          :filled="true"
        />
      </section>
    </main>

    <!-- Footer -->
    <footer>
      <UrbVerdeFooter />
    </footer>
  </div>
</template>

<script>
import NavbarHomepage from '@/components/navbar/NavbarHomepage.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';
import UrbVerdeEducaTopics from '@/components/homepage/UrbverdeEducaTopics.vue';
import UrbVerdeFooter from '@/components/homepage/UrbVerdeFooter.vue';
import TawkTo from '@/components/homepage/TawkTo.vue';
import CardComments from '@/components/homepage/CardComments.vue';
import HomeAwards from '@/components/homepage/HomeAwards.vue';
import HomeProduct from '@/components/homepage/HomeProduct.vue';
import HomeCta from '@/components/homepage/HomeCta.vue';

// Import para as imagens da página utilizados em componentes
import { logos, homepageImages } from '@/constants/images-homepage.js';

// Metas tags de SEO
import { useHead } from '@vueuse/head';

// Animate on Scroll Library
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  name: 'HomePage',
  components: {
    NavbarHomepage,
    PrimaryButton,
    BuscaSimples,
    UrbVerdeEducaTopics,
    UrbVerdeFooter,
    TawkTo,
    CardComments,
    HomeAwards,
    HomeProduct,
    HomeCta,
  },

  // Configuração das meta tags de SEO
  setup() {
    useHead({
      title: 'UrbVerde: Dados gratuitos para cidades mais verdes e sustentáveis',
      meta: [
        {
          name: 'description',
          content:
              'Conheça a UrbVerde, uma iniciativa dedicada a democratizar o acesso a dados ambientais e sociais gratuitos de todos os municípios brasileiros. Planeje cidades mais verdes e inclusivas com informações confiáveis.',
        },
        {
          name: 'keywords',
          content:
              'dados sociais gratuitos, dados ambientais, sustentabilidade, cidades verdes, planejamento urbano, smart cities, desenvolvimento sustentável, acesso gratuito, dados municipais, UrbVerde, página inicial',
        },
        {
          property: 'og:title',
          content: 'UrbVerde - Dados Sociais e Ambientais Gratuitos do seu Município',
        },
        {
          property: 'og:description',
          content:
              'Explore informações sociais e ambientais completas de municípios brasileiros com a UrbVerde, contribuindo para cidades mais resilientes e sustentáveis.',
        },
      ],
    });
  },

  data() {
    return {

      // Imagens retornando de images-homepage.js
      logos,
      homepageImages,

      rotatingWords: ['Inclusivo', 'Verde', 'Resiliente', 'Justo'], // Palavras para rotação
      currentWordIndex: 0,

      awardsList: [
        {
          year: '2024',
          title: 'Prêmio USP Impacto Social',
          subtitle: 'Cidades e Comunidades Sustentáveis',
        },
        {
          year: '2024',
          title: 'Prêmio Promoção de Justiça Climática',
          subtitle: 'Instituto de Arquitetos do Brasil - IAB',
        },
        {
          year: '2024',
          title: 'Excelência em Design',
          subtitle: 'Competição de Design, Simpósio IHC',
        },
      ],
    };
  },

  computed: {
    currentWord() {
      return this.rotatingWords[this.currentWordIndex];
    },
  },
  mounted() {
    this.startWordRotation();
    AOS.init({
      offset: 0,
      threshold: 0,
      once: false
    });
  },

  beforeUnmount() {
    clearInterval(this.wordRotationInterval);
  },

  methods: {
    onLocationUpdated() {
      return;
    },

    // Método para rotação das palavras
    startWordRotation() {
      this.wordRotationInterval = setInterval(() => {
        this.currentWordIndex = (this.currentWordIndex + 1) % this.rotatingWords.length;
      }, 4000); // Intervalo de 4 segundos
    },

    // Manipulação da imagem da plataforma
    handleMouseMove(event) {
      const image = this.$refs.zoomImage;
      const rect = image.getBoundingClientRect();

      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const centerX = (offsetX / rect.width - 0.5) * 5; // Calcula deslocamento X
      const centerY = (offsetY / rect.height - 0.5) * 5; // Calcula deslocamento Y
      image.style.transform = `scale(1.05) translate(${centerX}%, ${centerY}%)`; // Zoom dinâmico na imagem
    },

    resetZoom() {
      const image = this.$refs.zoomImage;
      image.style.transform = 'scale(1) translate(0, 0)';
    },
  },
};
</script>

  <style scoped lang="scss">
  a {
    text-decoration: none;
    border-radius: 4px;
  }

  p{
    padding: 0;
    margin: 0;
  }

  .no-transform[data-aos] {
    transform: none;
  }

  .homepage {
    position: relative;
    overflow-x: hidden;
    background-color: #FCFDFC;
  }

  .image-background-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: -1; // Imagem fica abaixo de todo o conteúdo da página
    overflow: hidden;
  }

  .image-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    top: -72px;
  }

  .content {
    position: relative;
    z-index: 1; // Conteúdo acima da imagem de fundo e abaixo do NavbarHomepage
  }

  .container {
    max-width: 1184px;
    margin: 0 auto;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 20vh;
    gap: 20vh;
  }

  .hero-top {
    display: flex;
    flex-direction: column;
    gap: 74px;
    align-items: center;
    justify-content: center;
  }

  .hero-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
    margin: 0;
  }

  .hero-text h1 {
    margin: 0;
    display: inline-block;
    white-space: nowrap;
  }

  .hero-text h4 {
    margin: 0;
  }

  .h1-text {
    color: map-get($primary-fade, 800);
    font-size: 48px;
    font-weight: 700;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  .fade-enter-from {
    transform: translateY(-20px);
    opacity: 0;
  }

  .fade-enter-to {
    transform: translateY(0);
    opacity: 1;
  }

  .fade-leave-from {
    transform: translateY(0);
    opacity: 1;
  }

  .fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }

  .h1-lasttext {
    display: inline-block;
    color: map-get($green, 500);
    font-size: 48px;
    font-weight: 700;
    width: 200px;
    text-align: left;
  }

  .subtitle {
    width: 520px;
    max-width: 100%;
    color: map-get($theme, secondary);
  }

  .search {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-direction: row;
  }

  .search .input-container{
    border-radius: 14px;
    background: map-get($gray, 100);
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);
  }

  .search .button-primary-link{
    margin: 0;
    padding: 0;
  }

  .search .button-primary-link .primary-button{
    width: 143px;
    height: 48px;
  }

  .wrapper-platform{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 80px;
    align-self: stretch;
  }

  // Imagem da plataforma e efeito sobre o mouse
  .platform-link {
    display: block;
    position: relative;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: none;
      background-color: transparent;
    }

    .platform {
      position: relative;
      display: block;
      overflow: hidden;
      border-radius: 32px;
      box-shadow:
        0px 0px 8px 1px #FFF inset,
        0px 67.187px 62.388px 0px rgba(0, 0, 0, 0.04),
        0px 0px 0px 0.96px rgba(0, 0, 0, 0.05),
        0px 28.795px 28.795px 0px rgba(0, 0, 0, 0.03),
        0px 14.397px 14.397px 0px rgba(0, 0, 0, 0.03),
        0px 9.598px 7.679px 0px rgba(0, 0, 0, 0.03),
        0px 3.839px 3.839px 0px rgba(0, 0, 0, 0.02),
        0px 1.92px 1.92px 0px rgba(0, 0, 0, 0.02);

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 32px;
        z-index: 2; // Overlay acima da imagem
        pointer-events: none;
      }

      &:hover .overlay {
        opacity: 1;
      }

      img {
        position: relative;
        z-index: 1;
        width: 100%;
        height: auto;
        display: block;
        border-radius: 32px;
        border: 1px solid map-get($gray, 300);
        background: map-get($gray, "white");
        transition: transform 0.2s ease-out;
        will-change: transform;
        object-fit: cover;
      }

      &:hover img {
        transform: scale(1.05);
        box-shadow:
          0px 4px 12px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .wrapper-cards{
    display: flex;
    align-items: center;
    gap: 24px;
    align-self: stretch;
    width: 100%;
    max-width: 1184px;
    margin: 0 auto;
    overflow: visible;
  }

  .institutes {
    display: flex;
    flex-direction: column;
    padding: 200px 0 184px 0;
    gap: 128px;
  }

  .institutes .institutes-header {
    display: flex;
    padding: 0px 128px;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    align-self: stretch;
    text-align: center;
  }

  .institutes .institutes-header h2{
    color: map-get($primary-fade, 800);
    font-family: Inter;
    font-size: 48px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    align-self: stretch;
    margin: 0;
  }

  .institutes .institutes-header h4{
    color: map-get($gray, 600);
    margin: 0;
  }

  .institutes .institutes-header a{
    color: map-get($green, 500);
    text-decoration-line: underline;
    text-underline-position: from-font;
  }

  .institutes .institutes-header a .bi{
    font-size: 14px;
  }

  // Animação das logos de instituições
  .institutes-logo-carousel {
    overflow: hidden;
    position: relative;
    margin: 0 24px;
  }

  .logo-track {
    display: flex;
    gap: 56px;
    width: max-content;
    animation: scroll-logos 60s linear infinite;
  }

  .logo-item {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-item img {
    max-width: 100%;
    max-height: 80px; // tamanho máximo das logos
    object-fit: contain;
  }

  @keyframes scroll-logos {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-50% - 30px)); // Move metade da largura da lista duplicada e 30px para corrigir
    }
  }

  .products{
    background-color: map-get($green, 600);
    display: flex;
    padding: 128px 128px 200px 128px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 120px;
    align-self: stretch;
  }

  .products .title{
    display: flex;
    max-width: 1184px;
    padding: 0px 128px;
    flex-direction: column;
    align-items: center;
    gap: 21px;
    align-self: center;
  }

  .products .title h2{
    color: map-get($gray, white);
    text-align: center;
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
  }

  .products .products-content{
    display: flex;
    max-width: 1184px;
    flex-direction: column;
    align-items: flex-start;
    gap: 120px;
    align-self: center;
  }

  .mission-educa{
    display: flex;
    padding: 128px 0px 90px 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 184px;
    align-self: stretch;
  }

  .mission-educa .button-primary-link{
    color: map-get($green, 600);
  }

  .mission-educa .mission{
    display: flex;
    flex-direction: row;
    padding: 0px 24px;
    align-items: center;
    gap: 40px;
    align-self: stretch;
    flex-wrap: wrap-reverse;
    justify-content: center;
  }

  .mission-educa .mission .label-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex: 1 0 0;
    color: map-get($primary-fade, 800);
    text-align: center;
  }

  .mission-educa .mission img{
    width: 421px;
    height: 259px;
    border-radius: 24px;
    border: 1px solid map-get($gray, 200);
    background: url(<path-to-image>) lightgray -160.678px -42.218px / 156.09% 117.148% no-repeat;
  }

  .educa{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 64px;
    align-self: stretch;
    width: 100%;
  }

  .educa .title{
    display: flex;
    align-items: flex-start;
    align-self: stretch;
    justify-content: space-between;
    width: 100%;
  }

  .educa .title h2{
    color: map-get($primary-fade, 800);
    margin: 0;
  }

  .educa .educa-topics{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    gap: 16px;
    align-self: stretch;
    overflow-x: auto;
    width: 100%;
  }
</style>
