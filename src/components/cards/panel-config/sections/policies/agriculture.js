import { createSectionConfig, createSection } from '@/components/cards/panel-config/helpers/helperCreateSection';
import mariAgriculture from '@/assets/images/cards/policies/mari-agriculture.svg';
import mariTarget from '@/assets/images/cards/policies/mari-target-2.svg';

export default createSectionConfig((nm_mun) => [
  // Seção: Eixo Vegetação em <Município>
  createSection({
    id: 'metas',
    ref: 'metasSection',
    title: `Eixo Agricultura Urbana em ${nm_mun}`,
    subtitle: 'Pontos de agricultura urbana são zonas verdes funcionais na cidade que produzem alimentos e promovem um ciclo alimentar mais justo, inclusivo e sustentável',
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
            eixo: 'agriculture',
            barPercentage: [0, 6],
          }
        },
      ]
    }
  }),

  // Seção: Ações e indicadores
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
            actionTitle: 'Ação 1 - Priorizar iniciativas de agricultura urbana em áreas de maior vulnerabilidade alimentar',
            ods: '1, 2, 3, 10, 12, 17',
            badgeStatus: 'nao-informado'
          }
        },
        {
          component: 'CardData',
          props: {
            overrideTitle: 'Vulnerabilidade Alimentar',
            overrideNumberValue: '0.6',
            numberType: 'large',
            overrideCardSubtitle: 'Considera X, Y e Z, seu valor ideal é 1.0.',
          }
        },
        // Ação 2
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
            overrideNumberValue: '291 m²',
            numberType: 'large',
            overrideCardSubtitle: 'Essa área pode ser usada para cultivo de agricultura urbana',
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
            imageSrc: mariAgriculture,
            midiaPosition: 'right',
            type: 'list',
            title: 'Descubra os benefícios da agricultura urbana',
            listItems: [
              'Garantem uma melhor segurança alimentar e nutricional à população',
              'Melhoram a saúde da população do seu entorno, aprimorando a qualidade do ar e dos microclimas',
              'Melhoram o bem-estar da população, ampliando a união comunitária, o suporte emocional e a força das comunidades vulneráveis',
              'Envolvem a sociedade incentivando atividades culturais e de educação alimentar'
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
      items: [
        // Ação 3
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
            overrideNumberValue: '452 m²',
            numberType: 'large',
            overrideCardSubtitle: 'Essa área pode ser usada para cultivo de agricultura urbana vertical'
          }
        },
        // Ação 4
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
            overrideNumberValue: '322 m',
            numberType: 'large'
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
            title: 'Projetos, iniciativas e políticas públicas para aumento de agricultura urbana',
            midiaPosition: 'left',
            type: 'list',
            listItems: [
              'Identificar áreas prioritárias para implementação de hortas comunitárias e agricultura urbana',
              'Criar programas de capacitação em agricultura urbana para comunidades vulneráveis',
              'Estabelecer parcerias com escolas e instituições para projetos de educação alimentar',
              'Desenvolver políticas de incentivo para agricultura urbana em terrenos públicos e privados',
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
            odsNumbers: [1, 2, 3, 6, 10, 11, 12, 13, 15, 17],
          }
        },
      ]
    }
  })
]);
