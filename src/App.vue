<template>
  
  <div class="container">
  
    <div id="app">
      <Sidebar />
    </div>
    
    <div class="prala">




      <MapBox v-if="coordinates" :coordinates="coordinates" />
      <!--<BuscaSimples/>    -->  
     
      <!-- 
       <SearchUserLocation @location-updated="handleLocationUpdate"/>
     
      <p v-if="locationData">
        Localização Atual: {{ locationData.city }}, {{ locationData.state }}, {{ locationData.country }}<br>
        Internacional: {{ locationData.international ? 'Sim' : 'Não' }}
      </p>

      <p v-else>Aguardando localização...</p>
      
      -->

      <!--  <SearchCity/>-->  

    </div>

  </div>

</template>

<script>
import Sidebar from './components/side_bar/SideBar.vue';
import SearchUserLocation from './components/search_dropdown/SearchUserLocation.vue';
import MapBox from './components/map/mapGenaretor.vue';

export default {
  components: {
    Sidebar,
    SearchUserLocation,
  },

  data() {
    return {
      locationData: null,
    };
  },

  methods: {
    handleLocationUpdate(locationData) {
      this.locationData = locationData;
    },
  }
};


</script>


<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

h1 {
  margin-top: -240px;
  color: #333;
  margin-bottom: 20px;
}


.autocomplete-container {
  margin: 0 auto;
}

pre {
  text-align: left;
  margin-top: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>
