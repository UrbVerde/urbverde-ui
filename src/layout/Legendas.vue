<template>
  <div id="legenda-mapa">


    <div v-for="(layer, idx) in layers" :key="idx" class="layer-legenda" :class="{ hide: !layer.visible }">
      
      <div class="legenda-name">{{ layer.name }}</div>

      <div class="legenda-info">
        
        <div v-for="(legenda, idx) in layer.legends" :key="idx" class="legenda-item">
          
          <!-- #Só contornos -->
          <div v-if="legenda.contour">
            <div class="color justify-center align-center" :style="{ border: `1px solid ${legenda.color}` }"></div>
            <div class="value">
              {{ legenda.value }}
            </div>
          </div>

          <!-- Com preenchimento -->
          <div v-else-if="legenda.range" class="d-flex flex-column">
            <div class="color" :style="{
              backgroundImage: legenda.color,
              width: '100px',
            }"></div>
            <div class="value mx-auto">
              {{ legenda.value }}
            </div>
          </div>

          <!-- Outros -->
          <div v-else>
            <div class="color" :style="{ background: legenda.color }"></div>
            <div class="value">
              {{ legenda.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    layers: function () {
      return this.$store.getters.layers.filter((item) => item.legends);
    },
  },
};
</script>

<style lang="scss" scoped>
#legenda-mapa {
  position: absolute;
  bottom: 2em;
  right: 5px;
  z-index: 300;
  max-width: 250px;
}

.layer-legenda {
  border-radius: 0 20px 0px 20px;
  background: rgba(255, 255, 255, 0.8);
  padding: 1em 0.8em 1em 0.8em;
  font-size: 11px;
  margin-bottom: 5px;

  .legenda-name {
    font-weight: bolder;
    text-align: left;
  }

  .legenda-info {
    display: block;
    margin-top: 0.7em;
    text-align: left;

    .legenda-item {
      margin-right: 1em;
      margin-bottom: 1em;
      display: inline-block;

      .color {
        display: inline-block;
        width: 1.5em;
        height: 1.5em;
      }

      .value {
        display: inline-block;
        margin-left: 0.5em;

        i {
          color: #808080;
        }
      }
    }
  }
}

.hide {
  display: none;
}
</style>
