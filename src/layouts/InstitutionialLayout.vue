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
    }
  }
};
</script>

  <style scoped lang="scss">
  @import '@/assets/styles/breakpoints.scss';

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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20vh 0 0 0;
    gap: 20vh;
  }
  </style>
