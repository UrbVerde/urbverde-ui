<template>
  <div class="institutes-awards">
    <div
      class="award"
      v-for="(award, index) in awards"
      :key="index"
    >
      <img
        src="@/assets/images/homepage/awards-1.svg"
        alt="Imagem de folha de premiação da UrbVerde"
        loading="lazy"
      />

      <div class="award-label">
        <h5>{{ award.year }}</h5>
        <div class="award-label-text">
          <p class="body-caption-bold">
            {{ award.title }}
          </p>
          <p class="body-caption-medium">
            {{ award.subtitle }}
          </p>
        </div>
      </div>

      <img
        src="@/assets/images/homepage/awards-2.svg"
        alt="Imagem de folha de premiação da UrbVerde"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeAwards',
  props: {
    awards: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped lang="scss">
.institutes-awards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 56px;
}

.institutes-awards p,
.institutes-awards h4,
.institutes-awards h5 {
  margin: 0;
}

.award {
  display: flex;
  gap: 8px;
  text-align: center;
}

.award img {
  width: 32px;
  height: 80px;
}

.award .award-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  align-self: stretch;
}

.award .award-label h5 {
  color: map-get($primary-fade, 700);
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
}

.award .award-label .award-label-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: map-get($primary-fade, 700);
}

.award .award-label .award-label-text p:last-child {
  color: map-get($primary-fade, 700);
  font-size: 10px;
}
</style>
