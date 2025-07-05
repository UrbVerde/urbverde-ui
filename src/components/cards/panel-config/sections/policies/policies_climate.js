import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariTarget from '@/assets/images/cards/policies/mari-target-1.svg';
import mariClimate from '@/assets/images/cards/policies/mari-climate.svg';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Vegetação em <Município>
  createSection({
    id: 'metas',
    ref: 'metasSection',
    title: `Eixo Emissões e Clima em ${nm_mun}`,
    subtitle: 'Identificação de áreas urbanas com potencial para reduzir as temperaturas de superfície e promover o sequestro de carbono',
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
    showYearPicker: false,
    panel: {
      variant: '2-2',
      items: [
        // Ação 1
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
            overrideNumberValue: '0.7',
            numberType: 'large',
            overrideCardSubtitle: 'Quanto mais próximo de 1.0, mais a cobertura vegetal da cidade contribui para redução da temperatura'
          }
        },
        // Ação 2
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
            overrideNumberValue: '90 tCO2e',
            numberType: 'large',
            overrideCardSubtitle: 'Sequestro de carbono é a capacidade das árvores e áreas verdes de absorverem toneladas de CO2 da atmosfera, ajudando a combater a crise climática'
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
            imageSrc: mariClimate,
            midiaPosition: 'right',
            type: 'list',
            title: 'Descubra os benefícios da redução das emissões de GEE e da temperatura excessiva',
            listItems: [
              'Diminui as ilhas de calor e melhora o conforto térmico nas cidades',
              'Melhora a qualidade do ar e reduz doenças respiratórias',
              'Ajuda a capturar gases do efeito estufa com mais justiça ambiental',
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

  // Ações 3 e 4
  createSection({
    id: 'indicadores',
    ref: 'indicadoresSection',
    showYearPicker: false,
    panel: {
      variant: '1-2',
      items: [
        // Ação 3
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
            overrideNumberValue: '452 m²',
            numberType: 'large',
            overrideCardSubtitle: 'Essa área pode ser usada para plantio de árvores'
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
      items: [
        {
          component: 'CardInfo',
          props: {
            showMidia: true,
            midiaType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=406y7gDN-ZE',
            title: 'Projetos, iniciativas e políticas públicas para redução das emissões de GEE e da temperatura excessiva',
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Implantar corredores verdes e aumentar a arborização em regiões críticas',
              'Criar zonas de baixa emissão com mobilidade ativa e menos carros',
              'Desenvolver planos locais de clima com metas de emissões e adaptação térmica',
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
