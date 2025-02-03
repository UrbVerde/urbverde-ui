<template>
  <div class="contacts-grid">
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
  </div>

</template>

<script>
import InstitutionalContact from '@/components/institutional_pages/InstitutionalContact.vue';

export default {
  name: 'institutionalContactWrapper',
  components: {
    InstitutionalContact,
  },
};
</script>

    <style scoped lang="scss">
      .contacts-grid {
        display: flex;
        padding: 0px 24px;
        justify-content: center;
        align-items: stretch;
        align-content: flex-start;
        gap: 32px;
        align-self: stretch;
        flex-wrap: wrap;
      }

    </style>
