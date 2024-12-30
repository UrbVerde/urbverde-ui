<!-- src/modules/Mapa/MapaBase.vue -->
<template>
  <div class="map_container" :class="{highlightMapa: highlightMap == true,}">
  <VueMapbox
      :mapStyle="currentMapStyle"
      :terrainStyleUrl="terrainStyleUrl"
      ref="mapbox"
      :maxBounds="[-53.97525, -25.47836, -41.22247, -19.79201]"
      :center="[viewState.longitude, viewState.latitude]"
      :interactive="true"
      :zoom="viewState.zoom"
      :showLoader="true"
    >
      <template v-for="layer in layers">
        <component v-if="layer.visible" :key="layer._id" v-bind:is="layer.componentName" :layer="layer"
          @OnFeatureClick="setBboxFromFeature">
        </component>
      </template>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div @click="goToMyLocation" id="gotToMyLocation" v-on="on">
            <v-icon color="white darken-2">
              mdi-map-marker-radius-outline
            </v-icon>
          </div>
        </template>
        <span>Minha localização</span>
      </v-tooltip>

      <div class="basemap-list">
        <div class="basemap-list_item" v-for="(item, i) in basemapList" :key="i"
          :class="['basemap-list_item', { 'selected': item.value === selectedBasemap }]">
          <div class="basemap-list_title" @click="changeMapStyle(item.value)">
            <span :style="item.value === selectedBasemap ? 'font-weight: bold' : ''">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <v-alert v-if="displayAlert" class="alert__box" color="warning" icon="$warning">
        Você está fora do estado de São Paulo</v-alert>
    </VueMapbox>
    <Legendas />
  </div>
</template>

<script>
import Vue from "vue";
import forEach from "lodash/forEach";
import * as turf from "@turf/turf";
import VueMapbox from "./components/VueMapbox.vue";
import VmLayer from "./components/VmLayer.vue";
import VmPopup from "./components/VmPopup.vue";
import axios from "axios";
// import spgeojson from "@/assets/data/geom_municipios.geo.json";

function requireAllComponents(requireContext) {
  var keys = requireContext.keys();
  forEach(keys, (k) => {
    var modulo = requireContext(k);
    var nome = k.match(/([^/]*).vue$/);
    Vue.component(nome[1], modulo.default || modulo);
  });
}
requireAllComponents(
  require.context("./layers", true, /[A-Za-z]\w+\.(vue|js)$/)
);


