<!-- urbverde-ui/src/components/legend/CardLayerSwitch.vue -->
<template>
  <div
    class="wrapper-grip"
    :class="{ 'grabbing': isGrabbing }"
    @mousedown="startGrabbing"
    @mouseup="stopGrabbing"
    @mouseleave="stopGrabbing"
  >
    <i class="bi-grip-vertical grip-icon"></i>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isGrabbing = ref(false);

const startGrabbing = () => {
  isGrabbing.value = true;
};

const stopGrabbing = () => {
  isGrabbing.value = false;
};
</script>

  <style scoped lang="scss">
  .wrapper-grip {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    cursor: grab;
    left: 0px;
    transform: translateY(-50%);
    top: 50%;

    .grip-icon {
      color: map-get($theme, primary);
      font-size: 20px;
      display: flex;
      margin: 0 auto 0 0;
    }

    &.grabbing {
      cursor: grabbing;
    }
  }
  </style>
