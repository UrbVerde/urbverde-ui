// urbverde-ui/src/components/cards/panel-config/sections/policies/policies_parks.js
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
    fixedYear: 2024,
    panel: {
      variant: '1-1',
      items: [
        {
          component: 'CardStamps',
          props: {
            eixo: 'policies_parks',
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
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 - Aumentar disponibilidade de praças e parques por habitante, para melhorar a qualidade ambiental da cidade',
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
            cardIndex: 0,
            numberType: 'composed',
            showSeeOnMap: true,
            seeOnMapLayerID: 'square_area_per_capita',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 - Garantir acesso a praças e parques para todos habitantes em até 15 minutos de caminhada',
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
            cardIndex: 1,
            numberType: 'composed',
            showSeeOnMap: true,
            seeOnMapLayerID: 'avg_distance_to_squares',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Ampliar a distribuição de praças e parques em todas regiões da cidade',
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
            cardIndex: 2,
            numberType: 'composed',
            showSeeOnMap: true,
            seeOnMapLayerID: 'square_served_area',
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
      variant: '2-1',
      items: [
        {
          type: 'panel',
          props: {
            variant: '1-2',
            items: [

              {
                component: 'CardAction',
                props: {
                  number: 4,
                  actionTitle: 'Ação 4 - Garantir o acesso a praças e parques para toda a população',
                  ods: '3, 10, 11, 13, 15, 17',
                  badgeStatus: 'nao-informado'
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
                        apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                        cardIndex: 4,
                      }
                    },
                    {
                      component: 'CardData',
                      props: {
                        apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                        cardIndex: 7,
                      }
                    },
                  ]
                }
              },
            ]
          },
        },
        {
          type: 'panel',
          props: {
            variant: '1-3',
            items: [
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                  cardIndex: 6,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                  cardIndex: 5,
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                  cardIndex: 8,
                }
              },
            ]
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
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 5,
            actionTitle: 'Ação 5 - Melhorar a oferta de serviços ecossistêmicos por praças e parques para adaptação climática',
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                  cardIndex: 9,
                  numberType: 'large',
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'square_pcv',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                  cardIndex: 10,
                  numberType: 'large',
                  showSeeOnMap: true,
                  seeOnMapLayerID: 'square_psi',
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
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Indice de qualificação climática/socioambiental',
            overrideNumberValue: 'Em breve',
            overrideCardSubtitle: 'Considera o papel ecológico, social, de lazer e estético das praças e parques para as cidades',
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
            odsNumbers: [3, 10, 11, 13, 15, 17],
          }
        },
      ]
    }
  })
]);
