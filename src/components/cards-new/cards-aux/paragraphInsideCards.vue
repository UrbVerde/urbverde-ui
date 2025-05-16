<template>
  <div class="card-paragraph">
    <div class="title-wrapper">
      <CardTitle
        v-if="showCardTitle"
        :title="title"
        :subtitle="subtitle"
        :show-subtitle="showSubtitle"
        :show-left-icon="showLeftIcon"
        :show-right-icon="showRightIcon"
        :left-icon-class="leftIconClass"
        :right-icon-class="rightIconClass"
      />
    </div>
    <div class="text-wrapper">
      <!-- Title Paragraph Wrapper -->
      <div v-if="showParagraphTitle" class="titleParagraphWrapper">
        <h5 class="heading-h5" :class="{ 'text-center': type === 'paragraph-center' }">
          {{ paragraphTitle }}
        </h5>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- List Type -->
        <ul v-if="type === 'list'" class="benefits-card-list">
          <li v-for="(item, index) in listItems" :key="index" class="benefits-card-item">
            <span class="benefits-card-number body-small-medium">{{ index + 1 }}</span>
            <p class="text-list body-small-regular" v-html="item"></p>
          </li>
        </ul>

        <!-- Paragraph Left Type -->
        <div v-else-if="type === 'paragraph-left'" class="paragraph-wrapper">
          <p class="paragraph body-small-regular">{{ paragraphText }}</p>
        </div>

        <!-- Paragraph Center Type -->
        <div v-else-if="type === 'paragraph-center'" class="paragraph-wrapper">
          <p class="paragraph body-small-regular text-center">{{ paragraphText }}</p>
        </div>

        <!-- Slot Type -->
        <slot v-else></slot>
      </div>

    </div>
    <!-- Button Wrapper -->
    <div v-if="showPrimaryButton" class="button-wrapper" :class="{ 'text-center': type === 'paragraph-center' }">
      <a
        v-if="buttonLink"
        :href="buttonLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <PrimaryButton
          :label="buttonLabel"
          :filled="true"
          :icon="buttonIcon"
          :icon-type="buttonIconType"
        />
      </a>
      <PrimaryButton
        v-else
        :label="buttonLabel"
        :filled="true"
        :icon="buttonIcon"
        :icon-type="buttonIconType"
      />
    </div>
  </div>
</template>

<script setup>
import CardTitle from './cardTitle.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

// CardTitle props
defineProps({
  // CardTitle props
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

  // Paragraph Title props
  showParagraphTitle: {
    type: Boolean,
    default: false
  },
  paragraphTitle: {
    type: String,
    default: ''
  },

  // Content type and content props
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

  // Button props
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
a{
  text-decoration: none;
  display: flex;
  width: 100%;
  height: auto;
}
.card-paragraph {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}

.title-wrapper {
  display: flex;
  height: auto;
  padding: 24px 24px 16px 24px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
}

.text-wrapper {
  display: flex;
  padding: 0 24px 24px 24px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}
.content {
  padding: 0;
}

.titleParagraphWrapper {
  display: flex;
  padding: 0 0 24px 0;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  h5 {
    color: map-get($body-text, body-color);
    text-align: left;
    margin: 0;

    &.text-center {
      text-align: center;
    }
  }
}

.paragraph-wrapper {
  display: flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  .paragraph {
    color: map-get($theme, secondary);
    text-align: left;
    margin: 0;

    &.text-center {
      text-align: center;
    }
  }
}

.button-wrapper {
  display: flex;
  padding: 0px 24px 24px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;

  &.text-center {
    align-items: center;
  }
}

:deep(.primary-button) {
  width: 100%;
}

// List styles from TipsCard
.benefits-card-list {
  list-style: none;
  padding: 0 0 24px 0;
  margin: 0;
  width: 100%;
}

.benefits-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0px;
  }

  &:first-child {
    margin-top: 8px;
  }
}

.benefits-card-number {
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: map-get($green, 100);
  color: map-get($green, 700);
}

.benefits-card-item p {
  margin: 0;
  flex: 1;
}

.text-list {
  color: map-get($theme, secondary);
}
</style>
