<template>
  <div>
    <div class="input-container">
      <input
        v-model="inputValue"
        @input="updateSuggestions"
        @focus="handleFocus"
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
    <ul v-if="dropdown" class="suggestions-list" ref="dropdown">
  <li class="suggestion-item" v-for="suggestion in visibleSuggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
    {{ suggestion }}
  </li>
</ul>
  </div>
  <button @click="clearHistory" class="clear-history-button">Limpar Histórico</button>

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
        'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins', 'Brasil'
      ],
      cachedCities: [], // Array para armazenar as cidades buscadas
      searchHistory: [], // Array para armazenar o histórico de busca
      dropdown: false,
    };
  },
  created() {
    this.loadSearchHistory(); // Carrega o histórico do localStorage ao iniciar o componente
    this.updateSuggestions();
  },

  mounted() {
  // Usar mousedown ao invés de click para evitar o fechamento imediato do dropdown
  document.addEventListener('mousedown', this.handleClickOutside);
},

beforeDestroy() {
  // Remove o listener quando o componente é destruído
  document.removeEventListener('mousedown', this.handleClickOutside);
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


  const cities = filteredCities.map(city => `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`);
  
  
  // Adiciona as cidades ao cache no formato correto
  this.cachedCities = [...new Set([...this.cachedCities, ...cities])];
  
  this.updateSuggestions(); // Atualiza as sugestões com os novos dados
  },

  handleClickOutside(event) {
    // Verifica se o clique foi fora do input e do dropdown e fecha o dropdown
    if (!this.$el.contains(event.target) && !this.$refs.dropdown.contains(event.target)) {
      this.dropdown = false;
    }
  },

  handleFocus(event) {
    this.dropdown = true;
    event.stopPropagation();
  },


  clearCache() {
  this.cachedCities = [];
  },
  updateSuggestions() {
  const inputLower = this.inputValue.toLowerCase();

  if (this.inputValue === '') {
    this.generateDefaultSuggestions();
    this.highlightedText = '';
    return;
  }

  // Filtra o histórico de busca
  const historySuggestions = this.searchHistory.filter(item =>
    item.toLowerCase().startsWith(inputLower)
  );

  // Filtra os estados excluindo os já presentes no histórico
  const stateSuggestions = this.states
    .filter(state =>
      state.toLowerCase().startsWith(inputLower) && !this.searchHistory.includes(state)
    )
    .map(state => state); // Mantém apenas o nome do estado

  // Filtra as cidades no cache excluindo as já presentes no histórico
  const citySuggestions = this.cachedCities
    .filter(city =>
      city.toLowerCase().startsWith(inputLower) && !this.searchHistory.includes(city)
    )
    .map(city => city); // Mantém o formato "Cidade - Sigla do Estado"

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
      this.clearCache();
    },
    submit() {
      if (this.inputValue) {
        alert(`Você selecionou: ${this.suggestions[0]}`);
        this.addToHistory(this.suggestions[0]); // Adiciona a sugestão selecionada ao histórico
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
      this.clearCache();
    },
    addToHistory(item) {
  // Converte todos os itens no histórico para minúsculas e verifica se o novo item já existe
  const itemLower = item.toLowerCase();
  const historyLower = this.searchHistory.map(historyItem => historyItem.toLowerCase());

  if (!historyLower.includes(itemLower)) {
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
    clearHistory() {
    this.searchHistory = []; // Limpa o array de histórico na memória
    localStorage.removeItem('searchHistory'); // Remove o histórico do localStorage
    alert('Histórico limpo com sucesso!');
  },
    loadSearchHistory() {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        this.searchHistory = JSON.parse(savedHistory);
      }
    },
    getCachedData() {
    const cachedCity = localStorage.getItem('cachedCity');
    const cachedState = localStorage.getItem('cachedState');
    const cachedStateAbbreviation = localStorage.getItem('cachedStateAbbreviation');
    const cachedCountry = localStorage.getItem('cachedCountry');
    const cachedInternational = localStorage.getItem('cachedInternational') === 'true';
    const cachedTimestamp = localStorage.getItem('cachedTimestamp');

    return {
      city: cachedCity,
      state: cachedState,
      stateAbbreviation: cachedStateAbbreviation,
      country: cachedCountry,
      international: cachedInternational,
      timestamp: cachedTimestamp,
    };
  },
  generateDefaultSuggestions() {
    // Carregar os dados armazenados em cache
    const cachedData = this.getCachedData();

    // Extrair dados relevantes
    const { city, state, stateAbbreviation, international } = cachedData;

    let defaultSuggestions = [];

    if (international) {
      defaultSuggestions = [
        "Rio de Janeiro - RJ",
        "São Paulo",
        "Brasil"
      ];
    } else {
      defaultSuggestions = [
        `${city} - ${stateAbbreviation}`,
        `${state}`,
        "Brasil"
      ];
    }

      // Filtra o histórico, excluindo itens que já estejam em defaultSuggestions
  const historySuggestions = this.searchHistory.slice(0, 3).filter(item => {
    return !defaultSuggestions.includes(item);
  });

    // Combinar histórico e sugestões padrão
    this.suggestions = [...historySuggestions, ...defaultSuggestions];
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
  flex-grow: 1;
  flex-basis: 1;
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
