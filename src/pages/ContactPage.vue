<template>
  <InstitutionalLayout
    active-item="contato"
    page-title="Contatos"
    page-subtitle="Escolha a melhor forma para entrar em contato com a nossa equipe"
  >
    <InstitutionalContact
      icon-name="bi-envelope"
      title="E-mail"
      description="Entre em contato pelo e-mail"
      contact-info="comunica.urbverde@usp.br"
      button-label="Enviar e-mail"
      contact-link="mailto:comunica.urbverde@usp.br"
    />
    <InstitutionalContact
      icon-name="bi-whatsapp"
      title="WhatsApp"
      description="Entre em contato pelo número"
      contact-info="+5511916709802"
      button-label="Enviar WhatsApp"
      contact-link="http://wa.me/5511916709802"
    />
    <InstitutionalContact
      icon-name="bi-chat-text"
      title="Suporte"
      description="Experimente usar o aplicativo de suporte
        disponível no botão do canto direito inferior da tela"
      :show-copy-button="false"
      :show-button="false"
    />
  </InstitutionalLayout>
</template>

<script>
import InstitutionalLayout from '@/layouts/InstitutionialLayout.vue';
import InstitutionalContact from '@/components/institutional_pages/InstitutionalContact.vue';
import { useHead } from '@vueuse/head';

export default {
  name: 'ContactPage',
  components: {
    InstitutionalLayout,
    InstitutionalContact,
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
.contacts-grid {
  display: flex;
  padding: 0px 24px;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  gap: 32px;
  align-self: stretch;
  flex-wrap: wrap;
}
</style>
