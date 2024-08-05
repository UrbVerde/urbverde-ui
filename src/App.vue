
<template>
  <div class="container">
    <div id="app">
      <Sidebar />
    </div>
    <div class="">

      <h1>Bootstrap</h1>
      <h1>Ganso</h1>

    </div>
  </div>
</template>

<script>
import Sidebar from './components/side_bar/SideBar.vue';

export default {
  components: {
    Sidebar

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


#app {

  margin: 0px;

}
</style>

