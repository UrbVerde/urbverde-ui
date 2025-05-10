<template>
  <div class="small-shadow card-base">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
.card-base {
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid map-get($gray, 200);
    background: map-get($gray, white);
    width: 100%;
    box-sizing: border-box;
}
</style>
