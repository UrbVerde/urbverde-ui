<template>
  <div>
    <!-- Modal -->
    <div class="modal fade"
         :id="modalId"
         tabindex="-1"
         aria-labelledby="`${modalId}Title`"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title heading-h5" :id="`${modalId}Title`">{{ title }}</h5>
            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"></button>
          </div>
          <div class="modal-body body-normal-regular">
            <slot name="body">
              {{ bodyText }}
            </slot>
          </div>
          <div class="modal-footer" v-if="showCloseButton || showSaveButton">
            <PrimaryButton
              v-if="showCloseButton"
              :label="closeButtonText"
              :filled="false"
              :icon="closeButtonIcon"
              :icon-position="closeButtonIconPosition"
              :icon-type="closeButtonIconType"
              @click="handleCloseClick"
            />
            <PrimaryButton
              v-if="showSaveButton"
              :label="saveButtonText"
              :filled="true"
              :icon="saveButtonIcon"
              :icon-position="saveButtonIconPosition"
              :icon-type="saveButtonIconType"
              @click="handleSaveClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PrimaryButton from '../buttons/PrimaryButton.vue';
import { Modal } from 'bootstrap';

const modalInstance = ref(null);

const props = defineProps({
  modalId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Modal Title'
  },
  bodyText: {
    type: String,
    default: ''
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeButtonText: {
    type: String,
    default: 'Fechar'
  },
  closeButtonIcon: {
    type: String,
    default: null
  },
  closeButtonIconPosition: {
    type: String,
    default: 'left'
  },
  closeButtonIconType: {
    type: String,
    default: 'bootstrap'
  },
  closeOnClick: {
    type: Boolean,
    default: true
  },
  showSaveButton: {
    type: Boolean,
    default: true
  },
  saveButtonText: {
    type: String,
    default: 'Salvar'
  },
  saveButtonIcon: {
    type: String,
    default: null
  },
  saveButtonIconPosition: {
    type: String,
    default: 'left'
  },
  saveButtonIconType: {
    type: String,
    default: 'bootstrap'
  }
});

const emit = defineEmits(['close', 'save']);

onMounted(() => {
  const modalEl = document.getElementById(props.modalId);
  if (modalEl) {
    modalInstance.value = new Modal(modalEl);

    // Adiciona listeners para eventos do bootstrap modal
    modalEl.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});

const handleCloseClick = () => {
  emit('close');
  if (props.closeOnClick && modalInstance.value) {
    modalInstance.value.hide();
  }
};

const handleSaveClick = () => {
  emit('save');
  if (props.closeOnClick && modalInstance.value) {
    modalInstance.value.hide();
  }
};

// Método público para abrir o modal programaticamente
const show = () => {
  if (modalInstance.value) {
    modalInstance.value.show();
  }
};

// Método público para fechar o modal programaticamente
const hide = () => {
  if (modalInstance.value) {
    modalInstance.value.hide();
  }
};

// Expor métodos para componentes pais
defineExpose({ show, hide });
</script>

  <style scoped lang="scss">
  .modal-title {
    color: map-get($body-text, body-color);
  }

  .modal-body {
    color: map-get($body-text, body-color);
  }
  </style>
