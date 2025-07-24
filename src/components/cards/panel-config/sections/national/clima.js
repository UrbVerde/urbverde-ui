// urbverde-ui/src/components/cards/panel-config/sections/national/clima.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import TGraphicSection from '@/components/cards/components-cards/cardsGraph/weather/TGraphicSection.vue';

import globalwarming from '@/assets/images/cards/globalwarming.svg';
import environmentalcampaign from '@/assets/images/cards/environmentalcampaign.svg';

export default createSectionConfig((nm_mun, uf) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Temperatura e clima em ${nm_mun} - ${uf}`,
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
            title: 'O que são ilhas de calor?',
            type: 'paragraph-left',
            paragraphText: 'São as áreas mais quentes das cidades, causadas por materiais como asfalto e concreto que retêm calor.',
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
                  cardIndex: 0,
                  showModalButton: true,
                  overrideCardSubtitle: 'Conta o número de crianças e idosos morando em áreas mais quentes. Quanto maior, maior a vulnerabilidade',
                  modalTitle: 'Nível de ilha de calor',
                  modalBodyText: 'Mede a intensidade da ilha de calor urbana considerando a vulnerabilidade populacional. Esse índice ajuda a identificar áreas críticas onde idosos e crianças estão mais expostos a altas temperaturas, sendo que, quanto maior o nível, maior a vulnerabilidade.',
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'heat_island',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
                  cardIndex: 3,
                  showModalButton: true,
                  modalTitle: 'Temperatura máxima da superfície',
                  modalBodyText: 'Representa o maior valor da temperatura de superfície terrestre registrado anualmente em todo o território urbano.',
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'max_surface_temp',
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
                  cardIndex: 1,
                  showModalButton: true,
                  modalTitle: 'Temperatura média da superfície',
                  modalBodyText: 'Representa o valor médio da temperatura de superfície terrestre registrado anualmente em todo o território urbano.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/temperature',
                  cardIndex: 2,
                  showModalButton: true,
                  modalTitle: 'Maior amplitude',
                  modalBodyText: 'Representa a maior diferença entre as temperaturas mínima e máxima da superfície terrestre registrada anualmente em todo o território urbano.',
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'surface_temp',
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
    ref: 'graphicSection',
    title: `Temperatura média em ${nm_mun} - ${uf} ao longo do tempo`,
    showYearPicker: false,
    component: TGraphicSection
  }),
  createSection({
    id: 'stats',
    ref: 'vulnerableSection',
    title: `Quem é mais afetado pelo calor extremo em ${nm_mun}?`,
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
                  showModalButton: true,
                  overrideCardSubtitle: 'Do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Negros e indígenas afetados',
                  modalBodyText: 'Este dado mostra a proporção de pessoas negras e indígenas entre todas as pessoas que vivem nas áreas mais quentes da cidade.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/heat',
                  cardIndex: 1,
                  showModalButton: true,
                  overrideCardSubtitle: 'Do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Mulheres afetadas',
                  modalBodyText: 'Este dado mostra a proporção de mulheres entre todas as pessoas que vivem nas áreas mais quentes da cidade.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/heat',
                  cardIndex: 2,
                  showModalButton: true,
                  overrideCardSubtitle: 'Do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Crianças afetadas',
                  modalBodyText: 'Este dado mostra a proporção de crianças entre todas as pessoas que vivem nas áreas mais quentes da cidade.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/heat',
                  cardIndex: 3,
                  showModalButton: true,
                  overrideCardSubtitle: 'Do total de pessoas vivendo nas regiões mais quentes',
                  modalTitle: 'Idosos afetados',
                  modalBodyText: 'Este dado mostra a proporção de idosos entre todas as pessoas que vivem nas áreas mais quentes da cidade.',
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
            showModalButton: true,
            modalTitle: 'Municipios do Estado',
            modalBodyText: 'Este ranking compara dados de temperatura da sua cidade com as demais cidades do Estado de São Paulo. O primeiro lugar indica a melhor posição para este dado.',
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/ranking',
            cardIndex: 1,
            showModalButton: true,
            modalTitle: 'Municipios da Mesorregião',
            modalBodyText: 'Este ranking compara dados de temperatura da sua cidade com as demais cidades da mesorregião. O primeiro lugar indica a melhor posição para este dado.',
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/weather/ranking',
            cardIndex: 2,
            showModalButton: true,
            modalTitle: 'Municipios da Microrregião',
            modalBodyText: 'Este ranking compara dados de temperatura da sua cidade com as demais cidades da microrregião. O primeiro lugar indica a melhor posição para este dado.',
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
                  changeToLayerId: 'idsa',
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
