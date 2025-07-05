<template>
  <modalBootstrap
    ref="refModal"
    :modalId="modalId"
    :title="'Como funcionam os selos?'"
    bodyText=""
    :showSecondaryButton="true"
    :showPrimaryButton="true"
    primaryButtonText="Ok"
    secondaryButtonText="Enviar mensagem"
    :primaryButtonClosesModal="true"
    :secondaryButtonClosesModal="false"
    @closeSecondary="openContacts"
    @closePrimary="closeModal"
    class="layer-info-modal"
    size="lg"
  >
    <template #body>
      <div class="modal-stamps-body">
        <div class="topic">
          <div class="heading-h6 topic-title">Introdução aos selos</div>
          <div class="body-small-regular topic-text">
            Os selos, pioneiramente incorporados a uma plataforma web de Plano Local de Ações Climáticas, representam uma inovação no incentivo à gestão municipal. Criados para fomentar o desenvolvimento de políticas públicas comprometidas com a melhoria da qualidade de vida, saúde e bem-estar da população, esses selos orientam os municípios presentes no painel Políticas Públicas a se basearem nos Objetivos de Desenvolvimento Sustentável (ODS).
            <br/><br/>
            Cada selo apresenta uma cor inspirada na paleta dos ODS, facilitando sua identificação e reforçando o alinhamento com as metas globais. Além disso, eles incentivam o uso estratégico das ações e indicadores disponíveis no painel como referência para a formulação de políticas públicas eficazes e integradas.
          </div>
        </div>
        <div class="topic">
          <div class="heading-h6 topic-title">Selos da UrbVerde</div>
          <div class="body-small-regular topic-text">
            Existem 6 selos, um para cada eixo do painel de políticas públicas:
            <ul>
              <li>Selo UrbVerde de Hidrologia</li>
              <li>Selo UrbVerde de Parques e Praças</li>
              <li>Selo UrbVerde de Agricultura Urbana</li>
              <li>Selo UrbVerde de Vegetação</li>
              <li>Selo UrbVerde de Emissões</li>
              <li>Selo UrbVerde de Mobilidade e Clima</li>
            </ul>
          </div>
        </div>
        <div class="topic">
          <div class="heading-h6 topic-title">Como obter os selos</div>
          <div class="body-small-regular topic-text">
            Para obter um selo, verifique as "Ações" de cada eixo, disponíveis no painel. Se você é gestor público do município e acredita que as ações daquele eixo foram concluídas em seu município, entre em contato conosco clicando no botão "Enviar mensagem" abaixo, se identificando e informando:<br/>
            <ul>
              <li>O número das ações do eixo</li>
              <li>Estado atual das Ações do eixo (concluídas ou em andamento), se nada for enviado as Ações estarão listadas como "Não informado"</li>
              <li>Justificativa ou resultados alcançados</li>
              <li>Dados e evidências que comprovem o progresso</li>
            </ul>
            <br/>
            Os selos são obtidos de forma individual, por eixo e por município. Verifique as ações disponíveis em cada eixo para saber quais ações devem ser completadas para obter o selo para seu município. O selo só é obtido após a conclusão de todas as ações do eixo.
          </div>
        </div>
        <div class="topic">
          <div class="heading-h6 topic-title">Outras informações</div>
          <div class="body-small-regular topic-text">
            Esta é a primeira versão dos selos e seu funcionamento pode ser aprimorado ao longo do tempo. Fique atento às atualizações e novidades na plataforma.
          </div>
        </div>
        <div class="topic">
          <div class="heading-h6 topic-title">Referências</div>
          <div class="body-small-regular topic-text">
            <a href="https://brasil.un.org/pt-br/sdgs" target="_blank">Objetivos de Desenvolvimento Sustentável (ODS)</a>
            <br/>
            <a href="https://www.greencitytimes.com/4-ways-gamification-can-promote-sustainable-urban-planning/" target="_blank">4 Ways Gamification Can Promote Sustainable Urban Planning – Green City Times</a>
          </div>
        </div>
      </div>
    </template>
  </modalBootstrap>
</template>

<script setup>
import { ref } from 'vue';
import modalBootstrap from '@/components/modal/modalBootstrap.vue';

const refModal = ref(null);

function openContacts() {
  window.open('/contato', '_blank');
}

function closeModal() {
  if (refModal.value && refModal.value.hide) {
    refModal.value.hide();
  }
}

// Expor métodos para abrir/fechar
function show() {
  if (refModal.value && refModal.value.show) {
    refModal.value.show();
  }
}

defineExpose({ show, hide: closeModal });
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.modal-stamps-body {
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: map-get($body-text, body-color);
}
.topic-title {
  color: map-get($body-text, body-color);
  margin-bottom: 8px;
}
.topic-text {
  color: map-get($body-text, body-color);
}
ul {
  margin: 8px 0 0 24px;
  padding: 0;
}
</style>
