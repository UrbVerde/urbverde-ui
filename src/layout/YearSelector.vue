<template>
  <div
    class="aside__toolbar_period"
    tabindex="0"
    @keydown.left="decrementYear"
    @keydown.right="incrementYear"
  >
    <!-- <label>ANO:</label> -->
    <v-row class="d-flex justify-space-between align-center">
      <v-col cols="4" md="2" v-for="year in years" :key="year.value">
        <router-link :to="{
          params: {
            ano: year.value,
          },
        }">
          <div class="d-flex flex-column justify-center align-center">
            <div class="yearitem" :class="{ itemActive: year.isActive }">
              <img v-if="year.isActive" src="@/assets/icons/yearactive-icon.png" width="25px" alt="" />
            </div>
            <span class="mt-5">{{ year.value }}</span>
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
      return parseInt(this.$route.params.ano); // Convert to integer
    },
    years() {
      const startYear = 2016;
      const endYear = 2021;
      const length = endYear - startYear + 1;

      const yearsArray = Array.from({ length }, (_, index) => endYear - index);
      yearsArray.reverse(); // Reverse the array

      return yearsArray.map((year) => ({
        value: year,
        isActive: year === this.routeYearValue, // Set isActive to true for the current year
      }));
    },
  },
  methods: {
    incrementYear() {
      const currentIndex = this.years.findIndex((year) => year.isActive);
      if (currentIndex < this.years.length - 1) {
        const nextYear = this.years[currentIndex + 1].value;
        this.changeYear(nextYear);
      }
    },
    decrementYear() {
      const currentIndex = this.years.findIndex((year) => year.isActive);
      if (currentIndex > 0) {
        const prevYear = this.years[currentIndex - 1].value;
        this.changeYear(prevYear);
      }
    },
    changeYear(year) {
      this.$router.push({ params: { ano: year } });
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
