<template>
  <CardBase
    v-for="(item, index) in data"
    :key="index"
    :title="item.title"
    :value="item.value"
    class="see-card"
  >
    <div class="button">
      <PrimaryButton
        label="Ver no Mapa"
        :filled="false"
        icon="bi-map"
        iconType="bootstrap"
        iconPosition="left"
        class="card-button"
        @click="handleClick(item)"
      />
    </div>
  </CardBase>
</template>

<script>
import CardBase from '@/components/cards/Card.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';

export default {
  name: 'SeeMoreCard',
  components: {
    CardBase,
    PrimaryButton,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    cityCode: {
      type: Number,
      required: true
    }
  },
  emits: ['change-layer'],
  methods: {
    handleClick(item) {
      // Verifica o título e redireciona para o link apropriado
      if (item.title === 'Temperatura média da superfície') {
        window.location.href = `http://localhost:5174/mapa?code=${this.cityCode}&type=city&year=2021&category=Clima&layer=surface_temp&scale=intraurbana`;
      } else if (item.title === 'Média da cobertura vegetal') {
        window.location.href = `http://localhost:5174/mapa?code=${this.cityCode}&type=city&year=2021&category=Vegeta%C3%A7%C3%A3o&layer=pcv&scale=intraurbana#map`;
      } else if (item.title === 'Moradores próximos a praças') {
        window.location.href = `http://localhost:5174/mapa?code=${this.cityCode}&type=city&year=2021&category=Parques+e+Pra%C3%A7as&layer=served_population&scale=intraurbana`;
      } else if (item.title === 'Distancia média até as praças') {
        window.location.href = `http://localhost:5174/mapa?code=${this.cityCode}&type=city&year=2021&category=Parques+e+Pra%C3%A7as&layer=avg_distance_to_squares&scale=intraurbana`;
      } else if (item.title === 'Desigualdade ambiental e social') {
        window.location.href = `http://localhost:5174/mapa?code=${this.cityCode}&type=city&year=2021&category=Vegeta%C3%A7%C3%A3o&layer=idsa&scale=intraurbana`;
      } else {
        // Comportamento padrão: emite o evento change-layer
        // this.$emit('change-layer', index);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.see-card{
  padding: 24px 32px 24px 32px;
}

.button{
  display: flex;
  width: 100%;
}

:deep(.primary-button){
  display: flex;
  width: 100%;
}
</style>
