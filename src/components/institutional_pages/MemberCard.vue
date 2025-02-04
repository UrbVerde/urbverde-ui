<!-- MemberCard.vue -->
<template>
  <div
    class="card-members shadow-sm"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Botões sociais - só aparecem no hover e se tiverem link -->
    <div class="buttons-wrapper" v-show="isHovered">
      <a
        v-if="linkedinUrl"
        :href="linkedinUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="@/assets/images/institutional-pages/about-us/button-linkedin.svg"
          alt="Link para LinkedIn"
        >
      </a>

      <a
        v-if="lattesUrl"
        :href="lattesUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="@/assets/images/institutional-pages/about-us/button-lattes.svg"
          alt="Link para Lattes"
        >
      </a>

      <a
        v-if="orcidUrl"
        :href="orcidUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="@/assets/images/institutional-pages/about-us/button-orcid.svg"
          alt="Link para Orcid"
        >
      </a>
    </div>

    <div class="content-text" :class="{ 'hovered': isHovered }">
      <div class="text-wrapper">
        <h4 class="member-title body-normal-bold">{{ name }}</h4>
        <p v-if="role" class="member-subtitle body-small-medium">{{ role }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemberCard',

  props: {
    backgroundImage: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: ''
    },
    linkedinUrl: {
      type: String,
      default: ''
    },
    lattesUrl: {
      type: String,
      default: ''
    },
    orcidUrl: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isHovered: false
    };
  }
};
</script>

  <style scoped lang="scss">
  h4, p{
    margin: 0;
  }

  .buttons-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 2;

    a {
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
        transform-origin: center;

      img {
        width: 40px;
        height: 40px;
      }

      &:hover {
        transform: scale(1.1);
        opacity: 0.9;
      }
    }
  }

  .card-members {
    display: flex;
    width: 240px;
    height: 300px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    border: 1px solid map-get($gray, 200);
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  .content-text {
    display: flex;
    top: 0;
    left: 0;
    width: 240px;
    height: 300px;
    padding: 32px 16px 16px 16px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 24px;
    position: absolute;
    z-index: 1;

    &::before,
    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        transition: opacity 0.3s ease;
    }

    &::before {
        background: linear-gradient(180deg, rgba(10, 54, 34, 0.00) 50%, rgba(10, 54, 34, 0.20) 75%, #0A3622 100%);
        opacity: 1;
    }

    &::after {
        background: linear-gradient(180deg, rgba(10, 54, 34, 0.00) 40%, rgba(10, 54, 34, 0.20) 60%, #0A3622 100%);
        opacity: 0;
    }

    &.hovered {
        &::before {
        opacity: 1;
        }

        &::after {
        opacity: 1;
        }
    }

    .text-wrapper {
        position: relative;
        z-index: 2;
    }
    }

  .text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .member-title {
    color: map-get($gray, white);
    text-align: start;
  }

  .member-subtitle {
    color: map-get($gray, white);
    opacity: 0.85;
    text-align: start;
  }
  </style>