export default {
  name: "MapaBase",
  components: { VueMapbox, VmLayer, VmPopup },
  props: ["highlightMap"],
  data() {
    return {
      displayAlert: "",
      radioGroup: "",
      ano: 2016,
      featureBbox: [],
      loading: "",
      viewState: {
        latitude: -22.357474,
        longitude: -47.8963723,
        zoom: 3,
        maxZoom: 16,
        pitch: 45,
        bearing: 0,
      },
      userMun: "",
      selectedBasemap: "MAPA",
      terrainStyleUrl: "https://api.maptiler.com/maps/basic-v2/style.json?key=eizpVHFsrBDeO6HGwWvQ", // Replace with your non-extruded style URL
      basemapList: [
        {
          title: "SATÉLITE",
          value:
            "https://api.maptiler.com/maps/hybrid/style.json?key=eizpVHFsrBDeO6HGwWvQ", // XmSZh88cfG77QlyKTuwa",
        },
        {
          title: "MAPA",
          value: "https://api.maptiler.com/maps/28491ce3-59b6-4174-85fe-ff2f6de88a04/style.json?key=eizpVHFsrBDeO6HGwWvQ",
        },
        // {
        //   title: "ruas",
        //   value:
        //     "https://api.maptiler.com/maps/streets-v2/style.json?key=XmSZh88cfG77QlyKTuwa",
        // },
      ],
    };
  },

  computed: {
    layers: function () {
      return this.$store.getters["layers"];
    },
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021][0];
    },
    currentMapStyle() {
      return this.basemapList.find(item => item.title === this.selectedBasemap)?.value || this.basemapList[1].value;
    },
  },

  watch: {},

  methods: {
    goToMyLocation: function () {
      navigator.geolocation.getCurrentPosition((location) => {
        let userLocation = turf.point([
          location.coords.longitude,
          location.coords.latitude,
        ]);
        const userLongitude = userLocation.geometry.coordinates[0];
        const userLatitude = userLocation.geometry.coordinates[1];

        this.getUserInfos(userLongitude, userLatitude);

        if (turf.booleanPointInPolygon(userLocation, spgeojson.features[0])) {
          window.maplibregl.flyTo({
            center: userLocation.geometry.coordinates,
            zoom: 17,
            bearing: 3,
            speed: 0.8,
            curve: 2,
            easing: (t) => t,
            essential: true,
          });
          this.$router.push({ params: { id: this.munPracaData.cd_mun } });
        } else {
          this.displayAlert = true;
          setTimeout(() => {
            this.displayAlert = false;
          }, 2000);
        }
        //
      });
    },

    getUserInfos(longitude, latitude) {
      axios
        .get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
        .then((response) => {
          this.userMun = response.data.address.city_district;
        })
        .catch((error) => {
          console.error('MapaBase.vue - Erro de SobreCarga no Sistema');
          // this.$router.push({ name: 'Home' });
        });
    },

    changeMapStyle: async function (style) {
  console.log('Changing map style to:', style);
  this.selectedBasemap = style;

  if (this.$refs.mapbox && this.$refs.mapbox.map) {
    const map = this.$refs.mapbox.map;
    
    // Save current view state
    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();

    // Save active layers before changing style
    const activeLayers = this.layers.filter(layer => layer.visible);
    console.log('Active layers before style change:', activeLayers.map(l => l._id));

    try {
      await new Promise((resolve, reject) => {
        map.once('style.load', () => {
          console.log('New style loaded');
          
          // Restore the view
          map.setCenter(center);
          map.setZoom(zoom);
          map.setBearing(bearing);
          map.setPitch(pitch);

          // Reapply active layers
          activeLayers.forEach(layer => {
            console.log('Reapplying layer:', layer._id);
            this.$store.commit("TOGGLE_LAYER", { ...layer, visible: false });
            this.$nextTick(() => {
              this.$store.commit("TOGGLE_LAYER", { ...layer, visible: true });
            });
          });

          resolve();
        });
        map.once('error', reject);
        console.log('Setting new style');
        map.setStyle(style);
      });

      console.log('Map style changed successfully');
    } catch (error) {
      console.error('Error changing map style:', error);
    }
  }
},

    loadingFeatures(loading) {
      this.loading = loading;
    },

    setBboxFromFeature(feature) {
      this.featureBbox = turf.bbox(feature[0].geometry);
    },
  },

  mounted() { },
};
</script>

<style scoped lang="scss">
#gotToMyLocation {
  position: absolute;
  top: 145px; //105px;
  right: 0.32em;
  width: 33px;
  height: 30px;
  background-color: #01dc82;
  color: white;
  font-size: 24px;
  text-align: center;
  z-index: 2;
  border-radius: 25% 0 25% 0;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.basemap-list {
  position: absolute;
  right: 4.2em;
  top: 0.75em;
  // color: white;
  text-align: center;
  z-index: 2;
  border: 1px solid #e1e1e1;
  // border-radius: 8px;
  display: flex;
  background-color: white;
  // height: 28px;
  // vertical-align: middle;

  &_item {
    color: black;
    border: 1px solid #e1e1e1;
    // border-radius: 8px;

    &.selected {
      font-weight: bold;
    }

    &:hover {
      background-color: #e1e1e1;
      cursor: pointer;
    }
  }

  &_title {
    // background-color: white;
    margin: 8px;
    // margin-top: 10px!important;
    // margin-left: 10px!important;
    padding: 0px;
    border-radius: 3px;
    width: 80px;
    font: 400 11px Roboto, Arial, sans-serif;
  }



}

.alert__box {
  position: absolute;
  z-index: 5;
  right: 0;
  top: 0;
  margin: auto;
}
</style>
