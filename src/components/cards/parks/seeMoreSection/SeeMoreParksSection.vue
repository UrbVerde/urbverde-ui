<template>
  <div class="content">
    <div class="see-more-cards">
      <SeeMoreCard
        v-if="cardData.length"
        :data="cardData"
        :cityCode="cityCode"
        @change-layer="onChangeLayer"
      />
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
    },
    changeLayer: {
      type: Function,
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
    },

    onChangeLayer(index) {
      // Repassa o evento para o método passado pela prop
      this.changeLayer(index);
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.see-more-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.download-card{
  width: 100%;
}
</style>
