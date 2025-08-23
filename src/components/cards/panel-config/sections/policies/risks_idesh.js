// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_idesh.js
// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_alimentar_insecurity.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariSearch from '@/assets/images/cards/policies/mari-search-2.svg';
import mariMap from '@/assets/images/cards/policies/mari-map.svg';

export default createSectionConfig((nm_mun) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Qual impacto da insegurança alimentar e nutricional em ${nm_mun}`,
    subtitle: 'Este índice mede as condições de desenvolvimento social das favelas, considerando moradia, infraestrutura urbana e vulnerabilidades sociais',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardInfo',
          props: {
            showLeftIcon: true,
            leftIconClass: 'bi bi-check2-circle',
            title: 'Problemas urbanos da falta do desenvolvimento social',
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariSearch,
            midiaPosition: 'right',
            type: 'paragraph-left',
            paragraphText: 'Aparecem em regiões com baixa renda, pouca escolaridade, moradias precárias e falta de serviços públicos. Afetam o bem-estar e aumentam a vulnerabilidade a outros riscos urbanos.',
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/risks',
                  cardIndex: 24,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/risks',
                  cardIndex: 25,
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/risks',
                  cardIndex: 26,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/risks',
                  cardIndex: 27,
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/risks',
                  cardIndex: 28,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/risks',
                  cardIndex: 29,
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
              'Foram feitas médias e cálculos para mostrar onde estão as piores condições de moradia, cidade e vida social, somadas ao risco ambiental',
              'Habitat: locais com casas muito cheias, sem água, sem esgoto e sem banheiro exclusivo têm pior qualidade de moradia',
              'Cidade: locais com ruas sem calçada, sem pavimento, sem bueiro e com descarte de esgoto irregular indicam pior infraestrutura urbana',
              'Vida social e risco: onde há baixa renda, pouca educação e jovens em situação de vulnerabilidade, somado ao risco de desastres ambientais, o desenvolvimento é menor'
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
