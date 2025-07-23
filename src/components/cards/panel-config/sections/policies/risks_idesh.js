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
      variant: '1-2',
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
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Regiões da cidade mais afetadas pela insegurança alimentar e nutricional',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Essas regiões representam 10% das áreas urbanas mais vulneráveis da cidade',
          }
        }
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
                  overrideTitle: 'Pretos, pardos e indígenas em áreas com pior desenvolvimento social (DESH)',
                  overrideNumberValue: 'Em breve',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Pretos, pardos e indígenas em áreas com melhor desenvolvimento social (DESH)',
                  overrideNumberValue: 'Em breve',
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
                  overrideTitle: 'Renda nas áreas com pior desenvolvimento social (DESH)',
                  overrideNumberValue: 'Em breve',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Renda nas áreas com melhor desenvolvimento social (DESH)',
                  overrideNumberValue: 'Em breve',
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
                  overrideTitle: 'Mulheres chefes de família não alfabetizadas em áreas com pior desenvolvimento social (DESH)',
                  overrideNumberValue: 'Em breve',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Mulheres chefes de família não alfabetizadas em áreas com melhor desenvolvimento social (DESH)',
                  overrideNumberValue: 'Em breve',
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
