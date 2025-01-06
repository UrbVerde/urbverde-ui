<template>
  <div class="custom-card">
    <div class="card-image-wrapper" v-if="$slots['custom-content']">
      <slot name="custom-content"></slot>
    </div>

    <div class="card-header">
      <h1 v-if="title" class="titulo">{{ title }}</h1>
      <h2 v-if="value" class="info">{{ value }}</h2>
      <p v-if="subtitle" class="textodescritivo">{{ subtitle }}</p>
    </div>

    <div class="card-content" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
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
  },
};
</script>

<style scoped>
.custom-card {
  border-radius: 16px;
  border: 1px solid var(--Gray-200, #E9ECEF);
  background: var(--Gray-White, #FFF);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  width: 285px;
  padding: 24px;
  box-sizing: border-box;
}

.card-image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px; 
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px; 
}

.titulo {
  color: var(--Body-Text-Body-Color, #212529);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; 
  margin-bottom: 4px;
}

.info {
  font-size: 28px;
  font-weight: bold;
  color: var(--Green-500, #198754);
  margin: 8px 0;
}

.textodescritivo {
  color: var(--Gray-600, #6C757D);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
