<template>
  <InstitutionalLayout
    active-item="sobre"
    page-title="Quem somos"
    page-subtitle="A UrbVerde é uma iniciativa com mais de 50 pesquisadores
                   dedicados a democratizar o acesso dados sociais e ambientais!"
  >
    <div class="content-page">
      <div class="top-content">
        <div class="image-top shadow-lg">
          <img src="@/assets/images/institutional-pages/about-us/top-image-1.png" alt="" loading="lazy">
        </div>
        <div class="image-bottom-wrapper">
          <div class="small-image"><img src="@/assets/images/institutional-pages/about-us/top-image-2.png" class="shadow-lg" loading="lazy"></div>
          <div class="small-image"><img src="@/assets/images/institutional-pages/about-us/top-image-3.png" class="shadow-lg" loading="lazy"></div>
          <div class="small-image"><img src="@/assets/images/institutional-pages/about-us/top-image-4.png" class="shadow-lg" loading="lazy"></div>
        </div>
      </div>

      <div class="text-content">
        <div class="text">
          <h2 class="title heading-h2">A história da UrbVerde</h2>
          <div class="paragraph">
            <p class="body-normal-medium">
              A UrbVerde nasceu em 2021 a partir do Edital PIPAE,
              com o objetivo de transformar o acesso a dados socioambientais
              e apoiar o planejamento urbano sustentável. A plataforma foi lançada em 2023,
              consolidando-se como uma ferramenta inovadora ao permitir o tratamento de
              imagens de satélite em nuvem e a disponibilização de dados espaciais
              acessíveis a gestores, pesquisadores e à sociedade.
            </p>
            <p class="body-normal-medium">
              Desde então, a UrbVerde cresceu significativamente,
              reunindo mais de 40 pesquisadores de instituições como
              USP, UFBA, UFSCAR, UNITAU, UNIARA e Universidade Lusófona.
              Em 2024, com o apoio do Edital PPPP da FAPESP e do CNPq, expandimos nossa
              atuação, por meio de parcerias com o Consórcio Intermunicipal Grande ABC
              e as prefeituras de Diadema e São Vicente. Esse crescimento tornou a
              UrbVerde uma ferramenta <strong>referência no monitoramento ambiental urbano no Brasil.</strong>
            </p>
            <p class="body-normal-medium">
              Nossa missão é impoderar a população com dados socioambientais acessíveis para
              fomentar decisões conscientes contra os desafios climáticos.
            </p>
          </div>
          <div class="image-earth">
            <img src="@/assets/images/institutional-pages/about-us/love-the-earth.svg" alt="" loading="lazy">
          </div>
        </div>
        <div class="text">
          <h2 class="title heading-h2">Financiamento</h2>
          <div class="paragraph">
            <p class="body-normal-medium">
              A Plataforma UrbVerde, inicialmente financiada pelo Edital de
              Apoio a Projetos Integrados de Pesquisa em Áreas Estratégicas (PIPAE)
              da Pró-Reitoria de Pesquisa e Inovação da Universidade de São Paulo
              (PRPI/USP), e atualmente conta com financiamento do Conselho Nacional
              de Desenvolvimento Científico e Tecnológico (CNPq) e do <strong>Programa de
                Pesquisa em Políticas Públicas (PPPP)</strong> da Fundação de Amparo à Pesquisa
              do Estado de São Paulo (FAPESP).
            </p>
          </div>
        </div>
      </div>

      <div class="finances-wrapper">
        <img src="@/assets/images/institutional-pages/about-us/financing/financing-image-1.svg" alt="" loading="lazy">
        <img src="@/assets/images/institutional-pages/about-us/financing/financing-image-2.svg" alt="" loading="lazy">
        <img src="@/assets/images/institutional-pages/about-us/financing/financing-image-3.svg" alt="" loading="lazy">
        <img src="@/assets/images/institutional-pages/about-us/financing/financing-image-4.svg" alt="" loading="lazy">
        <img src="@/assets/images/institutional-pages/about-us/financing/financing-image-5.svg" alt="" loading="lazy">
      </div>

      <div class="members-content">
        <h2 class="title heading-h2">Conheça nossa equipe</h2>
        <div class="wrapper">
          <div class="team">
            <h4 class="heading-h4">Coordenadores</h4>
            <div class="wrapper-members">
              ADICIONAR MEMBROS
            </div>
          </div>
        </div>
      </div>
    </div>
  </InstitutionalLayout>
</template>

<script>
import InstitutionalLayout from '@/layouts/InstitutionialLayout.vue';
import { useHead } from '@vueuse/head';

export default {
  name: 'AboutUs',
  components: {
    InstitutionalLayout,
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
    gap: 136px;
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

  .members-content{
    display: flex;
    padding: 0px 24px;
    flex-direction: column;
    align-items: center;
    gap: 56px;
    align-self: stretch;
  }

  .members-content .wrapper{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 72px;
    align-self: stretch;
  }

  .members-content .wrapper .team{
    display: flex;
    justify-content: center;
    align-items: flex-end;
    align-content: flex-end;
    gap: 40px 32px;
    align-self: stretch;
    flex-wrap: wrap;
  }

  .members-content .wrapper .team h4{
    color: map-get($theme, primary);
    width: 100%;
    text-align: center;
    font-weight: 700;
  }

  .members-content .wrapper .team .wrapper-members{
    display: flex;
    justify-content: center;
    align-items: flex-end;
    align-content: flex-end;
    gap: 40px 32px;
    align-self: stretch;
    flex-wrap: wrap;
  }

</style>
