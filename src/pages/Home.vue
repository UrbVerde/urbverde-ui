<template>
  <div>
    <!-- Navbar  -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- Logo -->
        <a href="#">
          <img src="@/assets/images/logo-homepage.png" alt="Logo Homepage" />
        </a>
        
        <!-- Botão responsivo (para telas menores) -->
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
              <a class="nav-link" href="#">Seja Parceiro</a>
            </li>
            <li class="nav-item d-flex">
              <a class="nav-link" href="#">Quem Somos</a>
            </li>
            <li class="nav-item d-flex">
              <a class="nav-link" href="#">Transparência</a>
            </li>
            <li class="nav-item d-flex">
              <a class="nav-link" href="#">UrbVerde Educa</a>
            </li>
          </ul>
          
          <!-- Botão à direita -->
          <div>
            <PrimaryButton 
              label="Acessar a plataforma"
              :filled="true"
              iconType="bootstrap"
              icon="bi bi-arrow-right"
              iconPosition="right"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Conteúdo da Página -->
    <div class="content">
      <h1>Content</h1>
    </div>
  </div>
</template>

<script>
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

  export default {
    name: "Home",
    components: {
      PrimaryButton,
    },
  };
</script>

<style scoped>

  .navbar {
    padding: 0;
    min-height: 72px;
    padding: 16px 128px;
  }

  .container-fluid{
    padding: 0;
  }

  .container-fluid a{
    padding: 0;
  }

  .navbar-nav {
    margin: auto; 
    padding: 0 12px;
    list-style: none;
    gap: 8px;
  }

  .navbar-nav .nav-item a{
    display: flex;
    padding: 8px 12px;
    align-items: center;
  }

  .navbar-button {
    margin-top: 16px;
    text-align: center;
  }

  .navbar-collapse.collapsing{
    padding-bottom: 12px;
  }

  .navbar-collapse.collapsing .navbar-nav{
    padding: 24px 6px 12px 6px;
  }

  .navbar-collapse.collapse.show{
    padding-bottom: 12px;
  }

  .navbar-collapse.collapse.show .navbar-nav{
    padding: 24px 6px 12px 6px;
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

  .content {
    background-color: lightblue;
    padding: 20px;
    text-align: center;
  }

</style>


<!-- 

- modificar logo qnd chega em 1280px 
- quando clica na tela, ao inves de arrastar pra baixo o content ficar pra cima e desfocado 
 - mudar o ícone também
 
-->