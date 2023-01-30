<template>
  <div class="map_container">
    <VueMapbox
      mapStyle="https://api.maptiler.com/maps/8fde2eea-8799-479e-8a8d-0989e2c7eb2d/style.json?key=XmSZh88cfG77QlyKTuwa"
      ref="mapbox"
      :maxBounds="[-53.97525, -25.47836, -41.22247, -19.79201]"
      :center="[viewState.longitude, viewState.latitude]"
      :interactive="true"
      :zoom="viewState.zoom"
      :showLoader="true"
    >
      <template v-for="layer in layers">
        <component
          v-if="layer.visible"
          :key="layer._id"
          v-bind:is="layer.componentName"
          :layer="layer"
          @OnFeatureClick="setBboxFromFeature"
        >
        </component>
      </template>

      <div @click="goToMyLocation" id="gotToMyLocation">
        <v-icon color="white darken-2"> mdi-map-marker-radius-outline </v-icon>
      </div>

      <div class="basemap-list">
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon>mdi-map</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, i) in basemapList" :key="i">
              <v-list-item-title @click="changeMapStyle(item.value)">{{
                item.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </VueMapbox>
    <Legendas />
  </div>
</template>

<script>
import Vue from "vue";
import forEach from "lodash/forEach";
import * as turf from "@turf/turf";

import spgeojson from "@/assets/data/geom_municipios.geo.json";

import VueMapbox from "./components/VueMapbox.vue";
import VmLayer from "./components/VmLayer.vue";
import VmPopup from "./components/VmPopup.vue";

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

import axios from "axios";

export default {
  name: "",
  components: { VueMapbox, VmLayer, VmPopup },
  data() {
    return {
      testes: "lalala",
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
      basemapList: [
        {
          title: "Satélite",
          value:
            "https://api.maptiler.com/maps/hybrid/style.json?key=XmSZh88cfG77QlyKTuwa",
        },
        {
          title: "Ruas",
          value:
            "https://api.maptiler.com/maps/streets-v2/style.json?key=XmSZh88cfG77QlyKTuwa",
        },
        {
          title: "Padrão",
          value:
            "https://api.maptiler.com/maps/8fde2eea-8799-479e-8a8d-0989e2c7eb2d/style.json?key=XmSZh88cfG77QlyKTuwa",
        },
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
            zoom: 12,
            bearing: 3,
            speed: 0.8,
            curve: 2,
            easing: (t) => t,
            essential: true,
          });
        } else {
          console.log("Localização não está presente no estado de São Paulo.");
        }
        this.$router.push({ params: { id: this.munPracaData.cd_mun } });
      });
    },

    async changeMapStyle(style) {
      window.maplibregl.setStyle(style, { before: "first" });
      await this.mapbox.updateLayerOrder();
    },

    getUserInfos(longitude, latitude) {
      axios
        .get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
        .then((response) => {
          this.userMun = response.data.address.city_district;
        });
    },

    loadingFeatures(loading) {
      this.loading = loading;
    },

    setBboxFromFeature(feature) {
      this.testes = feature[0].properties.municipio;
      this.featureBbox = turf.bbox(feature[0].geometry);
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
#gotToMyLocation {
  position: absolute;
  top: 30%;
  right: 1em;
  width: 45px;
  height: 40px;
  background-color: #01dc82;
  color: white;
  font-size: 24px;
  text-align: center;
  z-index: 2;
  border-radius: 25% 0 25% 0;
  display: grid;
  place-items: center;
}

.basemap-list {
  position: absolute;
  top: 23%;
  right: 1em;
  width: 45px;
  height: 40px;
  background-color: #01dc82;
  color: white;
  font-size: 24px;
  text-align: center;
  z-index: 2;
  border-radius: 25% 0 25% 0;
  display: grid;
  place-items: center;
}
</style>
