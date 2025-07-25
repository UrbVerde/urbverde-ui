<!-- urbverde-ui/src/components/cards/base/cardBase.vue -->
<template>
  <div class="card-wrapper" ref="cardWrapper">
    <div v-if="isVisible"
         class="card-base"
         @mouseenter="showButton = true"
         @mouseleave="showButton = false">
      <div v-if="showInfoButton || showSeeOnMap" class="info-button-wrapper" :class="{ 'show': showButton }">
        <cardSeeOnMap
          v-if="showSeeOnMap"
          :showSeeOnMap="showSeeOnMap"
          :seeOnMapLayerID="seeOnMapLayerID"
          :targetCityCode="targetCityCode"
          :targetCategory="targetCategory"
          :targetLayerId="targetLayerId"
          :targetLayerTitle="targetLayerTitle"
        />
        <CardHoverButton
          v-if="showInfoButton"
          iconClass="bi bi-info-lg"
          @click="openModal"
        />
      </div>
      <slot></slot>
    </div>
  </div>

  <cardModal
    :ref="el => { if (el) modalRef = el }"
    :title="modalTitle"
    :bodyText="modalBodyText"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import cardModal from './cardModal.vue';
import cardSeeOnMap from './cardSeeOnMap.vue';
import CardHoverButton from '@/components/buttons/CardHoverButton.vue';

defineProps({
  customClass: {
    type: String,
    default: ''
  },
  showInfoButton: {
    type: Boolean,
    default: false
  },
  showSeeOnMap: {
    type: Boolean,
    default: false
  },
  seeOnMapLayerID: {
    type: String,
    default: ''
  },
  // Propriedades para navegação entre camadas de categorias diferentes
  targetCityCode: {
    type: Number,
    required: false
  },
  targetCategory: {
    type: String,
    required: false
  },
  targetLayerId: {
    type: String,
    required: false
  },
  targetLayerTitle: {
    type: String,
    required: false
  },
  modalTitle: {
    type: String,
    default: 'Informações'
  },
  modalBodyText: {
    type: String,
    default: ''
  },
  customPadding: {
    type: String,
    default: '24px'
  },
  customGap: {
    type: String,
    default: '16px'
  }
});

const showButton = ref(false);
const modalRef = ref(null);
const cardWrapper = ref(null);
const isVisible = ref(false);

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
    rootMargin: '-75px 0px',
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
    height: 100%;
}

.card-base {
    display: flex;
    padding: v-bind('customPadding');
    flex-direction: column;
    align-items: flex-start;
    gap: v-bind('customGap');
    align-self: stretch;
    border-radius: 16px;
    background: map-get($gray, white);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    animation: fadeIn 0.5s ease-in-out;
    transition: all 0.3s ease-in-out;
    box-shadow: rgba(35, 38, 33, 0.1) 0px 10px 10px -10px;

    &:hover {
        transform: scale(1.02);
        box-shadow: rgba(74, 156, 19, 0.2) 0px 13px 13px -10px;
        border-color: map-get($green, 200);
    }
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
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    pointer-events: none;
    z-index: 1;

    &.show {
        opacity: 1;
        pointer-events: all;
    }
}
</style>
