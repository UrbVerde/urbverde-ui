<template>
  <div class="page">
    <header>
      <NavbarHomepage :active-item="activeItem" />
    </header>

    <main>
      <section class="content-wrapper">
        <div class="image-background-wrapper">
          <div class="image-background">
            <img :src="backgroundImage" :alt="backgroundAlt" />
          </div>
        </div>

        <section class="content container">
          <div class="page-title">
            <h1>
              <span class="title heading-h1">{{ pageTitle }}</span>
            </h1>
            <h4 class="subtitle heading-h5">{{ pageSubtitle }}</h4>
          </div>
          <slot></slot>
        </section>
      </section>
    </main>

    <footer>
      <UrbVerdeFooter />
    </footer>
  </div>
</template>

<script>
import NavbarHomepage from '@/components/navbar/NavbarHomepage.vue';
import UrbVerdeFooter from '@/components/homepage/UrbVerdeFooter.vue';
import backgroundImageDefault from '@/assets/images/institutional-pages/image-background.svg';

export default {
  name: 'InstitutionalLayout',
  components: {
    NavbarHomepage,
    UrbVerdeFooter,
  },
  props: {
    activeItem: {
      type: String,
      required: true
    },
    backgroundImage: {
      type: String,
      default: backgroundImageDefault
    },
    backgroundAlt: {
      type: String,
      default: 'Paisagem natural com árvores para um futuro sustentável'
    },
    pageTitle: {
      type: String,
      default: 'Título da página'
    },
    pageSubtitle: {
      type: String,
      default: 'Subtítulo da página'
    },
  }
};
</script>

  <style scoped lang="scss">
  @import '@/assets/styles/breakpoints.scss';

  h1, h4 {
    margin: 0;
  }

  .page {
    position: relative;
    overflow-x: hidden;
    background-color: #FCFDFC;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .image-background-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: -1;
    overflow: hidden;
  }

  .image-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: -72px;
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
    flex: 1;
  }

  .container {
    max-width: 1184px;
    margin: 0 auto;
  }

  .content {
    display: flex;
    max-width: 1184px;
    padding: 184px 0px 160px 0px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 184px;
    align-self: stretch;
  }

  .page-title{
    display: flex;
    max-width: 720px;
    padding: 0 24px 0 24px;
    margin: auto;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    align-self: stretch;

  }

  .title{
    font-size: 64px;
    color: map-get($primary-fade, 700);
    font-weight: 700;
    text-align: center;
    display: flex;
  }

  .subtitle{
    color: map-get($theme, secondary);
    text-align: center;
  }
  </style>
