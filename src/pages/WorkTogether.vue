<template>
  <InstitutionalLayout
    active-item="parceiro"
    page-title="Seja parceiro"
    page-subtitle="Seja parceiro da UrbVerde e fortaleça a análise ambiental do seu município!"
  >
    <div class="content-page">
      <div class="top-content">
        <div class="image-top shadow-lg">
          <img src="@/assets/images/institutional-pages/work-together/top-image-1.png" alt="" loading="lazy">
        </div>
      </div>

      <div class="text-content">
        <div class="text">
          <h2 class="title heading-h2">Adicione dados do seu município ao mapa!</h2>
          <div class="paragraph">
            <p class="body-normal-medium">
              A UrbVerde possui a flexibilidade de <strong>adicionar dados específicos de
                municípios ao mapa interativo</strong>, ampliando a qualidade das análises socioambientais.
              Com isso, gestores e pesquisadores podem integrar mapas, dados e imagens, possibilitando
              uma visão mais detalhada e comparativa da realidade local e tornando essas informações
              acessíveis a todos!
            </p>
          </div>
        </div>
        <div class="text">
          <h2 class="title heading-h2">Como funciona?</h2>
          <div class="paragraph">
            <p class="body-normal-medium">
              Se você possui <strong>dados ambientais e urbanos nos formatos GeoJSON, Shapefile (SHP),
                TIFF (GeoTIFF)</strong> ou outros formatos compatíveis, podemos incorporá-los
              à UrbVerde. Dessa forma, seu <strong>município será parceiro</strong> e
              terá informações específicas e acessíveis a todos. Entre em contato
              com nossa equipe e descubra como tornar sua cidade parceira da UrbVerde.
            </p>
          </div>
        </div>
      </div>

      <div class="contact-content">
        <div class="text">
          <h2 class="title heading-h2">Entre em contato com nossa equipe</h2>
        </div>
        <InstitutionalContactWrapper />
      </div>
    </div>
  </InstitutionalLayout>
</template>

<script>
import InstitutionalLayout from '@/layouts/InstitutionialLayout.vue';
import InstitutionalContactWrapper from '@/components/institutional_pages/InstitutionalContactWrapper.vue';
import { useHead } from '@vueuse/head';

export default {
  name: 'WorkTogether',
  components: {
    InstitutionalLayout,
    InstitutionalContactWrapper,
  },

  // Configuração das meta tags de SEO
  setup() {
    useHead({
      title: 'Sobre a UrbVerde: Democratizando dados socioambientais para cidades sustentáveis',
      meta: [
        {
          name: 'description',
          content:
                      'A UrbVerde é uma iniciativa que reúne mais de 50 pesquisadores de diversas instituições para democratizar o acesso a dados socioambientais e apoiar o planejamento urbano sustentável. Conheça nossa missão e impacto.',
        },
        {
          name: 'keywords',
          content:
                      'UrbVerde, dados socioambientais, planejamento urbano, sustentabilidade, monitoramento ambiental, cidades verdes, acesso gratuito, pesquisa, smart cities, FAPESP, CNPq, imagens de satélite, gestão pública',
        },
        {
          property: 'og:title',
          content: 'UrbVerde - Transformando dados em impacto socioambiental',
        },
        {
          property: 'og:description',
          content:
                      'Desde 2021, a UrbVerde tem sido referência em monitoramento ambiental urbano no Brasil, oferecendo dados gratuitos para apoiar políticas públicas e promover cidades mais resilientes.',
        },
      ],
    });
  }
};
</script>

<style scoped lang="scss">
  @import '@/assets/styles/breakpoints.scss';

  h2, p{
    margin: 0;
  }

  .content-page{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 120px;
    align-self: stretch;
  }

  .top-content{
    display: flex;
    padding: 0px 24px;
    flex-direction: column;
    align-items: center;
    gap: 56px;
    align-self: stretch;
    justify-content: center;
  }

  .image-top{
    border-radius: 8px;
    border: 8px solid map-get($gray, white);
    width: 100%;
    height: auto;
  }

  .image-top img{
    width: 100%;
    height: 100%;
  }

  .image-bottom-wrapper{
    display: flex;
    width: 100%;
    height: auto;
    align-items: center;
    justify-content: center;
    gap: 40px;
    align-self: stretch;
    flex-wrap: wrap;
  }

  .image-bottom-wrapper .small-image{
    width: auto;
    height: auto;
    max-width: 352px;
    max-height: 240px;
  }

  .image-bottom-wrapper img{
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 3px solid map-get($gray, white);
  }

  .text-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 96px;
    width: 100%;
    padding: 0 24px;
  }

  .contact-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 64px;
    width: 100%;
  }

  .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
    width: 100%;
    max-width: 672px;
  }

  .title {
    color: map-get($theme, primary);
    font-weight: 700;
    text-align: center;
    width: 100%;
  }

  .paragraph {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
    text-align: center;
    color: map-get($body-text, body-color);
  }

  .image-earth {
    width: 100%;
    max-width: 620px;

    img {
      width: 100%;
      height: auto;
    }
  }

  .finances-wrapper{
    display: flex;
    padding: 0px 64px;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 40px 56px;
    align-self: stretch;
    flex-wrap: wrap;
  }

  .finances-wrapper img{
    max-width: 150px;
    max-height: 80px;
    object-fit: contain;
  }

</style>
