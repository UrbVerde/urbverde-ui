<template>
  <div class="homepage">
    <!-- Navbar -->
    <NavbarHomepage />

    <!-- Content -->
    <div class="content">

      <!-- Background fixo e atrás dos contents -->
      <div class="image-background">
        <img src="@/assets/images/homepage/homepage-background.png" alt="Paisagem natural com pessoas plantando árvores para um futuro sustentável" />
      </div>

      <!-- Hero content -->
      <section class="hero-content container">
        <div class="hero-top">
          <div class="hero-text">
            <h1>
              <span class="h1-text">Mapeando um Futuro </span>
              <transition name="fade" mode="out-in">
                <span class="h1-lasttext" :key="currentWord">{{ currentWord }}</span>
              </transition>
            </h1>
            <h4 class="subtitle normal-medium">
              Acesse dados sociais e ambientais completos de seu município,
              de forma totalmente gratuita!
            </h4>
          </div>
          <div class="search">
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

          </div>
        </div>

        <div class="wrapper-platform">

          <!-- Imagem da plataforma -->
          <router-link to="/mapa" class="platform-link" aria-label="Acessar a plataforma da UrbVerde">
            <div
              class="platform"
              @mousemove="handleMouseMove"
              @mouseleave="resetZoom"
            >
              <div class="overlay"></div>
              <img src="@/assets/images/homepage/platform.png" alt="Interface da plataforma UrbVerde exibindo dados ambientais" ref="zoomImage" />
            </div>
          </router-link>

          <!-- Cards de comentários sobre a UrbVerde -->
          <div class="wrapper-cards">

            <div class="cards shadow-lg">
              <div class="top-content small-regular">
                <p>“ Iniciativas como a UrbVerde [...] fornecem a esperança de que
                  <span class="highlight small-bold">o mundo ainda tem jeito</span>. ”</p>
              </div>
              <div class="bottom-content">
                <div>
                  <img src="@\assets\images\homepage\image-card-1.png" alt="Foto de José Renato Nalini, Secretário Executivo de São Paulo" loading="lazy">
                </div>
                <div class="wrapper-bottom-content">
                  <h3 class="title small-bold">
                    José Renato Nalini
                  </h3>
                  <h4 class="subtitle small-regular">
                    Secretário Executivo de São Paulo
                  </h4>
                </div>
              </div>
            </div>

            <div class="cards shadow-lg">
              <div class="top-content small-regular">
                <p>“ A UrbVerde foi desenvolvida para fornecer dados ao
                  <span class="highlight small-bold">poder público e aos cidadãos</span>. ” </p>
              </div>
              <div class="bottom-content">
                <div>
                  <img src="@\assets\images\homepage\image-card-2.png" alt="Foto de Juliana Domingos de Lima, Jornalista do Estadão" loading="lazy">
                </div>
                <div class="wrapper-bottom-content">
                  <h3 class="title small-bold">
                    Juliana Domingos de Lima
                  </h3>
                  <h4 class="subtitle small-regular">
                    Jornalista do Estadão
                  </h4>
                </div>
              </div>
            </div>

            <div class="cards shadow-lg">
              <div class="top-content small-regular">
                <p>“ É uma
                  <span class="highlight small-bold">plataforma que caiu do céu.</span>
                  […] ajuda a ler a cidade de uma forma clara. ”</p>
              </div>
              <div class="bottom-content">
                <div>
                  <img src="@\assets\images\homepage\image-card-3.png" alt="Foto de Marcela Cury Petenusci, Professora de Ribeirão Preto" loading="lazy">
                </div>
                <div class="wrapper-bottom-content">
                  <h3 class="title small-bold">
                    Marcela Cury Petenusci
                  </h3>
                  <h4 class="subtitle small-regular">
                    Professora de Ribeirão Preto
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Institutes content-->
      <div class="institutes container">

        <div class="institutes-header">
          <h2>
            Da universidade para a sociedade
          </h2>
          <h4 class="normal-medium">
            A UrbVerde é fruto de uma colaboração entre diversas instituições públicas,
            por meio do financiamento do CNPq e do PPPP da FAPESP.
            <a href="#" class="normal-medium">
              Leia mais
              <i class="bi bi-arrow-up-right"></i>
            </a>
          </h4>
        </div>

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

        <div class="institutes-awards">

          <div class="award">
            <img src="@/assets/images/awards-1.png" alt="Imagem de folha de premiação da UrbVerde" loading="lazy">
            <div class="award-label">
              <h5>
                2024
              </h5>
              <div class="award-label-text">
                <p class="caption-bold">
                  Prêmio USP Impacto Social
                </p>
                <p class="caption-medium">
                  Cidades e Comunidades Sustentáveis
                </p>
              </div>
            </div>
            <img src="@/assets/images/awards-2.png" alt="Imagem de folha de premiação da UrbVerde" loading="lazy">
          </div>

          <div class="award">
            <img src="@/assets/images/awards-1.png" alt="Imagem de folha de premiação da UrbVerde" loading="lazy">
            <div class="award-label">
              <h5>
                2024
              </h5>
              <div class="award-label-text">
                <p class="caption-bold">
                  Prêmio Promoção de Justiça Climática
                </p>
                <p class="caption-medium">
                  Instituto de Arquitetos do Brasil - IAB
                </p>
              </div>
            </div>
            <img src="@/assets/images/awards-2.png" alt="Imagem de folha de premiação da UrbVerde" loading="lazy">
          </div>

          <div class="award">
            <img src="@/assets/images/awards-1.png" alt="Imagem de folha de premiação da UrbVerde" loading="lazy">
            <div class="award-label">
              <h5>
                2024
              </h5>
              <div class="award-label-text">
                <p class="caption-bold">
                  Excelência em Design
                </p>
                <p class="caption-medium">
                  Competição de Design, Simpósio IHC
                </p>
              </div>
            </div>
            <img src="@/assets/images/awards-2.png" alt="Imagem de folha de premiação da UrbVerde" loading="lazy">
          </div>

        </div>

      </div>

      <!-- Products content-->
      <div class="products">
        <div class="title container">
          <h2>Ferramentas para uma gestão sustentável</h2>
        </div>
        <div class="products-content container">
          <div class="product">
            <div class="image-wrapper">
              <img src="@/assets/images/homepage/product-bg-1.png" class="image-bg">
              <img src="@/assets/images/homepage/product-bg-2.png" class="image-front"> 
            </div>
            <div class="product-text">
              <div class="title">
                <h3 class="heading-h2">
                  Mapas ambientais e sociais
                </h3>
                <h4 class="normal-regular">
                  Explore mapas detalhados sobre vegetação, temperatura, parques e praças para entender melhor a sua cidade!
                </h4>
              </div>
              <router-link to="/mapa" class="button-primary-link">
              <PrimaryButton
                label="Acessar"
                :filled="false"
                iconType="bootstrap"
                icon="bi bi-arrow-right"
                iconPosition="right"
                />
              </router-link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// Importação de componentes
