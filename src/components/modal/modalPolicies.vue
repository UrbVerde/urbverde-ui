<!-- urbverde-ui/src/components/modal/modalPolicies.vue -->
<template>
  <teleport to="body">
    <modalBootstrap
      ref="refModalPolicies"
      modalId="modalPolicies"
      title="Bem vindo ao painel Políticas Públicas!"
      bodyText=""
      primaryButtonText="Vamos lá!"
      :primaryButtonClosesModal="true"
      @closePrimary="closeModal"
      class="policies-modal"
      size="lg"
    >
      <template #body>
        <div class="policies-content body-normal-regular">
          <p>Desenvolvido para <strong>apoiar a construção dos planos climáticos municipais</strong>, este painel oferece ferramentas para o acompanhamento anual de dados urbanos e ambientais, contribuindo com o planejamento territorial, a gestão pública e a redução das desigualdades socioambientais.</p>
          <p>Neste momento, está disponível apenas para os <strong>municípios do ABC Paulista</strong>, como parte do Programa de Pesquisa em Políticas Públicas (PPPP), da Fapesp.</p>
          <p><strong>Este painel está em versão beta</strong> — os dados ainda estão sendo inseridos e melhorias estão em andamento.</p>
        </div>
      </template>
    </modalBootstrap>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import modalBootstrap from './modalBootstrap.vue';

const locationStore = useLocationStore();
const refModalPolicies = ref(null);

const closeModal = () => {
  // Marcar que o modal já foi exibido para este usuário
  localStorage.setItem('policiesModalShown', 'true');
};

// Watch para viewMode para verificar quando deve exibir o modal
watch(() => locationStore.viewMode, (newViewMode, oldViewMode) => {
  // Verificar se mudou para policies e se é a primeira vez
  if (newViewMode === 'policies' && oldViewMode !== 'policies') {
    const hasShownModal = localStorage.getItem('policiesModalShown');

    if (!hasShownModal) {
      // Aguardar 1 segundo antes de exibir o modal
      setTimeout(() => {
        if (refModalPolicies.value) {
          refModalPolicies.value.show();
        }
      }, 1000);
    }
  }
});

// Método público para abrir o modal programaticamente
const show = () => {
  if (refModalPolicies.value) {
    refModalPolicies.value.show();
  }
};

// Método público para fechar o modal programaticamente
const hide = () => {
  if (refModalPolicies.value) {
    refModalPolicies.value.hide();
  }
};

// Expor métodos para componentes pais
defineExpose({ show, hide });
</script>

<style scoped lang="scss">
</style>
