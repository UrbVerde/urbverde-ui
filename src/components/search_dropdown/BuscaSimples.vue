<template>
  <div class="search-wrapper">
    <div :class="{ 'input-container': !dropdown, 'input-container-dropdown': dropdown }">
      <div class="input-overlay">
        <input ref="inputField" v-model="inputValue" @keyup="keydown" @focus="handleFocus" @keydown.enter="handleEnter"
          placeholder="Digite um cidade ou estado brasileiro" class="input-field" />
        <div v-if="highlightedText" class="suggestion-overlay">
          <span class="suggestion-text">
            <span class="invisible">{{ visibleInput }}</span><span class="highlight">{{ highlightedText }}</span>
          </span>

        </div>
      </div>
      <div class="button-container">
        <button :class="{ 'clean-button': inputValue !== '', 'clean-button-hidden': inputValue === '' }"
          @click="clearInput">
          <img id="imgIcon" src="../icons/clean.svg" width="16" height="16" /> </button>
        <button class="search-button" @click="clearHistory"> <img id="imgIcon" src="../icons/search.svg" width="16"
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

    <div :class="{ 'suggestion-container': dropdown, 'suggestion-container-hidden': !dropdown }">
      <div class="filter-container">
        <span class="filter-text">Buscar por:</span>
        <div class="filter-button-container">
          <button :class="{ 'filter-button': !filterAll, 'filter-button-active': filterAll }"
            @click="toggleAll">Todos</button>
          <button :class="{ 'filter-button': !filterCity, 'filter-button-active': filterCity }"
            @click="toggleCity">Municípios</button>
          <button :class="{ 'filter-button': !filterState, 'filter-button-active': filterState }"
            @click="toggleState">Estados</button>
        </div>
      </div>

      <ul v-if="dropdown" class="suggestions-list" ref="dropdown">
        <li class="suggestion-item" v-for="(suggestion, index) in visibleSuggestions" :key="suggestion"
          @click="selectSuggestion(suggestion)" tabindex="0" @keydown.enter="selectSuggestion(suggestion)"
          @keydown.up.prevent="focusPreviousSuggestion(index)" @keydown.down.prevent="focusNextSuggestion(index)"
          :ref="`suggestionItem-${index}`">
          {{ suggestion.text }}
        </li>
      </ul>
    </div>
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
      locationChosen: '',
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
      filterAll: true,
      filterCity: false,
      filterState: false,
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
    filteredSuggestions() {
      if (this.filterAll) {
        return this.suggestions;
      } else if (this.filterCity) {
        return this.suggestions.filter(suggestion => suggestion.type === 'city');
      } else if (this.filterState) {
        return this.suggestions.filter(suggestion => suggestion.type === 'state');
      }
      return this.suggestions; // fallback para todos os casos
    },
    visibleSuggestions() {
      return this.filteredSuggestions.slice(0, 5);
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
      const inputContainer = this.$el.querySelector('.input-container, .input-container-dropdown');
      const dropdown = this.$refs.dropdown;
      const suggestionContainer = this.$el.querySelector('.suggestion-container');

      if ((inputContainer && !inputContainer.contains(event.target)) &&
        (dropdown && !dropdown.contains(event.target)) &&
        (suggestionContainer && !suggestionContainer.contains(event.target))) {
        this.dropdown = false;
      }
    },

    handleFocus(event) {
      if (this.dropdown != true) {

        this.dropdown = true;


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



      if (this.inputValue === '') {
        this.generateDefaultSuggestions();
        this.highlightedText = '';
        return;
      }

      const inputLower = this.inputValue.toLowerCase();
      const historySuggestions = this.filterHistory(inputLower);
      const stateSuggestions = this.filterStates(inputLower);
      const citySuggestions = this.filterCities(inputLower);

      this.suggestions = [
        ...historySuggestions.map(item => ({ text: item, type: 'history' })),
        ...stateSuggestions.map(item => ({ text: item, type: 'state' })),
        ...citySuggestions.map(item => ({ text: item, type: 'city' }))
      ];

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
      if (this.visibleSuggestions.length > 0) {
        const firstSuggestion = this.visibleSuggestions[0].text;
        if (firstSuggestion.toLowerCase().startsWith(this.inputValue.toLowerCase())) {
          this.visibleInput = this.inputValue;
          this.highlightedText = firstSuggestion.slice(this.inputValue.length);
        } else {
          this.highlightedText = '';
        }
      } else {
        this.highlightedText = '';
      }
    },


    selectSuggestion(suggestion) {
      this.inputValue = suggestion.text;
      this.visibleInput = suggestion.text;
      this.highlightedText = '';
      this.addToHistory(suggestion.text);
      this.dropdown = false;

      this.locationChosen = suggestion.text;
      this.submit();
    },

    submit() {
      if (this.inputValue) {

        this.addToHistory(this.suggestions[0]);
        this.locationChosen = this.suggestions[0];

      }
      //this.suggestions = [];
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

    clearInput() {
      this.suggestions = [];
      this.generateDefaultSuggestions();
      this.inputValue = '';
      this.highlightedText = '';

      if (!this.dropdown) {
        this.dropdown = true;
      }


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

      if (international || city === "error" || state === "error") {
        defaultSuggestions = [
          { text: "Rio de Janeiro - RJ", type: "city" },
          { text: "São Paulo", type: "state" },
          { text: "Brasil", type: "country" }
        ];
      } else {
        defaultSuggestions = [
          { text: `${city} - ${stateAbbreviation}`, type: "city" },
          { text: state, type: "state" },
          { text: "Brasil", type: "country" }
        ];
      }

      const historySuggestions = this.searchHistory
        .slice(0, 2)
        .filter(item => !defaultSuggestions.some(def => def.text === item))
        .map(item => ({ text: item, type: "history" }));

      this.suggestions = [...historySuggestions, ...defaultSuggestions];
      this.updateHighlightedText();
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
    },

    toggleAll() {
      this.filterAll = true;
      this.filterCity = false;
      this.filterState = false;
      if (this.inputValue != '') {
        this.updateHighlightedText();
      }
    },

    toggleCity() {
      this.filterAll = false;
      this.filterCity = true;
      this.filterState = false;
      if (this.inputValue != '') {
        this.updateHighlightedText();
      }
    },

    toggleState() {
      this.filterAll = false;
      this.filterCity = false;
      this.filterState = true;
      if (this.inputValue != '') {
        this.updateHighlightedText();
      }
    },

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

.search-wrapper {
  position: relative;
  width: 100%;
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
  z-index: 1;
  /* Garante que o input fique acima do restante */

}

.input-container {

  border-radius: 99px;
  background: var(--Gray-100, #F8F9FA);

  /* Small Shadow */
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);

}

.input-container-dropdown {

  border-radius: 8px;
  background: var(--Gray-100, #F8F9FA);

  /* Regular Shadow */
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);


}

.input-container-dropdown::after {}

.input-field,
.suggestion-overlay {
  width: 100%;
  white-space: nowrap;

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
  background: var(--Gray-100, #F8F9FA);
  border: none;


}

.input-overlay {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.suggestion-overlay {

  /* alinhar texto digitado com sugestão */
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
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

.filter-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;

  background: var(--HitBox, rgba(255, 255, 255, 0.00));

  /*Typography*/
  color: var(--Theme-Secondary, #6C757D);

  /* Body/Small/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  /* 21px */
}

.filter-button-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;




}

.filter-button,
.filter-button-active {
  display: flex;
  padding: 8px 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;




  border-radius: 99px;

  /* Body/Small/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  /* 21px */
}

.filter-button {

  color: var(--Theme-Secondary, #6C757D);

  background: var(--HitBox, rgba(255, 255, 255, 0.00));

}

.filter-button-active {

  background: var(--Primary-Fade-100, #D2E8DD);
  color: var(--Theme-Primary, #025949);

}

.filter-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;

  background: var(--Gray-100, #F8F9FA);
}


.suggestion-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 24px;


  border: 1px solid #ccc;
  border-left: none;
  border-right: none;
  border-bottom: none;

  padding: 16px 16px 24px 16px;
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);

  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: var(--Gray-100, #F8F9FA);

}

.suggestion-container-hidden {
  display: none;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;



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
