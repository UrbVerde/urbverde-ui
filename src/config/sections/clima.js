// urbverde-ui/src/config/sections/clima.js
import { createSectionConfig, createSection } from '@/config/helperCreateSection';

import TemperatureSection from '@/components/cards/weather/temperatur/TemperatureSection.vue';
import TGraphicSection from '@/components/cards/weather/graphics/TGraphicSection.vue';
import RankSection from '@/components/cards/weather/ranking/RankSection.vue';
import HeatSection from '@/components/cards/weather/heat/HeatSection.vue';
import SeeMoreSection from '@/components/cards/weather/seeMore/SeeMoreSection.vue';
import CardTest from '@/components/cards-new/cardTest.vue';

export default createSectionConfig((nm_mun, uf) => [
  // Exemplo do novo formato usando Panel com diferentes tipos de cards
  createSection({
    id: 'new-test-cards',
    ref: 'newTestCardsSection',
    title: `Novo formato de cards em ${nm_mun} - ${uf}`,
    panel: {
      variant: '1-3',
      items: [
        {
          type: 'cardData',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
            cardIndex: 0,
            showInfoButton: true,
            modalTitle: 'Nível de ilha de calor',
            modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.'
          }
        },
        CardTest,
        CardTest,
      ]
    }
  }),

  // Exemplo do novo formato com painel aninhado e diferentes tipos de cards
  createSection({
    id: 'nested-panel-cards',
    ref: 'nestedPanelCardsSection',
    title: `Cards com painel aninhado em ${nm_mun} - ${uf}`,
    panel: {
      variant: '1-3',
      items: [
        CardTest,
        {
          type: 'panel',
          props: {
            variant: '2-1',
            items: [
              {
                type: 'cardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
                  cardIndex: 1,
                  showInfoButton: true,
                  modalTitle: 'Card aninhado 1',
                  modalBodyText: 'Descrição do card aninhado 1.'
                }
              },
              CardTest
            ]
          }
        },
        {
          type: 'panel',
          props: {
            variant: '2-1',
            items: [
              {
                type: 'cardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
                  cardIndex: 1,
                  showInfoButton: true,
                  modalTitle: 'Card aninhado 1',
                  modalBodyText: 'Descrição do card aninhado 1.'
                }
              },
              CardTest
            ]
          }
        }
      ]
    }
  }),

  // Mantendo os exemplos antigos para compatibilidade
  createSection({
    id: 'test-cards',
    ref: 'testCardsSection',
    title: `Teste dos novos cards em ${nm_mun} - ${uf}`,
    component: CardTest
  }),
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Temperatura e clima em ${nm_mun} - ${uf}`,
    component: TemperatureSection
  }),
  createSection({
    id: 'stats',
    ref: 'graphicSection',
    title: `Temperatura média em ${nm_mun} - ${uf} ao longo do tempo`,
    component: TGraphicSection
  }),
  createSection({
    id: 'stats',
    ref: 'vulnerableSection',
    title: `Quem é mais afetado pelo calor extremo em ${nm_mun}?`,
    component: HeatSection
  }),
  createSection({
    id: 'ranking',
    ref: 'rankingSection',
    title: `${nm_mun} - ${uf} nos rankings de municípios`,
    component: RankSection
  }),
  createSection({
    id: 'seeMore',
    ref: 'seeMoreSection',
    title: 'Veja mais sobre sua cidade!',
    component: SeeMoreSection,
    isSeeMore: true
  })
]);
