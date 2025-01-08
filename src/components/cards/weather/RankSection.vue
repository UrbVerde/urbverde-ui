<!-- urbverde-ui/src/components/cards/weather/RankSection.vue -->
<template>
  <div>
    <RankingCard
      v-for="(rank, index) in rankCards"
      :key="'rank-' + index"
      :title="rank.title"
      :subtitle="rank.subtitle"
      :data="rank.data"
    />
  </div>
</template>

<script>
import RankingCard from './RankingCard.vue';

export default {
  components: {
    RankingCard,
  },
  data() {
    return {
      rankCards: [
        {
          title: 'Municípios do Brasil',
          subtitle: 'Posição do seu município entre os 5568 do Brasil',
          data: [
            { title: 'Nível de ilha de calor', value: '2862', total: '5568' },
            { title: 'Temperatura média da superfície', value: '298', total: '5568' },
            { title: 'Temperatura máxima da superfície', value: '698', total: '5568' },
          ],
        },
        {
          title: 'Ranking Global',
          subtitle: 'Posição no ranking mundial de sustentabilidade',
          data: [
            { title: 'Índice de Sustentabilidade', value: '45', total: '100' },
            { title: 'Impacto de Carbono', value: '30', total: '50' },
          ],
        },
      ],
    };
  },
};
</script>
