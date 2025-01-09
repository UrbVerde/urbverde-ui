<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <LogoRouterLink />

        <!-- Botão para collapse (responsivo para telas menores) -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item d-flex">
              <a href="#" class="body-small-regular">Seja Parceiro</a>
            </li>
            <li class="nav-item d-flex">
              <a href="#" class="body-small-regular">Quem Somos</a>
            </li>
            <li class="nav-item d-flex">
              <a href="#" class="body-small-regular">Transparência</a>
            </li>
            <li class="nav-item d-flex">
              <a href="#" class="body-small-regular">UrbVerde Educa</a>
            </li>
          </ul>

          <router-link to="/mapa" class="button-primary-link" aria-label="Acessar a plataforma da UrbVerde">
            <PrimaryButton
              label="Acessar a plataforma"
              :filled="true"
              iconType="bootstrap"
              icon="bi bi-arrow-right"
              iconPosition="right"
            />
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import LogoRouterLink from '@/components/logo_router_link/LogoRouterLink.vue';

export default {
  name: 'NavbarHomepage',
  components: {
    PrimaryButton,
    LogoRouterLink,
  },
  methods: {
    handleOutsideClick(event) {
      const collapseElement = document.getElementById('navbarNav');
      const togglerElement = document.querySelector('.navbar-toggler');

      // Verifica se o clique foi fora do menu e do botão
      if (
        collapseElement &&
          togglerElement &&
          !collapseElement.contains(event.target) &&
          !togglerElement.contains(event.target)
      ) {
        // Fecha o menu se estiver aberto
        if (togglerElement.getAttribute('aria-expanded') === 'true') {
          togglerElement.click(); // Simula o clique no botão para fechar
        }
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
};
</script>

<style scoped lang="scss">
  .navbar {
    padding: 0;
    min-height: 72px;
    padding: 16px 128px;
    position: relative;
    z-index: 2;
  }

  .navbar .navbar-logo-homepage:hover {
    background-color: transparent;
  }

  .navbar .navbar-toggler {
    border: transparent;
  }

  .navbar .navbar-toggler.collapsed {
    border: transparent;
  }

  .navbar .navbar-toggler-icon {
    font-size: 16px;
    color: var(--bs-green-500)
  }

  .navbar .navbar-nav {
    margin: auto;
    padding: 0 12px;
    list-style: none;
    gap: 8px;
  }

  .navbar .navbar-nav .nav-item a {
    display: flex;
    padding: 8px 12px;
    align-items: center;
    text-decoration: none;
    color: map-get($body-text, body-color);
    text-align: center;
    border-radius: 4px;
  }

  .navbar .navbar-button {
    margin-top: 16px;
    text-align: center;
  }

  .navbar .navbar-collapse {
    transition: height 0.3s ease, padding 0.3s ease;
  }

  .navbar .navbar-collapse.collapsing {
    position: absolute;
    z-index: 3;
    top: 100%;
    background-color: var(--bs-light);
    left: 0;
    right: 0;
    box-shadow: 0px 24px 24px 0px rgba(0, 0, 0, 0.05);
    padding: 0 32px;
  }

  .navbar .navbar-collapse.collapsing .navbar-nav {
    padding: 12px 6px 56px 6px;
  }

  .navbar .navbar-collapse.collapse.show {
    position: absolute;
    height: auto;
    z-index: 3;
    top: 100%;
    background-color: var(--bs-light);
    left: 0;
    right: 0;
    box-shadow: 0px 24px 24px 0px rgba(0, 0, 0, 0.1);
    padding: 12px 32px 64px;
  }

  .navbar .navbar-collapse.collapse.show .navbar-nav {
    padding: 12px 6px 56px 6px;
  }

  .container-fluid {
    padding: 0;
  }

  .container-fluid a {
    padding: 0;
    width: auto;
    margin: 0;
  }

  .button-primary-link {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 16px 24px;
    }

    .navbar-nav {
      margin-bottom: 16px;
    }

    .navbar-button {
      margin-top: 0;
    }
  }

</style>
