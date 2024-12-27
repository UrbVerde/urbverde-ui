<template>
  <div>
      <NavbarHomepage />
  </div>

  <div class="content">
    <h1>
      Content
    </h1>
  </div>
</template>


<script>
  import NavbarHomepage from '@/components/navbar/NavbarHomepage.vue';

  export default {
  name: "Home",
  components: {
      NavbarHomepage,
  },
  };

</script>


<style scoped lang="scss">

  .content {
    background-color: map-get($primary-fade-colors, 400);
    padding: 20px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

</style>