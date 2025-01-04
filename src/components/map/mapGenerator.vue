<!-- urbverde-ui/src/components/map/mapGenerator.vue -->
<template>
  <div ref="mapContainer" class="map-container">
    <slot></slot> <!-- This allows child components to render inside MapBox -->
  </div>
</template>

<script>
import maplibregl from 'maplibre-gl';

export default {
  props: {
    coordinates: {
      type: Object,
      required: true,
      default: () => ({ lat: 0, lng: 0 }), // Avoid undefined errors
      validator: (value) => {
        return typeof value.lat === 'number' && typeof value.lng === 'number';
      },
    },
  },
  data() {
    return {
      map: null,
      mapLoaded: false
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      if (!this.coordinates.lat || !this.coordinates.lng) {
        console.warn('Invalid coordinates for map initialization');
        return;
      }

      this.map = new maplibregl.Map({
        container: this.$refs.mapContainer,
        style: 'https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ',
        center: [this.coordinates.lng, this.coordinates.lat],
        pitch: 20,
        zoom: 14,
        attributionControl: false,  // Add this line to hide attribution
        NavigationControl: true,
      });
      
      // Add zoom and rotation controls
      // this.map.addControl(
      //   new maplibregl.NavigationControl({
      //     showCompass: true,
      //     showZoom: true,
      //     visualizePitch: true
      //   }),
      //   'top-left'
      // );

    //   // Add geolocate control
    //   this.map.addControl(
    //     new maplibregl.GeolocateControl({
    //       positionOptions: {
    //         enableHighAccuracy: true
    //       },
    //       trackUserLocation: true
    //     }),
    //     'top-left'
    //   );

    //   this.map.on('load', () => {
    //     console.log('Map loaded successfully');
    //     this.mapLoaded = true;
    //   });

    //   this.map.addControl(new maplibregl.NavigationControl());
    // },
    // updateMapCenter() {
    //   if (this.map && this.mapLoaded && this.coordinates.lat && this.coordinates.lng) {
    //     console.log('Updating map center to:', this.coordinates);
    //     this.map.flyTo({
    //       center: [this.coordinates.lng, this.coordinates.lat],
    //       zoom: 14,
    //       duration: 10000,
    //       essential: true
    //     });
    //   }
    }
  },
  watch: {
    coordinates: {
      handler(newCoordinates) {
        console.log('MapBox received new coordinates:', newCoordinates);
        this.updateMapCenter();
      },
      deep: true
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      console.log('Map removed');
    }
  }
};
</script>

<style scoped>
.map-container {
  position: relative; /* Make this container the reference for absolute positioning */
  width: calc(100% - 48px);
  height: calc(100vh - 35px - 144px);
  border-radius: 15px;
  margin: 0px 24px 0; 
}


</style>