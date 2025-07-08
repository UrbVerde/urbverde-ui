// urbverde-ui/src/components/cards/panel-config/sections/national/vegetacao.js
// urbverde-ui/src/config/sections/clima.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import VGraphicSection from '@/components/cards/components-cards/cardsGraph/vegetation/VGraphicSection.vue';

import globalwarming from '@/assets/images/cards/globalwarming-vegetation.svg';
import environmentalcampaign from '@/assets/images/cards/plantingATreeTogether.svg';
import field from '@/assets/images/cards/img.svg';

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
            title: 'O que é cobertura vegetal?',
            type: 'paragraph-left',
            paragraphText: 'Áreas da cidade cobertas por vegetação, como árvores e gramíneas.',
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/cover',
            cardIndex: 0,
            showImage: true,
            imageSrc: field
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/cover',
                  cardIndex: 1,
                  showModalButton: true,
                  showCardSubtitle: true,
                  cardSubtitle: 'É a diferença entre a temperatura mais quente e a mais fria',
                  modalTitle: 'Média da cobertura vegetal',
                  modalBodyText: 'Representa o valor médio da cobertura vegetal registrado anualmente em todo o território urbano.',
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'pcv',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/cover',
                  cardIndex: 2,
                  showModalButton: true,
                  modalTitle: 'A cobertura vegetal na cidade varia entre',
                  modalBodyText: 'Representa os dados de cobertura vegetal mínimo e máximo registrados anualmente em todo o território urbano.',
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'pcv',
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
    title: `Cobertura vegetal em ${nm_mun} - ${uf} ao longo do tempo`,
    component: VGraphicSection
  }),
  createSection({
    id: 'stats',
    ref: 'vulnerableSection',
    title: 'Desigualdade ambiental e a vegetação',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            showCardTitle: false,
            showParagraphTitle: true,
            paragraphTitle: 'Quais os benefícios de uma cidade arborizada?',
            midiaType: 'image',
            imageSrc: environmentalcampaign,
            midiaPosition: 'right',
            type: 'list',
            listItems: [
              'Árvores  reduzem a sensação de calor, criando ambientes mais frescos.',
              'Ajudam a filtrar poluentes e  melhorar a qualidade do ar  nas cidades.',
              'Políticas públicas  podem auxiliar a promover mais áreas verdes nas cidades.',
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais dicas',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas/vegetação',
          }
        },
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
            apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/ranking',
            cardIndex: 0,
            showModalButton: true,
            modalTitle: 'Municipios do Estado',
            modalBodyText: 'Este ranking compara dados de cobertura vegetal da sua cidade com as demais cidades do Estado de São Paulo. O primeiro lugar indica a melhor posição para este dado.',
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/ranking',
            cardIndex: 1,
            showModalButton: true,
            modalTitle: 'Municipios da Mesorregião',
            modalBodyText: 'Este ranking compara dados de cobertura vegetal da sua cidade com as demais cidades da mesorregião. O primeiro lugar indica a melhor posição para este dado.',
          }
        },
        {
          component: 'CardRanking',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/ranking',
            cardIndex: 2,
            showModalButton: true,
            modalTitle: 'Municipios da Microrregião',
            modalBodyText: 'Este ranking compara dados de cobertura vegetal da sua cidade com as demais cidades da microrregião. O primeiro lugar indica a melhor posição para este dado.',
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/info',
                  cardIndex: 0,
                  showButtonPrimary: true,
                  changeToCategory: 'Clima',
                  changeToLayerId: 'heat_island',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/info',
                  cardIndex: 1,
                  showButtonPrimary: true,
                  changeToCategory: 'Parques+e+Praças',
                  changeToLayerId: 'served_population',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/vegetal/info',
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
