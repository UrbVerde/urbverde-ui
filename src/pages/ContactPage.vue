<template>

  <InstitutionalLayout
    active-item="contato"
    page-title="Contatos"
    page-subtitle="Escolha a melhor forma para entrar em contato com a nossa equipe"
  >

    <InstitutionalContactWrapper />

  </InstitutionalLayout>

</template>

<script>
import InstitutionalLayout from '@/layouts/InstitutionialLayout.vue';
import InstitutionalContactWrapper from '@/components/institutional_pages/InstitutionalContactWrapper.vue';
import { useHead } from '@vueuse/head';

export default {
  name: 'ContactPage',
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
