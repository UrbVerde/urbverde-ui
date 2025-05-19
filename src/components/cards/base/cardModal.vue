<template>
  <modalBootstrap
    :ref="el => { if (el) modalRef = el }"
    :modalId="uniqueModalId"
    :title="title"
    :bodyText="bodyText"
    :showSecondaryButton="false"
    primaryButtonText="Ok"
    :primaryButtonClosesModal="true"
  />
</template>

<script setup>
import { ref } from 'vue';
import modalBootstrap from '@/components/modal/modalBootstrap.vue';

defineProps({
  title: {
    type: String,
    default: 'Informações'
  },
  bodyText: {
    type: String,
    default: ''
  }
});

const modalRef = ref(null);
const uniqueModalId = ref(`modalCard-${Date.now()}-${Math.random().toString(36)
  .substr(2, 9)}`);

const show = () => {
  if (modalRef.value) {
    modalRef.value.show();
  }
};

defineExpose({
  show
});
</script>
