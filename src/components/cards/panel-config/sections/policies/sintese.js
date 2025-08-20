// urbverde-ui/src/components/cards/panel-config/sections/policies/sintese.js
// urbverde-ui/src/components/cards/panel-config/sections/national/clima.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariTarget from '@/assets/images/cards/policies/mari-target-1.svg';
import mariTarget2 from '@/assets/images/cards/policies/mari-target-2.svg';

export default createSectionConfig((nm_mun) => [
  // ===============================================
  // Seção: Eixo Parques e Praças
  // ===============================================
  createSection({
    id: 'parks',
    ref: 'parksSection',
    title: `Eixo Parques e praças em ${nm_mun}`,
    subtitle: 'Parques e praças são os principais espaços públicos de uma cidade, sendo essenciais para melhorar o ambiente e o bem-estar da população',
    showYearPicker: false,
    panel: {
      variant: '2-1',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardStamps',
          props: {
            eixo: 'policies_parks',
            barPercentage: [0, 6],
          }
        },
        {
          type: 'panel',
          props: {
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
        },
      ]
    }
  }),

  createSection({
    id: 'parks',
    ref: 'parksSection',
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
            targetCategory: 'policies_parks',
            targetLayerId: 'square_area_per_capita',
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
            targetCategory: 'policies_parks',
            targetLayerId: 'avg_distance_to_squares',
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
            targetCategory: 'policies_parks',
            targetLayerId: 'square_served_area',
          }
        },

      ]
    }
  }),

  createSection({
    id: 'parks',
    ref: 'parksSection',
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
    id: 'parks',
    ref: 'parksSection',
    showYearPicker: false,
    panel: {
      variant: '2-2',
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
                  showSeeOnMap: true,
                  numberType: 'large',
                  targetCategory: 'policies_parks',
                  targetLayerId: 'square_pcv',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/square',
                  cardIndex: 10,
                  numberType: 'large',
                  showSeeOnMap: true,
                  targetCategory: 'policies_parks',
                  targetLayerId: 'square_psi',
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

  createSection({
    id: 'parks',
    ref: 'parksSection',
    showYearPicker: false,
    boxPadding: '40px 0px 80px 0px',
    boxGap: '0px',
    panel: {
      variant: '1-1',
      gapColumnHeight: '0px',
      items: [
        {
          component: 'CardPrimaryButton',
          props: {
            changeToCategory: 'policies_parks',
            changeToLayerId: 'avg_distance_to_squares',
            buttonLabel: 'Navegar pelo eixo',
            buttonIcon: 'bi-arrow-right',
            buttonIconPosition: 'right',
          }
        }
      ]
    }
  }),

  // ===============================================
  // Seção: Eixo Emissões e Clima
  // ===============================================

  createSection({
    id: 'climate',
    ref: 'climateSection',
    title: `Eixo temperatura em ${nm_mun}`,
    subtitle: 'Identificação de áreas urbanas com potencial para reduzir as temperaturas de superfície',
    showYearPicker: false,
    panel: {
      variant: '2-1',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardStamps',
          props: {
            eixo: 'policies_climate',
            barPercentage: [0, 4],
          }
        },
        {
          type: 'panel',
          props: {
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
                  imageSrc: mariTarget2,
                  midiaPosition: 'right',
                  type: 'paragraph-left',
                  paragraphText: 'Busca melhorar o conforto urbano, reduzir as ilhas de calor, especialmente nas áreas vulneráveis, para promover um ambiente mais saudável e sustentável',
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
                    'Identificar áreas com altas emissões e calor excessivo para orientar a criação de novas zonas verdes',
                    'Transformar zonas vulneráveis em áreas mais frescas e sustentáveis',
                    'Reduzir as ilhas de calor urbanas (ICUs) para melhorar o conforto térmico',
                  ]
                }
              },
            ]
          }
        },
      ]
    }
  }),

  createSection({
    id: 'climate',
    ref: 'climateSection',
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
                  number: 1,
                  actionTitle: 'Ação 1 - Ampliar a arborização urbana em vias e espaços públicos para reduzir a temperatura da cidade e melhorar o conforto térmico',
                  ods: '3, 10, 11, 13, 15, 17',
                  badgeStatus: 'nao-informado'
                }
              },
              {
                component: 'CardAction',
                props: {
                  number: 2,
                  actionTitle: 'Ação 2 - Promover um programa de certificação ambiental de construção sustentáveis',
                  ods: '3, 10, 11, 13, 15, 17',
                  badgeStatus: 'nao-informado'
                }
              },
            ]
          }
        },
        {
          type: 'panel',
          props: {
            variant: '1-2',
            items: [
              {
                component: 'CardAction',
                props: {
                  number: 3,
                  actionTitle: 'Ação 3 - Implementar telhado verdes em prédios públicos',
                  ods: '3, 10, 11, 13, 15, 17',
                  badgeStatus: 'nao-informado'
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/weather/temperature',
                  cardIndex: 1,
                  numberType: 'large',
                  showModalButton: true,
                  modalTitle: 'Temperatura média da superfície',
                  modalBodyText: 'Representa o valor médio da temperatura de superfície terrestre registrado anualmente em todo o território urbano.',
                }
              },
            ]
          }
        },
      ]
    }
  }),

  createSection({
    id: 'climate',
    ref: 'climateSection',
    showYearPicker: false,
    boxPadding: '40px 0px 80px 0px',
    boxGap: '0px',
    panel: {
      variant: '1-1',
      gapColumnHeight: '0px',
      items: [
        {
          component: 'CardPrimaryButton',
          props: {
            changeToCategory: 'policies_climate',
            changeToLayerId: 'vegetation_temp_reduction',
            buttonLabel: 'Navegar pelo eixo',
            buttonIcon: 'bi-arrow-right',
            buttonIconPosition: 'right',
          }
        }
      ]
    }
  }),

  // ===============================================
  // Seção: Eixo Vegetação
  // ===============================================
  createSection({
    id: 'vegetation',
    ref: 'vegetationSection',
    title: `Eixo Vegetação em ${nm_mun}`,
    subtitle: 'Vegetação corresponde às áreas verdes das cidades, como árvores, gramados e arbustos. Elas ajudam a melhorar o clima urbano, promovem justiça socioambiental e favorecem a infiltração da água no solo',
    showYearPicker: false,
    panel: {
      variant: '2-1',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardStamps',
          props: {
            eixo: 'policies_vegetation',
            barPercentage: [0, 4],
          }
        },
        {
          type: 'panel',
          props: {
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
              },
            ]
          }
        },
      ]
    }
  }),

  createSection({
    id: 'vegetation',
    ref: 'vegetationSection',
    showYearPicker: false,
    panel: {
      variant: '5-2',
      gapColumnHeight: '56px',
      items: [
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
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/vegetation',
            cardIndex: 0,
            numberType: 'composed',
            showSeeOnMap: true,
            seeOnMapLayerID: 'icv',
          }
        },
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
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/vegetation',
            cardIndex: 1,
            numberType: 'composed',
            showSeeOnMap: true,
            seeOnMapLayerID: 'psi',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Aumentar a vegetação urbana a partir de dados de monitoramento anual',
            ods: '3, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/vegetation',
            cardIndex: 2,
            numberType: 'composed',
            showSeeOnMap: true,
            seeOnMapLayerID: 'pcv',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 4,
            actionTitle: 'Ação 4 - Aumentar o índice de área verde disponível para a população',
            ods: '3, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/vegetation',
            cardIndex: 3,
            numberType: 'composed',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 5,
            actionTitle: 'Ação 5 - Requalificar lotes vagos com potencial para arborização e infraestrutura verde',
            ods: '3, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de lotes subutilizados',
            overrideNumberValue: 'Em breve',
            numberType: 'composed',
            numberSubtitle: 'Recomendação: utilizar todos os lotes identificados até 2030',
            overrideCardSubtitle: 'Terrenos vazios ou pouco usados, sem função social ou ambiental'
          }
        },
      ]
    }
  }),

  createSection({
    id: 'vegetation',
    ref: 'vegetationSection',
    showYearPicker: false,
    boxPadding: '40px 0px 80px 0px',
    boxGap: '0px',
    panel: {
      variant: '1-1',
      gapColumnHeight: '0px',
      items: [
        {
          component: 'CardPrimaryButton',
          props: {
            changeToCategory: 'policies_vegetation',
            changeToLayerId: 'pcv',
            buttonLabel: 'Navegar pelo eixo',
            buttonIcon: 'bi-arrow-right',
            buttonIconPosition: 'right',
          }
        }
      ]
    }
  }),

  // ===============================================
  // Seção: Eixo Agricultura
  // ===============================================

  createSection({
    id: 'agriculture',
    ref: 'agricultureSection',
    title: `Eixo Agricultura Urbana em ${nm_mun}`,
    subtitle: 'Pontos de agricultura urbana são zonas verdes funcionais na cidade que produzem alimentos e promovem um ciclo alimentar mais justo, inclusivo e sustentável',
    showYearPicker: false,
    panel: {
      variant: '2-1',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardStamps',
          props: {
            eixo: 'agriculture',
            barPercentage: [0, 6],
          }
        },
        {
          type: 'panel',
          props: {
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
                  paragraphText: 'Busca melhorar a qualidade de vida da população através da agricultura urbana, assim como garantir a comida na mesa para todos de forma sustentável'
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
                    'Garantia da alimentação adequada e saudável à população da cidade',
                    'Aumentar as áreas verdes da cidade, reduzindo a temperatura local e permitindo um maior sequestro de carbono e maior permeabilização do solo',
                    'Promover agricultura urbana e acesso justo à alimentação de qualidade para todos',
                  ]
                }
              },
            ]
          }
        },
      ]
    }
  }),

  createSection({
    id: 'agriculture',
    ref: 'agricultureSection',
    showYearPicker: false,
    panel: {
      variant: '4-2',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 - Priorizar iniciativas de agricultura urbana em áreas de maior vulnerabilidade alimentar',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Vulnerabilidade Alimentar',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Considera X, Y e Z, seu valor ideal é 1.0.',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 - Promover a agricultura urbana vertical, em topo de edifícios e em quintais/espaços pequenos em áreas mais necessitadas',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Área total com potencial para iniciativas de agricultura urbana',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Essa área pode ser usada para cultivo de agricultura urbana',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Reduzir a distância média até pontos de venda de alimentos saudáveis, promovendo o acesso alimentar adequado',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Deserto Alimentar',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Distância média até alimentos saudáveis para cada 1000 habitantes'
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 4,
            actionTitle: 'Ação 4 - Realizar oficinas e iniciativas de Educação Alimentar, Nutricional e Culinária em áreas com altas densidades de estabelecimentos de venda de alimentos ultraprocessados',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Pântano Alimentar',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Distância média até alimentos ultraprocessados para cada 1000 habitantes'
          }
        },
      ]
    }
  }),

  createSection({
    id: 'agriculture',
    ref: 'agricultureSection',
    showYearPicker: false,
    boxPadding: '40px 0px 80px 0px',
    boxGap: '0px',
    panel: {
      variant: '1-1',
      gapColumnHeight: '0px',
      items: [
        {
          component: 'CardPrimaryButton',
          props: {
            changeToCategory: 'agriculture',
            changeToLayerId: 'urban_agriculture_distance',
            buttonLabel: 'Navegar pelo eixo',
            buttonIcon: 'bi-arrow-right',
            buttonIconPosition: 'right',
          }
        }
      ]
    }
  }),

  // ===============================================
  // Seção: Eixo Hidrologia
  // ===============================================

  createSection({
    id: 'hidro',
    ref: 'hidroSection',
    title: 'Eixo Hidrologia em Diadema',
    subtitle: 'As inundações e alagamentos urbanos são agravados pela impermeabilização e falta de planejamento. O eixo busca soluções para reduzir riscos e promover segurança hídrica da cidade',
    showYearPicker: false,
    panel: {
      variant: '2-1',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardStamps',
          props: {
            eixo: 'hidro',
            barPercentage: [0, 6],
          }
        },
        {
          type: 'panel',
          props: {
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
                  imageSrc: mariTarget2,
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
              },
            ]
          }
        },
      ]
    }
  }),

  createSection({
    id: 'hidro',
    ref: 'hidroSection',
    showYearPicker: false,
    panel: {
      variant: '6-2',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 – Implantar infraestrutura verde em áreas estratégicas para aumentar a permeabilidade do solo e fortalecer a resiliência urbana contra eventos climáticos',
            ods: '3, 6, 11, 13, 15',
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/vegetation',
                  cardIndex: 1,
                  numberType: 'large',
                }
              },
              {
                component: 'CardInfo',
                props: {
                  showMidia: false,
                  title: 'Infraestruturas verdes para sua cidade',
                  showRightIcon: true,
                  rightIconClass: 'bi bi-cone-striped',
                  type: 'paragraph-left',
                  paragraphText: 'Jardins de chuva, valas de infiltração, biovaletas, telhados verdes e arborização urbana são exemplos de infraestruturas verdes'
                }
              }
            ]
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 - Implantar zonas de risco controlado e restringir novas ocupações em áreas críticas para reduzir a exposição a inundações',
            ods: '6, 10, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Percentual da área urbana com risco de inundações',
            overrideNumberValue: '37%',
            numberType: 'large',
          }
        },
        {

          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 – Implantar sistemas de alerta precoce para reduzir os riscos de inundação por meio de sirenes, mensagens SMS, placas de sinalização, aplicativos de monitoramento e rádios comunitárias',
            ods: '3, 6, 11, 13, 15',
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
                  overrideTitle: 'Percentual de pessoas morando em áreas críticas de inundação',
                  overrideNumberValue: '36%',
                  numberType: 'large',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Estimativa da quantidade de domicílios em áreas críticas de inundação',
                  overrideNumberValue: '68.396 domicílios',
                  numberType: 'small',
                }
              },
            ]
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 4,
            actionTitle: 'Ação 4 - Melhorar continuamente a rede de drenagem urbana e a captação das águas pluviais para reduzir a ocorrência e a intensidade de alagamentos',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Estimativa do percentual de bocas de lobo em áreas críticas de inundação',
            overrideNumberValue: '71%',
            numberType: 'large',
            overrideCardSubtitle: 'Boca de lobo é um escoadouro nas ruas para as águas',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 5,
            actionTitle: 'Ação 5 - Implantar programas de conservação da vegetação nativa em APPs por meio de pagamento por serviços ambientais (PSA)',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 6,
            actionTitle: 'Ação 6 - Criar parques lineares em Áreas de Preservação Permanente (APPs), que funcionem como zonas de inundação controlada. ',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 7,
            actionTitle: 'Ação 7 - Recuperar a dinâmica natural dos rios urbanos, restaurando suas margens e leitos para ampliar a capacidade de infiltração, reduzir riscos de inundação e promover biodiversidade',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 8,
            actionTitle: 'Ação 8 - Criar corredores ecológicos conectando fragmentos florestais localizados em APPs para reduzir riscos de inundação e promover biodiversidade',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Cobertura vegetal das Área de Preservação Permanente (APPs)',
            overrideNumberValue: '18%',
            numberType: 'large',
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Índice de permeabilidade do solo das Área de Preservação Permanente (APPs)',
            overrideNumberValue: '52%',
            numberType: 'large',
          }
        },
      ]
    }
  }),

  createSection({
    id: 'hidro',
    ref: 'hidroSection',
    showYearPicker: false,
    boxPadding: '40px 0px 80px 0px',
    boxGap: '0px',
    panel: {
      variant: '1-1',
      gapColumnHeight: '0px',
      items: [
        {
          component: 'CardPrimaryButton',
          props: {
            changeToCategory: 'policies_hidro',
            changeToLayerId: 'flood_diadema_classes',
            buttonLabel: 'Navegar pelo eixo',
            buttonIcon: 'bi-arrow-right',
            buttonIconPosition: 'right',
          }
        }
      ]
    }
  }),

]);
