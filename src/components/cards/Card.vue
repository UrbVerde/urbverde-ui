<template>
  <div class="custom-card shadow-sm">
    <div class="card-image-wrapper" v-if="imagePosition === 'top' && imageSlot">
      <slot name="image"></slot>
    </div>

    <div class="card-header">
      <h6 v-if="title" class="titulo heading-h6">{{ title }}</h6>
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

<style scoped lang="scss">

p, h6{
  margin: 0;
}

.custom-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: auto;
  width: 100%;
  border-radius: 16px;
  border: 1px solid map-get($gray, 200);
  background-color: map-get($gray, white);
  gap: 16px;
}

.content-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

.card-image-wrapper {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  height: auto;
}

.card-header {
  display: flex;
  align-items: center;
  align-self: stretch;
  width: auto;
}

.card-header .titulo{
  color: map-get($body-text, body-color);
  height: 100%;
}

.content-wraper{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.textodescritivo{
  color: map-get($gray, 600);
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;

}

.value {
  color: map-get($green, 500);
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: 'Montserrat';
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  padding: 0;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
}

</style>
