<!-- urbverde-ui/src/components/modal/modalLayerInfo.vue -->
<template>
  <teleport to="body">
    <modalBootstrap
      ref="refModal"
      modalId="modalLayerInfo"
      :title="layerTitle"
      bodyText=""
      showSecondaryButton="true"
      primaryButtonText="Ok"
      secondaryButtonText="Ler mais"
      :primaryButtonClosesModal="true"
      :secondaryButtonClosesModal="false"
      @closeSecondary="openLayerInfoPage"
      @closePrimary="closeModal"
      class="layer-info-modal"
      size="lg"
    >
      <template #body>
        <div class="layer-info-content body-normal-regular" v-html="layerDescription">

        </div>
      </template>
    </modalBootstrap>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import modalBootstrap from './modalBootstrap.vue';
import { useLocationStore } from '@/stores/locationStore';

const refModal = ref(null);
const locationStore = useLocationStore();

const currentLayer = computed(() => locationStore.currentLayerName || '');

// Título do modal baseado na camada atual
const layerTitle = computed(() => `Informações sobre: ${currentLayer.value}`);

// Descrição da camada para o modal
const layerDescription = computed(() => {

  // Objeto com textos específicos para cada camada
  const layerDescriptions = {
    // Clima
    'Temperatura de superfície': '<p>A <strong>Temperatura de Superfície Terrestre</strong> é a temperatura estimada da superfície do solo, medida por imagens de satélite. Ela ajuda a monitorar o ambiente e a planejar áreas urbanas, permitindo a análise de ilhas de calor e padrões térmicos.<p><strong>Resolução:</strong> cada quadrado representa uma área de 30 x 30 metros.</p><p><strong>Metodologia:</strong> A TST é calculada a partir de imagens quinzenais do satélite <em>Landsat-8</em>, formando conjuntos de imagens anuais. O processo inclui a conversão dos valores digitais das imagens em radiância, aplicação da equação de Planck para obter temperaturas em Kelvin (K), que são convertidas para graus Celsius (°C). Uma correção atmosférica é aplicada usando um modelo de regressão linear baseado na relação entre temperatura de brilho e emissividade, conforme descrito por Ermida (2020).</p><p><strong>Cuidados ao analisar os dados:</strong> A TST pode ser influenciada por diferentes materiais de superfície, como asfalto, concreto e vegetação. A precisão dos dados está sujeita a fatores como cobertura de nuvens e variações atmosféricas. As temperaturas de superfície são representativas e úteis para mapear ilhas de calor urbanas, mas seus valores absolutos podem diferir de medições pontuais de temperatura do ar ou de superfícies específicas. Por isso, são analisadas as temperaturas relativas em relação à média urbana do município, destacando áreas com temperatura acima (ilhas de calor) ou abaixo da média (ilhas de frescor) e a intensidade desses fenômenos.</p><p><strong>Fonte:</strong> ERMIDA, S. L. et al. "Google Earth Engine open-source code for Land Surface Temperature estimation from the Landsat series". Remote Sensing, v. 12, n. 9, p. 1471, 2020. Disponível: <a href="https://doi.org/10.3390/rs12091471">aqui</a>.',
    'Temperatura máxima de superfície':'<p>A <strong>Temperatura Máxima de Superfície</strong> representa o maior valor registrado anualmente para cada setor censitário urbano, ao longo do período de 2016 a 2021. Esse dado é essencial para identificar as regiões mais afetadas por ondas de calor e compreender como diferentes áreas urbanas respondem às variações térmicas.</p> <p><strong>Resolução:</strong> Não se aplica.</p> <p><strong>Metodologia:</strong> A temperatura máxima é extraída a partir das imagens quinzenais do satélite <em>Landsat-8</em>, processadas em mosaicos anuais. O cálculo envolve a conversão dos valores digitais das imagens em temperatura, utilizando a equação de Planck. Para garantir precisão, aplica-se um modelo de correção atmosférica baseado na relação entre temperatura de brilho e emissividade.</p> <p><strong>Cuidados ao analisar os dados:</strong> A Temperatura Máxima de Superfície pode ser influenciada por diferentes coberturas do solo, como concreto, asfalto e vegetação. Além disso, fatores como cobertura de nuvens e variações atmosféricas podem afetar a captação dos dados. Como os valores representam a temperatura da superfície e não do ar, são analisadas as temperaturas relativas dentro do município, destacando as áreas mais quentes (ilhas de calor) e as mais frescas.</p> <p><strong>Fonte:</strong> ERMIDA, S. L. et al. "Google Earth Engine open-source code for Land Surface Temperature estimation from the Landsat series". Remote Sensing, v. 12, n. 9, p. 1471, 2020. Disponível: <a href="https://doi.org/10.3390/rs12091471">aqui</a>.</p>',
    'Nível de exposição à ilha de calor':'<p>O <strong>Coeficiente de Ilha de Calor</strong> mede a intensidade da ilha de calor urbana considerando a vulnerabilidade populacional. Esse índice ajuda a identificar áreas críticas onde idosos e crianças estão mais expostos a altas temperaturas.</p> <p><strong>Resolução:</strong> O coeficiente combina dois tipos de dados:</p> <ul> <li><strong>Temperatura de Superfície Terrestre (TST):</strong> resolução de 30 metros, com base nas imagens térmicas do <em>Landsat-8</em>.</li> <li><strong>Dados populacionais:</strong> extraídos do Censo do IBGE, organizados por setores censitários.</li> </ul> <p><strong>Metodologia:</strong> O coeficiente é calculado com base na TST e na população vulnerável do setor censitário, seguindo os passos:</p> <ul> <li>Identificação da <strong>temperatura de superfície terrestre</strong> (TST) a partir das imagens do <em>Landsat-8</em>.</li> <li>Cálculo da <strong>intensidade térmica</strong> do setor, comparando sua temperatura com a média da cidade.</li> <li>Obtenção dos <strong>dados populacionais</strong> do Censo do IBGE, considerando idosos e crianças como grupos vulneráveis.</li> <li>Multiplicação da população vulnerável pelo fator de intensidade térmica, gerando o <strong>Coeficiente de Ilha de Calor</strong>.</li> </ul> <p><strong>Cuidados ao analisar os dados:</strong></p> <ul> <li>A estimativa da população vulnerável depende dos dados censitários do IBGE, que podem sofrer defasagens entre censos.</li> <li>A precisão do coeficiente está ligada à resolução térmica do <em>Landsat-8</em> e à divisão dos setores censitários.</li> </ul> <p><strong>Fontes:</strong> </p> <ul> <li>Instituto Brasileiro de Geografia e Estatística (IBGE). <a href="https://censo2022.ibge.gov.br/panorama/downloads.html?localidade=BR">Censo Demográfico 2022</a>.</li> <li>NASA. <a href="https://landsat.gsfc.nasa.gov/landsat-8/landsat-8-data-users-handbook">Landsat 8 Science Data Users Handbook</a>.</li> <li>ERMIDA, S. L. <a href="https://doi.org/10.3390/rs12091471">Google Earth Engine Open-Source Code for Land Surface Temperature Estimation from the Landsat Series</a>. Remote Sensing, 2020.</li> </ul>',

    // Vegetação
    'Cobertura vegetal (PCV)': '<p>O <strong>Percentual de Cobertura vegetal (PCV)</strong> é uma estimativa da área de uma região que é coberta por vegetação, usando imagens de satélite.</p><p><strong>Resolução:</strong> cada quadrado representa uma área de 30 x 30 metros.</p> <p><strong>Metodologia:</strong> Para calcular o percentual, utilizamos o Modelo Linear de Mistura Espectral. Esse modelo analisa cada <em>pixel</em> das imagens de satélite, considerando frações de vegetação, solo e sombra. Os dados são obtidos a partir de um conjunto de imagens anual sem nuvens do satélite <em>Landsat-8</em>. Em seguida, os resultados são agrupados por setores censitários e municípios.</p> <p><strong>Cuidados ao analisar os dados:</strong> Como o PCV é uma estimativa baseada no Modelo Linear de Mistura Espectral, pode haver confusão entre as frações de sombra e vegetação, especialmente em áreas com alta densidade de árvores. Além disso, pode ocorrer confusão entre diferentes tipos de vegetação, como árvores, arbustos e gramados em algumas regiões.</p> <p><strong>Fonte:</strong> SMALL, C.; MILESI, C. Multi-scale standardized spectral mixture models. Remote Sensing Of Environment, Amsterdã, v. 136, p. 442–54, 19 jan. 2013. Disponível : <a href="https://doi.org/10.1016/j.rse.2013.05.024">aqui</a>.</p>',
    'Desigualdade sociambiental (IDSA)': '<p>O <strong>Indicador de Desigualdade Socioambiental (IDSA)</strong> mede as diferenças entre áreas de uma cidade em relação a condições como infraestrutura, aspectos sociais, densidade populacional e meio ambiente. Quanto mais próximo de 0, menor a desigualdade; quanto mais próximo de 1, maior a desigualdade na região. Esse indicador ajuda a entender quais áreas precisam de mais atenção para melhorar as condições de vida da população.</p> <p><strong>Resolução:</strong> Não se aplica.</p> <p><strong>Metodologia:</strong> O IDSA é composto por quatro subindicadores: Infraestrutura (Isi), Social (ISs), Demográfico (ISd) e Ambiental (ISa). Esses subindicadores são combinados para formar um indicador global que mede as desigualdades demográficas, sociais e ambientais. Valores próximos a 0 indicam menor desigualdade, enquanto valores próximos a 1 revelam maior desigualdade em determinada área.</p> <p><strong>Cuidados ao analisar os dados:</strong> Por se tratar de um dado que depende de informações censitárias, sua atualização está vinculada à realização de futuros Censos. Além disso, é importante considerar que o IDSA é uma medida relativa e deve ser analisada em conjunto com outros indicadores para uma compreensão mais completa das desigualdades socioambientais.</p> <p><strong>Fonte:</strong> Toppa, R. H.; Martines, M. R. Análise ambiental de áreas de interesse para o estabelecimento de unidades de conservação para a proteção dos mananciais do município de Araçoiaba da Serra, Estado de São Paulo. São Paulo, SP: Ed. dos autores, 2021.</p>',
    'Cobertura vegetal por satélite': '<p>A <strong>Cobertura vegetal por satélite</strong> é uma estimativa da área de uma região que é coberta por vegetação, usando imagens de satélite.</p><p><strong>Resolução:</strong> cada quadrado representa uma área de 30 x 30 metros.</p> <p><strong>Metodologia:</strong> Para calcular o percentual, utilizamos o Modelo Linear de Mistura Espectral. Esse modelo analisa cada <em>pixel</em> das imagens de satélite, considerando frações de vegetação, solo e sombra. Os dados são obtidos a partir de um conjunto de imagens anual sem nuvens do satélite <em>Landsat-8</em>.</p> <p><strong>Cuidados ao analisar os dados:</strong> Como o PCV é uma estimativa baseada no Modelo Linear de Mistura Espectral, pode haver confusão entre as frações de sombra e vegetação, especialmente em áreas com alta densidade de árvores. Além disso, pode ocorrer confusão entre diferentes tipos de vegetação, como árvores, arbustos e gramados em algumas regiões.</p> <p><strong>Fonte:</strong> SMALL, C.; MILESI, C. Multi-scale standardized spectral mixture models. Remote Sensing Of Environment, Amsterdã, v. 136, p. 442–54, 19 jan. 2013. Disponível : <a href="https://doi.org/10.1016/j.rse.2013.05.024">aqui</a>.</p>',
    'Vigor da vegetação (NDVI)': '<p>O <strong>Índice de Vegetação por Diferença Normalizada (NDVI)</strong> é amplamente utilizado para monitorar a densidade e a saúde da vegetação por meio de imagens de satélite. Ele permite identificar a produção primária de clorofila e umidade das plantas.</p> <p><strong>Resolução:</strong> cada quadrado representa uma área de 10 x 10 metros.</p> <p><strong>Metodologia:</strong> O NDVI é calculado a partir de um conjunto de imagens anual sem nuvens, construído com imagens do satélite <em>Sentinel-2</em>. A fórmula utiliza a diferença normalizada entre as bandas do infravermelho próximo e do vermelho.</p> <p><strong>Fonte:</strong> Rouse, J.W., Jr.; Haas, R.H.; Schell, J.; Deering, D. Monitoring the Vernal Advancement and Retrogradation (Green Wave Effect) of Natural Vegetation; Technical Report; 1973. Disponível: <a href="https://ntrs.nasa.gov/citations/19740022555">aqui</a>.</p>',
    'Cobertura vegetal por habitante (ICV)': '<p>O <strong>Índice de Cobertura Vegetal (ICV)</strong> representa a divisão da área coberta por vegetação pela área total de uma determinada região, permitindo estimar a quantidade de vegetação disponível para cada habitante dessa região.</p> <p><strong>Resolução:</strong> depende do recorte visual escolhido.</p> <p><strong>Metodologia:</strong> A partir dos dados de Percentual de Cobertura Vegetal (PCV), calcula-se a área vegetada do polígono. Em seguida, utilizando os dados do Censo, determina-se o ICV para cada setor censitário e município.</p> <p><strong>Cuidados ao analisar os dados:</strong> Como o ICV depende de informações censitárias, sua atualização está vinculada à realização de futuros Censos.</p>',

    // Parques e praças
    'Distância media até as praças': '<p>A <strong>Distância média até as praças</strong> indica o quanto os moradores precisam caminhar para encontrar uma praça ou parque. Esse dado permite compreender melhor quais regiões do município têm maior ou menor facilidade de acesso a espaços livres.</p><p><strong>Resolução:</strong> Não se aplica.</p><p><strong>Metodologia:</strong> A distância média é calculada como a média aritmética das distâncias entre os centróides dos setores censitários urbanos e as áreas verdes mapeadas.</p><p><strong>Cuidados ao analisar os dados:</strong> A precisão do indicador depende da atualização dos dados censitários e da qualidade do mapeamento das áreas verdes.</p><p><strong>Fontes:</strong> PIPAE. <em>Relatório Metodológico</em>. UrbVerde. <a href="https://www.livrosabertos.abcd.usp.br/portaldelivrosUSP/catalog/book/1281">Livro da UrbVerde</a>.</p>',
    'Distância media até as praças (>5000m²)': '<p>A <strong>Distância média até as praças com áreas maiores de 5000 metros quadrados</strong> indica o quanto os moradores precisam caminhar para encontrar uma praça ou parque maior de 5000 metros quadrados. Esse dado permite compreender melhor quais regiões do município têm maior ou menor facilidade de acesso a espaços livres.</p><p><strong>Resolução:</strong> Não se aplica.</p><p><strong>Metodologia:</strong> A distância média é calculada como a média aritmética das distâncias entre os centróides dos setores censitários urbanos e as áreas verdes mapeadas (dada a situação de 5000 metros quadrados).</p><p><strong>Cuidados ao analisar os dados:</strong> A precisão do indicador depende da atualização dos dados censitários e da qualidade do mapeamento das áreas verdes.</p><p><strong>Fontes:</strong> PIPAE. <em>Relatório Metodológico</em>. UrbVerde. <a href="https://www.livrosabertos.abcd.usp.br/portaldelivrosUSP/catalog/book/1281">Livro da UrbVerde</a>.</p>',
    'Área de praças por habitante': '<p>A <strong>Área de praças por habitante</strong> representa a quantidade de área de praças e parques disponível para cada habitante do município. Esse indicador é fundamental para avaliar a qualidade ambiental e o acesso a espaços verdes dentro do planejamento urbano.</p><p><strong>Resolução:</strong> Não se aplica.</p><p><strong>Metodologia:</strong> O cálculo segue a equação: IAV = Soma da área total dos polígonos <em>OpenStreetMap (OSM)</em> / Número total de habitantes IBGE. Técnicas de geoprocessamento foram aplicadas para somar os polígonos do OSM e cruzá-los com os dados populacionais do Censo IBGE (2022), permitindo a análise em escala municipal e intraurbana.</p><p><strong>Cuidados ao analisar os dados:</strong> Os polígonos de praças e parques são provenientes do <em>OpenStreetMap</em> e seguem a licença ODbl (Open Data License). A validação desses dados colaborativos ocorre periodicamente, conforme a disponibilidade de dados oficiais e novas atualizações da plataforma.</p><p><strong>Fontes:</strong> UN-Habitat (2018). <a href="https://unhabitat.org/sdg-indicator-1171-training-module-public-space">SDG Indicator 11.7.1 Training Module: Public Space</a>. United Nations Human Settlement. NUCCI, J. C. (2008). Qualidade ambiental e adensamento urbano: um estudo de ecologia e planejamento da paisagem aplicado ao distrito de Santa Cecília (MSP). Autor, Curitiba.</p>',
    'Área atendida pelas praças': '<p>A <strong>Área atendida pelas Praças</strong> representa a porcentagem da área do município que está dentro de um raio de 400 metros de uma praça ou parque. Essa informação é útil para entender a acessibilidade aos espaços verdes urbanos e apoiar o planejamento urbano sustentável.</p><p><strong>Resolução:</strong> Não se aplica.</p><p><strong>Metodologia:</strong> A análise é feita por meio da intersecção entre buffers de 400 metros ao redor dos polígonos do OpenStreetMap (OSM) e os setores censitários. A partir dessa intersecção, calcula-se a proporção da área de cada setor censitário que está coberta pelos buffers, permitindo estimar a cobertura de espaços verdes urbanos acessíveis à população.</p><p><strong>Cuidados ao analisar os dados:</strong> Os buffers estão sendo reformulados conforme a nova categorização dos espaços livres mapeados. Os raios dos buffers podem variar de acordo com o tamanho e a categoria de cada espaço verde.</p><p><strong>Fonte:</strong> FANTIN, M.; PEDRASSOLI, J. C.; MELO, B. M. de; MENEZES, G. P.; MARTINES, M. R. "Inteligência geográfica na construção de políticas públicas: rumo à plataforma de monitoramento de áreas verdes urbanas do Estado de São Paulo". Interações, v. 23, p. 907-922, 2022.</p>',
    'População atendida pelas praças (%)':'<p>A <strong>População atendida pelas praças (em %)</strong> representa a porcentagem da quantidade de pessoas que vivem em setores censitários atendidos por pelo menos uma praça ou parque em um raio de até 400 metros. Esse dado é fundamental para avaliar o acesso da população a áreas verdes e o impacto desses espaços na qualidade de vida urbana.</p> <p><strong>Resolução:</strong> Não se aplica.</p> <p><strong>Metodologia:</strong> A estimativa é feita identificando a interseção entre os setores censitários urbanos e os buffers gerados a partir dos polígonos de praças e parques. Dessa forma, é possível calcular a quantidade de habitantes de cada setor censitário que tem acesso a pelo menos uma praça ou parque.</p> <p><strong>Cuidados ao analisar os dados:</strong> O número de habitantes atendidos pode variar não apenas pela presença de praças e parques, mas também pela densidade populacional de cada setor censitário. Os buffers estão sendo reformulados conforme uma nova categorização dos espaços livres mapeados. Assim, os raios dos buffers podem sofrer alterações dependendo do tamanho de cada categoria.</p> <p><strong>Fontes:</strong> FANTIN, M. et al. "Inteligência geográfica na construção de políticas públicas: rumo à plataforma de monitoramento de áreas verdes urbanas do Estado de São Paulo". Interações, v. 23, pp. 907-922, 2022. GOMES, J. G. et al. "Medindo a desigualdade no acesso às praças e parques urbanos com o suporte de indicadores da plataforma UrbVerde". Anais do XX Simpósio Brasileiro de Sensoriamento Remoto, v. 20, pp. 1474-1477, 2023.</p>',

    // Socioeconômicos:
    'Quantidade de habitantes': '<p>A <strong>Quantidade de Habitantes</strong> mostra o total de pessoas que vivem nos setores censitários urbanos de cada município. Esse dado é fundamental para planejar políticas públicas, avaliar o acesso a serviços essenciais e entender a distribuição da população nas cidades.</p> <p><strong>Fonte:</strong> Instituto Brasileiro de Geografia e Estatística (IBGE), <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Densidade demográfica': '<p>A <strong>Densidade Demográfica</strong> representa o número de habitantes por quilômetro quadrado em cada setor censitário urbano. Esse indicador ajuda a identificar áreas com maior adensamento populacional e orientar políticas de infraestrutura, mobilidade e áreas verdes.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de alfabetizados': '<p>O <strong>Percentual de Alfabetizados</strong> indica a proporção da população urbana com capacidade de ler e escrever. Esse dado é importante para avaliar o acesso à educação e planejar políticas públicas voltadas à inclusão educacional.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Renda média do responsável da casa': '<p>A <strong>Renda Média do Responsável pela Casa</strong> reflete o rendimento médio mensal da pessoa responsável pelo domicílio. Esse dado é essencial para mapear desigualdades socioeconômicas e orientar políticas de redistribuição de renda e justiça social.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de crianças': '<p>O <strong>Percentual de Crianças</strong> representa a proporção da população urbana com até 9 anos de idade. Esse indicador é relevante para políticas voltadas à infância, como a oferta de creches, escolas e áreas de lazer.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de idosos': '<p>O <strong>Percentual de Idosos</strong> indica a proporção da população urbana com 60 anos ou mais. Esse dado é essencial para o planejamento de políticas de saúde, acessibilidade e mobilidade voltadas à população idosa.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de mulheres': '<p>O <strong>Percentual de Mulheres</strong> mostra a proporção de pessoas do sexo feminino nos setores urbanos. Esse dado contribui para a formulação de políticas de equidade de gênero e proteção social.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de homens': '<p>O <strong>Percentual de Homens</strong> indica a proporção de pessoas do sexo masculino nos setores urbanos. Esse dado pode ser usado em conjunto com outros indicadores para análises demográficas e sociais.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de pessoas brancas': '<p>O <strong>Percentual de Pessoas Brancas</strong> indica a proporção da população urbana que se identifica como branca, conforme declarado no Censo 2022. Esses dados são fundamentais para o mapeamento das desigualdades raciais e formulação de políticas de equidade.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de pessoas pretas': '<p>O <strong>Percentual de Pessoas Pretas</strong> indica a proporção da população urbana que se identifica como preta, conforme declarado no Censo 2022. Esses dados são fundamentais para o mapeamento das desigualdades raciais e formulação de políticas de equidade.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de pessoas pardas': '<p>O <strong>Percentual de Pessoas Pardas</strong> indica a proporção da população urbana que se identifica como parda, conforme declarado no Censo 2022. Esses dados são fundamentais para o mapeamento das desigualdades raciais e formulação de políticas de equidade.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de pessoas amarelas': '<p>O <strong>Percentual de Pessoas Amarelas</strong> indica a proporção da população urbana que se identifica como amarela, conforme declarado no Censo 2022. Esses dados são fundamentais para o mapeamento das desigualdades raciais e formulação de políticas de equidade.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>',
    'Percentual de pessoas indigenas': '<p>O <strong>Percentual de Pessoas Indígenas</strong> indica a proporção da população urbana que se identifica como indígena, conforme declarado no Censo 2022. Esses dados são fundamentais para o mapeamento das desigualdades raciais e formulação de políticas de equidade.</p> <p><strong>Fonte:</strong> IBGE, <a href="https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html">Censo Demográfico 2022</a>.</p>'
  };

  // Retorna a descrição específica ou um texto padrão
  return layerDescriptions[currentLayer.value] ||
      'Ops! Ainda não há informações específicas aqui. Por enquanto, clique em "Ler mais" para encontrar mais informações da camada.';
});

