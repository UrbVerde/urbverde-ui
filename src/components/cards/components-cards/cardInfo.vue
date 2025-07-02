<!-- urbverde-ui/src/components/cards/components-cards/cardInfo.vue -->
<template>
  <CardBase
    :show-info-button="showInfoButton"
    :modal-title="modalTitle"
    :modal-body-text="modalBodyText"
    :show-see-on-map="showSeeOnMap"
    :seeOnMapLayerID="seeOnMapLayerID"
    :city-code="cityCode"
    :class="{ 'background-image': midiaPosition === 'background' }"
    :style="midiaPosition === 'background' ? { backgroundImage: `url(${midiaLink})` } : {}"
    :custom-padding="'8px'"
    :custom-gap="'0'"
  >
    <div class="card-info-wrapper" :class="midiaPosition">
      <!-- Top position -->
      <template v-if="showMidia && midiaPosition === 'top'">
        <MidiaInsideCards
          :type-midia="midiaType"
          :imageSrc="imageSrc || (midiaType === 'image' ? midiaLink : undefined)"
          :videoUrl="videoUrl || (midiaType === 'video' ? midiaLink : undefined)"
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
          :button-link="buttonLink"
        />
      </template>

      <!-- Bottom position -->
      <template v-else-if="showMidia && midiaPosition === 'bottom'">
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
          :button-link="buttonLink"
        />
        <MidiaInsideCards
          :type-midia="midiaType"
          :imageSrc="imageSrc || (midiaType === 'image' ? midiaLink : undefined)"
          :videoUrl="videoUrl || (midiaType === 'video' ? midiaLink : undefined)"
        />
      </template>

      <!-- Left position -->
      <template v-else-if="showMidia && midiaPosition === 'left'">
        <MidiaInsideCards
          v-if="largerThan('tablet')"
          :type-midia="midiaType"
          :imageSrc="imageSrc || (midiaType === 'image' ? midiaLink : undefined)"
          :videoUrl="videoUrl || (midiaType === 'video' ? midiaLink : undefined)"
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
          :button-link="buttonLink"
        />
        <MidiaInsideCards
          v-if="!largerThan('tablet')"
          :type-midia="midiaType"
          :imageSrc="imageSrc || (midiaType === 'image' ? midiaLink : undefined)"
          :videoUrl="videoUrl || (midiaType === 'video' ? midiaLink : undefined)"
        />
      </template>

      <!-- Right position -->
      <template v-else-if="showMidia && midiaPosition === 'right'">
        <MidiaInsideCards
          v-if="!largerThan('tablet')"
          :type-midia="midiaType"
          :imageSrc="imageSrc || (midiaType === 'image' ? midiaLink : undefined)"
          :videoUrl="videoUrl || (midiaType === 'video' ? midiaLink : undefined)"
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
          :button-link="buttonLink"
        />
        <MidiaInsideCards
          v-if="largerThan('tablet')"
          :type-midia="midiaType"
          :imageSrc="imageSrc || (midiaType === 'image' ? midiaLink : undefined)"
          :videoUrl="videoUrl || (midiaType === 'video' ? midiaLink : undefined)"
        />
      </template>

      <!-- Background or no media -->
      <template v-else>
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
          :button-link="buttonLink"
        />
      </template>
    </div>
  </CardBase>
  <CardBase
    v-if="showInfoButton"
    :show-info-button="showInfoButton"
    :modal-title="modalTitle"
    :modal-body-text="modalBodyText"
    :show-see-on-map="showSeeOnMap"
    :seeOnMapLayerID="seeOnMapLayerID"
    :city-code="cityCode"
    style="display: none;" />
</template>

<script setup>
import CardBase from '../base/cardBase.vue';
import MidiaInsideCards from '../base/midiaInsideCards.vue';
import ParagraphInsideCards from '../base/paragraphInsideCards.vue';
import { useWindowSize } from '@/utils/useWindowsSize';

const { largerThan } = useWindowSize();

defineProps({
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
    type: [String, Object],
    default: ''
  },
  imageSrc: {
    type: [String, Object],
    default: undefined
  },
  videoUrl: {
    type: String,
    default: undefined
  },
  midiaPosition: {
    type: String,
    default: null,
    validator: (value) => [null, 'top', 'bottom', 'left', 'right', 'background'].includes(value)
  },

  // See on Map props
  showSeeOnMap: {
    type: Boolean,
    default: false
  },
  seeOnMapLayerID: {
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
  },
  buttonLink: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

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
      padding-top: 32px;
    }
  }

  &.bottom {
    :deep(.midia-wrapper) {
      padding-bottom: 32px;
    }
  }

  &.left, &.right {
    flex-direction: row;
    justify-content: center;
    align-items: center;

    :deep(.card-paragraph) {
      max-width: 600px;
    }

    @include breakpoint-down('tablet') {
      flex-direction: column;

      :deep(.midia-wrapper) {
        padding: 16px 24px;
      }
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
