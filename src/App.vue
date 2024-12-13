
<template>
  <div class="container">
    <div id="app">
      <Sidebar />
    </div>
    <div class="prala">

      <h1>Bootstrap</h1>
      <h1>Ganso</h1>
      
      <SearchUserLocation @location-updated="handleLocationUpdate"/>
      <p v-if="locationData">
      Localização Atual: {{ locationData.city }}, {{ locationData.state }}, {{ locationData.country }}<br>
      Internacional: {{ locationData.international ? 'Sim' : 'Não' }}
      
    </p>
    <p v-else>Aguardando localização...</p>
      <SearchDropdown/>
      

    </div>
    
  </div>
</template>

<script>
import Sidebar from './components/side_bar/SideBar.vue';
import SearchUserLocation from './components/search_dropdown/SearchUserLocation.vue';
import SearchDropdown from './components/search_dropdown/SearchDropdown.vue';

export default {
  components: {
    Sidebar,
    SearchUserLocation,
    SearchDropdown,
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
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


html, body, #app {
  font-family: 'Times New Roman', Times, serif;
  margin: 0;
  padding: 0;
  font-size: 16px;
  line-height: 1.6;

  color: #333;
  background-color: #f5f5f5;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.prala{

  padding: 0 350px;
}

#app {

  margin: 0px;

}
</style>

