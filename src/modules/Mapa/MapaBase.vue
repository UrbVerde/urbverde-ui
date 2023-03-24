<template>
  <div
    class="map_container"
    :class="{
      highlightMapa: highlightMap == true,
    }"
  >
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
        <div
          class="basemap-list_item"
          v-for="(item, i) in basemapList"
          :key="i"
        >
          <div class="basemap-list_title" @click="changeMapStyle(item.value)">
            {{ item.title }}
          </div>
        </div>
      </div>

      <v-alert
        v-if="displayAlert"
        class="alert__box"
        color="warning"
        icon="$warning"
      >
        Você está fora do estado de São Paulo</v-alert
      >
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
      basemapList: [
        {
          title: "satélite",
          value:
            "https://api.maptiler.com/maps/hybrid/style.json?key=XmSZh88cfG77QlyKTuwa",
        },
        {
          title: "ruas",
          value:
            "https://api.maptiler.com/maps/streets-v2/style.json?key=XmSZh88cfG77QlyKTuwa",
        },
        {
          title: "padrão",
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
          this.$router.push({ params: { id: this.munPracaData.cd_mun } });
        } else {
          this.displayAlert = true;
          setTimeout(() => {
            this.displayAlert = false;
          }, "2000");
        }
        //
      });
    },

    changeMapStyle: async function (style) {
      const activeLayers = this.layers.filter((item) => item.visible === true);
      await new Promise((resolve) => {
        window.maplibregl.setStyle(style);
        window.maplibregl.once("styledata", () => resolve());
      });

      const togglePromises = activeLayers.map((layer) => {
        return new Promise((resolve) => {
          this.$store.commit("TOGGLE_LAYER", layer);
          setTimeout(() => {
            this.$store.commit("TOGGLE_LAYER", layer);
            resolve();
          });
        });
      });

      await Promise.all(togglePromises);
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
  cursor: pointer;
}

.basemap-list {
  position: absolute;
  right: 4em;
  top: 0.8em;
  color: white;
  text-align: center;
  z-index: 2;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  display: flex;
  background-color: #e1e1e1;

  &_item {
    color: black;
    border: 1px solid #e1e1e1;
  }

  &_title {
    background-color: white;
    padding: 3px;
    border-radius: 3px;
    &:hover {
      background-color: #e1e1e1;
      cursor: pointer;
    }
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
