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
                  imageSrc: mariTarget2,
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
  // Seção: Eixo Emissões e Clima
  // ===============================================

  createSection({
    id: 'climate',
    ref: 'climateSection',
    title: `Eixo Emissões e Clima em ${nm_mun}`,
    subtitle: 'Identificação de áreas urbanas com potencial para reduzir as temperaturas de superfície e promover o sequestro de carbono',
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
                  imageSrc: mariTarget,
                  midiaPosition: 'right',
                  type: 'paragraph-left',
                  paragraphText: 'Busca melhorar o conforto urbano, reduzir os efeitos das ilhas de calor e minimizar as emissões de gases de efeito estufa (GEE), promovendo um ambiente mais saudável e sustentável para a população'
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
                    'Reduzir as ilhas de calor urbanas (ICUs) e aumentar o sequestro de carbono do município',
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
      variant: '3-2',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 - Expandir a vegetação urbana para reduzir as ilhas de calor urbana',
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Potencial da cobertura vegetal da cidade para redução da temperatura de superfície',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Quanto mais próximo de 1.0, mais a cobertura vegetal da cidade contribui para redução da temperatura'
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 - Expandir a vegetação urbana para aumentar o sequestro de carbono do município',
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Sequestro de carbono realizado pela vegetação da cidade no ano',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Sequestro de carbono é a capacidade das árvores e áreas verdes de absorverem toneladas de CO2 da atmosfera, ajudando a combater a crise climática'
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Mapear áreas públicas ociosas para novos projetos de arborização urbana',
            ods: '3, 10, 11, 13, 15, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Área pública residual total com potencial para ampliação da cobertura vegetal',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Essa área pode ser usada para plantio de árvores'
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
  // Seção: Eixo Hidrologia
  // ===============================================

  createSection({
    id: 'hidro',
    ref: 'hidroSection',
    title: `Eixo Hidrologia em ${nm_mun}`,
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
            actionTitle: 'Ação 1 - Aumentar a permeabilização do solo em áreas com baixa drenagem urbana',
            ods: '3, 6, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Porcentagem de solo impermeável (PSI)',
            overrideNumberValue: 'Em breve',
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
            overrideNumberValue: 'Em breve',
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
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Indica quanto das Áreas de Preservação Permanente (APPs), como margens de rios e córregos, estão cobertas por vegetação',
          }
        },
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
            overrideNumberValue: 'Em breve',
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
            overrideNumberValue: 'Em breve',
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
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Mostra quanto dos rios está canalizado em cada sub-bacia da cidade',
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
                  imageSrc: mariTarget2,
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
            actionTitle: 'Ação 2 - Promover a produção primária de alimentos na cidade',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Área total com potencial para agricultura urbana',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Essa área pode ser usada para cultivo de agricultura urbana',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 3,
            actionTitle: 'Ação 3 - Promover a agricultura urbana vertical com base em densidade demográfica, renda e tipo de assentamento',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Área total com potencial para agricultura urbana vertical',
            overrideNumberValue: 'Em breve',
            numberType: 'large',
            overrideCardSubtitle: 'Essa área pode ser usada para cultivo de agricultura urbana vertical'
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 4,
            actionTitle: 'Ação 4 - Reduzir a distância média até pontos de venda de alimentos saudáveis, promovendo o acesso alimentar adequado',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Distância média até alimentos saudáveis por habitante',
            overrideNumberValue: 'Em breve',
            numberType: 'large'
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

]);
