<template>
  <div>
    <div class="input-container">
      <input
        v-model="inputValue"
        @input="updateSuggestions"
        @keydown.enter="handleEnter"
        placeholder="Digite o nome de um estado brasileiro"
        class="input-field"
      />
      <div v-if="highlightedText" class="suggestion-overlay">
        <span class="suggestion-text">
          <span class="invisible">{{ visibleInput }}</span><span class="highlight">{{ highlightedText }}</span>
        </span>
      </div>
    </div>
    <div class="button-container">
      <button @click="submit">Enviar</button>
      <span class="suggestion-count" v-if="inputValue && suggestions.length > 0">
        {{ suggestions.length }} sugestão(ões)
      </span>
      <span class="cache-count">
        Cache: {{ cachedCities.length }} item(ns)
      </span>
      <span class="history-count">
        Histórico: {{ searchHistory.length }} item(ns)
      </span>
    </div>
    <ul v-if="inputValue && visibleSuggestions.length" class="suggestions-list">
      <li v-for="suggestion in visibleSuggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      visibleInput: '',
      suggestions: [],
      highlightedText: '',
      states: [
        'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
        'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
        'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
        'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
        'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
      ],
      cachedCities: [], // Array para armazenar as cidades buscadas
      searchHistory: [] // Array para armazenar o histórico de busca
    };
  },
  created() {
    this.loadSearchHistory(); // Carrega o histórico do localStorage ao iniciar o componente
    this.updateSuggestions();
  },
  computed: {
    visibleSuggestions() {
      return this.suggestions.slice(0, 6);
    }
  },
  methods: {
    async fetchCities(query) {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${query}`);
      const data = await response.json();
      const filteredCities = data.filter(city =>
        city.nome.toLowerCase().includes(query.toLowerCase())
      );
      const cities = filteredCities.map(city => `${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}`);
      this.cachedCities = cities; // Armazena as cidades no array de cache
      this.updateSuggestions(); // Atualiza as sugestões com os novos dados
    },
    updateSuggestions() {
      const inputLower = this.inputValue.toLowerCase();

      if (this.inputValue === '') {
        this.suggestions = [];
        this.highlightedText = '';
        return;
      }

      // Filtra o histórico de busca
      const historySuggestions = this.searchHistory.filter(item =>
        item.toLowerCase().startsWith(inputLower)
      );

      // Filtra os estados excluindo os já presentes no histórico
      const stateSuggestions = this.states.filter(state =>
        state.toLowerCase().startsWith(inputLower) && !this.searchHistory.includes(state)
      );

      // Filtra as cidades no cache excluindo as já presentes no histórico
      const citySuggestions = this.cachedCities.filter(city =>
        city.toLowerCase().startsWith(inputLower) && !this.searchHistory.includes(city)
      );

      // Combina as sugestões do histórico, estados e cidades, dando prioridade ao histórico
      this.suggestions = [...historySuggestions, ...stateSuggestions, ...citySuggestions];

      if (this.inputValue.length === 3) {
        // Faz a consulta à API do IBGE quando o input tiver exatamente 3 letras
        this.fetchCities(this.inputValue);
      }

      if (this.suggestions.length > 0) {
        const suggestion = this.suggestions[0];
        this.visibleInput = this.inputValue;
        this.highlightedText = suggestion.slice(this.inputValue.length);
      } else {
        this.visibleInput = this.inputValue;
        this.highlightedText = '';
      }
    },
    selectSuggestion(suggestion) {
      this.inputValue = suggestion;
      this.visibleInput = suggestion;
      this.highlightedText = '';
      this.suggestions = [];
      this.addToHistory(suggestion); // Adiciona a sugestão selecionada ao histórico
    },
    submit() {
      if (this.inputValue) {
        alert(`Você selecionou: ${this.inputValue}`);
        this.addToHistory(this.inputValue); // Adiciona a sugestão selecionada ao histórico
      }
      this.suggestions = [];
    },
    handleEnter() {
      if (this.suggestions.length > 0) {
        this.selectSuggestion(this.suggestions[0]);
        setTimeout(() => {
          this.submit();
        }, 1000);
      }
    },
    addToHistory(item) {
      if (!this.searchHistory.includes(item)) {
        this.searchHistory.unshift(item); // Adiciona ao início do array de histórico
        if (this.searchHistory.length > 10) {
          this.searchHistory.pop(); // Mantém o histórico limitado a 10 itens
        }
        this.saveSearchHistory(); // Salva o histórico atualizado no localStorage
      }
    },
    saveSearchHistory() {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    },
    loadSearchHistory() {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        this.searchHistory = JSON.parse(savedHistory);
      }
    }
  }
};
</script>

<style scoped>
.input-container {
  position: relative;
  display: inline-block;
  width: 300px;
}
.input-field {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  font-size: 16px;
}
.suggestion-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
}
.suggestion-text {
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
}
.invisible {
  visibility: hidden;
}
.highlight {
  color: #bbb;
}
.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
}
.suggestions-list li {
  padding: 5px;
  cursor: pointer;
}
.suggestions-list li:hover {
  background-color: #f0f0f0;
}
.button-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.suggestion-count {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}
.cache-count {
  margin-left: 20px;
  font-size: 14px;
  color: #666;
}
.history-count {
  margin-left: 20px;
  font-size: 14px;
  color: #666;
}
</style>
