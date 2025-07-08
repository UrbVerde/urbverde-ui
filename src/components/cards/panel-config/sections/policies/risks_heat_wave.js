// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_heat_wave.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariSearch from '@/assets/images/cards/policies/mari-search-2.svg';
import mariMap from '@/assets/images/cards/policies/mari-map.svg';

export default createSectionConfig((nm_mun) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: `Qual impacto das ondas de calor em ${nm_mun}`,
    subtitle: 'Este índice mede o risco de uma região sofrer impactos devido a ondas de calor',
    showYearPicker: false,
    panel: {
      variant: '1-2',
      items: [
        {
          component: 'CardInfo',
          props: {
            showLeftIcon: true,
            leftIconClass: 'bi bi-check2-circle',
            title: 'Problemas urbanos do calor extremo',
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariSearch,
            midiaPosition: 'right',
            type: 'paragraph-left',
            paragraphText: 'BusPodem agravar problemas de saúde, principalmente em áreas densamente povoadas e com pouca infraestrutura verde. Este índice ajuda a orientar políticas públicas de adaptação climática e justiça ambiental'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Regiões da cidade mais afetadas por ondas de calor',
            overrideNumberValue: '12 regiões',
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
      variant: '1-4',
      items: [
        {
          component: 'CardData',
          props: {
            overrideTitle: 'População impactada pelas ondas de calor',
            overrideNumberValue: '89%',
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Pretos, pardos e indígenas impactados pelas ondas de calor',
            overrideNumberValue: '49%',
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Idosos e crianças impactados pelas ondas de calor',
            overrideNumberValue: '39%',
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Mulheres impactadas pelas ondas de calor',
            overrideNumberValue: '39%',
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
              'Foram feitos cálculos com mapas para ver onde o risco de calor é maior, usando dados de ameaça, exposição e vulnerabilidade',
              'Ameaça: foi analisado os locais mais quentes da cidade',
              'Exposição: locais com muita gente e longos deslocamentos para o trabalho são mais expostos ao calor',
              'Vulnerabilidade: regiões com mais crianças e idosos, baixa renda e pouco acesso a saúde, água e áreas verdes são mais vulneráveis'
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
