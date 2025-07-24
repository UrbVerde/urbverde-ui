// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_flood.js
// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_alimentar_insecurity.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariSearch from '@/assets/images/cards/policies/mari-search-2.svg';
import mariMap from '@/assets/images/cards/policies/mari-map.svg';

export default createSectionConfig((nm_mun) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Qual impacto da insegurança alimentar e nutricional em ${nm_mun}`,
    subtitle: 'Este índice mede o risco de uma região sofrer impactos climáticos causados por inundações urbanas',
    showYearPicker: false,
    panel: {
      variant: '1-2',
      items: [
        {
          component: 'CardInfo',
          props: {
            showLeftIcon: true,
            leftIconClass: 'bi bi-check2-circle',
            title: 'Problemas urbanos das inundações',
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariSearch,
            midiaPosition: 'right',
            type: 'paragraph-left',
            paragraphText: 'Acontecem com mais frequência em locais com pouca drenagem, ruas mal estruturadas e ocupações em áreas de risco. Podem causar perdas materiais, doenças e impactos na mobilidade',
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
                  overrideTitle: 'Pretos, pardos e indígenas em áreas com risco de inundações',
                  overrideNumberValue: 'Em breve',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Pretos, pardos e indígenas fora das áreas de risco',
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
                  overrideTitle: 'Renda nas áreas com risco de inundações',
                  overrideNumberValue: 'Em breve',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Renda fora das áreas de risco',
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
                  overrideTitle: 'Mulheres chefes de família não alfabetizadas em áreas com risco de inundações',
                  overrideNumberValue: 'Em breve',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Mulheres chefes de família não alfabetizadas fora das áreas de risco',
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
              'Foram feitos cálculos com mapas para ver onde o risco de inundações é maior, usando dados de ameaça, exposição e vulnerabilidade',
              'Ameaça: considera as áreas com mais chance de alagar e onde já aconteceram mais inundações',
              'Exposição: locais com ruas estreitas, muito trânsito e muita gente são mais expostos aos efeitos das chuvas fortes',
              'Vulnerabilidade: onde há pouca drenagem, falta de calçada e baixa renda, as pessoas têm mais dificuldade para se proteger das inundações'
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
