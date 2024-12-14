<template>
  <div>
    <button class="logo-button">
      <img src="../../../assets/logo-white.png" alt="Logo" class="logo" />
      <span class="text">URBVERDE</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'LogoButton'
};
</script>

<style scoped>
.logo-button {

  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 232px;
  /* Definindo a largura do botão */
  height: 56px;
  /* Definindo a altura do botão */
  display: flex;
  align-items: center;
  gap: 8px;
  /* Espaçamento entre a imagem e o texto */
}

.logo {
  width: 32px;
  height: 32px;
}

.text {
  color: var(--Theme-Primary, #025949);
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  /* 30px */
  letter-spacing: 1px;

  color: var(--Theme-Primary, #025949);
  leading-trim: both;
  text-edge: cap;

}</style>
