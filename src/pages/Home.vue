<template>
  <div class="homepage">

    <TawkTo />

    <!-- Navbar -->
    <NavbarHomepage />

    <!-- Content -->
    <div class="content">

      <!-- Background fixo e atrás dos contents -->
      <div class="image-background-wrapper">
        <div class="image-background">
          <img src="@/assets/images/homepage/homepage-background.svg" alt="Paisagem natural com pessoas plantando árvores para um futuro sustentável" />
        </div>
      </div>

      <!-- Hero content -->
      <section class="hero-content container">
        <div class="hero-top">
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
              <img src="@/assets/images/homepage/platform.svg" alt="Interface da plataforma UrbVerde exibindo dados ambientais" ref="zoomImage" />
            </div>
          </router-link>

          <!-- Cards de comentários sobre a UrbVerde -->
          <div class="wrapper-cards">
            <CardComments
              quoteBeforeHighlight="Iniciativas como a UrbVerde [...] fornecem a esperança de que "
              highlight="o mundo ainda tem jeito"
              quoteAfterHighlight="."
              :imageSrc="imageNalini"
              imageAlt="Foto de José Renato Nalini, Secretário Executivo de São Paulo"
              author="José Renato Nalini"
              role="Secretário Executivo de São Paulo"
            />

            <CardComments
              quoteBeforeHighlight="A UrbVerde foi desenvolvida para fornecer dados ao "
              highlight="poder público e aos cidadãos"
              quoteAfterHighlight="."
              :imageSrc="imageJuliana"
              imageAlt="Foto de Juliana Domingos de Lima, Jornalista do Estadão"
              author="Juliana Domingos de Lima"
              role="Jornalista do Estadão"
            />

            <CardComments
              quoteBeforeHighlight="É uma "
              highlight="plataforma que caiu do céu"
              quoteAfterHighlight=" [...] ajuda a ler a cidade de uma forma clara."
              :imageSrc="imageMarcela"
              imageAlt="Foto de Marcela Cury Petenusci, Professora de Ribeirão Preto"
              author="Marcela Cury Petenusci"
              role="Professora de Ribeirão Preto"
            />
          </div>
        </div>
      </section>

      <!-- Institutes content-->
      <div class="institutes container">

        <div class="institutes-header">
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

        <!-- Lista de prêmios -->
        <HomeAwards :awards="awardsList" />

      </div>
    </div>

    <!-- Products content -->
    <div class="products">
      <div class="title container">
        <h2 class="heading-h2">
          Ferramentas para uma gestão sustentável
        </h2>
      </div>

      <div class="products-content container">
        <!-- Primeiro produto -->
        <HomeProduct
          :imageBgSrc="productBg1"
          imageBgAlt="Vista aérea mostrando contraste entre bairros residenciais e áreas verdes com quadras de esportes"
          :imageFrontSrc="productBg2"
          imageFrontAlt="Mapa de calor detalhando variações de temperatura e vegetação em áreas urbanas"
          title="Mapas ambientais e sociais"
          description="Explore mapas detalhados sobre vegetação, temperatura, parques e praças para entender melhor a sua cidade!"
          buttonLabel="Acessar"
          :filled="false"
          :icon=" 'bi bi-arrow-right' "
          :iconType=" 'bootstrap' "
          buttonRoute="/mapa"
        />

        <!-- Segundo produto -->
        <HomeProduct
          :imageBgSrc="productBg3"
          imageBgAlt="Mapa representando índices de cobertura vegetal por região em tons de verde"
          :imageFrontSrc="productBg4"
          imageFrontAlt="Cartão estatístico destacando média da cobertura vegetal de 20%"
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

    <!-- Mission and Urbverde Educa content -->
    <div class="mission-educa container">
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
              :imageSrc="imageMarcel"
              imageAlt="Reportagens e notícias"
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
              :imageSrc="imageNotebook"
              imageAlt="Documentos"
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
              :imageSrc="imageEdu"
              imageAlt="Metodologias"
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
              :imageSrc="imageBreno"
              imageAlt="Principais dúvidas"
              title="Principais dúvidas"
            />
          </a>
        </div>
      </div>
    </div>

    <!-- CTA content -->
    <HomeCta
      @location-updated="onLocationUpdated"
      :title="'Conheça mais sobre sua cidade!'"
      :buttonLabel="'Acessar'"
      :buttonRoute="'/mapa'"
      :filled="true"
    />

    <!-- Footer -->
    <UrbVerdeFooter />
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
import { useHead } from '@vueuse/head'; // Metas tags de SEO

import logo1 from '@/assets/images/homepage/institutes-logo/logo-01.svg';
import logo2 from '@/assets/images/homepage/institutes-logo/logo-02.svg';
import logo3 from '@/assets/images/homepage/institutes-logo/logo-03.svg';
import logo4 from '@/assets/images/homepage/institutes-logo/logo-04.svg';
import logo5 from '@/assets/images/homepage/institutes-logo/logo-05.svg';
import logo6 from '@/assets/images/homepage/institutes-logo/logo-06.svg';
import logo7 from '@/assets/images/homepage/institutes-logo/logo-07.svg';
import logo8 from '@/assets/images/homepage/institutes-logo/logo-08.svg';
import logo9 from '@/assets/images/homepage/institutes-logo/logo-09.svg';
import logo10 from '@/assets/images/homepage/institutes-logo/logo-10.svg';
import logo11 from '@/assets/images/homepage/institutes-logo/logo-11.svg';
import logo12 from '@/assets/images/homepage/institutes-logo/logo-12.svg';
import logo13 from '@/assets/images/homepage/institutes-logo/logo-13.svg';
import logo14 from '@/assets/images/homepage/institutes-logo/logo-14.svg';
import logo15 from '@/assets/images/homepage/institutes-logo/logo-15.svg';
import logo16 from '@/assets/images/homepage/institutes-logo/logo-16.svg';
import logo17 from '@/assets/images/homepage/institutes-logo/logo-17.svg';
import logo18 from '@/assets/images/homepage/institutes-logo/logo-18.svg';
import logo19 from '@/assets/images/homepage/institutes-logo/logo-19.svg';

import imageMarcel from '@/assets/images/homepage/urbverde-educa-topics-marcel.png';
import imageNotebook from '@/assets/images/homepage/urbverde-educa-topics-notebook.png';
import imageEdu from '@/assets/images/homepage/urbverde-educa-topics-edu.png';
import imageBreno from '@/assets/images/homepage/urbverde-educa-topics-breno.png';
import imageNalini from '@/assets/images/homepage/image-card-1.svg';
import imageJuliana from '@/assets/images/homepage/image-card-2.svg';
import imageMarcela from '@/assets/images/homepage/image-card-3.svg';
import productBg1 from '@/assets/images/homepage/product-bg-1.png';
import productBg2 from '@/assets/images/homepage/product-bg-2.png';
import productBg3 from '@/assets/images/homepage/product-bg-3.png';
import productBg4 from '@/assets/images/homepage/product-bg-4.svg';

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
      imageMarcel,
      imageNotebook,
      imageEdu,
      imageBreno,
      imageNalini,
      imageJuliana,
      imageMarcela,
      productBg1,
      productBg2,
      productBg3,
      productBg4,

      rotatingWords: ['Inclusivo', 'Verde', 'Resiliente', 'Justo'], // Palavras para rotação
      currentWordIndex: 0,

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
    padding-top: 240px;
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
