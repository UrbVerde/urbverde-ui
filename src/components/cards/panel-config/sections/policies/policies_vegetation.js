import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariParks from '@/assets/images/cards/policies/mari-vegetation.svg';
import mariTarget from '@/assets/images/cards/policies/mari-target-2.svg';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Vegetação em <Município>
  createSection({
    id: 'metas',
    ref: 'metasSection',
    title: `Eixo Vegetação em ${nm_mun}`,
    subtitle: 'Vegetação corresponde às áreas verdes das cidades, como árvores, gramados e arbustos. Elas ajudam a melhorar o clima urbano, promovem justiça socioambiental e favorecem a infiltração da água no solo',
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
            paragraphText: 'Busca aumentar as áreas verdes nas cidades e reduzir a impermeabilização, para melhorar o ambiente urbano, reduzir desigualdades e orientar ações sustentáveis.'
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
              'Monitorar com precisão o solo e garantir acesso justo à vegetação de qualidade',
              'Aumentar a cobertura vegetal em áreas críticas e minimizar impermeabilizações',
              'Reduzir a proporção de solo impermeável nas cidades',
              'Requalificar e vegetar lotes vagos com potencial para infraestrutura verde'
            ]
          }
        }
      ]
    }
  }),

  // Seção: Ações e indicadores

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
            eixo: 'policies_vegetation',
            barPercentage: [0, 4],
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
      variant: '2-2',
      gapColumnHeight: '56px',
      items: [
        // Ação 1
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 - Aumentar a cobertura vegetal por habitante em áreas críticas',
            ods: '3, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Cobertura vegetal por habitante',
            overrideNumberValue: '11 m²/hab',
            numberType: 'composed',
            numberSubtitle: 'Recomendação: mais de 12 m²/hab até 2030',
          }
        },
        // Ação 2
        {
          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 - Aumentar a permeabilização do solo em áreas com baixa drenagem urbana',
            ods: '3, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de solo impermeável (PSI)',
            overrideNumberValue: '59%',
            numberType: 'composed',
            numberSubtitle: 'Recomendação: reduzir 10% do PSI nos setores com mais de 75% até 2040',
          }
        },
      ]
    }
  }),

  // Benefícios da vegetação urbana
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
            imageSrc: mariParks,
            midiaPosition: 'right',
            type: 'list',
            title: 'Descubra os benefícios da vegetação urbana',
            listItems: [
              'Redução do calor urbano, enchentes e outros eventos climáticos extremos',
              'Melhoria da qualidade do ar e regulação do microclima nas cidades',
              'Ampliação de áreas verdes e de lazer em regiões com baixa infraestrutura',
              'Apoio à agricultura urbana e valorização de espaços sustentáveis'
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais dicas',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas',
          }
        }
      ]
    }
  }),

  // Ações 3 e 4
  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    showYearPicker: false,
    panel: {
      variant: '2-2',
      gapColumnHeight: '56px',
      items: [
        // Ação 3
        {
          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Requalificar lotes vagos com potencial para arborização e infraestrutura verde',
            ods: '3, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de lotes subutilizados',
            overrideNumberValue: '30%',
            numberType: 'composed',
            numberSubtitle: 'Recomendação: utilizar todos os lotes identificados até 2030',
            overrideCardSubtitle: 'Terrenos vazios ou pouco usados, sem função social ou ambiental'
          }
        },
        // Ação 4
        {
          component: 'CardAction',
          props: {
            number: 4,
            actionTitle: 'Ação 4 - Aumentar a vegetação urbana a partir de dados de monitoramento anual',
            ods: '3, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Percentual de cobertura vegetal (PCV)',
            overrideNumberValue: '322 m',
            numberType: 'composed',
            numberSubtitle: 'Recomendação: alcançar 30% de PCV até 2040',
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
      variant: '2-1',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=406y7gDN-ZE',
            title: 'Projetos, iniciativas e políticas públicas para aumento da vegetação',
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Incentivar o uso de geotecnologias para planejamento urbano verde',
              'Promover mutirões de reflorestamento urbano',
              'Utilizar lotes vagos para projetos piloto de infraestrutura verde',
              'Integrar os dados ao sistema de licenciamento e priorização de obras públicas'
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais dicas',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas',
          }
        },
        {
          component: 'CardSendData',
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
            odsNumbers: [3, 11, 13, 15],
          }
        },
      ]
    }
  })
]);
