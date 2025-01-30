<template>
  <InstitutionalLayout
    active-item="sobre"
    page-title="Quem somos"
    page-subtitle="A UrbVerde é uma iniciativa com mais de 50 pesquisadores
                   dedicados a democratizar o acesso dados sociais e ambientais!"
  >
    aa
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

</style>
