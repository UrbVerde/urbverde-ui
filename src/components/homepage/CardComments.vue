<template>
  <div class="cards shadow-lg">
    <div class="top-content body-small-regular">
      <p>
        “ {{ quoteBeforeHighlight }}
        <span class="highlight body-small-bold">{{ highlight }}</span>
        {{ quoteAfterHighlight }} ”
      </p>
    </div>

    <div class="bottom-content">
      <div>
        <img
          :src="imageSrc"
          :alt="imageAlt"
          loading="lazy"
        />
      </div>
      <div class="wrapper-bottom-content">
        <h3 class="title body-small-bold">
          {{ author }}
        </h3>
        <h4 class="subtitle body-small-regular">
          {{ role }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComments',
  props: {
    quoteBeforeHighlight: {
      type: String,
      default: '',
    },
    highlight: {
      type: String,
      default: '',
    },
    quoteAfterHighlight: {
      type: String,
      default: '',
    },
    imageSrc: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
  },
};
</script>

  <style scoped lang="scss">
  .cards {
    display: flex;
    padding: 24px;
    flex-direction: column;
    flex: 1 1 calc(33.333% - 24px);
    border-radius: 16px;
    border: 1px solid #E9ECEF;
    max-width: 100%;
    min-width: 280px;
    gap: 24px;
  }

  .top-content {
    color: map-get($body-text, body-color);
  }

  .top-content p {
    padding: 0;
    margin: 0;
  }

  .top-content p .highlight {
    background-color: map-get($green, 100);
    padding: 0 4px;
    border-radius: 4px;
    line-height: 150%;
  }

  .bottom-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    flex: 1;
    width: 100%;
  }

  .bottom-content p {
    padding: 0;
    margin: 0;
  }

  .bottom-content h3 {
    padding: 0;
    margin: 0;
  }

  .bottom-content h4 {
    padding: 0;
    margin: 0;
  }

  .bottom-content img {
    width: 56px;
    height: 56px;
    border-radius: 56px;
    border: 1px solid map-get($gray, 400);
    background: url(<path-to-image>) lightgray 50% / cover no-repeat;
  }

  .wrapper-bottom-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    align-self: stretch;
    width: 100%;
  }

  .wrapper-bottom-content .title {
    color: map-get($body-text, body-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
    width: 100%;
  }

  .wrapper-bottom-content .subtitle {
    color: #6C757D;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
    width: 100%;
  }
  </style>
