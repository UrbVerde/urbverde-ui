import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import placeholderImg from '@/assets/images/mapa.png';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Parques e Praças
  createSection({
    id: 'eixo',
    ref: 'eixoSection',
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
            imageSrc: placeholderImg,
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

  // Seção: Ações e Indicadores
  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    title: `Ações e indicadores em ${nm_mun}`,
    showYearPicker: false,
    panel: {
      variant: '2-2',
      items: [
        {
          type: 'panel',
          props: {
            variant: '1-1',
            items: [
              {
                component: 'CardAction',
                props: {
                  number: 1,
                  actionTitle: 'Ação 1 - Aumentar disponibilidade de praças e parques por habitante, para melhorar a qualidade ambiental da cidade',
                  ods: '3, 10, 11',
                  badgeStatus: 'nao-informado'
                }
              }
            ]
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
          type: 'panel',
          props: {
            variant: '1-1',
            items: [
              {
                component: 'CardAction',
                props: {
                  number: 2,
                  actionTitle: 'Garantir acesso a praças e parques para todos habitantes em até 15 minutos de caminhada',
                  ods: '3, 11, 13',
                  badgeStatus: 'em-andamento'
                }
              }
            ]
          }
        },
        {
          component: 'CardData',
          props: {
            overrideNumberValue: '291',
            numberUnit: 'm',
            overrideTitle: 'Distância média até chegar em praças e parques',
            overrideCardSubtitle: 'Recomendação da ONU: até 300 m',
          }
        },
        {
          type: 'panel',
          props: {
            variant: '1-1',
            items: [
              {
                component: 'CardAction',
                props: {
                  number: 3,
                  actionTitle: 'Ampliar a distribuição de praças e parques em todas regiões da cidade',
                  ods: '3, 11, 13',
                  badgeStatus: 'em-andamento'
                }
              }
            ]
          }
        },
        {
          component: 'CardData',
          props: {
            overrideNumberValue: '9082',
            numberUnit: 'm',
            overrideTitle: 'Área total destinada para praças e parques',
            overrideCardSubtitle: 'Valor equivalente a 32 campos de futebol',
          }
        },
      ]
    }
  }),

  // Seção: Benefícios dos parques e praças
  createSection({
    id: 'beneficios',
    ref: 'beneficiosSection',
    title: 'Descubra os benefícios dos parques e das praças',
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: placeholderImg,
            midiaPosition: 'right',
            type: 'list',
            listItems: [
              'Deixam as cidades mais preparadas para as mudanças climáticas e melhoram a saúde da população ao redor',
              'Ajudam a cidade a crescer de forma sustentável, com potencial de gerar créditos de carbono ao município',
              'Melhoram a vida de crianças e idosos durante eventos climáticos extremos',
              'Incentivam a participação das pessoas em ações de cultura e meio ambiente'
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais dicas',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas/temperatura',
          }
        }
      ]
    }
  }),

  // Seção: Ações e indicadores (continuação)
  createSection({
    id: 'indicadores2',
    ref: 'indicadoresSection2',
    title: '',
    panel: {
      variant: '1-2',
      items: [
        // Primeira coluna: CardAction
        {
          component: 'CardAction',
          props: {
            number: 4,
            actionTitle: 'Garantir o acesso a praças e parques para toda a população',
            ods: '3, 10, 17',
            badgeStatus: 'em-andamento'
          }
        },
        // Segunda coluna: painel 2-2 com os quatro CardData
        {
          type: 'panel',
          props: {
            variant: '2-2',
            items: [
              {
                component: 'CardData',
                props: {
                  overrideNumberValue: '89%',
                  overrideTitle: 'População atendida por praças e parques',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideNumberValue: '59%',
                  overrideTitle: 'Idosos e crianças atendidos por praças e parques',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideNumberValue: '49%',
                  overrideTitle: 'Pretos, pardos e indígenas atendidos por praças e parques',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideNumberValue: '39%',
                  overrideTitle: 'Mulheres chefes de família atendidas por praças e praças',
                }
              }
            ]
          }
        }
      ]
    }
  }),

  // Seção: Orientações para o planejamento climático
  createSection({
    id: 'orientacoes',
    ref: 'orientacoesSection',
    title: 'Orientações para o planejamento climático da cidade',
    panel: {
      variant: '1-2',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: placeholderImg,
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Identificar áreas prioritárias na cidade para implementação de Soluções Baseadas na Natureza (SBN)',
              'Criar novas áreas verdes públicas protegidas pelo município (Unidades de Conservação)',
              'Consultar praças, parques e espaços públicos permeáveis, que atenuam a água da chuva'
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais dicas',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas/temperatura',
          }
        },
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: placeholderImg,
            midiaPosition: 'right',
            type: 'list',
            listItems: [
              'Projetos, iniciativas e políticas públicas promovem justiça, sustentabilidade e equilíbrio.'
            ]
          }
        }
      ]
    }
  }),

  // Seção: ODS do eixo
  createSection({
    id: 'ods',
    ref: 'odsSection',
    title: 'Objetivos de Desenvolvimento Sustentável (ODS) do eixo',
    panel: {
      variant: '1-2',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: placeholderImg,
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'ODS 3: Saúde e bem-estar',
              'ODS 10: Redução das desigualdades',
              'ODS 11: Cidades e comunidades sustentáveis',
              'ODS 13: Ação contra a mudança global do clima'
            ]
          }
        },
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: placeholderImg,
            midiaPosition: 'right',
            type: 'list',
            listItems: [
              'Garantir saúde e qualidade de vida para todas as pessoas',
              'Eliminar as desigualdades entre etnias e povos',
              'Tornar cidades mais seguras, inclusivas e sustentáveis',
              'Ação contra a mudança global do clima'
            ]
          }
        }
      ]
    }
  })
]);
