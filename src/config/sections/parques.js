// urbverde-ui/src/config/sections/clima.js
import { createSectionConfig, createSection } from '@/config/helperCreateSection';

import globalwarming from '@/assets/images/cards/globalwarming-park.svg';
import environmentalcampaign from '@/assets/images/cards/environmentalcampaign.svg';

export default createSectionConfig((nm_mun, uf) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Parques e praças em ${nm_mun} - ${uf}`,
    panel: {
      variant: '1-3',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: globalwarming,
            midiaPosition: 'top',
            title: 'Quem as praças e parques atendem?',
            type: 'paragraph-left',
            paragraphText: 'Segundo a OMS, atendem principalmente moradores que vivem num raio de 400m, considerados "população da vizinhança.',
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/parks',
                  cardIndex: 0
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/parks',
                  cardIndex: 1
                }
              },
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/parks',
                  cardIndex: 2
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/parks',
                  cardIndex: 3
                }
              },
            ]
          }
        }
      ]
    }
  }),
  createSection({
    id: 'stats',
    ref: 'parksSquaresSection',
    title: 'Quem vive distante de parques e praças?',
    panel: {
      variant: '2-1',
      items: [
        {
          type: 'panel',
          props: {
            variant: '1-4',
            items: [
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/heat',
                  cardIndex: 0,
                  showInfoButton: true,
                  showCardSubtitle: true,
                  cardSubtitle: 'do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Nível de ilha de calor',
                  modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/heat',
                  cardIndex: 1,
                  showInfoButton: true,
                  showCardSubtitle: true,
                  cardSubtitle: 'do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Nível de ilha de calor',
                  modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/heat',
                  cardIndex: 2,
                  showInfoButton: true,
                  showCardSubtitle: true,
                  cardSubtitle: 'do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Nível de ilha de calor',
                  modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/heat',
                  cardIndex: 3,
                  showInfoButton: true,
                  showCardSubtitle: true,
                  cardSubtitle: 'do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Nível de ilha de calor',
                  modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
                }
              },
            ]
          }
        },
        {
          type: 'panel',
          props: {
            variant: '1-1',
            items: [
              {
                component: 'CardInfo',
                props: {
                  showMidia: true,
                  showCardTitle: false,
                  showParagraphTitle: true,
                  paragraphTitle: 'Como podemos tornar as cidades mais frescas?',
                  midiaType: 'image',
                  imageSrc: environmentalcampaign,
                  midiaPosition: 'right',
                  type: 'list',
                  listItems: [
                    'Árvores ajudam a reduzir o calor e melhorar a qualidade do ar.',
                    'Rios e lagos naturalizados ajudam a resfriar o clima urbano.',
                    'Políticas públicas podem promover mais áreas verdes nas cidades.',
                  ],
                  showPrimaryButton: true,
                  buttonLabel: 'Ver mais dicas',
                  buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas/temperatura',
                }
              },
            ]
          }
        }
      ]
    }
  }),
  createSection({
    id: 'ranking',
    ref: 'rankingSection',
    title: `${nm_mun} - ${uf} no rankings de municípios`,
    panel: {
      variant: '1-3',
      items: [
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/ranking',
            cardIndex: 0,
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/ranking',
            cardIndex: 1,
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/ranking',
            cardIndex: 2,
          }
        }
      ]
    }
  }),
  createSection({
    id: 'seeMore',
    ref: 'seeMoreSection',
    title: 'Veja mais sobre sua cidade!',
    showYearPicker: false,
    panel: {
      variant: '1-3',
      items: [
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/info',
            cardIndex: 0,
            showButtonPrimary: true,
            changeToCategory: 'Clima',
            changeToLayerId: 'heat_island',
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/info',
            cardIndex: 1,
            showButtonPrimary: true,
            changeToCategory: 'Parques+e+Praças',
            changeToLayerId: 'served_population',
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/info',
            cardIndex: 2,
            showButtonPrimary: true,
            changeToCategory: 'Parques+e+Praças',
            changeToLayerId: 'avg_distance_to_squares',
          }
        }
      ]
    }
  }),
]);
