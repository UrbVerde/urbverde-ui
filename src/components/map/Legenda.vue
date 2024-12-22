<template>
  <div class="legend-wrapper">
    <!-- Cabeçalho com o botão de expandir/recolher -->
    <div class="legend-header" @click="toggleLegend">
      <span>Legenda</span>
      <img :src="wrapperIcon" :class="{'icon-open': isOpen, 'icon-closed': !isOpen}" alt="toggle icon" />
    </div>

    <!-- Corpo da legenda que aparece ao abrir -->
    <div v-if="isOpen" class="legend-body">
      <!-- Seção do Ano -->
      <div class="section-container">
        <div class="year-section">
          <div class="year-label">
            <img src="@/assets/icons/calendar.svg" alt="Calendar icon" />
            <span>Ano</span>
          </div>
          <select v-model="selectedYear" class="form-select">
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <span>CAMADAS</span>
      <!-- Seção de Camadas -->
      <div class="section-container">
        <div class="layers-section">

          <img src="@/assets/icons/layer.svg" alt="Layer icon" />
          <p>Contornos e traços</p>
        </div>
        <div class="layer-details">
          <p class="layer-sub"><span class="legend-line black"></span>Setores censitários</p>
          <p class="layer-sub"><span class="legend-line blue"></span>Municípios</p>

        </div>

      </div>

      <!-- Seção de Temperatura -->
      <div class="section-container">
        <div class="temperatura-header">
          <img src="@/assets/icons/temperatura.svg" alt="Temperature icon" />
          <p>Temperatura de Superfície</p>
        </div>

        <div class="temperature-scale">
          <div class="temperature-bar"></div>
          <span>-5ºC</span>
          <span>0ºC</span>
          <span>+5ºC</span>
        </div>
      </div>
      <!-- Botão de Comparar -->
      <div class="compare">
        <button>Comparar camada</button>
      </div>
      <!-- Botão de Baixar -->
      <div class="section-container download-button">
        <button @click="downloadData">
          Baixar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import wrapperIcon from '../../assets/icons/wrapper.svg';

export default {
  name: 'MapLegend',
  data() {
    return {
      isOpen: false,
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
      console.log('Baixando os dados...');
    },
  },
  computed: {
    wrapperIcon() {
      return wrapperIcon;
    },
  },
};
</script>

  <style scoped>
  .legend-wrapper {
    border: 1px solid #ccc;
    border-radius: 16px;
    overflow: hidden;
    width: 296px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .legend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background-color: #FFF;
    cursor: pointer;
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.13) inset;
  }

  .legend-header span {
      margin-left: 16px;
      font-weight: bold;
  }
  .legend-header img {
    width: 20px;
    height: 20px;
    transition: transform 0.4s ease;
    margin-right: 16px;
  }

  .icon-open {
    transform: rotate(180deg); /* Rotaciona o ícone quando a legenda está aberta */
  }

  .icon-closed {
    transform: rotate(0deg); /* Ícone na posição padrão quando fechada */
  }

  .legend-body {
    padding: 10px;
    background-color: #F8F9FA;
  }

  /* Estilo para a seção do ano */
  .section-container {
    background-color: #FFF;
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.year-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.year-label {
  display: flex;
  align-items: center;
}

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

.layers-section{
 display: flex;
}

.layers-section p{
  margin-left: 10px;
  font-weight: bold
}

.layers-item {
    display: flex;
}

.layer-sub {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.legend-line {
  width: 20px;
  height: 2px;
  margin-right: 8px;
  display: inline-block;
}

.legend-line.black {
  background-color: black;
}

.legend-line.blue {
  background-color: blue;
}

.temperatura-header {
  display: flex;
  margin-top: 0;
}

.temperatura-header p {
  font-weight: bold;
}

.temperature-scale {
  justify-content: space-betsween;
  align-items: center;
  margin-top: 10px;
}

.temperature-bar {
  width: 80%;
  height: 16px;
  background: linear-gradient(to right, blue, green, yellow, red);
  border-radius: 4px;
  margin: 0 10px;
}

.compare-button,
.download-button {
  text-align: center;
  width: 80%;

}

.compare {
  display: flex;
  justify-content: center;
}

.compare button {
  width: 100%;
  border-radius: 12px;
  background-color: white;
  border: 2px solid #00a651;
  border-radius: 8px;
  padding: 10px 20px;
  color: #00a651;
  font-size: 14px;
  cursor: pointer;
}

.compare button:hover {
  background-color: #00a651;
  color: white;
}

.download-button {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 80px;
}
.download-button button {
  width: 100%;
  background-color: #00a651;
  color: white;
  border: none;
  border-radius: 16px;
  border: 2px solid #00a651;
  border-radius: 8px;
  padding: 10px 16px;
}
  </style>
