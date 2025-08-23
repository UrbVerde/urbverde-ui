// urbverde-ui/src/components/cards/panel-config/sections/policies/policies_hidrology.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariHidro from '@/assets/images/cards/policies/mari-hidrology.svg';
import mariTarget from '@/assets/images/cards/policies/mari-target-2.svg';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Parques e Praças
  createSection({
    id: 'metas',
    ref: 'metasSection',
    title: `Eixo Hidrologia em ${nm_mun}`,
    subtitle: 'A hidrologia é a ciência que trata da água na terra, sua ocorrência, circulação e distribuição, suas propriedades físicas e químicas e sua relação com o meio ambiente, incluindo sua relação com a vida',
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
              'Reduzir danos por inundações por meio do mapeamento preventivo de áreas críticas',
              'Garantir segurança e previsibilidade das ações da Defesa Civil com base em dados confiáveis',
              'Melhorar a qualidade ambiental urbana por meio da proteção hídrica e da ampliação da vegetação',
              'Fortalecer a justiça socioambiental ao priorizar territórios mais vulneráveis',
              'Apoiar políticas públicas voltadas a cidades mais resilientes e sustentáveis'
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
    fixedYear: 2024,
    panel: {
      variant: '4-2',
      gapColumnHeight: '56px',
      items: [
        {
          component: 'CardAction',
          props: {
            number: 1,
            actionTitle: 'Ação 1 - Implantar zonas de risco controlado e restringir novas ocupações em áreas críticas para reduzir a exposição a inundações',
            ods: '6, 10, 11, 13, 15',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/hydrology',
            cardIndex: 2,
            numberType: 'large',
          }
        },
        {
          component: 'CardAction',
          props: {
            number: 2,
            actionTitle: 'Ação 2 – Implantar infraestrutura verde em áreas estratégicas para aumentar a permeabilidade do solo e fortalecer a resiliência urbana contra eventos climáticos',
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
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/hydrology',
                  cardIndex: 4,
                  numberType: 'large',
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/hydrology',
                  cardIndex: 3,
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
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/hydrology',
            cardIndex: 5,
            numberType: 'large',
            overrideCardSubtitle: 'Boca de lobo é um escoadouro nas ruas para as águas',
          }
        },
      ]
    }
  }),

  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    title: 'Ações para Áreas de Preservação Permanente (APPs)',
    subtitle: 'Conforme definição da Lei n. 12.651/2012, Área de Preservação Permanente é uma área protegida, coberta ou não por vegetação nativa, com a função ambiental de preservar os recursos hídricos, a paisagem, a estabilidade geológica e a biodiversidade, facilitar o fluxo gênico de fauna e flora, proteger o solo e assegurar o bem-estar das populações humanas',
    fixedYear: 2024,
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
            title: 'Descubra os benefícios de proteger as APPs',
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
      gapColumnHeight: '56px',
      items: [
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
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/hydrology',
            cardIndex: 0,
            numberType: 'large',
          }
        },
        {
          component: 'CardData',
          props: {
            apiEndpoint: 'http://localhost:8080/v1/cards/pp/hydrology',
            cardIndex: 1,
            numberType: 'large',
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
            title: 'Projetos, iniciativas e políticas públicas de hidrologia',
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Implementar sistemas de drenagem urbana sustentável (SUDS) em áreas de risco',
              'Criar parques lineares ao longo de córregos e rios para aumentar a permeabilidade',
              'Desenvolver projetos de descanalização e renaturalização de rios urbanos',
              'Estabelecer políticas de incentivo para telhados verdes e pavimentos permeáveis',
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
            odsNumbers: [3, 6, 10, 11, 13, 15],
          }
        },
      ]
    }
  })
]);
