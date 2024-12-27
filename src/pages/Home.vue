<template>
  <div>
    <!-- Navbar  -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" class="navbar-logo-homepage">
          <img src="@/assets/images/logo-homepage.png" alt="Logo Homepage" />
        </router-link>
        
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

        <!-- Links e Botão -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Links de navegação -->
          <ul class="navbar-nav">
            <li class="nav-item d-flex">
              <a href="#" class="small-regular">Seja Parceiro</a>
            </li>
            <li class="nav-item d-flex">
              <a href="#" class="small-regular">Quem Somos</a>
            </li>
            <li class="nav-item d-flex">
              <a href="#" class="small-regular">Transparência</a>
            </li>
            <li class="nav-item d-flex">
              <a href="#" class="small-regular">UrbVerde Educa</a>
            </li>
          </ul>
          
          <!-- Botão à direita -->
          <router-link to="/mapa" class="button-primary-link">
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

    <!-- Fundo escuro -->
    <div class="navbar-backdrop"></div>

    <!-- Conteúdo da Página -->
    <div class="content">
      <h1>Content</h1>
    </div>
  </div>
</template>

<script>
  import PrimaryButton from "@/components/buttons/PrimaryButton.vue";

  // Fecha o collapse se clicka fora do menu
  export default {
    name: "Home",
    components: {
      PrimaryButton,
    },
    methods: {
      handleOutsideClick(event) {
        const collapseElement = document.getElementById("navbarNav");
        const togglerElement = document.querySelector(".navbar-toggler");

        // Verifica se o clique foi fora do menu e do botão
        if (
          collapseElement &&
          togglerElement &&
          !collapseElement.contains(event.target) &&
          !togglerElement.contains(event.target)
        ) {
          // Fecha o menu se estiver aberto
          if (togglerElement.getAttribute("aria-expanded") === "true") {
            togglerElement.click(); // Simula o clique no botão para fechar
          }
        }
      },
    },
    mounted() {
      // Adiciona o listener ao clicar fora
      document.addEventListener("click", this.handleOutsideClick);
    },
    beforeUnmount() {
      // Remove o listener ao desmontar o componente
      document.removeEventListener("click", this.handleOutsideClick);
    },
  };
</script>


<style scoped lang="scss">
  @use '@/assets/styles/colors.scss' as *;
  @use '@/assets/styles/fonts.scss' as *;
  @use '@/assets/styles/shadows.scss' as *;

  .navbar {
    padding: 0;
    min-height: 72px;
    padding: 16px 128px;
    position: relative;
    z-index: 2;
  }

  .navbar .navbar-logo-homepage:hover{
    background-color: transparent;
  }

  .navbar .navbar-toggler{
    border: transparent;
  }

  .navbar .navbar-toggler.collapsed{
    border: transparent;
  }

  .navbar .navbar-toggler-icon{
    font-size: 16px;
    color: var(--bs-green-500)
  }

  .navbar .navbar-nav {
    margin: auto; 
    padding: 0 12px;
    list-style: none;
    gap: 8px;
  }

  .navbar .navbar-nav .nav-item a{
    display: flex;
    padding: 8px 12px;
    align-items: center;
    text-decoration: none;
    color: $text-color-body;
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

  .navbar .navbar-collapse.collapsing{
    position: absolute;
    z-index: 3;
    top: 100%;
    background-color: var(--bs-light);
    left: 0;
    right: 0;
    box-shadow: 0px 24px 24px 0px rgba(0, 0, 0, 0.05);
    padding: 0 32px;
  }

  .navbar .navbar-collapse.collapsing .navbar-nav{
    padding: 12px 6px 56px 6px;
  }

  .navbar .navbar-collapse.collapse.show{
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

  .navbar .navbar-collapse.collapse.show .navbar-nav{
    padding: 12px 6px 56px 6px;
  }

  .container-fluid{
    padding: 0;
  }

  .container-fluid a{
    padding: 0;
  }

  .button-primary-link{
    text-decoration: none;
  }

  .content {
    background-color: lightblue;
    padding: 20px;
    text-align: center;
    position: relative;
    z-index: 1;
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


<!-- 

- Verificar os warnings dos styles, provavelmente incongruencia com o bootstrap
- Verificar para adicionar os imports globais direto no vite.config.js
- Adicionar nav como componente e subir junto com o button-primary para flor reutilizar

-->