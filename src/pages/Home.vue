  <template>
    <div class="homepage">
      <NavbarHomepage />

      <!-- Hero -->
      <div class="hero">
        
        <!-- Background fixo e atrás dos contents -->
        <div class="image-background">
          <img src="@/assets/images/homepage-background.png" alt="Natureza e pessoas plantando" />
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
              <p class="subtitle normal-medium">
                Acesse dados sociais e ambientais completos de seu município,
                de forma totalmente gratuita!
              </p>
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
            <router-link to="/mapa" class="platform-link">
              <div 
                class="platform" 
                @mousemove="handleMouseMove" 
                @mouseleave="resetZoom"
              >
                <div class="overlay"></div>
                <img src="@/assets/images/platform.png" alt="Plataforma UrbVerde" ref="zoomImage" />
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
                    <img src="@\assets\images\homepage\image-card-1.png" alt="José Renato Nalini">
                  </div>
                  <div class="wrapper-bottom-content">
                    <p class="title small-bold">
                      José Renato Nalini
                    </p>
                    <p class="subtitle small-regular">
                      Secretário Executivo de São Paulo
                    </p>
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
                    <img src="@\assets\images\homepage\image-card-2.png" alt="Juliana Domingos de Lima">
                  </div>
                  <div class="wrapper-bottom-content">
                    <p class="title small-bold">
                      Juliana Domingos de Lima
                    </p>
                    <p class="subtitle small-regular">
                      Jornalista do Estadão
                    </p>
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
                    <img src="@\assets\images\homepage\image-card-3.png" alt="José Renato Nalini">
                  </div>
                  <div class="wrapper-bottom-content">
                    <p class="title small-bold">
                      Marcela Cury Petenusci
                    </p>
                    <p class="subtitle small-regular">
                      Professora de Ribeirão Preto
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>

  <script>
  import NavbarHomepage from '@/components/navbar/NavbarHomepage.vue';
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
  import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';

  export default {
    name: 'HomePage',
    components: {
      NavbarHomepage,
      PrimaryButton,
      BuscaSimples,
    },

    // Transição das palavras
    data() {
      return {
        rotatingWords: ['Verde', 'Inclusivo', 'Resiliente'], // Palavras para rotação
        currentWordIndex: 0,
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
  a {
    text-decoration: none;
  }

  .homepage {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    height: 3000px;
  }

  .hero {
    position: relative;
    z-index: 1;  
    width: 100%;
    height: 100vh; 
    top: -72px;
  }


  .image-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; 
    background-color: map-get($gray-colors, "white");
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

  .hero-text p {
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
        background: map-get($gray-colors, "white");
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
    background: map-get($gray-colors, "white");
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
    color: $text-color-body;
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
  }

  .cards .bottom-content p{
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
    flex: 1 0 0;
    align-self: stretch;
  }

  .cards .bottom-content .title{
    color: $text-color-body;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
  }

  .cards .bottom-content .subtitle{
    color: #6C757D;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
  }
  </style>