import NavbarHomepage from '@/components/navbar/NavbarHomepage.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';

// Importação das logos
import logo1 from '@/assets/images/homepage/institutes-logo/logo-01.png';
import logo2 from '@/assets/images/homepage/institutes-logo/logo-02.png';
import logo3 from '@/assets/images/homepage/institutes-logo/logo-03.png';
import logo4 from '@/assets/images/homepage/institutes-logo/logo-04.png';
import logo5 from '@/assets/images/homepage/institutes-logo/logo-05.png';
import logo6 from '@/assets/images/homepage/institutes-logo/logo-06.png';
import logo7 from '@/assets/images/homepage/institutes-logo/logo-07.png';
import logo8 from '@/assets/images/homepage/institutes-logo/logo-08.png';
import logo9 from '@/assets/images/homepage/institutes-logo/logo-09.png';
import logo10 from '@/assets/images/homepage/institutes-logo/logo-10.png';
import logo11 from '@/assets/images/homepage/institutes-logo/logo-11.png';
import logo12 from '@/assets/images/homepage/institutes-logo/logo-12.png';
import logo13 from '@/assets/images/homepage/institutes-logo/logo-13.png';
import logo14 from '@/assets/images/homepage/institutes-logo/logo-14.png';
import logo15 from '@/assets/images/homepage/institutes-logo/logo-15.png';
import logo16 from '@/assets/images/homepage/institutes-logo/logo-16.png';
import logo17 from '@/assets/images/homepage/institutes-logo/logo-17.png';
import logo18 from '@/assets/images/homepage/institutes-logo/logo-18.png';
import logo19 from '@/assets/images/homepage/institutes-logo/logo-19.png';

