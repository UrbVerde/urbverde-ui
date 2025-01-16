<template>
    <div class="map-container">
      <VueMapbox
        :mapStyle="mapStyle"
        :center="center"
        :zoom="zoom"
        :maxBounds="maxBounds"
        ref="mapbox"
        @load="onMapLoad"
      >
        <slot></slot>
      </VueMapbox>
    </div>
  </template>
  
  <script>
  import VueMapbox from './components/VueMapbox.vue'
  import maplibregl from 'maplibre-gl'
  // import Vue from "vue";
  // import forEach from "lodash/forEach";
  // import * as turf from "@turf/turf";
  // import VmLayer from "./components/VmLayer.vue";
  // import VmPopup from "./components/VmPopup.vue";
  
  export default {
    name: 'BaseMap',
    components: {
      VueMapbox
    },
    props: {
      mapStyle: {
        type: String,
        default: "https://api.maptiler.com/maps/basic-v2/style.json?key=eizpVHFsrBDeO6HGwWvQ"
      },
      center: {
        type: Array,
        default: () => [-47.8963723, -22.357474]
      },
      zoom: {
        type: Number,
        default: 4
      },
      maxBounds: {
        type: Array,
        default: () => [-53.97525, -25.47836, -41.22247, -19.79201]
      }
    },
    


  watch: {},
    methods: {
      onMapLoad(map) {
        map.addControl(
          new maplibregl.NavigationControl({
            visualizePitch: true
          }), 
          'top-right'
        );
        
        map.addControl(
          new maplibregl.ScaleControl({
            maxWidth: 120,
            unit: 'metric'
          }), 
          'bottom-left'
        );
  
        this.$emit('map-loaded', map);
      }
    }
  }
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 100vh;
    position: relative;
  }
  </style>