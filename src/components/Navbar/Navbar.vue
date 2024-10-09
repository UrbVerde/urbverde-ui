<template>
    <div class="navbar">
        <!-- Primeira linha: Título e Botões -->
        <div class="header">
          <div class="header-left">
            <h1>Temperatura de Superfície Terrestre em São Carlos</h1>
          </div>    
          <div class="header-right">
            
            <button @click="shareMap" class="share-button">
              <img src="../../assets/icons/share.svg" alt="Compartilhar" />
            </button>
            
            <button @click="layerInfo" class="info-button">
             <img src="../../assets/icons/info.svg" alt="Informações da camada" />
              Informações da camada
           </button>
          </div>
        </div>

      <!-- Segunda linha: Navegação -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="selectTab(tab)"
          :class="{ 'active-tab': selectedTab === tab }"
          class="tab-button"
        >
          {{ tab }}
        </button>
      </div>
    </div>

  </template>
  
  <script>
  export default {
    data() {
      return {
        tabs: ["Mapa", "Estatística", "Ranking"],
        selectedTab: "Mapa",
      };
    },
    methods: {
      selectTab(tab) {
        this.selectedTab = tab;
        // Lógica para alterar o conteúdo do mapa, estatística ou ranking
      },
      shareMap() {
        // Lógica para compartilhar o mapa
        alert("Compartilhar mapa");
      },
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 320px;
    right: 0;
    background-color: #F8F9FACC;
    border-bottom: 1px solid #e0e0e0;
    z-index: 1000;
    padding: 16px 24px;
    box-sizing: border-box;
    flex-direction: column;
    align-items: stretch; 
  }

  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 8px; 
    gap: 16px;

  }

  .header-left h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .share-button{
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  .info-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: transparent;
    border: 1px solid #e0e0e0; /* Adiciona a borda */
    padding: 8px 16px;
    border-radius: 8px; /* Deixa as bordas arredondadas */
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }

  .share-button img{
    width: 35px;
    height: 35px;
  }

  .info-button img {
    width: 18px;
    height: 18px;
  }  

  .tabs {
    display: flex;
    gap: 12px;
    margin-top: 16px
  }

  .tab-button {
    background-color: transparent;
    border: none;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    color: #333;
  }
  
  .tab-button:hover {
    background-color: #f0f0f0;
    border-radius: 16px;
  }

  .active-tab {
    background-color: #d2e8dd;
    color: #025949;
    border-radius: 16px;
  }
  </style>
  