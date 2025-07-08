<!-- urbverde-ui/src/components/cards/components-cards/cardODS.vue -->
<template>
  <CardInfo
    :title="title"
    :type="'slot'"
    :show-midia="true"
    :midia-type="'video'"
    :video-url="videoUrl"
    :midia-position="'left'"
  >
    <div class="ods-wrapper">
      <OdsImages
        v-for="odsNumber in odsNumbers"
        :key="odsNumber"
        :ods-number="odsNumber"
        size="large"
        :text="true"
      />
    </div>
  </CardInfo>
</template>

<script setup>
import CardInfo from './cardInfo.vue';
import OdsImages from '../base/odsImages.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    default: 'https://www.youtube.com/watch?v=Fev2MHAa-qo&t=1s'
  },
  odsNumbers: {
    type: Array,
    required: true,
    validator: (value) => value.every(num => Number.isInteger(num) && num >= 1 && num <= 17)
  }
});
</script>

<style scoped lang="scss">
.ods-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-height: 330px;
  overflow-y: auto;
  width: 100%;
  padding: 0 24px 24px 24px;
  min-height: 0; /* Garante que o flex container respeite o max-height */

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: map-get($primary-fade, 400);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: map-get($primary-fade, 100);
    border-radius: 4px;
  }
}
</style>
