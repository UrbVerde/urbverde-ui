<template>
  <div class="aside__toolbar_layers">
    <VegetacaoSidebar v-if="this.$route.params.categoria == 'vegetacao'" />

    <PracasParquesSidebar
      v-if="this.$route.params.categoria == 'pracasparques'"
    />

    <TemperaturaSidebar v-if="this.$route.params.categoria == 'temperatura'" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.itemActive {
  background-color: #01dc82 !important;
}

.aside__toolbar_layers {
  margin-top: 1em;
  label {
    color: #003c3c;
    font-size: 13px;
  }
}
</style>
