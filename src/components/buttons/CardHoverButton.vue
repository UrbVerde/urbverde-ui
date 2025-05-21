<!-- urbverde-ui/src/components/buttons/CardHoverButton.vue -->
<template>
  <div class="info-button"
       @click="$emit('click')"
       data-bs-toggle="tooltip"
       :data-bs-title="tooltipText"
  >
    <i :class="iconClass"></i>
  </div>
</template>

<script setup>
defineProps({
  iconClass: {
    type: String,
    required: true
  },
  tooltipText: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>

<style scoped lang="scss">
.info-button {
    display: flex;
    width: 40px;
    height: 40px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border: 2px solid map-get($gray, 200);
    background: map-get($gray, white);
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: map-get($green, 500);
        color: map-get($green, 500);
    }

    i {
        font-size: 18px;
        color: map-get($body-text, body-color);
    }
}
</style>
