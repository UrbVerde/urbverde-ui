// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_arboviruses.js
// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_alimentar_insecurity.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariSearch from '@/assets/images/cards/policies/mari-search-2.svg';
import mariMap from '@/assets/images/cards/policies/mari-map.svg';

export default createSectionConfig((nm_mun) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Qual impacto da insegurança alimentar e nutricional em ${nm_mun}`,
    subtitle: 'Este índice mede o risco de uma região sofrer impactos devido às arboviroses, como dengue, zika e chikungunya',
    showYearPicker: false,
    panel: {
      variant: '1-2',
      items: [
        {
          component: 'CardInfo',
          props: {
            showLeftIcon: true,
            leftIconClass: 'bi bi-check2-circle',
            title: 'Problemas urbanos das arboviroses',
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariSearch,
            midiaPosition: 'right',
            type: 'paragraph-left',
            paragraphText: 'São mais comuns em áreas com más condições de saneamento, alta densidade populacional e presença de criadouros do mosquito. Afetam principalmente populações vulneráveis, com menos acesso à saúde e à informação'
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
                  overrideTitle: 'Pretos, pardos e indígenas em áreas com riscos de arboviroses',
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
                  overrideTitle: 'Renda nas áreas com riscos de arboviroses',
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
                  overrideTitle: 'Mulheres chefes de família não alfabetizadas em áreas com riscos de arboviroses',
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
              'Foram feitos cálculos com mapas para ver onde o risco de arboviroses é maior, usando dados de ameaça, exposição e vulnerabilidade',
              'Ameaça: combina temperatura média, número de casos de dengue e índice de chuvas – quanto maior esses fatores, maior o risco',
              'Exposição: locais com maior densidade de pessoas têm mais chance de espalhar doenças transmitidas por mosquitos',
              'Vulnerabilidade: locais com pouca água potável, sem coleta de lixo e baixa renda têm menos condições de enfrentar as arboviroses'
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
