<!-- urbverde-ui/src/pages/Home.vue -->
<template>
  <div class="homepage" role="document">
    <TawkTo />

    <!-- Navbar -->
    <header class="no-transform"
            role="banner"
            data-aos="fade"
            data-aos-delay="100"
            data-aos-duration="400">
      <NavbarHomepage />
    </header>

    <main>
      <!-- Content -->
      <div class="content">

        <!-- Background fixo e atrás dos contents -->
        <div class="image-background-wrapper"
             data-aos="fade"
             data-aos-duration="750"
             data-aos-delay="300">
          <figure class="image-background">
            <img src="@/assets/images/homepage/homepage-background.svg" alt="Paisagem natural com pessoas plantando árvores para um futuro sustentável" />
          </figure>
        </div>

        <!-- Hero section -->
        <section class="hero-content container" aria-labelledby="hero-title">
          <div class="hero-top"
               data-aos="zoom-in-up"
               data-aos-duration="1000"
               data-aos-delay="500">

            <div class="hero-text"
                 v-if="windowWidth >= 1026">
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

            <div class="hero-text"
                 v-else>
              <h1>
                <span class="h1-text heading-h1">Mapeando um Futuro</span>
                <transition name="fade" mode="out-in">
                  <span class="h1-lasttext heading-h1" :key="currentWord">{{ currentWord }}</span>
                </transition>
              </h1>
              <h4 class="subtitle body-normal-medium">
                Acesse dados sociais e ambientais completos de seu município,
                de forma totalmente gratuita!
              </h4>
            </div>

            <HomeSearch
              @location-updated="onLocationUpdated"
              buttonRoute="/mapa"
              buttonLabel="Acessar"
              :filled="true"
              iconType="bootstrap"
              icon="bi bi-arrow-right"
            />
          </div>

          <!-- Platform Preview -->
          <section class="wrapper-platform" aria-label="Prévia da plataforma">
            <router-link
              v-if="windowWidth >= 601"
              to="/mapa"
              class="platform-link"
              aria-label="Acessar a plataforma da UrbVerde"
              data-aos="fade-up"
              data-aos-delay="1500"
              data-aos-duration="750"
            >
              <figure
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
              </figure>
            </router-link>

            <!-- Mobile version -->
            <router-link
              v-else
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
                  src="@/assets/images/homepage/platform_small.svg"
                  alt="Interface da plataforma UrbVerde exibindo dados ambientais"
                />
              </div>
            </router-link>
          </section>
        </section>

        <!-- Testimonials -->
        <section class="block-cards" aria-label="Depoimentos">
          <div class="wrapper-cards">
            <article>
              <CardComments
                quoteBeforeHighlight="Iniciativas como a UrbVerde [...] fornecem a esperança de que "
                highlight="o mundo ainda tem jeito"
                quoteAfterHighlight="."
                :imageSrc="homepageImages.nalini.src"
                :imageAlt="homepageImages.nalini.alt"
                author="José Nalini"
                role="Secretário de São Paulo"
              />
            </article>
            <article>
              <CardComments
                quoteBeforeHighlight="A UrbVerde foi desenvolvida para fornecer dados ao "
                highlight="poder público e aos cidadãos"
                quoteAfterHighlight="."
                :imageSrc="homepageImages.juliana.src"
                :imageAlt="homepageImages.juliana.alt"
                author="Juliana de Lima"
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
                author="Marcela Petenusci"
                role="Professora de Ribeirão Preto"
              />
            </article>
          </div>
        </section>

        <!-- Institutions -->
        <section class="institutes container" aria-labelledby="institutes-title">
          <div class="institutes-header">
            <h2 class="heading-h2">
              Da universidade para a sociedade
            </h2>
            <h4 class="body-normal-medium">
              A UrbVerde é fruto de uma colaboração entre diversas instituições públicas,
              por meio do financiamento do CNPq e do PPPP da FAPESP.
              <router-link to="/sobre" class="read-more">
                Leia mais
                <i class="bi bi-arrow-up-right"></i>
              </router-link>

            </h4>
          </div>

          <!-- Logo Carousel -->
          <div class="institutes-logo-carousel" role="marquee">
            <div class="logo-track">
              <div class="logo-item" v-for="(logo, index) in logos" :key="`original-${index}`">
                <img :src="logo.src" :alt="logo.alt" loading="lazy" />
              </div>
              <!-- Duplicated logos for continuous scroll -->
              <div class="logo-item" v-for="(logo, index) in logos" :key="`duplicate-${index}`">
                <img :src="logo.src" :alt="logo.alt" loading="lazy" />
              </div>
            </div>
          </div>

          <!-- Awards -->
          <section class="award-wrapper">
            <HomeAwards :awards="awardsList" />
          </section>
        </section>
      </div>

      <!-- Products Section -->
      <section class="products" aria-labelledby="products-title">
        <div class="title-image">
          <figure class="world-image">
            <img
              src="@/assets/images/homepage/product-world.png"
              alt="Imagem do planeta terra">
            <img src="@/assets/images/homepage/product-satellite.png" alt="Imagem de um satélite que fica em volta do planeta terra">
          </figure>
          <div class="title container">
            <h2 class="heading-h2">
              Ferramentas para uma gestão inteligente
            </h2>
            <h4 class="heading-h4">
              Por meio de imagens de satélite, fornecemos informações que ajudam sua cidade a enfrentar os desafios climáticos
            </h4>
          </div>
        </div>

        <!-- Decorative elements -->
        <span class="effect" role="presentation"></span>
        <img src="@/assets/images/homepage/product-effect-star.svg" class="star" alt="Fundo de estrelas">
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

      <!-- Mission and Education -->
      <section class="mission-educa container">
        <div class="mission">
          <div class="label-content">
            <p class="heading-h5">
              Nossa missão é gerar dados <strong>socioambientais acessíveis e gratuitos</strong>
              para todo o Brasil, para ajudar cidadãos e gestores a tomar
              decisões conscientes e enfrentar os desafios climáticos
            </p>
            <router-link to="" class="button-primary-link">
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
        <div class="educa"
             v-if="windowWidth >= 600"
        >
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
                label="Explorar artigos"
                :filled="false"
                iconType="bootstrap"
                icon="bi bi-arrow-right"
                iconPosition="right"
              />
            </a>
          </div>
          <div class="educa-topics">

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

        <div class="educa"
             v-else
        >
          <div class="title">
            <h2 class="heading-h2">
              Explore mais tópicos no UrbVerde Educa
            </h2>
          </div>
          <div class="topics-button-wrapper">
            <div class="educa-topics">

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
            <a
              href="https://urbverde-educa.tawk.help/"
              target="_blank"
              rel="noopener noreferrer"
              class="button-primary-link"
            >
              <PrimaryButton
                label="Explorar artigos"
                :filled="false"
                iconType="bootstrap"
                icon="bi bi-arrow-right"
                iconPosition="right"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section aria-label="Chamada para ação">
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
    <footer role="contentinfo">
      <UrbVerdeFooter />
    </footer>
  </div>
