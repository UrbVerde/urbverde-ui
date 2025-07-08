<!-- urbverde-ui/src/components/cards/components-cards/cardSendData.vue -->
<template>
  <cardBase>
    <cardTitle title="O que a gestão está fazendo para cumprir as ações?" />

    <div class="content-send-wrapper">
      <div class="image-wrapper">
        <div class="image-wrapper-content">
          <img
            src="@/assets/images/cards/policies/mari-search.svg"
            alt="Busca de informações"
            class="search-image"
          />
        </div>
        <p class="body-small-regular secondary-text">
          Ops! Ainda nenhuma informação relacionada ao cumprimento das ações do eixo foi enviada pela gestão municipal
        </p>
      </div>

      <router-link to="/contato" class="button-link" target="_blank">
        <PrimaryButton
          label="Enviar informações"
          :filled="false"
        />
      </router-link>
    </div>
  </cardBase>
</template>

<script setup>
import cardBase from '../base/cardBase.vue';
import cardTitle from '../base/cardTitle.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
</script>

<style scoped lang="scss">
.content-send-wrapper {
  display: flex;
  padding: 24px 0 0 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  gap: 40px;
  align-self: stretch;
}

.image-wrapper {
  display: flex;
  max-width: 500px;
  height: auto;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  align-self: stretch;
}

.image-wrapper-content {
  width: 100%;
  max-width: 136px;
  height: auto;
}

.search-image {
  width: 100%;
  max-width: 600px;
  height: auto;
}

.secondary-text {
  color: map-get($theme, secondary);
  text-align: center;
  margin: 0;
}

.button-link {
  text-decoration: none;
  display: block;
}
</style>
