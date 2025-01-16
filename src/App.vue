<template>
  <div id="app">
    <BaseMap>
      <AuxTempIntra 
        :layer="{
          name: 'Temperatura',
          type: 'raster',
          zIndex: 51,
          opacity: 0.8
        }"
      />
    </BaseMap>
  </div>
</template>

<script>
import BaseMap from './camadas/BaseMap.vue'
import AuxTempIntra from './camadas/layersTest/AuxTempIntraurb.vue'

export default {
  name: 'App',
  components: {
    BaseMap,
    AuxTempIntra
  }
}
</script>