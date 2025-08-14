// urbverde-ui/src/components/cards/panel-config/sections/policies/risks_heat_wave.js
import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariSearch from '@/assets/images/cards/policies/mari-search-2.svg';
import mariEmissions from '@/assets/images/cards/policies/mari-emissions.svg';

export default createSectionConfig((nm_mun) => [
  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: 'CO₂ e seu papel nas cidades',
    showYearPicker: false,
    panel: {
      variant: '1-2',
      items: [
        {
          component: 'CardInfo',
          props: {
            title: 'O que é o CO₂ equivalente?',
            showLeftIcon: true,
            leftIconClass: 'bi bi-clouds',
            type: 'paragraph-left',
            paragraphText: 'CO₂e (dióxido de carbono equivalente) é uma forma de medir e comparar o impacto de diferentes gases de efeito estufa (como CO₂, CH₄, N₂O, entre outros) no aquecimento global. Todos esses gases são convertidos para a mesma unidade, considerando seu potencial de aquecimento ao longo de 100 anos (fator GWP-100)'
          }
        },
        {
          component: 'CardInfo',
          props: {
            title: 'As emissões e o aquecimento global',
            showMidia: true,
            showLeftIcon: true,
            leftIconClass: 'bi bi-thermometer-sun',
            midiaType: 'image',
            imageSrc: mariSearch,
            midiaPosition: 'right',
            type: 'paragraph-left',
            paragraphText: 'A liberação de gases do efeito estufa pelas cidades aumenta a retenção de calor na atmosfera, intensificando o aquecimento global e agravando eventos extremos em todo o mundo.'
          }
        },
      ]
    }
  }),

  createSection({
    id: 'stats',
    ref: 'statsSection',
    showYearPicker: true,
    title: `Emissões de carbono em ${nm_mun}`,
    panel: {
      variant: '2-1',
      gapColumnHeight: '40px',
      items: [
        {
          type: 'panel',
          props: {
            variant: '1-3',
            items: [
              {
                component: 'CardInfo',
                props: {
                  title: 'Sua importância na gestão climática',
                  midiaPosition: 'right',
                  showLeftIcon: true,
                  leftIconClass: 'bi bi-people',
                  type: 'paragraph-left',
                  paragraphText: 'O CO₂e permite comparar emissões de diferentes setores, ajudando a definir prioridades, acompanhar avanços e cumprir metas climáticas em escalas local a global'
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Emissões totais da cidade',
                  overrideNumberValue: 'Em breve',
                  numberType: 'large',
                  overrideCardSubtitle: 'Quantidade que a cidade emite de CO₂e',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Emissões por habitante',
                  overrideNumberValue: 'Em breve',
                  numberType: 'large',
                  overrideCardSubtitle: 'Emissão de CO₂e em relação ao número de habitantes',
                }
              }
            ]
          }
        },
        {
          type: 'panel',
          props: {
            variant: '1-5',
            items: [
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Emissões originadas da agropecuária',
                  overrideNumberValue: 'Em breve',
                  numberType: 'small',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Emissões originadas da energia',
                  overrideNumberValue: 'Em breve',
                  numberType: 'small',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Emissões originadas da mudanças de uso da terra e floresta',
                  overrideNumberValue: 'Em breve',
                  numberType: 'small',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Emissões originadas de processos industriais',
                  overrideNumberValue: 'Em breve',
                  numberType: 'small',
                }
              },
              {
                component: 'CardData',
                props: {
                  overrideTitle: 'Emissões originadas de resíduos',
                  overrideNumberValue: 'Em breve',
                  numberType: 'small',
                }
              },
            ]
          }
        }
      ]
    }
  }),

  createSection({
    id: 'stats',
    ref: 'statsSection',
    title: 'Mitigação das emissões urbanas',
    showYearPicker: true,
    panel: {
      variant: '3-1',
      gapColumnHeight: '40px',
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'image',
            imageSrc: mariEmissions,
            midiaPosition: 'right',
            type: 'list',
            title: 'Mitigação no contexto climático',
            listItems: [
              'Mitigação é o conjunto de ações para reduzir as emissões de gases de efeito estufa e aumentar sua remoção da atmosfera',
              'Tem como objetivo de conter os impactos das mudanças climáticas',
              'Algumas formas de mitigar incluem o uso de energia limpa, arborização urbana, transporte sustentável e gestão adequada de resíduos',
            ],
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
                  showMidia: true,
                  showLeftIcon: true,
                  leftIconClass: 'bi bi-tree',
                  type: 'paragraph-left',
                  title: 'Papel da vegetação na mitigação',
                  paragraphText: 'As árvores absorvem CO₂ e liberam oxigênio pela fotossíntese, ajudando a sequestrar gases que aquecem o planeta'
                }
              },
              {
                component: 'CardData',
                props: {
                  apiEndpoint: 'http://localhost:8080/v1/cards/pp/vegetation',
                  cardIndex: 2,
                  numberType: 'composed',
                  showButtonPrimary: true,
                  changeToCategory: 'policies_vegetation',
                  changeToLayerId: 'pcv',
                }
              }
            ]
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
                  showMidia: true,
                  showLeftIcon: true,
                  leftIconClass: 'bi bi-thermometer-high',
                  type: 'paragraph-left',
                  title: 'Como a temperatura da cidade é afetada?',
                  paragraphText: 'Quanto maior a liberação de CO₂ na atmosfera, maior o desequilíbrio no efeito estufa contribuindo para o aumento da temperatura do clima urbano'
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
                  showButtonPrimary: true,
                  changeToCategory: 'policies_climate',
                  changeToLayerId: 'vegetation_temp_reduction',
                }
              }
            ]
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
            odsNumbers: [3, 10, 11, 13, 15, 17],
          }
        },
      ]
    }
  })
]);
