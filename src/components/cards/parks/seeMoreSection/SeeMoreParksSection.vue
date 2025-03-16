<!-- urbverde-ui/src/components/cards/parks/seeMoreSection/SeeMoreParksSection.vue -->
<!-- SeeMoreParkSection.vue -->
<template>
  <div class="content">
    <div class="see-more-cards">
      <SeeMoreCard
        v-if="cardData.length"
        :data="cardData"
        :cityCode="computedCityCode"
        @change-layer="onChangeLayer"
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
import DownloadCard from '../../DownloadCard.vue';

export default {
  name: 'SeeMoreSection',

  components: {
    SeeMoreCard,
    DownloadCard
  },

  props: {
    // Add cityCode as a fallback prop similar to WidgetsSection
    cityCode: {
      type: Number,
      required: true
    },
    layer: {
      type: String,
      default: 'temperatura'
    }
  },

  setup(props) { // Removed empty object pattern
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
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/square/info?city=${city}`);
        const data = await response.json();
        this.cardData = data;
      } catch (error) {
        console.error('Erro ao buscar dados do cartão:', error);
      }
    },

    onChangeLayer(layer) {
      // Use the layer parameter here to fix the unused variable warning
      // For example, you could log it or actually emit it to the parent
      console.log('Layer changed:', layer);
      this.$emit('change-layer', layer);
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
