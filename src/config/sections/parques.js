// urbverde-ui/src/config/sections/parques.js
import { createSectionConfig, createSection } from '@/config/helperCreateSection';

import InfoParksSection from '@/components/cards/parks/infoSection/infoParksSection.vue';
import ParksSquaresSection from '@/components/cards/parks/parksandSquaresSection/ParksSquaresSection.vue';
import SeeMoreParksSection from '@/components/cards/parks/seeMoreSection/SeeMoreParksSection.vue';
import RankParksSection from '@/components/cards/parks/rankSection/RankParksSection.vue';

export default createSectionConfig((nm_mun, uf) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Parques e praças em ${nm_mun} - ${uf}`,
    component: InfoParksSection
  }),
  createSection({
    id: 'stats',
    ref: 'parksSquaresSection',
    title: 'Quem vive distante de parques e praças?',
    component: ParksSquaresSection
  }),
  createSection({
    id: 'ranking',
    ref: 'rankParksSection',
    title: `${nm_mun} - ${uf} nos rankings de municípios`,
    component: RankParksSection
  }),
  createSection({
    id: 'seeMore',
    ref: 'seeMoreParksSection',
    title: 'Veja mais sobre sua cidade!',
    component: SeeMoreParksSection,
    isSeeMore: true
  })
]);
