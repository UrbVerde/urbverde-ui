<!-- urbverde-ui/src/components/cards/base/cardTitle.vue -->
<template>
  <div class="card-title">
    <div class="icon-wrapper-left" v-if="showLeftIcon">
      <i :class="leftIconClass"></i>
    </div>
    <div class="title-wrapper">
      <h5 class="title heading-h6">
        {{ title }}
      </h5>
      <p class="subtitle body-small-medium" v-if="showSubtitle">
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
p, h5 {
    margin: 0;
}

.card-title {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 12px;
}

.title-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    flex: 1 0 0;
}

.title-wrapper .title {
    color: map-get($body-text, body-color);
}

.title-wrapper .subtitle {
    color: map-get($gray, 550);
}

.icon-wrapper-left, .icon-wrapper-right {
    width: 40px;
    height: 40px;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: map-get($gray, 100);
    text-align: center;
    vertical-align: middle;
}
</style>