// Para criação de meta tags de SEO
import { useHead } from '@vueuse/head';

export default {
  name: 'HomePage',
  components: {
    NavbarHomepage,
    PrimaryButton,
    BuscaSimples,
  },

  setup() {

    // Configuração das meta tags de SEO
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
      // Palavras para transição
      rotatingWords: ['Inclusivo', 'Verde', 'Resiliente'], // Palavras para rotação
      currentWordIndex: 0,

      // Imagens das logos das instituições
      logos: [
        { src: logo1, alt: 'Logo da Instituição 1' },
        { src: logo2, alt: 'Logo da Instituição 2' },
        { src: logo3, alt: 'Logo da Instituição 3' },
        { src: logo4, alt: 'Logo da Instituição 4' },
        { src: logo5, alt: 'Logo da Instituição 5' },
        { src: logo6, alt: 'Logo da Instituição 6' },
        { src: logo7, alt: 'Logo da Instituição 7' },
        { src: logo8, alt: 'Logo da Instituição 8' },
        { src: logo9, alt: 'Logo da Instituição 9' },
        { src: logo10, alt: 'Logo da Instituição 10' },
        { src: logo11, alt: 'Logo da Instituição 11' },
        { src: logo12, alt: 'Logo da Instituição 12' },
        { src: logo13, alt: 'Logo da Instituição 13' },
        { src: logo14, alt: 'Logo da Instituição 14' },
        { src: logo15, alt: 'Logo da Instituição 15' },
        { src: logo16, alt: 'Logo da Instituição 16' },
        { src: logo17, alt: 'Logo da Instituição 17' },
        { src: logo18, alt: 'Logo da Instituição 18' },
        { src: logo19, alt: 'Logo da Instituição 19' },
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
  },

  beforeUnmount() {
    clearInterval(this.wordRotationInterval);
  },

  methods: {
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

  .products{
    background-color: #146C43;
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
    align-self: stretch;
  }

  .products .title h2{
    color: map-get($gray, white);
    text-align: center;
    font-family: Inter;
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 57.6px */
  }

  .products .products-content{
    display: flex;
    max-width: 1184px;
    flex-direction: column;
    align-items: flex-start;
    gap: 120px;
    align-self: stretch;
  }

  .products .products-content .product{
    display: flex;
    align-items: center;
    gap: 40px;
    align-self: stretch;
  }

  .products .products-content .product .image-wrapper{
    width: 530.531px;
    height: 397.257px;
    flex-shrink: 0;
    position: relative;
  }

  .products .products-content .product .image-bg{
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    position: absolute;
  }

  .products .products-content .product .image-front{
    display: flex;
    width: 305px;
    height: 186px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    position: absolute;
    bottom: 52px;
    left: 282px;
  }

  .products .products-content .product .product-text{
    display: flex;
    padding: 0px 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 56px;
    flex: 1 0 0;
  }

  .products .products-content .product .product-text .title{
    display: flex;
    flex-direction: column;
    padding: 0px 40px;
    justify-content: center;
    align-items: center;
    gap: 16px;
    align-self: stretch;
    color: map-get($gray, white);
    text-align: center;
  }

  .products .products-content .product .product-text .button-primary-link{
  }







  a {
    text-decoration: none;
    border-radius: 4px;
  }

  .homepage {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    height: 5000px;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 1;
    width: 100%;
    height: 100vh;
    top: -72px;
    padding-top: 1px;
  }

  .image-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: map-get($gray, "white");
  }

  .image-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 1;
    display: block;
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
    padding-top: 312px;
    gap: 240px;
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
    color: var(--Primary-Fade-800, #013C31);
    font-family: Inter;
    font-size: 48px;
    font-weight: 700;
    line-height: 120%;
  }

  //Transição aplicada pelo <transition name="fade" mode="out-in">
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
    color: var(--Green-500, #198754);
    font-family: Inter;
    font-size: 48px;
    font-weight: 700;
    line-height: 120%;
    width: 200px; // Tamanho fixo para evitar movimentação horizontal brusca
    text-align: left;
  }

  .subtitle {
    width: 520px;
    max-width: 100%;
    color: #6C757D;
  }

  .search {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-direction: row;
  }

  .search .input-container{
    border: 2px solid var(--Primary-Fade-500, #418377) !important; // Não funcionando, ajustar depois
    border-radius: 14px;
    background: var(--Gray-100, #F8F9FA);
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
        border: 1px solid var(--Gray-300, #DEE2E6);
        background: map-get($gray, "white");
        transition: transform 0.2s ease-out;
        will-change: transform;
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
  }

  .wrapper-cards .cards{
    display: flex;
    padding: 24px;
    flex-direction: column;
    flex: 1 1 calc(33.333% - 24px);
    border-radius: 16px;
    border: 1px solid #E9ECEF;
    background: map-get($gray, "white");
    max-width: 100%;
    min-width: 280px;
    gap: 24px;
  }

  .wrapper-cards .cards {
    flex: 1 1 calc(33.333% - 24px); // Cards ocupando 1/3 do espaço do pai
    min-width: 280px;
    max-width: 100%;
  }

  .cards .top-content{
    color: $body-text;
  }

  .cards .top-content p{
    padding: 0;
    margin: 0;
  }

  .cards .top-content p .highlight{
    background-color: var(--Green-100, #D1E7DD);
    padding: 0 4px;
    border-radius: 4px;
    line-height: 150%;
  }

  .cards .bottom-content{
    display: flex;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    flex: 1;
    width: 100%;
  }

  .cards .bottom-content p{
    padding: 0;
    margin: 0;
  }

  .cards .bottom-content h3{
    padding: 0;
    margin: 0;
  }

  .cards .bottom-content h4{
    padding: 0;
    margin: 0;
  }

  .cards .bottom-content img{
    width: 56px;
    height: 56px;
    border-radius: 56px;
    border: 1px solid var(--Gray-400, #CED4DA);
    background: url(<path-to-image>) lightgray 50% / cover no-repeat;
  }

  .cards .bottom-content .wrapper-bottom-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    align-self: stretch;
    width: 100%;
  }

  .cards .bottom-content .title{
    color: $body-text;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
    width: 100%;
  }

  .cards .bottom-content .subtitle{
    color: #6C757D;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
    width: 100%;
  }

  .institutes {
    display: flex;
    flex-direction: column;
    padding: 200px 0 184px 0; // Uso de Padding pois o margin não está funcionando
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
    color: var(--Primary-Fade-800, #013C31);
    font-family: Inter;
    font-size: 48px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    align-self: stretch;
    margin: 0;
  }

  .institutes .institutes-header h4{
    color: var(--Gray-600, #6C757D);
    margin: 0;
  }

  .institutes .institutes-header a{
    color: var(--Green-500, #198754);
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
    animation: scroll-logos 50s linear infinite;
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

  .institutes-awards{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 56px;
  }

  .institutes-awards p,
  .institutes-awards h4,
  .institutes-awards h5 {
    margin: 0;
  }

  .institutes-awards .award{
    display: flex;
    gap: 8px;
    text-align: center;
  }

  .institutes-awards .award img{
    width: 32px;
    height: 80px;
  }

  .institutes-awards .award .award-label{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    align-self: stretch;
  }

  .institutes-awards .award .award-label h5{
    color: #013C31;
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 30px */
  }

  .institutes-awards .award .award-label .award-label-text{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--Primary-Fade-700, #025949);
  }

  .institutes-awards .award .award-label .award-label-text p:last-child{
    color: var(--Primary-Fade-700, #025949);
    font-size: 10px;
  }

  </style>
