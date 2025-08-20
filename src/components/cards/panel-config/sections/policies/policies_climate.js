// urbverde-ui/src/components/cards/panel-config/sections/policies/policies_climate.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariTarget from '@/assets/images/cards/policies/mari-target-1.svg';
import mariClimate from '@/assets/images/cards/policies/mari-climate.svg';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Vegetação em <Município>
  createSection({
    id: 'metas',
    ref: 'metasSection',
    title: `Eixo temperatura em ${nm_mun}`,
    subtitle: 'Identificação de áreas urbanas com potencial para reduzir as temperaturas de superfície',
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
            paragraphText: 'Busca melhorar o conforto urbano, reduzir as ilhas de calor, especialmente nas áreas vulneráveis, para promover um ambiente mais saudável e sustentável'
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
            eixo: 'policies_climate',
            barPercentage: [0, 4],
          }
        },
      ]
    }
  }),

  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    gapColumnHeight: '56px',
    panel: {
      variant: '3-1',
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
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariClimate,
            midiaPosition: 'right',
            type: 'list',
            title: 'Descubra os benefícios da redução da temperatura excessiva das cidades',
            listItems: [
              'Diminui as ilhas de calor e melhora o conforto térmico nas cidades',
              'A vegetação absorve calor e libera umidade, melhorando a qualidade do ar e reduzindo doenças respiratórias',
              'Traz mais equilíbrio climático para bairros vulneráveis'
            ],
            showPrimaryButton: true,
            buttonLabel: 'Ver mais dicas',
            buttonLink: 'https://urbverde-educa.tawk.help/category/categorias-e-camadas',
          }
        }
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
            title: 'Projetos, iniciativas e políticas públicas para redução da temperatura excessiva',
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Implantar corredores verdes e aumentar a arborização em regiões críticas',
              'Desenvolver planos locais de clima com metas de emissões e adaptação térmica',
              'Implementar telhados verdes e jardins verticais são soluções para melhorar o microclima',
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
            odsNumbers: [3, 10, 11, 13, 15, 17],
          }
        },
      ]
    }
  })
]);
