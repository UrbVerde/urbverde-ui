<template>
  <button @click="changeButton" :class="['btn', 'btn-light', 'minimize-btn', { 'btn-open': !minimized, 'btn-closed': minimized }]">
    <img :src="minimized ?  maximize : minimize" alt="" />
  </button>
</template>

<script>
import minimizeImage from '@/assets/icons/minimize.svg';
import maximizeImage from '@/assets/icons/maximize.svg';

export default {
  methods: {
    changeButton() {
      this.$emit('changed-state');
      this.minimized=!this.minimized;
    }
  },
  data() {
    return {
      minimized:false,
      minimize: minimizeImage,
      maximize: maximizeImage
    };
  }
};
</script>

<style scoped>
.minimize-btn {
  display: flex;
  padding: 10px;
  align-items: center;
  transition: 0.3s;
  margin-left: -10px
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
