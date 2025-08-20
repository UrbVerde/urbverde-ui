// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_alimentar_insecurity.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariSearch from '@/assets/images/cards/policies/mari-search-2.svg';
import mariMap from '@/assets/images/cards/policies/mari-map.svg';

export default createSectionConfig((nm_mun) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Qual impacto da insegurança alimentar e nutricional em ${nm_mun}`,
    subtitle: 'Este índice mede o risco de uma região sofrer impactos devido a insegurança alimentar e nutricional',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardInfo',
          props: {
            showLeftIcon: true,
            leftIconClass: 'bi bi-check2-circle',
            title: 'Problemas urbanos da insegurança alimentar e nutricional',
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariSearch,
            midiaPosition: 'right',
            type: 'paragraph-left',
            paragraphText: 'Afetam mais as populações urbanas vulneráveis, especialmente em áreas com pouco acesso a equipamentos públicos, hortas e mercados locais. Este índice orienta políticas de soberania alimentar, saúde e justiça socioambiental'
          }
        },
      ]
    }
  }),

  createSection({
    id: 'stats',
    ref: 'statsSection',
    showYearPicker: false,
    panel: {
      variant: '1-3',
      items: [
        {
          type: 'panel',
          props: {
            variant: '2-1',
            items: [
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/pp/risks',
                  cardIndex: 12,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/pp/risks',
                  cardIndex: 13,
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/pp/risks',
                  cardIndex: 14,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/pp/risks',
                  cardIndex: 15,
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
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/pp/risks',
                  cardIndex: 16,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'https://api.urbverde.com.br/v1/cards/pp/risks',
                  cardIndex: 17,
                }
              },
            ]
          }
        },
      ]
    },
  }),

  createSection({
    id: 'stats',
    ref: 'statsSection',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariMap,
            midiaPosition: 'right',
            type: 'list',
            title: 'Como o índice foi construído?',
            listItems: [
              'Foram feitos cálculos com mapas para ver onde o risco alimentar é maior, usando dados de sensibilidade, domiciliar e capacidade adaptativa',
              'Sensibilidade: leva em conta crianças pequenas, acesso à Bolsa Família, poucas refeições e consumo alto de ultraprocessados',
              'Ambiente domiciliar: altas densidades por domicílio e pouco acesso à água indicam maior risco alimentar',
              'Capacidade adaptativa: renda baixa, acesso ruim à energia e poucos restaurantes populares dificultam uma boa alimentação'
            ],
          }
        }
      ]
    }
  }),

  // Seção: ODS do eixo
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: 'Objetivos de Desenvolvimento Sustentável (ODS) do eixo',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardODS',
          props: {
            odsNumbers: [3, 10, 11, 13],
          }
        },
      ]
    }
  })
]);
