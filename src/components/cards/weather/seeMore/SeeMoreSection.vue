<template>
  <div class="content">
    <div class="see-more-cards">
      <SeeMoreCard v-if="cardData.length" :data="cardData" @change-layer="handleChangeLayer" />
    </div>
    <div class="download-card">
      <DownloadCard />
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
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/weather/info?city=${city}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Erro ao buscar dados do cartão:', error);
      }
    },

    handleChangeLayer(index) {
      const layerMap = ['vegetação', 'parques', 'vegetação']; // Associe manualmente os índices às camadas
      const selectedLayer = layerMap[index] || 'temperatura'; // Default caso haja erro
      this.$emit('change-layer', selectedLayer);
      this.scrollToTop();
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adiciona um efeito de rolagem suave
      });
    }
  }
};
</script>

<style scoped lang="scss">

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.see-more-cards {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.download-card{
  width: 100%;
}

</style>
