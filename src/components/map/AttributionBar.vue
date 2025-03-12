<template>
  <div class="attribution-bar">

    <div class="scale-content">
      <div ref="scaleMount" class="scale-widget"></div>
    </div>

    <div class="attribution">
      <div class="scale-proportion body-caption-regular">Escala {{ scaleProportion }}</div>
      <div class="coordinates body-caption-regular">{{ coordinates.lat }} {{ coordinates.lng }}</div>
      <div class="altitude body-caption-regular">{{ altitude }}</div>

      <div class="sources">
        <span class="body-caption-medium">Fonte: IBGE (2010), Landsat 8, Sen...</span>
        <a href="#" class="more-link body-caption-medium">Ver mais</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import maplibregl from 'maplibre-gl';

// Get props from parent
const props = defineProps({
  map: {
    type: Object,
    required: true
  },
  // The rest of your props...
  scaleProportion: {
    type: String,
    default: '1:100'
  },
  coordinates: {
    type: Object,
    default: () => ({
      lat: "23°33'34.3\"S",
      lng: "46°53'57.3\"W"
    })
  },
  altitude: {
    type: String,
    default: '810 m'
  }
});

const scaleMount = ref(null);
let scaleControl = null;

onMounted(() => {
  // 1) Create the ScaleControl
  scaleControl = new maplibregl.ScaleControl({
    maxWidth: 88,
    unit: 'metric'
  });

  // 2) Manually call onAdd(map) to get the control’s DOM element
  const scaleEl = scaleControl.onAdd(props.map);

  // 3) Append that DOM element to our <div ref="scaleMount">
  scaleMount.value.appendChild(scaleEl);
});

onBeforeUnmount(() => {
  // If you need to remove the control cleanly:
  if (scaleControl && props.map) {
    scaleControl.onRemove(props.map);
  }
});
</script>

<style scoped lang="scss">
.attribution-bar {
    position: absolute;
    bottom: 0px;
    right: 0px;
    z-index: 9999;
    width: auto;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 2px;
    white-space: nowrap;
}

.attribution {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    padding: 0 8px 0 12px;
    background: rgba(248, 249, 250, 0.70);
    backdrop-filter: blur(20px);
    color: map-get($body-text, body-color);
    border-radius: 4px 0 0 0;
}

.scale-content {
    padding: 0 6px;
    display: flex;
    align-items: center;
    justify-content: end;
    border-radius: 4px 0 0 0;
    width: 88px;
    height: 24px;
}

.scale-widget {
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 2px 0;
}

:deep(.maplibregl-ctrl) {
  margin: 0;
}

:deep(.maplibregl-ctrl-scale) {
  background-color: transparent;
  border-color: map-get($body-text, body-color);
  color: map-get($body-text, body-color);
  margin: 0;
  font-size: 12px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  padding-bottom: 2px;
  line-height: 12px;
  position: relative;
  text-align: center;
  width: 100%;
}

.scale-proportion,
.coordinates,
.altitude,
.sources {
  display: flex;
  align-items: center;
  gap: 6px;
}

.more-link {
  color: map-get($theme, primary);
  text-decoration: underline;
}
</style>
