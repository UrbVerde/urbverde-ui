<!-- urbverde-ui/src/components/modal/modalBootstrap.vue -->
<!--
    Para funcionar corretamente:

    1. Importar o componente modalBootstrap.vue
    2. No botão em que abre o modal, adicionar o @click="refModalWaitlist.show()"
    3. Configurar o modal na página (se for um modal específico)
        Exemplo:
        <modalBootstrap
            ref="refModalWaitlist"
            modalId="modalWaitlist"
            title="Título do modal"
            bodyText="Conteúdo do modal"
            showSecondaryButton="true"
            primaryButtonText="Ok"
            :primaryButtonClosesModal="true"
            :secondaryButtonClosesModal="false"
            @closeSecondary="handleSecondaryAction"
            @closePrimary="handlePrimaryAction"
        />

    4. Adicionar const <nome da ref do modal> = ref(null); no script
        Exemplo:
        const refModalWaitlist = ref(null);

-->

<template>
  <div>
    <!-- Modal -->
    <div class="modal fade"
         :id="modalId"
         tabindex="-1"
         aria-labelledby="`${modalId}Title`"
         aria-hidden="true">
      <div :class="['modal-dialog modal-dialog-centered', size === 'lg' ? 'modal-lg' : '']" role="document">
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
          <div class="modal-footer" v-if="showSecondaryButton || showPrimaryButton">

            <!-- Secondary Button -->
            <PrimaryButton
              v-if="showSecondaryButton"
              :label="secondaryButtonText"
              :filled="false"
              @click="secondaryButtonCloseOnClick"
            />

            <!-- Primary Button -->
            <PrimaryButton
              v-if="showPrimaryButton"
              :label="primaryButtonText"
              :filled="true"
              @click="primaryButtonCloseOnClick"
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
  showSecondaryButton: {
    type: Boolean,
    default: false
  },
  secondaryButtonText: {
    type: String,
    default: 'Fechar'
  },
  secondaryButtonClosesModal: {
    type: Boolean,
    default: true
  },
  showPrimaryButton: {
    type: Boolean,
    default: true
  },
  primaryButtonText: {
    type: String,
    default: 'Salvar'
  },
  primaryButtonClosesModal: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'lg'].includes(value)
  }
});

const emit = defineEmits(['closeSecondary', 'closePrimary', 'close']);

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

const secondaryButtonCloseOnClick = () => {
  emit('closeSecondary');
  if (props.secondaryButtonClosesModal && modalInstance.value) {
    modalInstance.value.hide();
  }
};

const primaryButtonCloseOnClick = () => {
  emit('closePrimary');
  if (props.primaryButtonClosesModal && modalInstance.value) {
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
.modal-content{
  cursor: default;
}

.modal-title {
  color: map-get($body-text, body-color);
}

.modal-body {
  color: map-get($body-text, body-color);
}

.modal-footer{
  display: flex;
  flex-direction: row;
}

.modal-footer :deep(.primary-button){
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  gap: 0;
}

.modal-dialog-centered{
  padding: 16px;
  margin: auto;
}

.modal-body{
  margin: 12px;
}
</style>
