<!-- src/components/icons/IconComponent.vue -->
<template>
  <span :style="sizeStyles">
    <!-- If it's a Bootstrap icon -->
    <i
      v-if="isBootstrapIcon"
      :class="iconClass"
      class="bi">
    </i>

    <!-- If it's an SVG path -->
    <img
      v-else-if="isSvgPath"
      :src="iconSource"
      :alt="name"
      class="svg-icon"
    />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 20,
  },
});

// Check if it’s a bootstrap icon
const isBootstrapIcon = computed(() =>
  props.name.startsWith('bi ') || props.name.startsWith('bi-')
);

// Check if it’s an SVG (we can adapt this check as needed)
const isSvgPath = computed(() => props.name.includes('.svg'));

// Construct the class for the <i> if it is a bootstrap icon
const iconClass = computed(() => {
  // If the user wrote “bi bi-cloud-sun”, we can keep it as-is,
  // or if they wrote “bi-cloud-sun” then prepend “bi ”
  if (props.name.startsWith('bi ')) {
    return props.name.replace('bi ', '');
  } else if (props.name.startsWith('bi-')) {
    return props.name;
  }

  return '';
});

// For the local SVG path
const iconSource = computed(() => new URL(`../../assets/icons/${props.name}`, import.meta.url).href);

// Size styles
const sizeStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));
</script>

  <style scoped>
  .svg-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  </style>
