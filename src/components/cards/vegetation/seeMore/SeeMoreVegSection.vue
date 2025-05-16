<!-- urbverde-ui/src/components/cards/vegetation/seeMore/SeeMoreVegSection.vue -->
<template>
  <div class="content">
    <div class="see-more-cards">
      <SeeMoreCard
        v-if="cardData.length"
        :data="cardData"
        :cityCode="computedCityCode"
      />
    </div>
    <div class="download-card">
      <DownloadCard/>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import SeeMoreCard from '../../SeeMoreCard.vue';
import DownloadCard from '../../../cards-new/cardDownload.vue';

export default {
  name: 'SeeMoreVegSection',

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

  setup(props) {
    const locationStore = useLocationStore();

    // Compute the city code from the store with fallback to the prop
    const computedCityCode = computed(() =>
      locationStore.cd_mun || props.cityCode
    );

    return {
      computedCityCode
    };
  },

  data() {
    return {
      cardData: []
    };
  },

  computed: {
    // Add a computed property to react to changes in computedCityCode
    cityCodeForFetch() {
      return this.computedCityCode;
    }
  },

  watch: {
    // Update the watcher to use the computed cityCode
    cityCodeForFetch: {
      handler: 'fetchDataOnChange',
      immediate: true
    }
  },

  methods: {
    fetchDataOnChange() {
      if (this.computedCityCode) {
        this.fetchData(this.computedCityCode);
      }
    },

    async fetchData(city) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/vegetal/info?city=${city}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Erro ao buscar dados do cartão:', error);
      }
    },
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.see-more-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.download-card {
  width: 100%;
}
</style>
