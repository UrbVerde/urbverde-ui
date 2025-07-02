<template>
  <div v-if="size === 'large' && text" class="ods-list-wrapper">
    <img
      :src="getOdsImage(odsNumber)"
      :alt="`ODS ${odsNumber}`"
      class="ods-image large"
    />
    <div class="text-wrapper">
      <h3 class="ods-title body-small-medium">{{ getOdsTitle(odsNumber) }}</h3>
      <p class="ods-subtitle body-small-medium">{{ getOdsSubtitle(odsNumber) }}</p>
    </div>
  </div>
  <img
    v-else
    :src="getOdsImage(odsNumber)"
    :alt="`ODS ${odsNumber}`"
    :class="['ods-image', size]"
  />
</template>

<script>
// Importação de todas as imagens ODS
import ods01 from '@/assets/images/cards/ods/ods-01.svg';
import ods02 from '@/assets/images/cards/ods/ods-02.svg';
import ods03 from '@/assets/images/cards/ods/ods-03.svg';
import ods04 from '@/assets/images/cards/ods/ods-04.svg';
import ods05 from '@/assets/images/cards/ods/ods-05.svg';
import ods06 from '@/assets/images/cards/ods/ods-06.svg';
import ods07 from '@/assets/images/cards/ods/ods-07.svg';
import ods08 from '@/assets/images/cards/ods/ods-08.svg';
import ods09 from '@/assets/images/cards/ods/ods-09.svg';
import ods10 from '@/assets/images/cards/ods/ods-10.svg';
import ods11 from '@/assets/images/cards/ods/ods-11.svg';
import ods12 from '@/assets/images/cards/ods/ods-12.svg';
import ods13 from '@/assets/images/cards/ods/ods-13.svg';
import ods14 from '@/assets/images/cards/ods/ods-14.svg';
import ods15 from '@/assets/images/cards/ods/ods-15.svg';
import ods16 from '@/assets/images/cards/ods/ods-16.svg';
import ods17 from '@/assets/images/cards/ods/ods-17.svg';

export default {
  name: 'OdsImages',
  props: {
    odsNumber: {
      type: Number,
      required: true,
      validator: (value) => value >= 1 && value <= 17
    },
    size: {
      type: String,
      default: 'small',
      validator: (value) => ['small', 'large'].includes(value)
    },
    text: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      odsImages: {
        1: ods01,
        2: ods02,
        3: ods03,
        4: ods04,
        5: ods05,
        6: ods06,
        7: ods07,
        8: ods08,
        9: ods09,
        10: ods10,
        11: ods11,
        12: ods12,
        13: ods13,
        14: ods14,
        15: ods15,
        16: ods16,
        17: ods17
      },
      odsTitles: {
        1: 'ODS 1: Erradicação da pobreza',
        2: 'ODS 2: Fome zero e agricultura sustentável',
        3: 'ODS 3: Saúde e bem-estar',
        4: 'ODS 4: Educação de qualidade',
        5: 'ODS 5: Igualdade de gênero',
        6: 'ODS 6: Água potável e saneamento',
        7: 'ODS 7: Energia limpa e acessível',
        8: 'ODS 8: Trabalho decente e crescimento econômico',
        9: 'ODS 9: Indústria, inovação e infraestrutura',
        10: 'ODS 10: Redução das desigualdades',
        11: 'ODS 11: Cidades e comunidades sustentáveis',
        12: 'ODS 12: Consumo e produção responsáveis',
        13: 'ODS 13: Ação contra a mudança global do clima',
        14: 'ODS 14: Vida na água',
        15: 'ODS 15: Vida terrestre',
        16: 'ODS 16: Paz, justiça e instituições eficazes',
        17: 'ODS 17: Parcerias e meios de implementação'
      },
      odsSubtitles: {
        1: 'Acabar com a pobreza em todas as suas formas e em todos os lugares.',
        2: 'Garantir comida saudável para todos e apoiar a agricultura sustentável.',
        3: 'Garantir saúde de qualidade e bem-estar para todas as pessoas.',
        4: 'Oferecer educação inclusiva e de qualidade para todos.',
        5: 'Promover a igualdade entre homens e mulheres.',
        6: 'Garantir acesso à água limpa e ao saneamento básico.',
        7: 'Levar energia limpa e acessível para todos.',
        8: 'Promover empregos dignos e crescimento econômico sustentável.',
        9: 'Investir em inovação, infraestrutura e tecnologia para todos.',
        10: 'Diminuir as desigualdades dentro e entre os países.',
        11: 'Tornar as cidades mais seguras, inclusivas e sustentáveis.',
        12: 'Usar os recursos de forma consciente e sustentável.',
        13: 'Combater as mudanças climáticas com ações urgentes.',
        14: 'Proteger os oceanos, mares e a vida aquática.',
        15: 'Cuidar das florestas, da biodiversidade e dos ecossistemas.',
        16: 'Promover paz, justiça e instituições fortes.',
        17: 'Trabalhar juntos para atingir todos os objetivos.'
      }
    };
  },
  methods: {
    getOdsImage(number) {
      return this.odsImages[number] || '';
    },
    getOdsTitle(number) {
      return this.odsTitles[number] || '';
    },
    getOdsSubtitle(number) {
      return this.odsSubtitles[number] || '';
    }
  }
};
</script>

<style scoped lang="scss">
.ods-image {
  border: 1px solid map-get($gray, 300);
  border-radius: 8px;
}

.ods-image.small {
  width: 48px;
  height: 48px;
}

.ods-image.large {
  width: 88px;
  height: 88px;
}

.ods-list-wrapper {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 24px;
  flex-direction: row;
}

.text-wrapper {
  display: flex;
  padding-top: 8px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}

.ods-title {
  color: map-get($body-text, body-color);
  margin: 0;
}

.ods-subtitle {
  color: map-get($gray, 600);
  margin: 0;
}
</style>
