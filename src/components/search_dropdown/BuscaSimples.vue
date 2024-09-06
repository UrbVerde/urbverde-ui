<template>
  <div>
    <div class="input-container">
      <input ref="inputField" v-model="inputValue" @keyup="keydown" @focus="handleFocus" @keydown.enter="handleEnter"
        placeholder="Digite o nome de um estado brasileiro" class="input-field" />
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
      <li class="suggestion-item" v-for="(suggestion, index) in visibleSuggestions" :key="suggestion"
        @click="selectSuggestion(suggestion)" tabindex="0" @keydown.enter="selectSuggestion(suggestion)"
        @keydown.up.prevent="focusPreviousSuggestion(index)" @keydown.down.prevent="focusNextSuggestion(index)"
        :ref="`suggestionItem-${index}`">
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
      previousInputValue: '',
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
      cachedCities: [],
      searchHistory: [],
      dropdown: false,
    };
  },
  created() {
    this.loadSearchHistory();
    this.updateSuggestions();
  },
  mounted() {
    document.addEventListener('mousedown', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  },
  computed: {
    visibleSuggestions() {
      return this.suggestions.slice(0, 6);
    }
  },
  methods: {
    async fetchCities(query) {
      try {
        this.clearCache();
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${query}`);
        const data = await response.json();
        const filteredCities = data.filter(city =>
          city.nome.toLowerCase().includes(query.toLowerCase())
        );
        const cities = filteredCities.map(city => `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`);
        this.cacheCities(cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
        // Optionally, display an error message to the user
      }
    },

    focusPreviousSuggestion(index) {
      if (index > 0) {
        const previousItem = this.$refs[`suggestionItem-${index - 1}`];
        if (previousItem && previousItem[0]) {
          previousItem[0].focus();
        }
      }
    },
    focusNextSuggestion(index) {
      if (index < this.visibleSuggestions.length - 1) {
        const nextItem = this.$refs[`suggestionItem-${index + 1}`];
        if (nextItem && nextItem[0]) {
          nextItem[0].focus();
        }
      }
    },

    handleClickOutside(event) {
      if (!this.$refs.inputField.contains(event.target) && !this.$refs.dropdown.contains(event.target)) {
        this.dropdown = false;
      }
    },

    handleFocus(event) {
      if (!this.dropdown) {
        if(this.inputValue != this.suggestions[0]){
          this.dropdown = true;
        }
        
      }
      event.stopPropagation();
    },

    cacheCities(cities) {
      this.cachedCities = [...new Set([...this.cachedCities, ...cities])];
      this.updateSuggestions();
    },

    clearCache() {
      this.cachedCities = [];
    },

    keydown() {
      this.updateSuggestions();
      console.log(this.inputValue);

    },

    updateSuggestions() {



      //this.previousInputValue = this.inputValue;

      //if (this.inputValue === this.previousInputValue && this.inputValue.length === 2) return;


      if (this.inputValue === '') {
        this.generateDefaultSuggestions();
        this.highlightedText = '';
        return;
      }

      const inputLower = this.inputValue.toLowerCase();
      const historySuggestions = this.filterHistory(inputLower);
      const stateSuggestions = this.filterStates(inputLower);
      const citySuggestions = this.filterCities(inputLower);

      this.suggestions = [...historySuggestions, ...stateSuggestions, ...citySuggestions];

      if (this.inputValue.length === 3) {
        this.fetchCities(this.inputValue);
      }

      this.updateHighlightedText();



    },

    filterHistory(query) {
      return this.searchHistory.filter(item => item.toLowerCase().startsWith(query));
    },

    filterStates(query) {
      return this.states
        .filter(state => state.toLowerCase().startsWith(query) && !this.searchHistory.includes(state));
    },

    filterCities(query) {
      return this.cachedCities
        .filter(city => city.toLowerCase().startsWith(query) && !this.searchHistory.includes(city));
    },

    updateHighlightedText() {
      if (this.suggestions.length > 0) {
        const suggestion = this.suggestions[0];
        if (suggestion.toLowerCase().startsWith(this.inputValue.toLowerCase())) {
          this.visibleInput = this.inputValue;
          this.highlightedText = suggestion.slice(this.inputValue.length);
        } else {
          this.highlightedText = '';
        }
      } else {
        this.highlightedText = '';
      }
    },


    selectSuggestion(suggestion) {
      this.inputValue = suggestion;
      this.visibleInput = suggestion;
      this.highlightedText = '';
      this.suggestions = [];
      this.addToHistory(suggestion);
      this.dropdown = false;
      this.submit();
    },

    submit() {
      if (this.inputValue) {
        alert(`Você selecionou: ${this.suggestions[0]}`);
        this.addToHistory(this.suggestions[0]);
      }
      this.suggestions = [];
    },

    handleEnter() {
      if (this.suggestions.length > 0) {
        this.selectSuggestion(this.suggestions[0]);
        this.$refs.inputField.blur();
        setTimeout(() => {
          this.submit();
        }, 1000);
      }
    },

    addToHistory(item) {
      const itemLower = item.toLowerCase();
      const historyLower = this.searchHistory.map(historyItem => historyItem.toLowerCase());

      if (!historyLower.includes(itemLower)) {
        this.searchHistory.unshift(item);
        if (this.searchHistory.length > 10) {
          this.searchHistory.pop();
        }
        this.saveSearchHistory();
      }
    },

    saveSearchHistory() {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    },

    clearHistory() {
      this.searchHistory = [];
      localStorage.removeItem('searchHistory');
      alert('Histórico limpo com sucesso!');
    },

    loadSearchHistory() {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        this.searchHistory = JSON.parse(savedHistory);
      }
    },

    generateDefaultSuggestions() {
      const cachedData = this.getCachedData();
      const { city, state, stateAbbreviation, international } = cachedData;

      let defaultSuggestions = [];

      if (international) {
        defaultSuggestions = ["Rio de Janeiro - RJ", "São Paulo", "Brasil"];
      } else {
        defaultSuggestions = [`${city} - ${stateAbbreviation}`, `${state}`, "Brasil"];
      }

      const historySuggestions = this.searchHistory.slice(0, 3).filter(item => !defaultSuggestions.includes(item));
      this.suggestions = [...historySuggestions, ...defaultSuggestions];
    },

    getCachedData() {
      return {
        city: localStorage.getItem('cachedCity'),
        state: localStorage.getItem('cachedState'),
        stateAbbreviation: localStorage.getItem('cachedStateAbbreviation'),
        international: localStorage.getItem('cachedInternational') === 'true',
        latitude: localStorage.getItem('cachedLatitude'),
        longitude: localStorage.getItem('cachedLongitude'),
      };
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
