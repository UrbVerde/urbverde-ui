<!-- urbverde-ui/src/components/side_bar/buttons/CollapseButton.vue -->
<template>
  <div class="collapse-button-container">
    <button class="collapse-button" @click="toggleSidebar">
      <i class="bi" :class="iconClass"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const iconClass = computed(() => props.isOpen ? 'bi-list' : 'bi-list');
</script>

  <style scoped lang="scss">
  @import '@/assets/styles/colors.scss';

  .collapse-button-container {
    display: flex;
  }

  .collapse-button {
    display: flex;
    width: 48px;
    height: 48px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid map-get($primary-fade, 100);
    background: map-get($primary-fade, 100);
    cursor: pointer;

    i {
      font-size: 32px;
      color: map-get($green, 600);
    }
  }
  </style>
