<template>
  <cardBase>
    <div class="content">
      <div class="top">
        <div class="number">
          <span class="number-text">{{ number }}</span>
        </div>
        <div class="text-wrapper">
          <h3 class="title body-small-regular">{{ actionTitle }}</h3>
          <badgeCards :status="badgeStatus" />
        </div>
      </div>
      <div class="bottom-ods">
        <odsImages
          v-for="odsNumber in odsArray"
          :key="odsNumber"
          :odsNumber="odsNumber"
          size="small"
        />
      </div>
    </div>
  </cardBase>
</template>

<script>
import cardBase from '../base/cardBase.vue';
import badgeCards from '@/components/badge/badgeCards.vue';
import odsImages from '../base/odsImages.vue';

export default {
  name: 'CardAction',
  components: {
    cardBase,
    badgeCards,
    odsImages
  },
  props: {
    number: {
      type: Number,
      required: true
    },
    actionTitle: {
      type: String,
      required: true
    },
    ods: {
      type: String,
      required: true,
      validator: (value) =>
        // Valida se a string contém apenas números, vírgulas e espaços
        /^[\d,\s]+$/.test(value)

    },
    badgeStatus: {
      type: String,
      required: true,
      validator: (value) => ['nao-informado', 'em-andamento', 'completo'].includes(value)
    }
  },
  computed: {
    odsArray() {
      // Converte a string "1, 2, 3, 6" em um array [1, 2, 3, 6]
      return this.ods
        .split(',')
        .map(item => parseInt(item.trim()))
        .filter(item => !isNaN(item) && item >= 1 && item <= 17);
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.top {
  display: flex;
  align-items: center;
  gap: 24px;
  align-self: stretch;

  .number {
    display: flex;
    width: 72px;
    height: 72px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    aspect-ratio: 1/1;
    border-radius: 16px;
    background: map-get($primary-fade, 100);

    .number-text {
      color: map-get($green, 500);
      font-family: Montserrat;
      font-size: 64px;
      font-style: normal;
      font-weight: 900;
      line-height: 150%; /* 96px */
    }
  }

  .text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .title {
      color: map-get($body-text, body-color);
      margin: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      text-align: left;
    }
  }
}

.bottom-ods {
  display: flex;
  justify-content: left;
  align-items: center;
  align-content: center;
  gap: 8px;
  flex-wrap: wrap;
  opacity: 0.8;
}

@include breakpoint-down('tablet') {
  .top {
    .number {
        width: 56px;
        height: 56px;

        .number-text {
        font-size: 48px;
        font-style: normal;
        font-weight: 800;
        line-height: 150%; /* 96px */
        }
    }
    }
}
</style>
