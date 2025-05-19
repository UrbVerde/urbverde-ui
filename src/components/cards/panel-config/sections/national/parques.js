// urbverde-ui/src/config/sections/clima.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';

import globalwarming from '@/assets/images/cards/globalwarming-park.svg';
import airpollution from '@/assets/images/cards/airPollutionFree.svg';

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
                  cardIndex: 2,
                  overrideCardSubtitle: 'Quantas vezes moradores próximos a praças tem em média mais renda',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/parks',
                  cardIndex: 3,
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/inequality',
                  cardIndex: 0,
                  overrideCardSubtitle: 'Do total de pessoas vivendo fora da vizinhança de praças',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/inequality',
                  cardIndex: 1,
                  overrideCardSubtitle: 'Do total de pessoas vivendo fora da vizinhança de praças',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/inequality',
                  cardIndex: 2,
                  overrideCardSubtitle: 'Do total de pessoas vivendo fora da vizinhança de praças',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/inequality',
                  cardIndex: 3,
                  overrideCardSubtitle: 'Do total de pessoas vivendo fora da vizinhança de praças',
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
                  paragraphTitle: 'Quais os benefícios dos parques e praças?',
                  midiaType: 'image',
                  imageSrc: airpollution,
                  midiaPosition: 'right',
                  type: 'list',
                  listItems: [
                    'Incentivam a atividade física, ajudando a prevenir problemas de saúde.',
                    'Ajudam a reduzir o estresse, promovendo saúde mental e bem-estar',
                    'Políticas públicas ajudam a promover e manter esses espaços.',
                  ],
                  showPrimaryButton: true,
                  buttonLabel: 'Ver mais dicas',
                  buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas/praças-e-parques',
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
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/ranking',
            cardIndex: 0,
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/ranking',
            cardIndex: 1,
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/ranking',
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
      variant: '2-1',
      items: [
        {
          type: 'panel',
          props: {
            variant: '1-3',
            items: [
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/info',
                  cardIndex: 0,
                  showButtonPrimary: true,
                  changeToCategory: 'Clima',
                  changeToLayerId: 'heat_island',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/info',
                  cardIndex: 1,
                  showButtonPrimary: true,
                  changeToCategory: 'Parques+e+Praças',
                  changeToLayerId: 'served_population',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/square/info',
                  cardIndex: 2,
                  showButtonPrimary: true,
                  changeToCategory: 'Parques+e+Praças',
                  changeToLayerId: 'avg_distance_to_squares',
                }
              }
            ],
          }
        },
        {
          component: 'CardDownload'
        },
      ]
    }
  }),
]);
