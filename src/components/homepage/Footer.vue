<template>
  <div class="footer">
    <div class="newsletter">
      <h4 class="heading-h4">Receba as novidades por e-mail!</h4>

      <!-- Formulário -->
      <div class="form">
        <form class="input-group body-small-medium" @submit.prevent="onSubmit">
          <!-- Campo de e-mail -->
          <input
            type="email"
            class="form-control"
            placeholder="Adicionar seu e-mail"
            aria-label="Adicionar seu e-mail"
            aria-describedby="button-addon2"
            required
            v-model.trim="email"
          />

          <!-- Botão (com ícones e transições) -->
          <button
            :class="['button-base', buttonStateClass]"
            :style="{ minWidth: '56px' }"
            :disabled="loading || success || submissionsCount >= maxSubmissions"
            type="submit"
            id="button-addon2"
          >
            <!-- Container fixo para não “pular” entre ícones -->
            <span class="icon-holder"> 
              <transition name="icon-fade">
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
        <router-link to="/mapa">Plataforma</router-link>
        <a
          href="https://urbverde-educa.tawk.help/"
          target="_blank"
          rel="noopener noreferrer"
        >
          UrbVerde Educa
        </a>
        <a
          href="https://urbverde-educa.tawk.help/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contatos
        </a>
        <a
          href="https://urbverde-educa.tawk.help/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Termos de uso
        </a>
      </div>

      <div class="midias">
        <a href="http://wa.me/5511916709802" target="_blank" rel="noopener noreferrer">
          <img
            src="@/assets/images/homepage/media-links/media-link-01.svg"
            alt="WhatsApp Link"
          />
        </a>
        <a href="mailto:comunica.urbverde@usp.br" target="_blank" rel="noopener noreferrer">
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
  name: "Footer",
  data() {
    return {
      email: "",
      submissionsCount: 0,
      maxSubmissions: 3, // caso queira manter
      loading: false,
      success: false
    };
  },
  computed: {
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.email.trim());
    },
    buttonStateClass() {
      if (this.success) {
        return "button-success";
      }
      if (this.loading) {
        return "button-loading";
      }
      return this.isEmailValid ? "button-valid" : "button-invalid";
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
      if (this.submissionsCount >= this.maxSubmissions) {
        alert(`Parece que você enviou ${this.maxSubmissions} vezes. Tente novamente mais tarde.`);
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("email", this.email.trim());

        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxXwPCAHpHFhr2C1mkhsbbzUbCbXfaS2EwooF6-bmaOUXXXZsuFMCMMOHKcZbLpoKtb/exec",
          {
            method: "POST",
            body: formData
          }
        );

        if (!response.ok) {
          this.loading = false;
          throw new Error("Não foi possível salvar o e-mail, tente novamente.");
        }

        const result = await response.json();
        if (result.status !== "success") {
          this.loading = false;
          throw new Error("Retorno inesperado do servidor, tente novamente.");
        }

        // Sucesso
        this.loading = false;
        this.success = true;
        this.email = "";
        this.submissionsCount++;
        window.localStorage.setItem('submissionsCount', this.submissionsCount);
      } catch (error) {
        this.loading = false;
        alert("Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde.");
        console.error(error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
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

.icon-holder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.button-base {
  border-radius: 8px !important;
  border: 1px solid map-get($gray, 400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Estados do botão */
.button-invalid {
  background-color: map-get($gray, 100);
  color: map-get($gray, 500);
}
.button-valid {
  background-color: map-get($gray, 100);
  color: map-get($green, 700);
}
.button-loading {
  background-color: map-get($gray, 100);
  color: map-get($green, 700);
}
.button-success {
  background-color: map-get($gray, 100);
  color: map-get($green, 500);
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
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
          padding: px;
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
</style>
