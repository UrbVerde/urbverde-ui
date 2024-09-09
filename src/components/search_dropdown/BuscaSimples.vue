<template>
  <div :class="{ 'input-container': !dropdown, 'input-container-dropdown': dropdown }">
    <input ref="inputField" v-model="inputValue" @keyup="keydown" @focus="handleFocus" @keydown.enter="handleEnter"
      placeholder="Digite um cidade ou estado brasileiro" class="input-field" />
    <div v-if="highlightedText" class="suggestion-overlay">
      <span class="suggestion-text">
        <span class="invisible">{{ visibleInput }}</span><span class="highlight">{{ highlightedText }}</span>
      </span>

    </div>
    <div class="button-container">
      <button :class="{ 'clean-button': inputValue !== '', 'clean-button-hidden': inputValue === '' }" @click="submit">
        <img id="imgIcon" src="../icons/clean.svg" width="16" height="16" /> </button>
      <button class="search-button" @click="submit"> <img id="imgIcon" src="../icons/search.svg" width="16"
          height="16" /> </button>
    </div>
  </div>
  <div class="button-debug">


    <span v-if="debug">
      {{ suggestions.length }} sugestão(ões)
    </span>
    <span v-if="debug">
      Cache: {{ cachedCities.length }} item(ns)
    </span>
    <span v-if="debug">
      Histórico: {{ searchHistory.length }} item(ns)
    </span>
    <button v-if="debug" @click="clearHistory">Limpar Histórico</button>
  </div>
  
  <div class="suggestion-container">
    <ul v-if="dropdown" class="suggestions-list" ref="dropdown">
      <li class="suggestion-item" v-for="(suggestion, index) in visibleSuggestions" :key="suggestion"
        @click="selectSuggestion(suggestion)" tabindex="0" @keydown.enter="selectSuggestion(suggestion)"
        @keydown.up.prevent="focusPreviousSuggestion(index)" @keydown.down.prevent="focusNextSuggestion(index)"
        :ref="`suggestionItem-${index}`">
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
      debug: false,
      lastInputLength: 0,
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
        if (this.inputValue != this.suggestions[0]) {
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

      if (this.inputValue.length === 3 && this.lastInputLength !== 3) {
        this.fetchCities(this.inputValue);
        this.lastInputLength = 3;  // Atualiza o comprimento anterior
      } else if (this.inputValue.length !== 3 && this.lastInputLength === 3) {
        this.lastInputLength = this.inputValue.length;  // Atualiza o comprimento se sair de 3 caracteres
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

      if (international || city == "error" || state == "error") {
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
#imgIcon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;

}

.input-container,
.input-container-dropdown {

  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;

  height: 48px;
  padding: 0px 16px 0px 24px;


  /* alinhar texto digitado com sugestão */
  position: relative;

}

.input-container {

  border-radius: 99px;
  background: var(--Gray-100, #aa127c);

  /* Small Shadow */
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);

}

.input-container-dropdown {

  border-radius: 8px;
  background: var(--Gray-100, #F8F9FA);

  /* Regular Shadow */
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);

  /* depois volto aqui */
  border-bottom: 1px solid #ccc;


}

.input-field,
.suggestion-overlay {


  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;

  /* layout */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;

  /* Typography */
  overflow: hidden;
  color: var(--Body-Text-Body-Color, #212529);
  text-overflow: ellipsis;

  /* Body/Small/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  /* 21px */
}

.input-field {

  border: none;
  z-index: 1;

}

.suggestion-overlay {

  /* alinhar texto digitado com sugestão */
  position: absolute;
  pointer-events: none;
  z-index: 2;
  background: transparent;

}

.invisible {
  visibility: hidden;
}

.highlight {
  color: #bbb;
}

.suggestion-text {}



.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;

}

.clean-button,
.search-button {
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 10px;

  background: none;
  border: none;
}

.clean-button {}

.clean-button-hidden {
  display: none;

}

.search-button {}

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

.button-debug {
  display: none;
}
</style>
