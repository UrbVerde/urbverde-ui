import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariHidro from '@/assets/images/cards/policies/mari-hidrology.svg';
import mariTarget from '@/assets/images/cards/policies/mari-target-1.svg';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Parques e Praças
  createSection({
    id: 'metas',
    ref: 'metasSection',
    title: `Eixo Hidrologia em ${nm_mun}`,
    subtitle: 'As inundações e alagamentos urbanos são agravados pela impermeabilização e falta de planejamento. O eixo busca soluções para reduzir riscos e promover segurança hídrica da cidade',
    showYearPicker: false,
    panel: {
      variant: '1-2',
      items: [
        {
          component: 'CardInfo',
          props: {
            showLeftIcon: true,
            leftIconClass: 'bi bi-check2-circle',
            title: 'Objetivos do eixo',
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariTarget,
            midiaPosition: 'right',
            type: 'paragraph-left',
            paragraphText: 'Busca prevenir inundações e ampliar a infiltração da água da chuva, protegendo comunidades vulneráveis e promovendo uma drenagem urbana mais sustentável',
          }
        },
        {
          component: 'CardInfo',
          props: {
            showMidia: false,
            title: 'Metas do eixo',
            showLeftIcon: true,
            leftIconClass: 'bi bi-list-check',
            type: 'list',
            listItems: [
              'Reduzir o número de mortes e de pessoas afetadas por desastres hidrometeorológicos',
              'Reduzir as perdas econômicas diretas associadas a desastres',
              'Garantir especial atenção à proteção de pessoas de baixa renda e em situação de vulnerabilidade'
            ]
          }
        }
      ]
    }
  }),

  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    title: `Ações e indicadores em ${nm_mun}`,
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardStamps',
          props: {
            eixo: 'hidro',
            barPercentage: [0, 6],
          }
        },
      ]
    }
  }),

  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    showYearPicker: false,
    panel: {
      variant: '3-2',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 - Aumentar a permeabilização do solo em áreas com baixa drenagem urbana',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de solo impermeável (PSI)',
            overrideNumberValue: '59%',
            numberType: 'large',
            overrideCardSubtitle: 'Solo que não deixa a água infiltrar, como asfalto e concreto',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 - Ampliar a permeabilidade nas sub-bacias hidrográficas da cidade',
            ods: '6, 10, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de solo impermeável (PSI) na sub-bacia',
            overrideNumberValue: '62%',
            numberType: 'large',
            overrideCardSubtitle: 'É a parte da sub-bacia coberta por solo que não deixa a água infiltrar',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Expandir áreas vegetadas nas margens de córregos (APPs)',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de áreas vegetadas em APPs',
            overrideNumberValue: '55%',
            numberType: 'large',
            overrideCardSubtitle: 'Indica quanto das Áreas de Preservação Permanente (APPs), como margens de rios e córregos, estão cobertas por vegetação',
          }
        },
      ]
    }
  }),

  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariHidro,
            midiaPosition: 'right',
            type: 'list',
            title: 'Descubra os benefícios da hidrologia urbana',
            listItems: [
              'Redução de alagamentos e enchentes, tornando a cidade mais segura em dias de chuva',
              'Melhoria da qualidade da água e preservação dos rios urbanos com mais vegetação nas margens',
              'Criação de espaços mais agradáveis e saudáveis, com menos concreto e mais natureza nas cidades',
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais dicas',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas',
          }
        }
      ]
    }
  }),

  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    showYearPicker: false,
    panel: {
      variant: '3-2',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 4,
            actionTitle: 'Ação 4 - Ampliar vegetação nas APPs em cada sub-bacia municipal',
            ods: '6, 10, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de áreas vegetadas em APP por sub-bacia',
            overrideNumberValue: '62%',
            numberType: 'large',
            overrideCardSubtitle: 'Mostra quanto das Áreas de Preservação Permanente (APPs) está coberto por vegetação nas sub-bacias da cidade',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 5,
            actionTitle: 'Ação 5 - Desenvolver projetos de renaturalização de rios urbanos',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {

          component: 'CardData',
          props: {
            overrideTitle: 'Percentual de rios canalizados',
            overrideNumberValue: '23%',
            numberType: 'large',
            overrideCardSubtitle: 'Parte dos rios que foi transformada em canais de concreto, reduzindo sua função natural e aumentando o risco de enchentes',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 6,
            actionTitle: 'Ação 6 - Implantar trechos-piloto de renaturalização de rios',
            ods: '6, 10, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Percentual de rios canalizados por sub-bacias',
            overrideNumberValue: '44%',
            numberType: 'large',
            overrideCardSubtitle: 'Mostra quanto dos rios está canalizado em cada sub-bacia da cidade',
          }
        },
      ]
    }
  }),

  // Seção: Orientações para o planejamento climático
  createSection({
    id: 'planejamento',
    ref: 'planejamentoSection',
    title: 'Orientações para o planejamento climático da cidade',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=e_TtnmXEHKI&t=6839s',
            title: 'Projetos, iniciativas e políticas públicas de hidrologia',
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
              'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais orientações',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas',
          }
        }
      ]
    }
  }),

  // Seção: ODS do eixo
  createSection({
    id: 'planejamento',
    ref: 'planejamentoSection',
    title: 'Objetivos de Desenvolvimento Sustentável (ODS) do eixo',
    showYearPicker: false,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardODS',
          props: {
            odsNumbers: [3, 6, 10, 11, 13, 15],
          }
        },
      ]
    }
  })
]);
