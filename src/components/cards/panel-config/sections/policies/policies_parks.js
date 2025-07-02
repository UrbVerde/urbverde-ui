import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariParks from '@/assets/images/cards/policies/mari-parks.svg';
import mariTarget from '@/assets/images/cards/policies/mari-target-1.svg';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Parques e Praças
  createSection({
    id: 'metas',
    ref: 'metasSection',
    title: `Eixo Parques e Praças em ${nm_mun}`,
    subtitle: 'Parques e praças são os principais espaços públicos de uma cidade, sendo essenciais para melhorar o ambiente e o bem-estar da população',
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
            paragraphText: 'Promover ações e iniciativas para aumentar a disponibilidade, acessibilidade, distribuição e melhorias das praças e parques na cidade, contribuindo para a redução da desigualdade local',
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
              'Garantir que praças e parques atendam todo o território da cidade',
              'Aumentar as áreas verdes e a permeabilidade nos espaços públicos',
              'Preparar os parques e as praças para servirem como refúgios durante eventos climáticos extremos'
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
      variant: '3-2',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 - Aumentar disponibilidade de praças e parques por habitante, para melhorar a qualidade ambiental da cidade',
            ods: '3, 10, 11',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Áreas de praças e parques disponíveis por habitante',
            overrideNumberValue: '12 m',
            numberType: 'composed',
            numberSubtitle: 'Recomendação da ONU: mais de 15 m²/hab',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 - Garantir acesso a praças e parques para todos habitantes em até 15 minutos de caminhada',
            ods: '3, 11, 13',
            badgeStatus: 'em-andamento'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Distância média até chegar em praças e parques',
            overrideNumberValue: '291 m',
            numberType: 'composed',
            numberSubtitle: 'Recomendação da ONU: até 300 m',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Ampliar a distribuição de praças e parques em todas regiões da cidade',
            ods: '3, 11, 13',
            badgeStatus: 'em-andamento'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Área total destinada para praças e parques',
            overrideNumberValue: '9082 m',
            numberType: 'composed',
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
            imageSrc: mariParks,
            midiaPosition: 'right',
            type: 'list',
            title: 'Descubra os benefícios dos parques e das praças',
            listItems: [
              'Deixam as cidades mais preparadas para as mudanças climáticas e melhoram a saúde da população ao redor',
              'Ajudam a cidade a crescer de forma sustentável, com potencial de gerar créditos de carbono ao município',
              'Melhoram o ar da cidade e são refúgios durante eventos climáticos extremos',
              'Incentivam a participação das pessoas em ações de cultura e meio ambiente'
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
            actionTitle: 'Ação 4 - Garantir o acesso a praças e parques para toda a população',
            ods: '3, 10, 11',
            badgeStatus: 'nao-informado'
          }
        },
        {
          type: 'panel',
          props: {
            variant: '2-2',
            items: [
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'População atendida por praças e parques',
                  overrideNumberValue: '89%',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Idosos e crianças atendidos por parques e praças',
                  overrideNumberValue: '59%',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Pretos, pardos e indígenas atendidos por praças e parques',
                  overrideNumberValue: '49%',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Mulheres chefes de família atendidas por parques e praças',
                  overrideNumberValue: '39%',
                }
              },
            ]
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 5,
            actionTitle: 'Ação 5 - Melhorar a oferta de serviços ecossistêmicos por praças e parques para adaptação climática',
            ods: '3, 11, 13',
            badgeStatus: 'em-andamento'
          }
        },
        {
          type: 'panel',
          props: {
            variant: '1-2',
            items: [
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Área de parques e praças coberta por vegetação',
                  overrideNumberValue: '33%',
                  numberType: 'large',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Área impermeável de parques e praças',
                  overrideNumberValue: '69%',
                  numberType: 'large',
                }
              },
            ]
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 6,
            actionTitle: 'Ação 6 - Ampliar a qualidade de parques e praças',
            ods: '3, 11, 13',
            badgeStatus: 'em-andamento'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Qualidade social e ecológica de parques e praças',
            overrideNumberValue: '0.7',
            numberType: 'large',
            overrideCardSubtitle: 'Considera fatores como saúde, educação, segurança, acesso a recursos e preservação do meio ambiente, tendo o valor ideal igual a 1.0',
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
            title: 'Projetos, iniciativas e políticas públicas de parques e praças',
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Identificar áreas prioritárias na cidade para implementação de Soluções Baseadas na Natureza (SBN)',
              'Criar novas áreas verdes públicas protegidas pelo município (Unidades de Conservação)',
              'Construir praças, parques e espaços públicos permeáveis, que absorvam a água da chuva',
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
            odsNumbers: [3, 10, 11, 13],
          }
        },
      ]
    }
  })
]);
