// urbverde-ui/src/components/cards/panel-config/sections/national/parques.js
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/parks',
                  cardIndex: 0,
                  showModalButton: true,
                  modalTitle: 'Moradores próximos a praças',
                  modalBodyText: 'Representa o percentual de moradores que vivem em um raio de 400 metros de praças e parques, considerando a recomendação da OMS para acesso a áreas verdes.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/parks',
                  cardIndex: 1,
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'avg_distance_to_squares',
                  showModalButton: true,
                  modalTitle: 'Distância média até as praças',
                  modalBodyText: 'Representa a distância média que os moradores precisam percorrer para chegar à praça ou parque mais próximo de suas residências.',
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/parks',
                  cardIndex: 2,
                  overrideCardSubtitle: 'Quantas vezes moradores próximos a praças tem em média mais renda',
                  showModalButton: true,
                  modalTitle: 'Desigualdade de renda',
                  modalBodyText: 'Este dado mostra a diferença de renda entre as pessoas que moram próximas a praças e parques em comparação com aquelas que moram mais distantes dessas áreas.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/parks',
                  cardIndex: 3,
                  showModalButton: true,
                  modalTitle: 'Racismo ambiental',
                  modalBodyText: 'Este dado mostra a proporção de pessoas negras e indígenas entre aquelas que moram mais distantes de praças e parques, evidenciando desigualdades no acesso a áreas verdes.',
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/inequality',
                  cardIndex: 0,
                  overrideCardSubtitle: 'Do total de pessoas vivendo fora da vizinhança de praças',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/inequality',
                  cardIndex: 1,
                  overrideCardSubtitle: 'Do total de pessoas vivendo fora da vizinhança de praças',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/inequality',
                  cardIndex: 2,
                  overrideCardSubtitle: 'Do total de pessoas vivendo fora da vizinhança de praças',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/inequality',
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
            apiEndpoint: 'http://localhost:8080/v1/cards/square/ranking',
            cardIndex: 0,
            showModalButton: true,
            modalTitle: 'Municipios do Estado',
            modalBodyText: 'Este ranking compara dados de acesso a praças e parques da sua cidade com as demais cidades do Estado de São Paulo. O primeiro lugar indica a melhor posição para este dado.',
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/square/ranking',
            cardIndex: 1,
            showModalButton: true,
            modalTitle: 'Municipios da Mesorregião',
            modalBodyText: 'Este ranking compara dados de acesso a praças e parques da sua cidade com as demais cidades da mesorregião. O primeiro lugar indica a melhor posição para este dado.',
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/square/ranking',
            cardIndex: 2,
            showModalButton: true,
            modalTitle: 'Municipios da Microrregião',
            modalBodyText: 'Este ranking compara dados de acesso a praças e parques da sua cidade com as demais cidades da microrregião. O primeiro lugar indica a melhor posição para este dado.',
          }
        }
      ]
    }
  }),
  createSection({
    id: 'seeMore',
    ref: 'seeMoreSection',
    title: 'Veja mais sobre sua cidade!',
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/info',
                  cardIndex: 0,
                  showButtonPrimary: true,
                  changeToCategory: 'Clima',
                  changeToLayerId: 'heat_island',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/info',
                  cardIndex: 1,
                  showButtonPrimary: true,
                  changeToCategory: 'Parques+e+Praças',
                  changeToLayerId: 'served_population',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/square/info',
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
