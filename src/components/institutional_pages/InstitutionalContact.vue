<template>
  <div
    class="wrapper-card shadow-sm"
    :style="{ backgroundImage: currentBackground }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="icon">
      <i :class="`bi ${iconName}`"></i>
    </div>
    <div class="content">
      <div class="label">
        <h4 class="title heading-h4">{{ title }}</h4>
        <div class="subtitle">
          <p class="body-normal-regular">
            {{ description }}
          </p>
          <p class="body-normal-regular">
            {{ contactInfo }}
          </p>
          <i
            v-if="showCopyButton && isHovered"
            :class="`bi ${copyIcon} cursor-pointer copy-icon`"
            @click="copyToClipboard"
          ></i>
        </div>
      </div>

      <a
        v-if="showButton"
        class="contact-button-wrapper"
        :href="contactLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <PrimaryButton
          :label="buttonLabel"
          :filled="false"
          iconType="bootstrap"
          icon="bi bi-arrow-right"
          iconPosition="right"
        />
      </a>
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import backgroundImage from '@/assets/images/institutional-pages/contacts/contact-background-default.png';
import backgroundImageHover from '@/assets/images/institutional-pages/contacts/contact-background-hover.png';

export default {
  name: 'InstitutionalContact',
  components: {
    PrimaryButton,
  },
  props: {
    iconName: {
      type: String,
      default: 'bi-envelope'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    contactInfo: {
      type: String,
      default: ''
    },
    buttonLabel: {
      type: String,
      default: ''
    },
    contactLink: {
      type: String,
      default: ''
    },
    showCopyButton: {
      type: Boolean,
      default: true
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultBackground: `url(${backgroundImage})`,
      hoverBackground: `url(${backgroundImageHover})`,
      isHovered: false,
      hasCopied: false
    };
  },
  computed: {
    currentBackground() {
      return this.isHovered ? this.hoverBackground : this.defaultBackground;
    },
    copyIcon() {
      return this.hasCopied ? 'bi-check-lg' : 'bi-copy';
    }
  },
  methods: {
    handleMouseEnter() {
      this.isHovered = true;
    },
    handleMouseLeave() {
      this.isHovered = false;
      this.hasCopied = false;
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.contactInfo)
        .then(() => {
          this.hasCopied = true;
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  },
  mounted() {
    const img = new Image();
    img.src = backgroundImageHover;
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.wrapper-card {
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  max-width: 352px;
  height: auto;
  width: 100%;
  padding: 40px 24px 40px 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  border-radius: 24px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f8f9fa;
}

.copy-icon {
  opacity: 0;
  transition: all 0.3s ease;
}

.wrapper-card:hover .copy-icon {
  opacity: 1;
  cursor: pointer;
}

h4, p{
  margin: 0;
}

a{
  text-decoration: none;
}

.wrapper-card .icon{
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper-card .icon .bi{
  font-size: 60px;
  height: auto;
  line-height: 1;
  color: map-get($gray, white);
}

.wrapper-card .content{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
}

.wrapper-card .content .label{
  display: flex;
  padding: 0px 16px;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

.wrapper-card .content .label .title{
  width: 100%;
  color: map-get($gray, white);
}

.wrapper-card .content .label .subtitle p{
  color: map-get($gray, white);
  width: 100%;
  opacity: 0.9;
}

.wrapper-card .content .label .subtitle{
  position: relative;
  width: 100%;
}

.wrapper-card .content .label .subtitle .bi{
  position: absolute;
  right: -12px;
  top: 11px;
  font-size: 24px;
  line-height: 1;
  color: map-get($gray, white);
  transition: all 0.3s ease;
}

.contact-button-wrapper :deep(.primary-button) {
  width: auto;
  border-radius: 99px;
  padding: 0px 24px;
}
</style>
