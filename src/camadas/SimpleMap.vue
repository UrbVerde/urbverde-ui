<template>
    <div class="map-wrapper">
      <BaseMap @map-loaded="onMapLoaded">
        <component 
          v-for="layer in layers" 
          :key="layer.name"
          :is="layer.componentName"
          :layer="layer"
        />
      </BaseMap>
      
      <!-- Legenda -->
      <div v-for="layer in layers" :key="`legend-${layer.name}`">
        <div class="legend" v-if="layer.legends && layer.legends.length">
          <div 
            v-for="(legend, index) in layer.legends" 
            :key="index"
            class="legend-item"
          >
            <div 
              class="legend-gradient" 
              :style="{ background: legend.color }"
            ></div>
            <div class="legend-labels">
              <span>{{ legend.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import BaseMap from './BaseMap.vue'
  import AuxTempIntra from './layersTest/AuxTempIntraurb.vue'
  
  export default {
    name: 'SimpleMap',
    components: {
      BaseMap,
      AuxTempIntra,
      // Renda,
    },
    data() {
      return {
        layers: [
            {
            name: "Temperatura de Superfície",
            componentName: "AuxTempIntra",
            type: "raster",
            zIndex: 51,
            opacity: 0.8,
            visible: true
            }
        ]
      }
    },
    methods: {
      onMapLoaded(map) {
        this.$emit('map-loaded', map);
      }
    }
  }
  </script>
  
  <style scoped>
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
  }
  
  .legend {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  
  .legend-item {
    margin-bottom: 5px;
  }
  
  .legend-gradient {
    width: 200px;
    height: 20px;
    border-radius: 2px;
  }
  
  .legend-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
  }
  </style>