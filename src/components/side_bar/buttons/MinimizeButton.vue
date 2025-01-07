<!-- urbverde-ui/src/components/buttons/MinimizeButton.vue -->
<template>
  <div class="alling-button">
  <button @click="changeButton" :class="['btn', 'btn-light', 'minimize-btn', minimized ? 'btn-closed' : 'btn-open']">
    <i :class="['bi', minimized ? 'bi-chevron-right' : 'bi-chevron-left']" style="font-size: 20px"></i>
  </button>
</div>
</template>

<script>
export default {
  data() {
    return {
      minimized: false
    };
  },
  methods: {
    changeButton() {
      this.$emit('changed-state');
      this.minimized = !this.minimized;
    }
  }
};
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