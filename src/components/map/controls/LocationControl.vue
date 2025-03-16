<!-- urbverde-ui/src/components/map/controls/LocationControl.vue -->
<template>
  <div></div>
  <!-- <div class="location-control" @click="findUserLocation">
    <div class="location-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="22" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="12" x2="2" y2="12"></line>
        <line x1="12" y1="6" x2="12" y2="2"></line>
        <line x1="12" y1="22" x2="12" y2="18"></line>
      </svg>
    </div>
  </div> -->
</template>

<script setup>
// import { defineProps, defineEmits } from 'vue';

// const props = defineProps({
//   map: {
//     type: Object,
//     required: true
//   }
// });

// const emit = defineEmits(['location-found']);

// // Find user location and fly to it
// function findUserLocation() {
//   if (!props.map) {return;}

//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { longitude, latitude } = position.coords;

//       // Fly to the user's location
//       props.map.flyTo({
//         center: [longitude, latitude],
//         zoom: 15,
//         duration: 2000
//       });

//       // Notify parent component
//       emit('location-found', { lng: longitude, lat: latitude });
//     },
//     (error) => {
//       console.error('Error getting user location:', error);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0
//     }
//   );
// }
</script>

<style scoped>
.location-control {
  background: #fff;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  border-radius: 8px;
  border: 2px solid #fff;
  position: absolute;
  top: 20px;
  right: 20px;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 7;
  transition: transform 0.2s ease;
}

.location-control:hover {
  transform: scale(1.05);
}

.location-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3c4043;
}
</style>
