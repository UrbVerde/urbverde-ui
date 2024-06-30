<template>
  <header id="headernav">
    <v-row style="width:100%">
      <v-col cols="2" md="1" class="d-flex justify-center align-center">
        <router-link :to="{ name: 'Home' }">
          <v-img max-width="70px" src="@/assets/icons/urbverde-logo-icon.png"></v-img>
        </router-link>
      </v-col>

      <!-- Busca por Município -->
      <v-col cols="10" md="5" :class="{ highlight: highlightSearch }">
        <v-autocomplete color="#01dc82" class="mt-5" v-model="municipioSelected" :items="municipios"
          label="Selecione outro município"></v-autocomplete>
      </v-col>

      <!-- Categorias -->
      <v-col cols="12" md="6" class="headernav__categories">

        <router-link :to="{
          name: 'Mapa',
          params: {
            id: this.$route.params.id,
            ano: this.$route.params.ano || 2016,
            escala: this.$route.params.escala,
            categoria: 'pracasparques',
          },
        }" class="layers__box_category" :class="{ category__active: activeRoute == 'pracasparques', }">
          <a><span>Praças e Parques</span></a>
        </router-link>

        <router-link :to="{
          name: 'Mapa',
          params: {
            id: this.$route.params.id,
            ano: this.$route.params.ano || 2016,
            escala: this.$route.params.escala,
            categoria: 'vegetacao',
          },
        }" class="layers__box_category" :class="{ category__active: activeRoute == 'vegetacao', }">
          <a><span>Vegetação</span></a>
        </router-link>

        <router-link :to="{
          name: 'Mapa',
          params: {
            id: this.$route.params.id,
            ano: this.$route.params.ano || 2016,
            escala: this.$route.params.escala,
            categoria: 'temperatura',
          },
        }" class="layers__box_category" :class="{ category__active: activeRoute == 'temperatura', }">
          <a><span>Temperatura</span></a>
        </router-link>
      </v-col>
    </v-row>

  </header>
</template>

<script>
import municipios from '@/modules/Mapa/municipios.js';
import * as turf from "@turf/turf";
import axios from "axios";

export default {
  props: ["highlightSearch"],
  data() {
    return {
      municipioSelected: '',
    };
  },
  computed: {
    municipios() {
      return require('@/modules/Mapa/municipios.js').default;
    },
    activeRoute() {
      return this.$route.params.categoria;
    },
    routeScaleValue() {
      return this.$route.params.escala;
    },
  },

  watch: {
    municipioSelected(val) {
      console.log(val)
      axios
        .get(
          `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageodata_pracas_por_municipio&PROPERTYNAME=nm_mun,cd_mun,geom&CQL_FILTER=nm_mun='${val}'&outputFormat=application%2Fjson`
        )
        .then((response) => {
          this.$router.push({
            params: { id: response.data.features[0].properties.cd_mun },
          });

          let bboxMun = turf.bbox(response.data.features[0].geometry);
          let massCenterMun = turf.centerOfMass(response.data.features[0]);
          window.maplibregl.flyTo({
            center: massCenterMun.geometry.coordinates,
            zoom: 10,
            bearing: 3,
            speed: 0.8,
            curve: 2,
            easing: (t) => t,
            essential: true,
          });

          window.maplibregl.fitBounds([
            [bboxMun[0], bboxMun[1]],
            [bboxMun[2], bboxMun[3]],
          ]);
        })
        .catch((error) => {
          console.error('HeaderMap.vue - Erro de SobreCarga no Sistema');
          // this.$router.push({ name: 'Home' });
        });
    },
    
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #003c3c !important;
}

.headernav__categories {
  // padding: 0 1.8em; // 0.8em;
  // margin-left: px;
  border-left: 1px solid #ddeaf3;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.category__active,
.category__active a,
/* Added selector for the <a> tag */
.category__active span {
  /* Added selector for the <span> tag */
  background-color: #003c3c !important;
  color: white !important;
}

// .headernav__categories__btn :hover {
//   background-color: #35cc8d !important;
//   color: #003c3c !important;
// }
// .category__active:hover {
//   background-color: #003c3c !important;
//   color: black !important;
// }

// .layer_active {
//   background-color: #003c3c;
//   color: white;
// }

// .aside__toolbar_scale {
//   label {
//     color: #003c3c;
//     font-size: 13px;
//   }
// }

// .aside__toolbar_btnbox {
//   position: relative;
// }

// .aside__toolbar_scale--buttons {
//   border-radius: 14px;
//   text-align: center;
//   background-color: #e6f1f2;
//   color: #003c3c;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   height: 57px;
//   padding: 2em;
//   font-size: 1.2em;
//   cursor: pointer;

//   & span {
//     font-size: 0.8em;
//   }
// }

.layers__box {
  &_category {
    border-radius: 14px;
    text-align: center;
    background-color: #e6f1f2;
    color: #003c3c;
    display: flex;
    justify-content: center;
    align-items: center !important;
    vertical-align: middle;
    // padding: 2em;
    height: 63px;
    width: 180px;
    font-size: 1.2em;
    // margin: 0.8em;
    cursor: pointer;

    & span {
      font-size: 0.8em;
    }

    @media (max-width: 950px) {}
  }
}
</style>

<style>
.v-select__selection,
.v-select__selection--comma,
.v-select.v-text-field input {
  color: #003c3c !important;
  /* font-size: 1.2em; */
  /* max-height: 100%; */
}

.v-input__slot {
  margin-bottom: 0px !important;
}

.v-text-field__details {
  height: 0px !important;
  padding: 0px !important;
}

#headernav>div>div.col.col-5>div>div>div.v-input__slot>div.v-select__slot>label {
  color: #003c3c !important;
}
</style>
