<template>
  <div>
    <div class="search-container">
      <div class="input-wrapper">
        <input
          v-model="inputValue"
          @input="updateSuggestions"
          placeholder="Digite por município ou estado"
          class="input-field"
        />
        <i class="search-icon"></i>
      </div>

      <!-- Filtros de busca -->
      <p class="filter-title primary-fade-color:100 ">Busca por:</p>
      <div class="filter-container">
        <span :class="{'active-filter': activeFilter === 'Todos'}" @click="setFilter('Todos')">Todos</span>
        <span :class="{'active-filter': activeFilter === 'Municipios'}" @click="setFilter('Municipios')">Municípios</span>
        <span :class="{'active-filter': activeFilter === 'Estados'}" @click="setFilter('Estados')">Estados</span>
      </div>

      <!-- Lista de sugestões -->
      <ul v-if="visibleSuggestions.length" class="suggestions-list">
        <li v-for="suggestion in visibleSuggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
          {{ suggestion }}
        </li>
      </ul>

    <!-- Coordenadas exibidas na tela -->
      <p v-if="coordinates">
        Coordenadas encontradas: Latitude: {{ coordinates.lat }}, Longitude: {{ coordinates.lng }}
      </p>    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  components: {
    
  },
  data() {
    return {
      inputValue: '',
      suggestions: [],
      activeFilter: 'Todos',
      coordinates: null, // Adicionado para armazenar as coordenadas
      states: [
        'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
        'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
        'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
        'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
        'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
      ],
      cities: ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Belo Horizonte', 'Fortaleza']
    };
  },
  computed: {
    visibleSuggestions() {
      return this.suggestions.slice(0, 5); // Mostra no máximo 5 sugestões
    }
  },
  methods: {
    updateSuggestions() {
      if (this.inputValue.length > 0) {
        const inputLower = this.inputValue.toLowerCase();
        let allSuggestions = [];

        if (this.activeFilter === 'Todos') {
          allSuggestions = [...this.states, ...this.cities];
        } else if (this.activeFilter === 'Municipios') {
          allSuggestions = this.cities;
        } else if (this.activeFilter === 'Estados') {
          allSuggestions = this.states;
        }

        this.suggestions = allSuggestions.filter(item =>
          item.toLowerCase().startsWith(inputLower)
        );
      } else {
        this.suggestions = [];
      }
    },
    selectSuggestion(suggestion) {
      this.inputValue = suggestion;
      this.suggestions = [];
      console.log("Sugestão selecionada:", suggestion);
      this.fetchCoordinates(suggestion); // Chama a função para buscar coordenadas
    },
    setFilter(filter) {
      this.activeFilter = filter;
      this.updateSuggestions();
    },
    
    
    //Organizacao das coordenadas
    async fetchCoordinates(address) {
      const apiKey = '3f84bf15d01643f5a6dac9ce3905198a'; // Sua chave API
      const endpoint = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
      const response = await axios.get(endpoint);
      if (response.data && response.data.results.length > 0) {
        const location = response.data.results[0].geometry;
        this.$emit('location-updated', { lat: location.lat, lng: location.lng });
      } else {
        console.error('Nenhuma coordenada encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
    }
    },
  }
};
</script>

<style scoped>
/* Estilos principais da busca */
.search-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 288px;
  font-family: 'Arial', sans-serif;
}

/* Input */
.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-image: url('../../assets/Search.png');
  background-size: contain; 
  background-repeat: no-repeat; 
  width: 24px;
  height: 24px;
  display: inline-block;
}

/* Filtros */
.filter-container {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.filter-title{
  color: #a1a1a1;
  font-size: 14px;
  font-weight:lighter;
  margin-top: 10px;
  margin-bottom: 0px;
  margin-left: -190px;
  
}

.filter-container span {
  cursor: pointer;
  padding: 8px;
  border-radius: 20px;
  color: #666;
  font-size: 14px;
}

.filter-container .active-filter {
  background-color: #DFF2EC;
  color: #025949;
}

/* Lista de sugestões */
.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.suggestions-list li {
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}
</style>
