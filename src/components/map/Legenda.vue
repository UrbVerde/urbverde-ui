<!-- urbverde-ui/src/components/map/Legenda.vue -->
<template>
  <div class="legend-wrapper">
    <!--Cabecalho Legenda -->
    <div class="legend-header" @click="toggleLegend">
      <span class="body-small-semibold">Legenda</span>
      <img :src="wrapperIcon" :class="{'icon-open': isOpen, 'icon-closed': !isOpen}" alt="toggle icon" />
    </div>

    <!-- Corpo Legenda -->
    <div v-if="isOpen" class="legend-body">
      <!-- Seção do Ano -->
      <div class="section-container">
        <div class="year-section">
          <div class="year-label">
            <img src="@/assets/icons/calendar.svg" alt="Calendar icon" />
            <span class="body-small-medium">Ano</span>
          </div>
          <select v-model="selectedYear" class="form-select">
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <!-- Layers button -->
      <div class="container-layers">
        <span>CAMADAS</span>
        <img :src="addIcon"  />
      </div>

      <!-- Layers Section -->
      <div class="section-container">
        <div class="container-header">
          <img src="@/assets/icons/layer.svg" alt="Layer icon" />
          <span class="body-small-medium">Contornos e traços</span>
        </div>
        <div class="layer-details">
          <p class="layer-sub"><span class="legend-line black"></span>Setores censitários</p>
          <p class="layer-sub"><span class="legend-line blue"></span>Municípios</p>
        </div>
      </div>

      <!-- Seção de Temperatura -->
      <div class="section-container ">
        <div class="container-header">
          <img src="@/assets/icons/temperatura.svg" alt="Temperature icon" />
          <span class="body-small-medium">Temperatura de Supe...</span>
        </div>
        <div class="temperature-scale">
          <div class="temperature-bar"></div>
          <div class="temperature-labels">
            <span>-5ºC</span>
            <span>0ºC</span>
            <span>+5ºC</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Seção separada para os botões -->
    <div v-if="isOpen" class="buttons-container">
      <div class="buttons-space">

        <PrimaryButton
          label="Comparar Camadas"
          :filled="false"
          :icon="wrapperIcon"
          icon-position="left"
        >
        </PrimaryButton>

        <PrimaryButton
          label="Baixar"
          :filled
          :icon="wrapperIcon"
          icon-position="left"
          @click="downloadData"
        >
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script>
import addIcon from '../../assets/icons/add.svg';
import wrapperIcon from '../../assets/icons/wrapper.svg';
import PrimaryButton from '../buttons/PrimaryButton.vue';

export default {
  name: 'MapLegend',
  components: {
    PrimaryButton
  },
  data() {
    return {
      isOpen: false,
      addIcon,
      wrapperIcon,
      selectedYear: 2021,
      availableYears: [2021, 2020, 2019, 2018], // Exemplo de anos disponíveis
    };
  },
  methods: {
    toggleLegend() {
      this.isOpen = !this.isOpen;
    },
    downloadData() {
      // Função que será chamada ao clicar no botão "Baixar"
      console.warn('Baixando os dados...');
    },
  }
};
</script>

<style scoped >
.legend-wrapper {
  position: absolute;
  top: 33px;
  right: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 264px;
  height: auto;
  max-height: calc(100% - 40px); /* Prevents it from exceeding the map's height */
  border-radius: 16px;
  background-color: #F8F9FA ;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1; /* Ensure it stays above the map */
  transition: opacity 0.3s ease-in-out;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.13) inset;
}

.legend-header span {
    margin-left: 16px;

}
.legend-header img {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  /* margin-right: 16px; */
}

.icon-open {
  transform: rotate(180deg); /* Rotaciona o ícone quando a legenda está aberta */
}

.icon-closed {
  transform: rotate(0deg); /* Ícone na posição padrão quando fechada */
}

.legend-body {
  padding: 16px;
  background-color: #F8F9FA;
  overflow-y: auto; /* Add scroll if content exceeds container height */
}

/* Estilo para a seção */
.section-container {
  background-color: #FFF;
  padding: 16px 16px  ;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.container-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.container-header img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.container-header p {
  margin: 0;
  font-size: 16px;
  line-height: 1;
}

.year-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* .year-label {
  display: flex;
  align-items: center;
} */

.year-label img {
  margin-right: 10px;
}

select {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  width: 120px;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
}

.container-layers{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
}
.container-layers span{

  color: var(--Theme-Secondary, #525960);
  /* Body/Caption/Medium */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  margin-left: 8px;
}

.container-layers img {
  width: 16px;
  height: 16px;
  margin-right: 16px;
}

.layer-details{
  display: flex;
  flex-direction: column;
  margin-top: 16px;

}

.layer-sub {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 32px;

}

.legend-line {
  width: 22px;
  height: 3px;
  border-radius: 8px;
  display: inline-block;
}

.legend-line.black {
  background-color: rgb(194, 25, 25);
}

.legend-line.blue {
  background-color: blue;
}

/* Seção da barra de temperatura */
.temperature-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Barra de temperatura */
.temperature-bar {
  margin-top: 16px;
  width: 80%;
  height: 16px;
  padding: 8px;
  gap: 8px;
  border-radius: 2px;
  background: linear-gradient(to right, #388BBB, #FADE8C, #D74752);
}

/* Rótulos da temperatura */
.temperature-labels {
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  width: 80%;
  font-size: 12px;
  font-weight: 500;
}

.buttons-container {
  background-color: #ffffff; /* Cor de fundo da separação */
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  width: 100%;

}

.buttons-space {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
}

.buttons-space button {
  width: 100%;
  border-radius: 12px;
}

  </style>
