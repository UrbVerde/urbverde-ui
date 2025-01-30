<!-- urbverde-ui/src/components/side_bar/buttons/LogoButton.vue -->
<template>
  <div>
    <LogoRouterLink />
  </div>
</template>

<script>
import LogoRouterLink from '@/components/logo_router_link/LogoRouterLink.vue';

export default {
  name: 'LogoButton',
  components: {
    LogoRouterLink,
  },
};
</script>

<style scoped>
.logo-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 190px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
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
  letter-spacing: 1px;
  leading-trim: both;
  text-edge: cap;
}
</style>
