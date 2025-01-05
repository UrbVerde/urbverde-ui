<template>
  <router-link :to="to" class="container">
    <img src="@/assets/images/logo-white.png" alt="Logo Homepage" class="logo" />
    <span class="logo-text">URBVERDE</span>
  </router-link>
</template>

<script>
export default {
  name: 'NavbarLogo',
  props: {
    to: {
      type: String,
      default: '/',
    },
  },
};
</script>

<style scoped>
.container {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo {
  width: 32px;
  height: 32px;
}

.logo-text {
  color: var(--Theme-Primary, #025949);
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: 1px;
  leading-trim: both;
  text-edge: cap;
}
</style>
