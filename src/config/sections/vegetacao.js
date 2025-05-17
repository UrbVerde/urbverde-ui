// urbverde-ui/src/config/sections/clima.js
import { createSectionConfig, createSection } from '@/config/helperCreateSection';
import VGraphicSection from '@/components/cards/vegetation/vgraphics/VGraphicSection.vue';

import globalwarming from '@/assets/images/cards/globalwarming.svg';
import environmentalcampaign from '@/assets/images/cards/environmentalcampaign.svg';
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
            apiEndpoint: 'https://api.urbverde.com.br/v1/cards/vegetal/cover',
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/vegetal/cover',
                  cardIndex: 1,
                  showInfoButton: true,
                  showCardSubtitle: true,
                  cardSubtitle: 'É a diferença entre a temperatura mais quente e a mais fria',
                  modalTitle: 'Nível de ilha de calor',
                  modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/vegetal/cover',
                  cardIndex: 2,
                  showInfoButton: true,
                  modalTitle: 'Nível de ilha de calor',
                  modalBodyText: 'O nível de ilha de calor indica a intensidade do efeito de aquecimento urbano em relação às áreas rurais circundantes.',
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
    title: `Quem é mais afetado pelo calor extremo em ${nm_mun}?`,
    panel: {
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/vegetal/info',
                  cardIndex: 0,
                  showButtonPrimary: true,
                  changeToCategory: 'Clima',
                  changeToLayerId: 'heat_island',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/vegetal/info',
                  cardIndex: 1,
                  showButtonPrimary: true,
                  changeToCategory: 'Parques+e+Praças',
                  changeToLayerId: 'served_population',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/vegetal/info',
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
