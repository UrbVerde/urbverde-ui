<!-- urbverde-ui/src/components/cards/base/cardSeeOnMap.vue -->
<template>
  <CardHoverButton
    iconClass="bi bi-map"
    tooltipText="Ver no mapa"
    @click="navigateToMap"
    data-bs-toggle="tooltip"
    data-bs-title="Ver o dado no mapa"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useLocationStore } from '@/stores/locationStore';
import CardHoverButton from '@/components/buttons/CardHoverButton.vue';

const props = defineProps({
  showSeeOnMap: {
    type: Boolean,
    default: false
  },
  // Propriedade para navegar entre camadas da mesma categoria
  seeOnMapLayerID: {
    type: String,
    default: ''
  },
  // Propriedades para navegar entre camadas de categorias diferentes
  targetCityCode: {
    type: Number,
    required: false
  },
  targetCategory: {
    type: String,
    required: false
  },
  targetLayerId: {
    type: String,
    required: false
  },
  targetLayerTitle: {
    type: String,
    required: false
  }
});

const router = useRouter();
const locationStore = useLocationStore();

const navigateToMap = () => {
  // Get the current year and city code from the store
  const currentYear = locationStore.currentYear;
  const currentCityCode = locationStore.cityCode;
  const currentViewMode = locationStore.viewMode;

  // Determine which properties to use based on what's provided
  const finalCityCode = props.targetCityCode || currentCityCode;
  const finalCategory = props.targetCategory || router.currentRoute.value.query.category;
  const finalLayer = props.targetLayerId || props.seeOnMapLayerID;

  if (props.targetCategory) {
    // Navigate directly using window.location.href (same as cardPrimaryButton)
    window.location.href = `https://urbverde.iau.usp.br/mapa?code=${finalCityCode}&viewMode=${currentViewMode}&type=city&year=${currentYear}&category=${finalCategory}&layer=${finalLayer}&scale=intraurbana`;
  } else {
    // Original logic for same category navigation
    const currentCategory = router.currentRoute.value.query.category;

    // Update the store with the new layer
    locationStore.setLocation({
      category: currentCategory,
      layer: props.seeOnMapLayerID,
      layerName: props.seeOnMapLayerID
    });

    // Navigate to the map with the new layer
    router.push({
      path: '/mapa',
      query: {
        code: currentCityCode,
        type: 'city',
        year: currentYear,
        category: currentCategory,
        layer: props.seeOnMapLayerID,
        scale: 'intraurbana',
        viewMode: currentViewMode
      }
    });
  }
};
</script>

<style scoped lang="scss">
.info-button {
    display: flex;
    width: 40px;
    height: 40px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border: 2px solid map-get($gray, 200);
    background: map-get($gray, white);
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: map-get($green, 500);
        color: map-get($green, 500);
    }

    i {
        font-size: 28px;
        color: map-get($body-text, body-color);
    }
}
</style>
