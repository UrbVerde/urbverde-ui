<!-- urbverde-ui/src/App.vue -->
<template>
  <div id="app">
    <Legenda/>
  </div>
</template>

<script>
import Legenda from './components/map/Legenda.vue';

export default {
  name: 'App',
  components: {
    Legenda
  }
};
</script>
