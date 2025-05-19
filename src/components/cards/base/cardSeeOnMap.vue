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
  seeOnMapLayerID: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const locationStore = useLocationStore();

const navigateToMap = () => {
  // Get the current year and city code from the store
  const currentYear = locationStore.year || '2021';
  const currentCityCode = locationStore.cityCode;

  // Get the current category from the URL
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
      scale: 'intraurbana'
    }
  });
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
