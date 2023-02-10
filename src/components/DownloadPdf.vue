<template>
  <v-btn :color="color" class="pa-3" @click="downloadPdf"
    ><p class="mb-0 white--text">Baixar relatório</p>
  </v-btn>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import imageCover from "../assets/urbverde_relcover.png";

export default {
  name: "PdfDownloader",
  props: {
    color: {
      type: String,
      default: "#003C3C",
    },
  },
  data() {
    return {
      printMode: false,
      setorDataForChart: false,
    };
  },
  methods: {
    async downloadPdf() {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor("#003c3c");
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      doc.setDrawColor(0, 60, 60);
      doc.setTextColor("#FFF");
      const headerLength = doc.getTextWidth(
        `Relatório para ${this.munTempData.nm_mun}`
      );
      const headerAlign = (pageWidth - headerLength) / 2;
      doc.text(`Relatório para ${this.munTempData.nm_mun}`, headerAlign, 10);
      doc.setFontSize(24);

      doc.addImage(imageCover, "png", 50, 100);

      doc.setFontSize(10);
      const textWidth = doc.getTextWidth(`${this.$route.params.ano || 2021}`);
      const x = (pageWidth - textWidth) / 2;
      doc.text(`${this.$route.params.ano || 2021}`, x, pageHeight - 10);
      // Page 2
      doc.addPage();
      const title = "A UrbVerde";
      doc.setFillColor("#003c3c");
      doc.rect(10, 10, pageWidth, 10, "F");
      doc.setDrawColor(0, 0, 0, 0);
      doc.circle(5 + 7, 10 + 5, 7, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(title, 20, 17);
      doc.setFontSize(14);
      const paragraph_page2 =
        "A Plataforma  de monitoramento das áreas verdes urbanas do Estado de São Paulo - UrbVerde é uma ferramenta inovadora para o planejamento urbano que viabiliza o tratamento de imagens de satélite provenientes de plataformas na nuvem, disponibilizando dados espaciais para todos. Com um enfoque ambiental, a plataforma oferece métricas acompanháveis em coleções anuais que possam fornecer suporte à decisão de políticas públicas, em três produtos principais ou camadas: ";
      const widthP = pageWidth - 20;
      const linesP = doc.splitTextToSize(paragraph_page2, widthP);
      doc.setTextColor("#000");
      doc.text(linesP, 10, 40);

      doc.setTextColor("#003c3c");
      doc.text("• " + "Praças e Parques", 20, 80);
      doc.text(
        "• " +
          "Cobertura Vegetal Urbana e Índice de Vulnerabilidade Socioambiental",
        20,
        90
      );
      doc.text("• " + "Temperatura de Superfície Terrestre (TST)", 20, 100);
      const paragraph2_page2 =
        "Nesta primeira versão da plataforma é abrangido todo o território do Estado de São Paulo com suas 645 municipalidades. Os dados das áreas consideradas urbanizadas são analisados nas escalas estadual e intraurbana por meio de três unidades territoriais de análise: municípios, setores censitários e espaços-livres. Essas escalas permitem comparar as desigualdades entre municípios contíguos ou de diferentes regiões e tamanhos, bem como detalhar como estão distribuídas em uma escala intraurbana.";
      const widthP2 = pageWidth - 20;
      const linesP2 = doc.splitTextToSize(paragraph2_page2, widthP2);
      doc.setTextColor("#000");
      doc.text(linesP2, 10, 110);
      const paragraph3_page2 =
        "Além da ampla escala espacial, a plataforma também contempla a escala temporal, pois as imagens de satélite permitem analisar a evolução histórica e comparar diferentes períodos em um mesmo lugar. A primeira coleção de dados cobre o período de cinco anos entre 2016-2021 e pode ser atualizada anualmente. ";
      const widthP3 = pageWidth - 20;
      const linesP3 = doc.splitTextToSize(paragraph3_page2, widthP3);
      doc.setTextColor("#000");
      doc.text(linesP3, 10, 155);

      const pragraph4_page2 =
        "As premissas que regem a construção da plataforma são: ";
      const widthP4 = pageWidth - 20;
      const linesP4 = doc.splitTextToSize(pragraph4_page2, widthP4);
      doc.setTextColor("#000");
      doc.text(linesP4, 10, 185);

      doc.setTextColor("#003c3c");
      doc.text(
        "- " +
          "uso de dados abertos ¹. Ex: sensoriamento remoto, censos, OpenStreetMaps",
        20,
        195
      );
      doc.text(
        "- " +
          "facilidade de acesso aos dados disponibilizados em uma plataforma Web-SIG;",
        20,
        205
      );
      doc.text(
        "- " +
          "replicabilidade e escalabilidade oferecidas pela computação em nuvem;",
        20,
        215
      );
      doc.text(
        "- " + "interatividade com os municípios interessados.",
        20,
        225
      );
      const footer = `¹ De acordo com a Open Knowledge Foundation, dados abertos são aqueles que estão disponíveis para serem acessados e reutilizados por qualquer pessoa, sem restrições de custo ou de uso.disponíveis de uma forma conveniente e modificável; Reutilização e redistribuição: os dados devem ser fornecidos em termos que permitam a reutilização e redistribuição, incluindo a mistura com outros conjuntos de dados. Os dados devem ser legíveis por máquina; Participação universal: todos devem ser capazes de usar, reutilizar e redistribuir - não deve haver discriminação contra campos de esforço ou contra pessoas ou grupos. Por exemplo, não são permitidas restrições "não comerciais" que impediriam o uso "comercial", ou restrições de uso para determinados fins (por exemplo, somente na educação)” (https://okfn.org/opendata/).`;
      const lineWidth = 0.5;
      doc.setFont("times", "italic");
      doc.setLineWidth(lineWidth);
      doc.setDrawColor(0);
      doc.line(
        10,
        doc.internal.pageSize.height - 50 + 5,
        10 + doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 50 + 5
      );
      const widthFooter = pageWidth;
      const linesFooter = doc.splitTextToSize(footer, widthFooter);
      doc.setTextColor("#000");
      doc.setFontSize(10);
      doc.text(linesFooter, 10, doc.internal.pageSize.height - 40);

      // Page 3
      doc.addPage();

      const titlePage3 = `Praças e Parques de ${this.munTempData.nm_mun}`;
      doc.setFillColor("#003c3c");
      doc.rect(10, 10, pageWidth, 10, "F");
      doc.setDrawColor(0, 0, 0, 0);
      doc.circle(5 + 7, 10 + 5, 7, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal", "normal");
      doc.text(titlePage3, 20, 17);

      doc.setFontSize(14);
      const paragraph_page3 =
        "As praças e parques de um município atendem principalmente a população da vizinhança, definida pela OMS (Organização Mundial da Saúde) como um raio de 400m ao redor de cada praça.";
      const widthP1P4 = pageWidth - 20;
      const linesP1P4 = doc.splitTextToSize(paragraph_page3, widthP1P4);
      doc.setTextColor("#000");
      doc.text(linesP1P4, 10, 40);

      //Praças
      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Acesso - população atendida pelas praças", 10, 70);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      doc.text(`Ranking Estadual de População Atendida por Praças`, 20, 80);
      // doc.text(`${this.getRankPosition("a1")} de 645`, 25, 90);
      doc.text(
        `Ranking Estadual de População Atendida por Mesorregião`,
        20,
        100
      );
      // doc.text(`${this.getRankPosition("a2")} de 645`, 25, 110);
      doc.text(
        `Ranking Estadual de População Atendida por Microrregião`,
        20,
        120
      );
      // doc.text(`${this.getRankPosition("a3")} de 645`, 25, 130);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Distribuição - M² de praças por habitante", 10, 150);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      doc.text(`${this.munPracaData.a2.toFixed(2)}`, 20, 160);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Cobertura - % de Área Ocupada pelo Buffer de Praças", 10, 170);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      doc.text(`${this.munPracaData.a3.toFixed(2)}`, 20, 180);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Distribuição Espacial - Distância do Setor às Praças", 10, 190);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      doc.text(`${this.munPracaData.a4.toFixed(2)}`, 20, 200);

      // Page 4
      doc.addPage();

      const titlePage4 = `Vegetação e Indicador de Desigualdade Socioambiental de ${this.munVegData.nm_mun}`;
      doc.splitTextToSize(titlePage4, pageWidth - 20);
      doc.setFillColor("#003c3c");
      doc.rect(10, 10, pageWidth, 10, "F");
      doc.setDrawColor(0, 0, 0, 0);
      doc.circle(5 + 7, 10 + 5, 7, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal", "normal");
      doc.text(titlePage4, 20, 17);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("% de Cobertura Vegetal (PCV)", 10, 40);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      const paragraph_page4 =
        "O que é o PCV? É uma métrica calculada usando satélites que mede o quanto as áreas urbanas são cobertas por vegetação, incluindo árvores e gramíneas.";
      const widthP1P3 = pageWidth - 20;
      const linesP1P3 = doc.splitTextToSize(paragraph_page4, widthP1P3);
      doc.setTextColor("#000");
      doc.text(linesP1P3, 20, 50);
      doc.text(`Valor para o município de ${this.munVegData.nm_mun}`, 20, 65);
      doc.text(`${(this.munVegData.b1 * 100).toFixed(2)} %`, 20, 75);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Índice de Cobertura Vegetal (ICV)", 10, 85);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      const paragraph2_page4 =
        "O que é o ICV?  É uma métrica que equivale à área de cobertura vegetal por habitante do município.";
      const widthP2P4 = pageWidth - 20;
      const linesP2P4 = doc.splitTextToSize(paragraph2_page4, widthP2P4);
      doc.setTextColor("#000");
      doc.text(linesP2P4, 20, 95);
      doc.text(`Valor para o município de ${this.munVegData.nm_mun}`, 20, 110);
      doc.text(`${this.munVegData.b2.toFixed(2)}`, 20, 120);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Índice de Desigualdade Socioambiental (IDSA)", 10, 130);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      const paragraph3_page4 =
        "O que é o IDSA? É um indicador baseado no PCV e nos dados do censo, que indica maior igualdade quanto mais próximo ao valor 0.";
      const widthP3P4 = pageWidth - 20;
      const linesP3P4 = doc.splitTextToSize(paragraph3_page4, widthP3P4);
      doc.setTextColor("#000");
      doc.text(linesP3P4, 20, 140);
      doc.text(`Valor para o município de ${this.munVegData.nm_mun}`, 20, 160);
      doc.text(`${this.munVegData.b3.toFixed(2)}`, 20, 170);

      // Page 5
      doc.addPage();
      const titlePage5 = `Temperatura de Superfície para ${this.munTempData.nm_mun}`;
      doc.setFillColor("#003c3c");
      doc.rect(10, 10, pageWidth, 10, "F");
      doc.setDrawColor(0, 0, 0, 0);
      doc.circle(5 + 7, 10 + 5, 7, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal", "normal");
      doc.text(titlePage5, 20, 17);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Coeficiente de Ilhas de Calor (ºC/m² * hab)", 10, 40);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      const paragraph_page5 =
        "As ilhas de calor urbano (ICU) são um fenômeno percebido nas áreas mais quentes da cidade, onde as temperaturas de superficie ficam mais altas pelo excesso de materiais escuros que retêm mais calor, como o asfalto e o concreto, prejudicando a`qualidade de vida da população";
      const widthP1P5 = pageWidth - 20;
      const linesP1P5 = doc.splitTextToSize(paragraph_page5, widthP1P5);
      doc.setTextColor("#000");
      doc.text(linesP1P5, 20, 50);
      doc.text(`Valor para o município de ${this.munTempData.nm_mun}`, 20, 75);
      doc.text(`${this.munTempData.c1.toFixed(2)}`, 20, 85);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Temperatura Média de Superfície (TMS)", 10, 95);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      doc.text(`${this.munTempData.c2.toFixed(2)}`, 20, 105);

      doc.setFontSize(16);
      doc.setTextColor("#003c3c");
      doc.text("Temperatura Máxima de Superfície", 10, 115);
      doc.setTextColor("#000");
      doc.setFontSize(14);
      doc.text(`${this.munTempData.c3.toFixed(2)}`, 20, 125);

      // Page 6
      doc.addPage();

      if (this.setorDataForChart) {
        doc.autoTable({
          startY: 135,
          head: [
            [
              "Ano",
              "% Cobertura Vegetal do Município",
              "% Cobertura Vegetal no Setor",
            ],
          ],
          body: [
            [
              "2016",
              `${this.lineChartVegData[2016][0].b1.toFixed(2)} %`,
              `${this.setorDataForChart[2016][0].b1.toFixed(2)} %`,
            ],
            [
              "2017",
              `${this.lineChartVegData[2017][0].b1.toFixed(2)} %`,
              `${this.setorDataForChart[2017][0].b1.toFixed(2)} %`,
            ],
            [
              "2018",
              `${this.lineChartVegData[2018][0].b1.toFixed(2)} %`,
              `${this.setorDataForChart[2018][0].b1.toFixed(2)} %`,
            ],
            [
              "2019",
              `${this.lineChartVegData[2019][0].b1.toFixed(2)} %`,
              `${this.setorDataForChart[2019][0].b1.toFixed(2)} %`,
            ],
            [
              "2020",
              `${this.lineChartVegData[2020][0].b1.toFixed(2)} %`,
              `${this.setorDataForChart[2020][0].b1.toFixed(2)} %`,
            ],
            [
              "2021",
              `${this.lineChartVegData[2021][0].b1.toFixed(2)} %`,
              `${this.setorDataForChart[2021][0].b1.toFixed(2)} %`,
            ],
          ],
        });
      }

      doc.autoTable({
        head: [
          [
            "Ano",
            "Porcentagem de Cobertura Vegetal",
            "Temperatura Média de Superfície",
          ],
        ],
        body: [
          [
            "2016",
            `${this.lineChartVegData[2016][0].b1.toFixed(2)} %`,
            `${this.tstChartData[2016][0].c2.toFixed(2)} ºC`,
          ],
          [
            "2017",
            `${this.lineChartVegData[2017][0].b1.toFixed(2)} %`,
            `${this.tstChartData[2017][0].c2.toFixed(2)} ºC`,
          ],
          [
            "2018",
            `${this.lineChartVegData[2018][0].b1.toFixed(2)} %`,
            `${this.tstChartData[2018][0].c2.toFixed(2)} ºC`,
          ],
          [
            "2019",
            `${this.lineChartVegData[2019][0].b1.toFixed(2)} %`,
            `${this.tstChartData[2019][0].c2.toFixed(2)} ºC`,
          ],
          [
            "2020",
            `${this.lineChartVegData[2020][0].b1.toFixed(2)} %`,
            `${this.tstChartData[2020][0].c2.toFixed(2)} ºC`,
          ],
          [
            "2021",
            `${this.lineChartVegData[2021][0].b1.toFixed(2)} %`,
            `${this.tstChartData[2021][0].c2.toFixed(2)} ºC`,
          ],
        ],
      });

      // Save and Download
      doc.save(
        `Relatorio_${this.munTempData.nm_mun}_${
          this.$route.params.ano || 2021
        }.pdf`
      );
    },
  },
  created() {},
  computed: {
    munTempData() {
      if (!this.$route.params.ano) {
        return this.$store.getters.getMunTempData[2021][0];
      } else {
        return this.$store.getters.getMunTempData[this.$route.params.ano][0];
      }
    },
    munVegData() {
      if (!this.$route.params.ano) {
        return this.$store.getters.getMunVegData[2021][0];
      } else {
        return this.$store.getters.getMunVegData[this.$route.params.ano][0];
      }
    },
    munPracaData() {
      return this.$store.getters.getMunPracaData[2021][0];
    },

    lineChartVegData() {
      return this.$store.getters.getMunVegData;
    },

    tstChartData() {
      return this.$store.getters.getMunTempData;
    },
  },
  watch: {
    "$route.params.id": {
      handler: async function (id) {
        this.$store.dispatch("getMunicipioPracaData", this.$route.params.id);
        this.$store.dispatch("getMunicipioVegData", this.$route.params.id);
        this.$store.dispatch("getMunicipioTempData", this.$route.params.id);
      },
      deep: true,
      immediate: true,
    },

    "$route.params.setorid": {
      handler: async function (setorid) {
        if (setorid) {
          await axios
            .get(
              `https://urbverde.iau.usp.br/geoserver/urbverde/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urbverde%3Ageodata_vegetacao_por_setor&CQL_FILTER=cd_setor=${setorid}&outputFormat=application%2Fjson`
            )
            .then((response) => {
              let serieHistoricaPorSetor = {
                2016: [],
                2017: [],
                2018: [],
                2019: [],
                2020: [],
                2021: [],
              };
              response.data.features.forEach((item) =>
                serieHistoricaPorSetor[item.properties.ano].push(
                  item.properties
                )
              );

              this.setorDataForChart = serieHistoricaPorSetor;

              let bboxMun = turf.bbox(response.data.features[0].geometry);
              let massCenterMun = turf.centerOfMass(response.data.features[0]);
              window.maplibregl.flyTo({
                center: massCenterMun.geometry.coordinates,
                zoom: 12,
                bearing: 3,
                speed: 0.8,
                curve: 2,
                easing: (t) => t,
                essential: true,
              });
              window.maplibregl.fitBounds([
                [bboxMun[0], bboxMun[1]],
                [bboxMun[2], bboxMun[3]],
              ]);
            });
        }
      },
    },
  },
};
</script>
