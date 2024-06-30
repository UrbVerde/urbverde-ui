<template>
  <label style="background-color: white">
    <v-autocomplete v-model="municipioSelected" :items="municipios" outlined dense solo
      :label="currentuserlocation ? `Selecione um município. Ex: ${currentuserlocation}` : 'Selecione um município'">
    </v-autocomplete>
  </label>
</template>

<script>
import axios from "axios";
import * as turf from "@turf/turf";
import municipios from "@/modules/Mapa/municipios.js";

export default {
  props: {
    goToMap: {
      type: Boolean,
      default: false,
      municipios: municipios,
    },
    currentuserlocation: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      municipioSelected: "",
      municipios: municipios,
    };
  },
  watch: {
    municipioSelected: {
      handler: function (val) {
        // console.log("Municipio Selecionado:", val)
        axios
          .get(
            `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageodata_pracas_por_municipio&PROPERTYNAME=nm_mun,cd_mun,geom&CQL_FILTER=nm_mun='${val}'&outputFormat=application%2Fjson`
          )
          .then((response) => {
            if (
              response.data &&
              response.data.features &&
              response.data.features.length > 0 &&
              response.data.features[0].geometry
            ) {
              let bboxMun = turf.bbox(response.data.features[0].geometry);
              let massCenterMun = turf.centerOfMass(response.data.features[0]);

              if (!this.goToMap) {
                this.$router.push({
                  params: { id: response.data.features[0].properties.cd_mun },
                });
              } else {
                this.$router.push({
                  name: "Mapa",
                  params: {
                    id: response.data.features[0].properties.cd_mun,
                    ano: 2021,
                    escala: "intraurbana",
                    categoria: "pracasparques",
                  },
                });
              }

              this.$emit("id", response.data.features[0].properties.cd_mun);
              // window.maplibregl.flyTo({
              //   center: massCenterMun.geometry.coordinates,
              //   zoom: 10,
              //   bearing: 3,
              //   speed: 0.8,
              //   curve: 2,
              //   easing: (t) => t,
              //   essential: true,
              // });

              // window.maplibregl.fitBounds([
              //   [bboxMun[0], bboxMun[1]],
              //   [bboxMun[2], bboxMun[3]],
              // ]);
            }
          })
          .catch((error) => {
            console.error('SearchMun.vue - Erro de SobreCarga no Sistema');
            // this.$router.push({ name: 'Home' });
          });
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style></style>