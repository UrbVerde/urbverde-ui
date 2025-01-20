<template>
  <div class="custom-card">
    <div class="card-image-wrapper" v-if="imagePosition === 'top' && imageSlot">
      <slot name="image"></slot>
    </div>

    <div class="card-header">
      <h1 v-if="title" class="titulo">{{ title }}</h1>
    </div>

    <div class="content-wrapper">
      <h2 v-if="value" class="value">{{ value }}</h2>
      <p v-if="subtitle" class="textodescritivo">{{ subtitle }}</p>
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
  justify-content: justify;
  align-items: flex-start;
  align-self: stretch;
}

.content-wraper{
  display: flex;
  padding-bottom: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
}
.card-header .titulo {
  color: var(--Body-Text-Body-Color, #212529);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500; 
  line-height: 120%; /* 19.2px */
}

.value {
  color: var(--Green-500, #198754);
}

.content-wraper .textodescritivo{
  color: var(--Gray-600, #6C757D);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 21px */
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}
</style>