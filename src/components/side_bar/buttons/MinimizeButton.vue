<!-- urbverde-ui/src/components/side_bar/buttons/MinimizeButton.vue -->
<template>
  <div class="alling-button">
    <button
      @click="changeButton"
      :class="['btn', 'btn-light', 'minimize-btn', minimized ? 'btn-closed' : 'btn-open']"
    >
      <i v-if="smallerThan('tablet')" class="bi bi-x-lg" style="font-size: 20px"></i>
      <i v-else :class="['bi', minimized ? 'bi-chevron-right' : 'bi-chevron-left']" style="font-size: 20px"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWindowSize } from '@/utils/useWindowsSize';

const minimized = ref(false);
const emit = defineEmits(['changed-state']);
const { smallerThan } = useWindowSize();

function changeButton() {
  emit('changed-state');
  minimized.value = !minimized.value;
}
</script>

<style scoped>
.minimize-btn {
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  transition: 0.3s;
}

.minimize-btn i {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.btn-open {
  background-color: white;
  border-color: white;
}

.btn-closed {
  background: var(--Gray-100, #F8F9FA);
  border-color: var(--Gray-100, #F8F9FA);
}
</style>
