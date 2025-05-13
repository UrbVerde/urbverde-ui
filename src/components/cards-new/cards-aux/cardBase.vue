<template>
  <div class="card-wrapper" ref="cardWrapper">
    <div v-if="isVisible"
         class="small-shadow card-base"
         @mouseenter="showButton = true"
         @mouseleave="showButton = false">
      <div v-if="showInfoButton" class="info-button-wrapper" :class="{ 'show': showButton }">
        <div class="info-button"
             @click="openModal"
             data-bs-toggle="tooltip"
             data-bs-title="Saiba mais sobre o dado"
        >
          <i class="bi bi-info"></i>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>

  <modalBootstrap
    :ref="el => { if (el) modalRef = el }"
    :modalId="uniqueModalId"
    :title="modalTitle"
    :bodyText="modalBodyText"
    :showSecondaryButton="false"
    primaryButtonText="Ok"
    :primaryButtonClosesModal="true"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import modalBootstrap from '@/components/modal/modalBootstrap.vue';

defineProps({
  customClass: {
    type: String,
    default: ''
  },
  showInfoButton: {
    type: Boolean,
    default: false
  },
  modalTitle: {
    type: String,
    default: 'Informações'
  },
  modalBodyText: {
    type: String,
    default: ''
  }
});

const showButton = ref(false);
const modalRef = ref(null);
const cardWrapper = ref(null);
const isVisible = ref(false);
const uniqueModalId = ref(`modalCard-${Date.now()}-${Math.random().toString(36)
  .substr(2, 9)}`);

const openModal = () => {
  if (modalRef.value) {
    modalRef.value.show();
  }
};

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  if (cardWrapper.value) {
    observer.observe(cardWrapper.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped lang="scss">
.card-wrapper {
    min-height: 100px;
    width: 100%;
}

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
    height: 100%;
    box-sizing: border-box;
    position: relative;
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.info-button-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    padding: 12px;
    align-items: flex-start;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    pointer-events: none;
    z-index: 1;

    &.show {
        opacity: 1;
        pointer-events: all;
    }
}

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
        font-size: 28px;
        color: map-get($body-text, body-color);
    }
}
</style>
