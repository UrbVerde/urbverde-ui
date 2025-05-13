<template>
  <CardBase
    :show-info-button="showInfoButton"
    :modal-title="modalTitle"
    :modal-body-text="modalBodyText"
    :class="{ 'background-image': midiaPosition === 'background' }"
    :style="midiaPosition === 'background' ? { backgroundImage: `url(${midiaLink})` } : {}"
  >
    <div class="card-info-wrapper" :class="midiaPosition">
      <MidiaInsideCards
        v-if="showMidia && midiaPosition !== 'background'"
        :type-midia="midiaType"
        :link="midiaLink"
      />
      <ParagraphInsideCards
        :show-card-title="showCardTitle"
        :title="title"
        :subtitle="subtitle"
        :show-subtitle="showSubtitle"
        :show-left-icon="showLeftIcon"
        :show-right-icon="showRightIcon"
        :left-icon-class="leftIconClass"
        :right-icon-class="rightIconClass"
        :show-paragraph-title="showParagraphTitle"
        :paragraph-title="paragraphTitle"
        :type="type"
        :list-items="listItems"
        :paragraph-text="paragraphText"
        :show-primary-button="showPrimaryButton"
        :button-label="buttonLabel"
        :button-icon="buttonIcon"
        :button-icon-type="buttonIconType"
      />
    </div>
  </CardBase>
</template>

<script setup>
import CardBase from './cards-aux/cardBase.vue';
import MidiaInsideCards from './cards-aux/midiaInsideCards.vue';
import ParagraphInsideCards from './cards-aux/paragraphInsideCards.vue';

defineProps({
  // CardBase props
  showInfoButton: {
    type: Boolean,
    default: false
  },
  modalTitle: {
    type: String,
    default: 'Informações'
  },
  modalBodyText: {
    type: String,
    default: ''
  },

  // MidiaInsideCards props
  showMidia: {
    type: Boolean,
    default: false
  },
  midiaType: {
    type: String,
    validator: (value) => ['image', 'video'].includes(value)
  },
  midiaLink: {
    type: String,
    default: ''
  },
  midiaPosition: {
    type: String,
    default: null,
    validator: (value) => [null, 'top', 'bottom', 'left', 'right', 'background'].includes(value)
  },

  // CardTitle props (from ParagraphInsideCards)
  showCardTitle: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  showSubtitle: {
    type: Boolean,
    default: false
  },
  showLeftIcon: {
    type: Boolean,
    default: false
  },
  showRightIcon: {
    type: Boolean,
    default: false
  },
  leftIconClass: {
    type: String,
    default: 'bi bi-stars'
  },
  rightIconClass: {
    type: String,
    default: 'bi bi-stars'
  },

  // Paragraph Title props (from ParagraphInsideCards)
  showParagraphTitle: {
    type: Boolean,
    default: false
  },
  paragraphTitle: {
    type: String,
    default: ''
  },

  // Content type and content props (from ParagraphInsideCards)
  type: {
    type: String,
    default: 'list',
    validator: (value) => ['list', 'paragraph-left', 'paragraph-center', 'slot'].includes(value)
  },
  listItems: {
    type: Array,
    default: () => []
  },
  paragraphText: {
    type: String,
    default: ''
  },

  // Button props (from ParagraphInsideCards)
  showPrimaryButton: {
    type: Boolean,
    default: false
  },
  buttonLabel: {
    type: String,
    default: ''
  },
  buttonIcon: {
    type: String,
    default: null
  },
  buttonIconType: {
    type: String,
    default: 'bootstrap'
  }
});
</script>

<style scoped lang="scss">
:deep(.card-base) {
  padding: 0px;
  gap: 0px;
}

.card-info-wrapper {
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: flex-start;

  &.top, &.bottom {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    :deep(.midia-wrapper) {
      padding: 16px 24px;
    }
  }

  &.top {
    :deep(.midia-wrapper) {
      padding-bottom: 40px;
    }
  }

  &.bottom {
    :deep(.midia-wrapper) {
      padding-top: 40px;
    }
  }

  &.left, &.right {
    flex-direction: row;
    justify-content: center;
    align-items: center;

    :deep(.card-paragraph) {
      width: 400px;
    }
  }

  &.background {
    :deep(.card-paragraph) {
      width: 60%;
    }
  }
}

.background-image {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
