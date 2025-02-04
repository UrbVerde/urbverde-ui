<!--

  ╔═════════════════════════════════════════════════════════════════════╗
  ║                     COMO USAR O PRIMARY BUTTON                      ║
  ╚═════════════════════════════════════════════════════════════════════╝

    Botão com ícone do Bootstrap:
    <PrimaryButton
      label="Confirmar"
      :filled="true"
      icon="bi-check-circle" -> Classe do ícone Bootstrap
      iconType="bootstrap"
      iconPosition="left"
    />

    Botão com ícone de imagem SVG:
    <PrimaryButton
      label="Cancelar"
      :filled="false"
      :icon="require('@/assets/icons/logo.svg')"
      iconType="image"
      iconPosition="right"
  />

  Deve importar a imagem no local para utilizar, Vite não cosegue carregar dinamicamente a imagem.
-->

<!-- urbverde-ui/src/components/buttons/PrimaryButton.vue -->
<template>
  <button
    class="primary-button"
    :class="{ 'filled': filled, 'notFilled': !filled}"
  >

    <!-- Ícone do Bootstrap ou imagem no lado esquerdo -->
    <span v-if="icon && iconPosition === 'left'" class="icon">
      <i v-if="iconType === 'bootstrap'" :class="`bi ${icon}`"></i>
      <img v-else :src="icon" alt="icon" />
    </span>

    <!-- Texto do botão -->
    <span class="body-small-medium">{{ label }}</span>

    <!-- Ícone do Bootstrap ou imagem no lado direito -->
    <span v-if="icon && iconPosition === 'right'" class="icon">
      <i v-if="iconType === 'bootstrap'" :class="`bi ${icon}`"></i>
      <img v-else :src="icon" alt="icon" />
    </span>

  </button>
</template>

<script>
export default{
  name: 'PrimaryButton',
  props: {
    label: {
      type: String,
      default: ''
    },
    filled: {
      type: Boolean,
      default: true,
    },
    iconType: {
      type: String, // "bootstrap" ou "image"
      default: 'bootstrap',
      validator: (value) => ['bootstrap', 'image'].includes(value),
    },
    icon: {
      type: String, // Caminho ou URL do ícone
      default: null,
    },
    iconPosition: {
      type: String, // Define a posição do ícone: "left" ou "right"
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value),
    },
  },
};

</script>

<style scoped lang="scss">

  .primary-button{
    width: 261px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    gap: 6px;
    transition: all 0.1s ease-in-out;
  }

  .icon img {
    width: 16px;
    height: 16px;
    margin-top: -4px;
  }

  .filled {
    border: none;
    background: radial-gradient(48.28% 48.28% at 51.72% 100%, #146C43 0%, #198754 100%);
    box-shadow: 0px 0px 2px 0px rgba(255, 255, 255, 0.25) inset;
    color: map-get($gray, white);
  }

  .filled:hover {
    background: radial-gradient(48.28% 48.28% at 51.72% 100%, #0D5232 0%, #15774A 100%);
    box-shadow: 0px 0px 2px 0px rgba(255, 255, 255, 0.25) inset;
  }

  .notFilled {
    border: 1px solid map-get($green, 600);
    background-color: #FFF;
    color: map-get($green, 600);
  }

  .notFilled:hover {
    border: 3px solid map-get($green, 600);
    box-shadow: 0px 0px 2px 0px rgba(255, 255, 255, 0.25) inset;
  }

</style>