// URL da documentação para cada camada
const getLayerInfoUrl = computed(() => {
  const layerUrls = {
    // Clima
    'Temperatura de superfície': 'https://urbverde-educa.tawk.help/article/temperatura-de-superf%C3%ADcie-terrestre-tst',
    'Temperatura máxima de superfície':'https://urbverde-educa.tawk.help/article/temperatura-de-superf%C3%ADcie-terrestre-tst',
    'Nível de Exposição à ilha de calor':'https://urbverde-educa.tawk.help/article/coeficiente-de-ilha-de-calor',

    // Vegetação
    'Cobertura vegetal (PCV)': 'https://urbverde-educa.tawk.help/article/percentual-de-cobertura-vegetal-pcv',
    'Desigualdade sociambiental (IDSA)':'https://urbverde-educa.tawk.help/article/%C3%ADndice-de-desigualdade-socioambiental-idsa',
    'Cobertura vegetal por satélite':'https://urbverde-educa.tawk.help/article/vegeta%C3%A7%C3%A3o',
    'Vigor da vegetação (NDVI)':'https://urbverde-educa.tawk.help/article/%C3%ADndice-de-vegeta%C3%A7%C3%A3o-por-diferen%C3%A7a-normalizada-ndvi',
    'Cobertura vegetal por habitante (ICV)':'https://urbverde-educa.tawk.help/article/%C3%ADndice-de-cobertura-vegetal-icv',

    // Parques e praças
    'Distância media até as praças':'https://urbverde-educa.tawk.help/article/dist%C3%A2ncia-m%C3%A9dia-at%C3%A9-as-pra%C3%A7as',
    'Distância media até as praças (>5000m²)':'https://urbverde-educa.tawk.help/article/dist%C3%A2ncia-m%C3%A9dia-at%C3%A9-as-pra%C3%A7as',
    'Área de praças por habitante':'https://urbverde-educa.tawk.help/article/%C3%A1rea-de-pra%C3%A7as-por-habitante-m%C2%B2hab',
    'Área atendida pelas praças':'https://urbverde-educa.tawk.help/article/%C3%A1rea-atendida-pelas-pra%C3%A7as',
    'População atendida pelas praças (%)':'https://urbverde-educa.tawk.help/article/popula%C3%A7%C3%A3o-atendida-por-pra%C3%A7as',
  };

  return layerUrls[currentLayer.value] || 'https://urbverde-educa.tawk.help/category/categorias-e-camadas';
});

// Método para abrir o modal
function show() {
  refModal.value.show();
}

// Método para fechar o modal
function closeModal() {
  refModal.value.hide();
}

// Método para abrir a página de informações da camada
function openLayerInfoPage() {
  window.open(getLayerInfoUrl.value, '_blank', 'noopener,noreferrer');
}

// Expor métodos para componentes pais
defineExpose({ show, closeModal });
</script>

  <style scoped lang="scss">
  .layer-info-content {
    margin-bottom: 16px;
    color: map-get($body-text, body-color);
  }

  /* Adicione essa classe global para aplicar ao título do modal */
  :global(.layer-info-modal .modal-title) {
    white-space: pre-line !important;
  }
  </style>
