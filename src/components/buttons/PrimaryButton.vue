<template>
  <button
    class="primary-button"
    :class="{ 'filled': filled, 'notFilled': !filled }"
  >
    <span v-if="icon && iconPosition === 'left'" class="icon">
      <IconComponent
        v-if="iconType === 'bootstrap'"
        :name="icon"
        :size="16"
      />
      <img v-else
           :src="icon"
           alt="icon"
           class="icon-image" />
    </span>

    <span class="body-small-medium">{{ label }}</span>

    <span v-if="icon && iconPosition === 'right'" class="icon">
      <IconComponent
        v-if="iconType === 'bootstrap'"
        :name="icon"
        :size="16"
      />
      <img v-else
           :src="icon"
           alt="icon"
           class="icon-image" />
    </span>
  </button>
</template>

<script setup>
import IconComponent from '@/components/icons/IconComponent.vue';

defineProps({
  label: {
    type: String,
    default: ''
  },
  filled: {
    type: Boolean,
    default: true
  },
  iconType: {
    type: String,
    default: 'bootstrap',
    validator: (value) => ['bootstrap', 'image'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  }
});
</script>

<style scoped lang="scss">
.primary-button {
  width: 261px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  gap: 8px;
  padding: 0 16px;
  transition: all 0.1s ease-in-out;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  width: 16px;
  height: 16px;
}

.filled {
  border: none;
  background: radial-gradient(48.28% 48.28% at 51.72% 100%, #146C43 0%, #198754 100%);
  box-shadow: 0px 0px 2px 0px rgba(255, 255, 255, 0.25) inset;
  color: map-get($gray, white);
}

.filled:hover {
  background: radial-gradient(48.28% 48.28% at 51.72% 100%, #0D5232 0%, #15774A 100%);
}

.notFilled {
  border: 1px solid map-get($green, 600);
  background-color: #FFF;
  color: map-get($green, 600);
}

.notFilled:hover {
  border: 3px solid map-get($green, 600);
}
</style>
