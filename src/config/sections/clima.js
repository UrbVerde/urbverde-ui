// urbverde-ui/src/config/sections/clima.js
import { createSectionConfig, createSection } from '@/config/helperCreateSection';

import TemperatureSection from '@/components/cards/weather/temperatur/TemperatureSection.vue';
import TGraphicSection from '@/components/cards/weather/graphics/TGraphicSection.vue';
import RankSection from '@/components/cards/weather/ranking/RankSection.vue';
import HeatSection from '@/components/cards/weather/heat/HeatSection.vue';
import SeeMoreSection from '@/components/cards/weather/seeMore/SeeMoreSection.vue';
import CardTest from '@/components/cards-new/cardTest.vue';
import cardRanking from '@/components/cards-new/cardRanking.vue';
import CardInfo from '@/components/cards-new/cardInfo.vue';
import imagem from '@/assets/images/cards/youngFarmer.svg';

export default createSectionConfig((nm_mun, uf) => [
  // Test section for CardInfo
  createSection({
    id: 'card-info-test',
    ref: 'cardInfoTestSection',
    title: `Teste do CardInfo em ${nm_mun} - ${uf}`,
    panel: {
      variant: '1-1',
      items: [
        {
          component: CardInfo,
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: imagem,
            midiaPosition: 'right',
            title: 'Título do Card',
            subtitle: 'Subtítulo do Card',
            showSubtitle: false,
            type: 'paragraph-left',
            paragraphText: 'Este é um exemplo de texto para testar o CardInfo com diferentes configurações.',
            showPrimaryButton: true,
            buttonLabel: 'texto',
            buttonIcon: 'bi bi-arrow-right',
            buttonLink: 'https://www.google.com',
            showInfoButton: true,
            modalTitle: 'Informações do Card',
            modalBodyText: 'Este é um card de teste para demonstrar as funcionalidades do CardInfo.'
          }
        },
      ]
    }
  }),

  // Exemplo do novo formato usando Panel com diferentes tipos de cards
  createSection({
    id: 'new-test-cards',
    ref: 'newTestCardsSection',
    title: `Novo formato de cards em ${nm_mun} - ${uf}`,
    panel: {
      variant: '1-3',
      items: [
        {
          component: CardInfo,
          props: {
            showMidia: true,
            midiaType: 'image',
            midiaLink: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.vecteezy.com%2Ffotos-gratis%2Fimagem&psig=AOvVaw01rn4yfw7k0nHSXyWHIOEQ&ust=1747266799347000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDn9pjSoY0DFQAAAAAdAAAAABAE',
            midiaPosition: 'top',
            title: 'Título do Card',
            subtitle: 'Subtítulo do Card',
            showSubtitle: false,
            type: 'paragraph-left',
            paragraphText: 'Este é um exemplo de texto para testar o CardInfo com diferentes configurações.',
            showPrimaryButton: false,
            buttonLabel: 'Saiba mais',
            buttonIcon: 'bi bi-arrow-right',
            showInfoButton: true,
            modalTitle: 'Informações do Card',
            modalBodyText: 'Este é um card de teste para demonstrar as funcionalidades do CardInfo.'
          }
        },
        // Exemplo de CardTest com props
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
            cardIndex: 0,
            showInfoButton: true,
            modalTitle: 'Nível de ilha de calor',
            modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
            cardIndex: 3,
            showInfoButton: true,
            modalTitle: 'Nível de ilha de calor',
            modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
          }
        },
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
        // Exemplo de CardTest com props
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
            cardIndex: 0,
            showInfoButton: true,
            modalTitle: 'Nível de ilha de calor',
            modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
          }
        },
        {
          type: 'panel',
          props: {
            variant: '2-1',
            items: [
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
                  cardIndex: 1,
                  showInfoButton: true,
                  modalTitle: 'Card aninhado 1',
                  modalBodyText: 'Descrição do card aninhado 1.',
                }
              },
              // Exemplo de CardTest com props em painel aninhado
              {
                component: CardTest,
                props: {
                  modalTitle: 'Card Teste Aninhado',
                  modalBodyText: 'Este é um CardTest em um painel aninhado com props personalizadas!'
                }
              }
            ]
          }
        },
        {
          type: 'panel',
          props: {
            variant: '2-1',
            items: [
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
                  cardIndex: 1,
                  showInfoButton: true,
                  modalTitle: 'Card aninhado 1',
                  modalBodyText: 'Descrição do card aninhado 1.',
                  year: null
                }
              },
              CardTest // CardTest sem props (usará os valores padrão)
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
    component: CardTest,
    props: {
      modalTitle: 'Card Teste com Props',
      modalBodyText: 'Este é um exemplo de CardTest com props personalizadas!'
    }
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
    id: 'ranking',
    ref: 'rankingSection',
    title: `${nm_mun} - ${uf} nos rankings de municípios`,
    component: cardRanking,
    props: {
      apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/ranking',
      requiresYear: true,
      showInfoButton: true,
      modalTitle: 'Informações do Clima',
      modalBodyText: 'Informações sobre o ranking climático...',
      rankingIndex: 0,
      year: null
    }
  }),
  createSection({
    id: 'seeMore',
    ref: 'seeMoreSection',
    title: 'Veja mais sobre sua cidade!',
    component: SeeMoreSection,
    isSeeMore: true
  }),
  createSection({
    id: 'seeMore',
    ref: 'seeMoreSection',
    title: 'Veja mais sobre sua cidade!',
    component: 'CardData',
    props: {
      apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
      cardIndex: 0,
      showButtonPrimary: true,
      changeToCategory: 'Clima',
      changeToLayerId: 'heat_island',
      overrideTitle:'teste'
    }
  })
]);
