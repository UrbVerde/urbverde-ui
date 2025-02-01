<template>
  <div class="footer">
    <div class="newsletter">
      <h4 class="heading-h4">Receba as novidades por e-mail!</h4>

      <div class="form">
        <form class="input-group body-small-medium" @submit.prevent="onSubmit">

          <input
            type="email"
            class="form-control"
            placeholder="Adicionar seu e-mail"
            aria-label="Adicionar seu e-mail"
            aria-describedby="button-addon2"
            required
            v-model.trim="email"
            :disabled="loading"
          />

          <button
            :class="['button-base', buttonStateClass]"
            :style="{ minWidth: '56px' }"
            :disabled="loading || success"
            type="submit"
            id="button-addon2"
          >
            <span class="icon-holder">
              <transition name="icon-fade" mode="out-in">
                <i
                  v-if="success"
                  key="success"
                  class="bi bi-check-lg"
                  style="font-size: 26px;"
                ></i>
                <span
                  v-else-if="loading"
                  key="loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <i
                  v-else
                  key="idle"
                  class="bi bi-send"
                  style="font-size: 18px;"
                ></i>
              </transition>
            </span>
          </button>
        </form>

        <p class="body-caption-regular">
          Ao enviar, você concorda em receber e-mails da UrbVerde.
        </p>
      </div>
    </div>

    <!-- Divider -->
    <span class="divider"></span>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <router-link to="/mapa" class="button-primary-link">
        <div class="logo-button">
          <img
            src="@/assets/images/logo-urbverde-white.svg"
            width="39px"
            height="40px"
            alt="Logo da UrbVerde"
          />
          <p class="body-small-medium">&copy; UrbVerde, 2025.</p>
        </div>
      </router-link>

      <div class="links body-small-medium">
        <router-link to="/sobre">Quem Somos</router-link>
        <router-link to="/parceiro">Seja Parceiro</router-link>
        <router-link to="/contato">Contatos</router-link>
        <a
          href="https://urbverde-educa.tawk.help/"
          target="_blank"
          rel="noopener noreferrer"
        >
          UrbVerde Educa
        </a>
      </div>

      <div class="midias">
        <a href="http://wa.me/5511916709802" target="_blank" rel="noopener noreferrer">
          <img
            src="@/assets/images/homepage/media-links/media-link-01.svg"
            alt="WhatsApp Link"
          />
        </a>
        <a
          href="mailto:comunica.urbverde@usp.br"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="@/assets/images/homepage/media-links/media-link-02.svg"
            alt="E-mail Link"
          />
        </a>
        <a
          href="https://instagram.com/urb.verde"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="@/assets/images/homepage/media-links/media-link-03.svg"
            alt="Instagram Link"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/urbverde/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="@/assets/images/homepage/media-links/media-link-04.svg"
            alt="LinkedIn Link"
          />
        </a>
        <a
          href="https://www.youtube.com/@urb_verde"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="@/assets/images/homepage/media-links/media-link-05.svg"
            alt="Youtube Link"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UrbVerdeFooter',
  data() {
    return {
      email: '',
      loading: false,
      success: false
    };
  },
  computed: {
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validação simples do formato do e-mail

      return emailRegex.test(this.email.trim());
    },
    buttonStateClass() {
      if (this.success) {
        return 'button-success';
      }
      if (this.loading) {
        return 'button-loading';
      }

      return this.isEmailValid ? 'button-valid' : 'button-invalid';
    }
  },
  watch: {
    // Se o usuário modificar o e-mail após ter sucesso, zera o estado de sucesso para permitir outro envio
    email(newVal, oldVal) {
      if (this.success && newVal !== oldVal) {
        this.success = false;
      }
    }
  },
  mounted() {
    const savedCount = window.localStorage.getItem('submissionsCount');
    if (savedCount) {
      this.submissionsCount = parseInt(savedCount, 10) || 0;
    }
  },
  methods: {
    async onSubmit() {
      if (!this.isEmailValid) {
        return;
      }
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('email', this.email.trim());

        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbxXwPCAHpHFhr2C1mkhsbbzUbCbXfaS2EwooF6-bmaOUXXXZsuFMCMMOHKcZbLpoKtb/exec',
          {
            method: 'POST',
            body: formData
          }
        );

        if (!response.ok) {
          this.loading = false;
          throw new Error('Não foi possível salvar o e-mail, tente novamente.');
        }

        const result = await response.json();
        if (result.status !== 'success') {
          this.loading = false;
          throw new Error('Retorno inesperado do servidor, tente novamente.');
        }

        // Sucesso
        this.loading = false;
        this.success = true;
      }
      catch (error) {
        this.loading = false;
        alert('Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde.');
        console.error(error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

a {
  text-decoration: none;
}

.divider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  height: 1px;
  width: 100%;
  background-color: map-get($green, 600);
}

.button-base {
  border-radius: 8px !important;
  border: 1px solid map-get($gray, 400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-invalid {
  background-color: map-get($gray, 100);
  color: map-get($gray, 500);
}
.button-valid {
  background-color: map-get($gray, 100);
  color: map-get($green, 500);
}
.button-loading {
  background-color: map-get($gray, 100);
  color: map-get($green, 500);
}
.button-success {
  background-color: map-get($gray, 100);
  color: map-get($green, 500);
}

.icon-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
}

.icon-fade-enter,
.icon-fade-leave-to {
  opacity: 0;
}
.icon-fade-enter-to,
.icon-fade-leave {
  opacity: 1;
}
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.icon-fade-enter:not(.spinner-border),
.icon-fade-leave-to:not(.spinner-border) {
  transform: scale(0.7);
}
.icon-fade-enter-to:not(.spinner-border),
.icon-fade-leave:not(.spinner-border) {
  transform: scale(1);
}
.icon-fade-enter-active:not(.spinner-border),
.icon-fade-leave-active:not(.spinner-border) {
  transition: opacity 0.3s ease-in-out, transform 0.15s ease-in-out;
}

.spinner-border {
  margin: 0 !important;
  transform-origin: center center;
}

.form-control:disabled { // Utilizado durante o loading
  cursor: default;
  pointer-events: none;
  opacity: 1;
  background-color: map-get($gray, white);
}

.footer {
  display: flex;
  padding: 0px 80px;
  background: linear-gradient(180deg, #146c43 0%, #0f5132 100%);
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;

  .newsletter {
    display: flex;
    height: 237px;
    padding: 48px 0px 56px 0px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    align-self: stretch;

    h4 {
      font-weight: 700;
      text-align: center;
      color: map-get($gray, white);
      padding: 0;
      margin: 0;
    }

    .form {
      display: flex;
      width: 498px;
      height: auto;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      gap: 12px;

      .input-group {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 8px;
        border-radius: 16px;

        .form-control {
          flex: 1;
          height: 40px;
          border-radius: 8px !important;
          border: transparent;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 253, 133, 0.25);
          border-color: transparent;
        }

        button {
          min-width: 80px;
          height: 40px;
          margin-left: 8px;
        }
      }

      p {
        color: map-get($gray, white);
        margin: auto;
        padding: 0;
        text-align: center;
      }
    }
  }

  .footer-bottom {
    display: flex;
    padding: 32px 24px;
    align-items: center;
    justify-content: center;
    gap: 24px;
    align-self: stretch;
    justify-content: space-between;
    flex-wrap: wrap-reverse;

    .logo-button {
      display: flex;
      align-items: center;
      gap: 12px;
      color: map-get($gray, white);

      p {
        margin: 0;
      }
    }

    .links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      flex: 1 0 0;

      a {
        color: map-get($gray, white);
        text-decoration: none;
      }
    }

    .midias {
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        width: 36px;
        height: 36px;
      }
    }
  }
}

// Specific media
@media screen and (max-width: 1100px) {

  .footer {
    padding: 0px 24px;
  }

  .links {
    flex-direction: column;
  }

}

// Specific media where the footer is displayed in a single column
@media screen and (max-width: 720px) {

  .footer .newsletter .heading-h4{
    font-size: 20px;
  }

  .footer .footer-bottom {
    display: flex;
    flex-direction: column;
    padding: 32px 24px 40px 24px;
    gap: 40px;

    .links {
      order: 1;
      width: 100%;
    }

    .midias {
      order: 2;
      width: 100%;
      justify-content: center;
    }

    .button-primary-link {
      order: 3;
      width: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}

@include breakpoint-down('mobile-large') {

  .footer .newsletter .form {
    width: 100%;
  }

}

</style>
