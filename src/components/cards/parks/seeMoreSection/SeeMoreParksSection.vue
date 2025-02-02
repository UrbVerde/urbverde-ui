<template>
  <div class="content">
    <div class="see-more-cards">
      <SeeMoreCard v-if="cardData.length" :data="cardData" />
    </div>
    <div class="download-card">
      <DownloadCard/>
    </div>
  </div>
</template>

<script>
import SeeMoreCard from '../../SeeMoreCard.vue';
import DownloadCard from '../../DownloadCard.vue';

export default {
  name: 'SeeMoreSection',

  components: {
    SeeMoreCard,
    DownloadCard
  },

  props: {
    cityCode: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      cardData: []
    };
  },

  watch: {
    cityCode: {
      handler: 'fetchDataOnChange',
      immediate: true
    }
  },

  methods: {
    fetchDataOnChange() {
      if (this.cityCode) {
        this.fetchData(this.cityCode);
      }
    },

    async fetchData(city) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/square/info?city=${city}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Erro ao buscar dados do cartão:', error);
      }
    }
  }
};
</script>

  <style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .see-more-cards {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin: 20px;
    flex-wrap: wrap;
  }
  </style>