</template>

<script>
import NavbarHomepage from '@/components/navbar/NavbarHomepage.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import UrbVerdeEducaTopics from '@/components/homepage/UrbverdeEducaTopics.vue';
import UrbVerdeFooter from '@/components/homepage/UrbVerdeFooter.vue';
import TawkTo from '@/components/homepage/TawkTo.vue';
import CardComments from '@/components/homepage/CardComments.vue';
import HomeAwards from '@/components/homepage/HomeAwards.vue';
import HomeProduct from '@/components/homepage/HomeProduct.vue';
import HomeSearch from '@/components/homepage/HomeSearch.vue';
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
    UrbVerdeEducaTopics,
    UrbVerdeFooter,
    TawkTo,
    CardComments,
    HomeAwards,
    HomeProduct,
    HomeSearch,
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
      windowWidth: window.innerWidth,

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

    window.addEventListener('resize', this.updateWindowWidth);
  },

  beforeUnmount() {
    clearInterval(this.wordRotationInterval);

    window.removeEventListener('resize', this.updateWindowWidth);
  },

  methods: {
    onLocationUpdated() {
      return;
    },

    // Método para atualizar a largura da janela
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
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
  @import '@/assets/styles/breakpoints.scss';

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

    ::-webkit-scrollbar{
      height: 6px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: map-get($primary-fade, 400);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-track {
      background-color: map-get($primary-fade, 100);
      border-radius: 4px;
    }
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
    padding: 20vh 0 0 0;
    gap: 20vh;
  }

  .hero-top {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 72px;
    align-items: center;
    justify-content: center;
  }

  .hero-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
    margin: 0;
  }

  .hero-text h1 {
    width: 100%;
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

  .wrapper-platform{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 80px;
    align-self: stretch;

    position: relative;
    z-index: -1;
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

  .block-cards {
    width: 100%;
    margin: 0 auto;
    overflow: visible;
    position: relative;
  }

  .wrapper-cards {
    display: flex;
    gap: 24px;
    align-self: stretch;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    overflow: visible;
    overflow-x: auto;
    padding: 80px 16px 24px 16px;
    scroll-behavior: smooth;
  }

  .wrapper-cards::-webkit-scrollbar {
    display: none;
  }

  .institutes {
    display: flex;
    flex-direction: column;
    padding: 176px 0 184px 0;
    gap: 128px;
  }

  .institutes .institutes-header {
    display: flex;
    max-width: 928px;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    align-self: stretch;
    text-align: center;
    margin: auto;
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

  .institutes .institutes-header .read-more{
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
    margin: 0;
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
    background-color: map-get($green, 700);
    display: flex;
    padding: 128px 128px 240px 128px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 176px;
    align-self: stretch;
    position: relative;
    overflow: hidden;
  }

  .products .effect {
    width: 812px;
    height: 688px;
    display: block;
    background: radial-gradient(30.23% 28.09% at 72.7% 28.29%, rgba(11, 201, 134, 0.85) 0%, rgba(60, 255, 0, 0.59) 100%);
    filter: blur(200px);
    transform: rotate(-28deg);
    position: absolute;
    margin: auto;
    top: -480px;
    z-index: 1;
  }

  .products .star {
    position: absolute;
    z-index: 1;
    top: -140px;
    width: 826px;
    height: 517px;
    margin: auto;
  }

  .products .title-image{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 64px;
    align-self: stretch;
    position: relative;
    z-index: 2;
  }

  .products .title-image .world-image {
    position: relative;
    display: flex;
    height: auto;
    filter: drop-shadow(0px 16px 48px rgba(0, 0, 0, 0.5));
    z-index: 2;

    .img{
      background-color: #fff;
    }

    img:first-child {
      -webkit-mask-image: url('@/assets/images/homepage/product-world.png'); /* Certifique-se do caminho correto */
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-image: url('@/assets/images/homepage/product-world.png');
      mask-size: contain;
      mask-repeat: no-repeat;
      background-color: transparent;
      position: relative;
      height: 120px;
      width: 120px;
    }

    img:last-child {
      -webkit-mask-image: url('@/assets/images/homepage/product-satellite.png'); /* Certifique-se do caminho correto */
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-image: url('@/assets/images/homepage/product-satellite.png');
      mask-size: contain;
      mask-repeat: no-repeat;
      background-color: transparent;
      position: absolute;
      right: -37px;
      top: -37px;
      height: 48px;
      width: 48px;
    }
  }

  .products .title{
    display: flex;
    max-width: 1184px;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    align-self: center;
    padding: 0;
  }

  .products .title h2{
    color: map-get($gray, white);
    text-align: center;
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    margin: 0;
  }

  .products .title h4{
    color: map-get($gray, white);
    opacity: 80%;
    text-align: center;
    font-style: normal;
    margin: 0;
  }

  .products .products-content{
    display: flex;
    max-width: 1184px;
    flex-direction: column;
    align-items: center;
    gap: 160px;
    align-self: center;
    padding: 0;
  }

  .mission-educa{
    display: flex;
    padding: 104px 0px 90px 0px;
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
    padding-bottom: 24px;
  }

  @include breakpoint-down('desktop-small') {
    .h1-text {
      font-size: 40px;
    }

    .h1-lasttext{
      font-size: 40px;
    }

    .hero-content {
      padding: 20vh 64px 0 64px;
      gap: 20vh;
    }

    .wrapper-cards {
      max-width: 1200px;
      padding: 80px 80px 24px 80px;
    }

    .institutes {
      padding: 152px 0 176px 0;
      gap: 120px;
    }

    .institutes .institutes-header h2{
      margin: 0 64px;
      font-size: 40px;
    }

    .institutes .institutes-header h4{
      margin: 0 64px;
    }

    .products{
      padding: 120px 64px 200px 64px;
      gap: 160px;
    }

    .products .title h4{
      font-size: 20px;
    }

    .products .products-content{
      gap: 152px;
    }

    .products .title h2{
      font-size: 40px;
    }

    .products .title-image .world-image {

      img:first-child {
        height: 112px;
        width: 112px;
      }

      img:last-child {
        right: -34px;
        top: -34px;
        height: 44px;
        width: 44px;
      }
    }

    .products .effect {
      width: 730px;
      height: 620px;
      top: -440px;
    }

    .products .star {
      width: 743px;
      height: 465px;
      top: -137px;
    }

    .mission-educa {
      padding: 128px 64px 88px 64px;
    }

    .mission-educa .educa .educa-topics{
      overflow-x: auto;
      scroll-behavior: smooth;
    }

  }

  // Specific media
  @media screen and (max-width: 1200px) {
    .wrapper-cards {
      max-width: 1184px;
      padding: 80px 64px 24px 64px;
    }
  }

  @include breakpoint-down('tablet') {

    .h1-text {
      font-size: 40px;
    }

    .h1-lasttext{
      font-size: 40px;
    }

    .wrapper-cards {
      max-width: 1184px;
      padding: 80px 40px 24px 40px;
    }

    .hero-content {
      padding: 18vh 40px 0 40px;
      gap: 18vh;
    }

    .institutes {
      padding: 128px 0 152px 0;
      gap: 96px;
    }

    .institutes .institutes-header h2{
      margin: 0 40px;
      font-size: 36px;
    }

    .institutes .institutes-header h4{
      margin: 0 40px;
      font-size: 14px;
    }

    .institutes .award-wrapper{
      display: none;
    }

    .h1-lasttext {
      display: block;
      text-align: center;
      width: 100%;
    }

    .hero-text h1 {
      width: 100%;
      margin: auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      white-space: wrap;
    }

    .products{
      padding: 112px 40px 176px 40px;
      gap: 144px;
    }

    .products .products-content{
      gap: 136px;
    }

    .products .title h2{
      font-size: 36px;
    }

    .products .title h4{
      font-size: 18px;
    }

    .products .title-image .world-image {

      img:first-child {
        height: 100px;
        width: 100px;
      }

      img:last-child {
        right: -28px;
        top: -28px;
        height: 38px;
        width: 38px;
      }
    }

    .products .effect {
      width: 592px;
      height: 502px;
      top: -341px;
    }

    .products .star {
      width: 670px;
      height: 418px;
      top: -124px;
    }

    .mission-educa {
      padding: 104px 0px;
      gap: 120px;
    }

    .mission-educa .mission{
      padding: 0px 64px;
      gap: 56px;
    }

    .mission-educa .mission img{
      width: 345px;
      height: 212px;
    }

    .mission-educa .educa .title{
      padding: 0 40px;
      align-items: center;
      gap: 16px;
    }

    .mission-educa .educa .educa-topics{
      padding: 0 40px 0 40px;
      scroll-behavior: smooth;
    }

    .mission-educa .educa button.primary-button {
      width: 184px;
    }

    .mission-educa .educa .educa-topics::-webkit-scrollbar {
      display: none;
    }

  }

  @include breakpoint-down('mobile-large') {
    .hero-content {
      padding: 15vh 24px 0 24px;
      gap: 15vh;
    }

    .wrapper-platform {
      justify-content: flex-start;
      align-items: flex-start;
    }

    .platform-link .platform img {
      width: 700px;
      height: 500px;
      object-position: top left;
    }

    .wrapper-cards {
      max-width: 1184px;
      padding: 48px 24px 24px 24px;
    }

    .institutes {
      padding: 128px 0 152px 0;
      gap: 80px;
    }

    .institutes .institutes-header h2{
      margin: 0 24px;
      font-size: 32px;
    }

    .institutes .institutes-header h4{
      margin: 0 24px;
    }

    .products{
      padding: 104px 24px 160px 24px;
      gap: 128px;
    }

    .products .products-content{
      gap: 120px;
    }

    .products .title h2{
      font-size: 32px;
    }

    .products .title h4{
      font-size: 16px;
    }

    .products .title-image .world-image {

      img:first-child {
        height: 87px;
        width: 87px;
      }

      img:last-child {
        right: -25px;
        top: -25px;
        height: 32px;
        width: 32px;
      }
    }

    .products .effect {
      width: 533px;
      height: 451px;
      top: -304px;
    }

    .products .star {
      width: 600px;
      height: 376px;
      top: -105px;
    }

    .mission-educa .mission{
      padding: 0px 32px;
      gap: 56px;
    }

    .mission-educa .educa .title{
      padding: 0 24px;
    }

    .mission-educa .educa .educa-topics{
      padding: 0 24px 0 24px;
    }

    .mission-educa .educa{
      justify-content: center;
      align-items: center;
      gap: 56px;
    }

    .mission-educa .mission img{
      width: 100%;
      height: auto;
    }

    .mission-educa .educa .topics-button-wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
      align-self: stretch;
    }

    .mission-educa .educa .title h2{
      font-size: 32px;
      text-align: center;
    }

  }

  @include breakpoint-down('mobile-medium') {

    .wrapper-cards {
      max-width: 1184px;
      padding: 48px 24px 24px 24px;
    }

    .hero-content {
      padding: 13vh 24px 0 24px;
      gap: 13vh;
    }

    .hero-top{
      gap: 64px;
    }

    .institutes {
      padding: 88px 0 112px 0;
      gap: 72px;
    }

    .products{
      padding: 96px 24px 144px 24px;
      gap: 120px;
    }

    .products .products-content{
      gap: 112px;
    }

    .products .title h2{
      font-size: 32px;
    }

    .products .title h4{
      font-size: 14px;
    }

    .products .title-image .world-image {

      img:first-child {
        height: 80px;
        width: 80px;
      }

      img:last-child {
        right: -22px;
        top: -22px;
        height: 28px;
        width: 28px;
      }
    }

    .products .effect {
      width: 533px;
      height: 451px;
      top: -310px;
    }

    .products .star {
      width: 600px;
      height: 376px;
      top: -92px;
    }

    .mission-educa .educa .title h2{
      font-size: 24px;
      text-align: center;
    }

  }

  @include breakpoint-down('mobile-small') {

    .h1-text {
      font-size: 36px;
    }

    .h1-lasttext{
      font-size: 36px;
    }

    .subtitle{
      font-size: 14px;
    }

    .hero-top{
      gap: 40px;
    }

    .hero-content {
      padding: 13vh 24px 0 24px;
      gap: 13vh;
    }
  }

</style>
