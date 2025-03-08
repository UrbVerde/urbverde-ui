<!-- urbverde-ui/src/components/cards/DownloadCard.vue -->
<template>

  <!-- Desktop Version -->

  <div class="download-card shadow-sm"
       v-if="largerThan('tablet')">
    <div class="content">
      <div class="label">
        <h2 class="title heading-h5">Baixe gratuitamente o relatório completo</h2>
        <p class="text body-small-medium">
          Obtenha dados completos de temperatura, vegetação e áreas verdes de seu município
        </p>
      </div>
      <div class="botao">
        <PrimaryButton
          label="Baixar Relatório"
          :filled="true"
          icon="bi-download"
          iconType="bootstrap"
          iconPosition="left"
          class="download-card-button"
          @click="refModalWaitlist.show()"
        />
      </div>
    </div>
    <div class="download-card-image">
      <img
        src="@/assets/images/cards/youngFarmer.svg"
        alt="Ilustração dicas"
      />
    </div>
  </div>

  <!-- Mobile Version -->

  <div class="download-card shadow-sm"
       v-else>
    <div class="content">
      <div class="label">
        <h2 class="title heading-h5">Baixe gratuitamente o relatório completo</h2>
        <div class="download-card-image">
          <img
            src="@/assets/images/cards/youngFarmer.svg"
            alt="Ilustração dicas"
          />
        </div>
        <p class="text body-small-medium">
          Obtenha dados completos de temperatura, vegetação e áreas verdes de seu município
        </p>
      </div>
      <div class="botao">
        <PrimaryButton
          label="Baixar Relatório"
          :filled="true"
          icon="bi-download"
          iconType="bootstrap"
          iconPosition="left"
          class="download-card-button"
          @click="refModalWaitlist.show()"
        />
      </div>
    </div>
  </div>

  <!-- Modal -->
  <modalWaitList
    ref="refModalWaitlist"
    :modalId="'modalWaitlistDownload'"
  />
</template>

<script setup>

import { ref } from 'vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import modalWaitList from '../modal/modalWaitList.vue';
import { useWindowSize } from '@/utils/useWindowsSize';

const {
  largerThan,
} = useWindowSize();

// Referência ao modal
const refModalWaitlist = ref(null);

</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

  p, h2{
    margin: 0;
  }

  .download-card {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid map-get($gray, 200);
    border-radius: 16px;
    overflow: hidden;
    padding: 40px;
    box-sizing: border-box;
    gap: 40px;
  }

  .label{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
  }

  .title {
    color: map-get($body-text, body-color);
    text-align: center;
  }

  .content {
    display: flex;
    max-width: 620px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    flex: 1 0 0;
  }

  .text {
    color: map-get($theme, secondary);
    text-align: center;
  }

  .botao {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 261px;
  }

  .botao a {
    text-decoration: none;
    max-width: 261px;
    width: 100%;
    display: block;
  }

  .download-card-image {
    width: auto;
    display: flex;
    justify-content: center;
  }

  .download-card-image img {
    width: auto;
    max-width: min(100%, 300px);
    height: auto;
    object-fit: contain;
  }

  :deep(.primary-button) {
    width: 100%;
  }

  @include breakpoint-down('tablet') {
    .download-card-image {
      max-width: 100%;
      display: flex;
      justify-content: center;
    }

    .download-card-image img {
      max-width: min(100%, 240px);
      width: auto;
      height: auto;
      margin: 12px 0;
      object-fit: contain;
    }
  }
</style>
