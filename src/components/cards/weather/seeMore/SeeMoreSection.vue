<!-- SeeMoreSection.vue -->
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
    // Add cityCode as a fallback prop
    cityCode: {
      type: Number,
      required: true
    },
    layer: {
      type: String,
      default: 'temperatura'
    }
  },

  setup(props) { // Removed the unused 'emit' parameter
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
      cardData: [
        {
          title: 'Média da cobertura vegetal',
          value: 'Ver detalhes'
        },
        {
          title: 'Moradores próximos a praças',
          value: 'Ver detalhes'
        },
        {
          title: 'Desigualdade ambiental e social',
          value: 'Ver detalhes'
        }
      ]
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
        // You can keep this API call to potentially override the default data
        // or comment it out if you want to use the static data
        const response = await fetch(`https://api.urbverde.com.br/v1/cards/square/info?city=${city}`);
        const data = await response.json();
        if (data && data.length > 0) {
          this.cardData = data;
        }
        // If the API doesn't return data, we'll use the default cardData
      } catch (error) {
        console.error('Erro ao buscar dados do cartão:', error);
        // Keep using the default cardData in case of an error
      }
    },

    onChangeLayer(layer) {
      // Actually use the layer parameter to fix the unused variable warning
      console.log('Layer changed:', layer);
      // If you want to emit the event to the parent component, uncomment the line below
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
