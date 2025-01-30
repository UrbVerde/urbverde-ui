<!-- urbverde-ui/src/components/homepage/UrbverdeEducaTopics.vue -->
<template>
  <div class="urbverde-topics">
    <!-- Imagem -->
    <div class="image-wrapper">
      <img :src="imageSrc" :alt="imageAlt" />
    </div>

    <!-- Título -->
    <h3 class="title heading-h6">
      {{ title }}
    </h3>
  </div>
</template>

<script>
export default {
  name: 'UrbVerdeEducaTopics',
  props: {
    imageSrc: {
      type: String,
      required: true, // A imagem é obrigatória
    },
    imageAlt: {
      type: String,
      default: 'Imagem relacionada', // Texto alternativo
    },
    title: {
      type: String,
      required: true, // Título obrigatório
    },
  },
};
</script>

  <style scoped lang="scss">
  .urbverde-topics {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex: 1 0 0;

    .image-wrapper {
      width: 272px;
      height: 169px;
      overflow: hidden;
      border-radius: 8px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      color: map-get($body-text, body-color);
      text-align: center;
    }
  }
  </style>
