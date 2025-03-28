// urbverde-ui/src/config/sections/vegetacao.js
import { createSectionConfig, createSection } from '@/config/helperCreateSection';

import VegetationSection from '@/components/cards/vegetation/vegetationCover/VegetationSection.vue';
import VGraphicSection from '@/components/cards/vegetation/vgraphics/VGraphicSection.vue';
import InequalitySection from '@/components/cards/vegetation/inequality/InequalitySection.vue';
import SeeMoreVegSection from '@/components/cards/vegetation/seeMore/SeeMoreVegSection.vue';
import RankVegSection from '@/components/cards/vegetation/rankSection/RankVegSection.vue';

export default createSectionConfig((nm_mun, uf) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `A cobertura vegetal em ${nm_mun} - ${uf}`,
    component: VegetationSection
  }),
  createSection({
    id: 'stats',
    ref: 'graphicSection',
    title: `Cobertura vegetal em ${nm_mun} - ${uf} ao longo do tempo`,
    component: VGraphicSection
  }),
  createSection({
    id: 'stats',
    ref: 'inequalitySection',
    title: 'Desigualdade ambiental e a vegetação',
    component: InequalitySection
  }),
  createSection({
    id: 'ranking',
    ref: 'rankingVegSection',
    title: `${nm_mun} - ${uf} nos rankings de municípios`,
    component: RankVegSection
  }),
  createSection({
    id: 'seeMore',
    ref: 'seeMoreSection',
    title: 'Veja mais sobre sua cidade!',
    component: SeeMoreVegSection,
    isSeeMore: true
  })
]);
