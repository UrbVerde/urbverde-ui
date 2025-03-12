<template>
  <div class="attribution-bar">
    <!-- ScaleControl container -->
    <div ref="scaleMount" class="scale-widget"></div>

    <!-- Other custom bits (e.g. proportion, coordinates, sources) -->
    <div class="scale-proportion">Escala {{ scaleProportion }}</div>
    <div class="coordinates">{{ coordinates.lat }} {{ coordinates.lng }}</div>
    <div class="altitude">{{ altitude }}</div>

    <!-- Image sources -->
    <div class="sources">
      <span>Fonte: IBGE (2010), Landsat 8, Sen...</span>
      <a href="#" class="more-link">Ver mais</a>
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
    maxWidth: 120,
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

<style scoped>
.attribution-bar {
    position: absolute;
    bottom: 10px;
    right: 30px;
    z-index: 9999; /* some large value so it’s above the map */
    width: auto;
    height: 22px;
    padding: 2px 16px;
    background: rgba(248, 249, 250, 0.80);
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    font-family: Inter, sans-serif;
    font-size: 12px;
    color: #212529;
    white-space: nowrap;
}

.scale-widget {
    /* Just a placeholder div to hold the scale’s DOM */
    display: flex;
    align-items: center;
}

.scale-proportion,
.coordinates,
.altitude,
.sources {
    display: flex;
    align-items: center;
    gap: 8px;
}

.more-link {
    color: #025949;
    font-weight: 500;
    text-decoration: underline;
}
</style>
