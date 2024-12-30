<template>
  <div class="homepage">
    <NavbarHomepage />

    <!-- Hero -->
    <div class="hero">
      
      <!-- Background fixo e atrás de tudo -->
      <div class="image-background">
        <img src="@/assets/images/homepage-background.png" alt="Natureza e pessoas plantando" />
      </div>

      <!-- Hero content -->
      <div class="hero-content container">
        <div class="hero-top">
          <div class="hero-text">
            <h1>
              <span class="h1-text">Mapeando um Futuro</span>
              <span class="h1-lasttext"> Verde</span>
            </h1>
            <p class="subtitle normal-medium">
              Acesse dados sociais e ambientais completos de seu município,
              de forma totalmente gratuita!
            </p>
          </div>
          <div class="search-button">
            <BuscaSimples @location-updated="onLocationUpdated" />
          </div>
        </div>

        <div class="platform">
          <img src="@/assets/images/platform.png" alt="Plataforma" />
        </div>
      </div>
      <div style="margin-top: 200px;">
        <h2>Outras sessões abaixo</h2>
      </div>
    </div>

    </div>

    <!-- Aqui entram as próximas seções ou divs normalmente -->
</template>

<script>
import NavbarHomepage from '@/components/navbar/NavbarHomepage.vue';
import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';

export default {
  name: 'HomePage',
  components: {
    NavbarHomepage,
    BuscaSimples
  },
  methods: {
    onLocationUpdated(location) {
      console.log('Localização atualizada:', location);
    },
  },
};
</script>

<style scoped lang="scss">
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
  z-index: -1;   /* atrás do header */
  background-color: white; /* fallback */
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

.h1-lasttext {
  color: var(--Green-500, #198754);
  font-family: Inter;
  font-size: 48px;
  font-weight: 700;
  line-height: 120%;
}

.subtitle {
  width: 520px;
  max-width: 100%;
  color: #6C757D;
}

.platform {
  text-align: center;
  margin: auto;
}

.platform img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 32px;
  border: 0.96px solid var(--Gray-300, #DEE2E6);
  background: var(--White, #FFF);
  box-shadow: 
    0px 0px 8px 1px #FFF inset,
    0px 67.187px 62.388px 0px rgba(0, 0, 0, 0.04),
    0px 0px 0px 0.96px rgba(0, 0, 0, 0.05),
    0px 28.795px 28.795px 0px rgba(0, 0, 0, 0.03),
    0px 14.397px 14.397px 0px rgba(0, 0, 0, 0.03),
    0px 9.598px 7.679px 0px rgba(0, 0, 0, 0.03),
    0px 3.839px 3.839px 0px rgba(0, 0, 0, 0.02),
    0px 1.92px 1.92px 0px rgba(0, 0, 0, 0.02);
}

.next-sections {
  margin-top: 200px;
}
</style>
