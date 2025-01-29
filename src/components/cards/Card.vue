<template>
  <div class="custom-card">
    <div class="card-image-wrapper" v-if="imagePosition === 'top' && imageSlot">
      <slot name="image"></slot>
    </div>

    <div class="card-header">
      <h1 v-if="title" class="titulo heading-h6">{{ title }}</h1>
    </div>

    <div class="content-wrapper">
      <h2 v-if="value" class="value">{{ value }}</h2>
      <p v-if="subtitle" class="textodescritivo body-small-medium">{{ subtitle }}</p>
    </div>

    <div class="card-image-wrapper" v-if="imagePosition === 'middle' && imageSlot">
      <slot name="image"></slot>
    </div>

    <div class="card-content" v-if="$slots.default">
      <slot></slot>
    </div>

    <div class="card-image-wrapper" v-if="imagePosition === 'bottom' && imageSlot">
      <slot name="image"></slot>
    </div>

    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardBase',
  props: {
    title: {
      type: String,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    imagePosition: {
      type: String,
      default: 'top',
      validator: value => ['top', 'middle', 'bottom'].includes(value),
    },
  },
  computed: {
    imageSlot() {
      return !!this.$slots.image;
    },
  },
};
</script>

<style>
.custom-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
  width: 100%;
  border-radius: 16px;
  border: 1px solid var(--Gray-200, #E9ECEF);
  background: var(--Gray-White, #FFF);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
}

.card-image-wrapper {
  display: flex;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  align-self: stretch;
}

.content-wraper{
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
}

.content-wraper .textodescritivo{
  color: var(--Gray-600, #6C757D);
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;

}

.value {
  color: var(--Green-500, #198754);
}

.card-content {
  display: flex;
  flex-direction: column;
}

</style>
