<template>
  <div class="card-title">
    <div class="icon-wrapper-left" v-if="showLeftIcon">
      <i :class="leftIconClass"></i>
    </div>
    <div class="title-wrapper">
      <h5 class="heading-h6">
        {{ title }}
      </h5>
      <p class="heading-h6" v-if="showSubtitle">
        {{ subtitle }}
      </p>
    </div>
    <div class="icon-wrapper-right" v-if="showRightIcon">
      <i :class="rightIconClass"></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showRightIcon: {
    type: Boolean,
    default: false
  },
  showLeftIcon: {
    type: Boolean,
    default: false
  },
  showSubtitle: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  rightIconClass: {
    type: String,
    default: 'bi bi-stars'
  },
  leftIconClass: {
    type: String,
    default: 'bi bi-stars'
  },
});
</script>

<style scoped lang="scss">
.card-title {
    display: flex;
    width: 100%;
    padding: 16px 24px;
    align-items: center;
    gap: 12px;
}

.title-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    flex: 1 0 0;
}

.title-wrapper:first-child {
    color: map-get($body-text, body-color);
}

.title-wrapper:last-child {
    color: map-get($gray, 550);
}

.icon-wrapper-left {
    font-size: 24px;
    display: flex;
    padding: 8px;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    background-color: map-get($gray, 100);
}

.icon-wrapper-right {
    font-size: 24px;
    display: flex;
    padding: 8px;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    background-color: map-get($gray, 100);
}
</style>
