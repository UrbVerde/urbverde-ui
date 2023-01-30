<template>
  <div class="aside__toolbar_period">
    <label>SELECIONE UM PERÍODO</label>
    <v-row class="d-flex justify-space-between align-center">
      <v-col cols="4" md="2">
        <router-link
          class=""
          :to="{
            params: {
              ano: 2016,
            },
          }"
        >
          <div class="d-flex flex-column justify-center align-center">
            <div
              class="yearitem"
              :class="{ itemActive: routeYearValue == 2016 }"
            >
              <img
                v-if="routeYearValue == 2016"
                src="@/assets/icons/yearactive-icon.png"
                width="25px"
                alt=""
              />
            </div>
            <span class="mt-5">2016</span>
          </div>
        </router-link>
      </v-col>
      <v-col cols="4" md="2">
        <router-link
          class=""
          :to="{
            params: {
              ano: 2017,
            },
          }"
        >
          <div class="d-flex flex-column justify-center align-center">
            <div
              class="yearitem"
              :class="{ itemActive: routeYearValue == 2017 }"
            >
              <img
                v-if="routeYearValue == 2017"
                src="@/assets/icons/yearactive-icon.png"
                width="25px"
                alt=""
              />
            </div>
            <span class="mt-5">2017</span>
          </div>
        </router-link>
      </v-col>
      <v-col cols="4" md="2">
        <router-link
          class=""
          :to="{
            params: {
              ano: 2018,
            },
          }"
        >
          <div class="d-flex flex-column justify-center align-center">
            <div
              class="yearitem"
              :class="{ itemActive: routeYearValue == 2018 }"
            >
              <img
                v-if="routeYearValue == 2018"
                src="@/assets/icons/yearactive-icon.png"
                width="25px"
                alt=""
              />
            </div>
            <span class="mt-5">2018</span>
          </div>
        </router-link>
      </v-col>
      <v-col cols="4" md="2">
        <router-link
          class=""
          :to="{
            params: {
              ano: 2019,
            },
          }"
        >
          <div class="d-flex flex-column justify-center align-center">
            <div
              class="yearitem"
              :class="{ itemActive: routeYearValue == 2019 }"
            >
              <img
                v-if="routeYearValue == 2019"
                src="@/assets/icons/yearactive-icon.png"
                width="25px"
                alt=""
              />
            </div>
            <span class="mt-5">2019</span>
          </div>
        </router-link>
      </v-col>
      <v-col cols="4" md="2">
        <router-link
          class=""
          :to="{
            params: {
              ano: 2020,
            },
          }"
        >
          <div class="d-flex flex-column justify-center align-center">
            <div
              class="yearitem"
              :class="{ itemActive: routeYearValue == 2020 }"
            >
              <img
                v-if="routeYearValue == 2020"
                src="@/assets/icons/yearactive-icon.png"
                width="25px"
                alt=""
              />
            </div>
            <span class="mt-5">2020</span>
          </div>
        </router-link>
      </v-col>
      <v-col cols="4" md="2">
        <router-link
          class=""
          :to="{
            params: {
              ano: 2021,
            },
          }"
        >
          <div class="d-flex flex-column justify-center align-center">
            <div
              class="yearitem"
              :class="{ itemActive: routeYearValue == 2021 }"
            >
              <img
                v-if="routeYearValue == 2021"
                src="@/assets/icons/yearactive-icon.png"
                width="25px"
                alt=""
              />
            </div>
            <span class="mt-5">2021</span>
          </div>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    routeYearValue() {
      return this.$route.params.ano;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #003c3c !important;
}

.aside__toolbar_period {
  label {
    color: #003c3c;
    font-size: 13px;
  }

  a {
    width: 20%;
  }
}

.full_height {
  height: 89vh;
}

.yearitem {
  height: 3px;
  width: 1em;
  background-color: #d0e3e3;
  position: relative;
  margin-top: 25px;

  img {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
  }
}

.itemActive {
  background-color: #01dc82 !important;
}
</style>
