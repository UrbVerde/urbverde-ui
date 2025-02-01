<template>
  <TawkTo />

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
import TawkTo from '@/components/homepage/TawkTo.vue';
import { useHead } from '@vueuse/head';

export default {
  name: 'ContactPage',
  components: {
    InstitutionalLayout,
    InstitutionalContactWrapper,
    TawkTo,
  },

  setup() {
    useHead({
      title: 'Fale Conosco | UrbVerde - Dados socioambientais para cidades sustentáveis',
      meta: [
        {
          name: 'description',
          content:
            'Entre em contato com a equipe da UrbVerde para esclarecer dúvidas, conhecer nossos projetos e colaborar com a democratização de dados socioambientais. Saiba como podemos apoiar políticas públicas e cidades mais sustentáveis.',
        },
        {
          name: 'keywords',
          content:
            'UrbVerde, contato, suporte, dados socioambientais, planejamento urbano, sustentabilidade, monitoramento ambiental, cidades inteligentes, políticas públicas, smart cities, pesquisa, gestão ambiental, parceria institucional',
        },
        {
          property: 'og:title',
          content: 'Fale com a UrbVerde - Conecte-se à inovação em sustentabilidade urbana',
        },
        {
          property: 'og:description',
          content:
            'A UrbVerde facilita o acesso a dados socioambientais para fortalecer políticas públicas e tornar cidades mais sustentáveis. Entre em contato e descubra como podemos colaborar.',
        },
      ],
    });
  }
};
</script>
