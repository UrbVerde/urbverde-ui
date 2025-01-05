<!-- urbverde-ui/src/components/search_dropdown/BuscaSimples.vue -->
<template>
  <div class="search-wrapper">

    <search-user-location @location-updated="updateLocationData" />
    
    <div :class="{ 'input-container shadow-sm': !dropdown, 'input-container-dropdown shadow': dropdown }">
      <div class="input-overlay">
        <input ref="inputField" v-model="inputValue" @input="handleInput" @focus="handleFocus"
          @keydown.enter="handleEnter" :placeholder="!inputValue && !highlightedText ? 'Procure um local :)' : ''"
          class="input-field small-regular" />
        <div v-if="highlightedText && inputValue" class="suggestion-overlay small-regular">
          <span class="suggestion-text">
            <span class="invisible small-regular">{{ visibleInput }}</span>
            <span class="highlight small-regular">{{ highlightedText }}</span>
          </span>
        </div>
      </div>

      <div class="button-container">
        <button
          :class="{ 'clean-button': inputValue !== '', 'clean-button-hidden': inputValue === '' }"
          @click="clearInput"
        >
          <img
            id="imgIcon"
            src="../../assets/icons/clean.svg"
            width="16"
            height="16"
          />
        </button>

        <button class="search-button" @click="submit">
          <img
            id="imgIcon"
            src="../../assets/icons/search.svg"
            width="16"
            height="16"
          />
        </button>
      </div>
    </div>

    <div v-if="debug" class="button-debug">
      <span>{{ suggestions.length }} sugestão(ões)</span>
      <span>Cache: {{ cachedCities.length }} item(ns)</span>
      <span>Histórico: {{ searchHistory.length }} item(ns)</span>
      <button @click="clearHistory">Limpar Histórico</button>
    </div>

    <div :class="{ 'suggestion-container shadow': dropdown, 'suggestion-container-hidden': !dropdown }">
      <div class="suggestion-grid">
        <div class="filter-container">
          <div class="filter-button-container" ref="filterButtonContainer" @mousedown="startDrag" @mousemove="onDrag"
            @mouseup="endDrag" @mouseleave="endDrag">
            <button :class="{ 'filter-button small-regular': !filterAll, 'filter-button-active small-medium': filterAll }"
              @click="toggleAll">Todos</button>
            <button :class="{ 'filter-button small-regular': !filterCity, 'filter-button-active small-medium': filterCity }"
              @click="toggleCity">Municípios</button>
            <button :class="{ 'filter-button small-regular': !filterState, 'filter-button-active small-medium': filterState }"
              @click="toggleState">Estados</button>
          </div>
        </div>


        <ul v-if="dropdown" class="suggestions-list" ref="dropdown">
          <li class="suggestion-item" v-for="(suggestion, index) in visibleSuggestions" :key="suggestion"
            @click="selectSuggestion(suggestion)" tabindex="0" @keydown.enter="selectSuggestion(suggestion)"
            @keydown.up.prevent="focusPreviousSuggestion(index)" @keydown.down.prevent="focusNextSuggestion(index)"
            :ref="`suggestionItem-${index}`">
            <img :src="getImageSource(suggestion.type)" width="20" height="20" />
            <span class="item-text small-regular">{{ suggestion.text }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Coordenadas exibidas na tela -->
    <p v-if="debug && coordinates">
      Coordenadas encontradas: Latitude: {{ coordinates.lat }}, Longitude: {{ coordinates.lng }}
    </p>

  </div>
</template>

<script>
import { debounce } from 'lodash';
import axios from 'axios';

import { API_URLS } from '@/constants/endpoints';

import historyIcon from '../../assets/icons/history.svg';
import locationIcon from '../../assets/icons/location.svg';
import SearchUserLocation from './SearchUserLocation.vue';

export default {
  components: {
    SearchUserLocation
  },

  data() {
    return {
      locationData: null,
      defaultCoordinates: null, // { lat: -23.30958993100988, lng: -51.36049903673405 }, //Rolândia
      citiesWithCodes: {}, // Will store { display_name: cd_mun } mapping
      coordinates: null,
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
      showSuggestions: false, // Controla a exibição das sugestões
      debug: false,
      lastInputLength: 0,
      filterAll: true,
      filterCity: false,
      filterState: false,
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
    };
  },


  created() {
    this.debouncedFetchCities = debounce(this.fetchCities, 100);
    this.loadSearchHistory();
    this.generateDefaultSuggestions();
    this.updateSuggestions();
  },


  mounted() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const filterButton = this.$refs.filterButtonContainer;
    // Show dropdown after 2s delay
    setTimeout(() => {
      this.dropdown = true;
      this.dropdown = true;
    }, 2500);
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    const filterButton = this.$refs.filterButtonContainer;
  },


  computed: {
    filteredSuggestions() {
      if (this.filterAll) {
        return this.suggestions;
      } else if (this.filterCity) {
        // Include cities from history and regular city suggestions
        return this.suggestions.filter(suggestion =>
          suggestion.type === 'city' ||
          (suggestion.type === 'history' && !this.states.includes(suggestion.text))
        );
      } else if (this.filterState) {
        return this.suggestions.filter(suggestion =>
          suggestion.type === 'state' ||
          (suggestion.type === 'history' && this.states.includes(suggestion.text))
        );
      }
      return this.suggestions; // fallback para todos os casos
    },
    visibleSuggestions() {
      const suggestions = this.filteredSuggestions;
      
      // Find first state suggestion
      const firstStateIndex = suggestions.findIndex(s => s.type === 'state');
      
      if (firstStateIndex === -1) {
        // No states found, return first 5 items
        return suggestions.slice(0, 5);
      }

      // Get cities before first state
      const citiesBefore = suggestions.slice(0, firstStateIndex);
      // Get states after
      const statesAfter = suggestions.slice(firstStateIndex);

      // Calculate how many items we can show while ensuring at least one state
      const totalItems = Math.min(5, suggestions.length);
      const citiesCount = Math.min(citiesBefore.length, totalItems - 1); // Reserve 1 spot for state

      return [
        ...citiesBefore.slice(0, citiesCount),
        // { type: 'separator' }, // Add separator
        ...statesAfter.slice(0, totalItems - citiesCount)
      ];
    }
  },


  methods: {
    updateLocationData(location) {
      this.locationData = location;
      console.log("Dados de localização atualizados:", location);
      this.cacheCities([location.city]);
    },
    
    async fetchCities(query) {
      try {
        this.clearCache();

        // Keep using the online API for suggestions
        // Change URL if you to use local MSW API instead
        // const response = await fetch(`/v1/address/suggestions?query=${query}`); // Local MSW API
        const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${query}`); // Online API
        const data = await response.json();
        
    // Store both display_name and cd_mun
    this.citiesWithCodes = data.reduce((acc, item) => {
          acc[item.display_name] = item.cd_mun;
          return acc;
        }, {});

        // Update cache with display_names
        const cities = data.map(item => item.display_name);
        this.cachedCities = [...new Set([...this.cachedCities, ...cities])];

      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    },
    
    async fetchCoordinates(address) {
      try {
        // Get the cd_mun from our stored mapping
        const cityCode = this.citiesWithCodes[address];
        
        if (!cityCode) {
          this.handleLocationFailure();
          console.error('City code not found for:', address);
          return;
        }

        // Use the mock API with cd_mun
        const response = await fetch(`/v1/address/suggestions?query=${cityCode}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          if (data[0].error) {
            this.handleLocationFailure();
            console.error('Location error:', data[0].error);
            return;
          }
          
          const location = data[0].coordinates;
          if (location && location.lat && location.lng) {
            const coordinates = { lat: location.lat, lng: location.lng };
            this.coordinates = coordinates;
            // Emit both coordinates and cd_mun
            this.$emit('location-updated', { 
              ...coordinates, 
              cd_mun: cityCode 
            });
          } else {
            this.handleLocationFailure();
            console.error('Invalid coordinates in response');
          }
        } else {
          this.handleLocationFailure();
          console.error('No coordinates found');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        this.handleLocationFailure();
      }
    },
    
    handleLocationFailure() {
      this.coordinates = null;
      this.$emit('location-updated', null);
      this.$emit('api-error');
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
      const inputContainer = this.$el.querySelector('.input-container , .input-container-dropdown ');
      const dropdown = this.$refs.dropdown;
      const suggestionContainer = this.$el.querySelector('.suggestion-container');

      if ((inputContainer && !inputContainer.contains(event.target)) &&
        (dropdown && !dropdown.contains(event.target)) &&
        (suggestionContainer && !suggestionContainer.contains(event.target))) {
        this.dropdown = false;
      }
    },
    handleFocus(event) {
      if (this.dropdown !== true) {
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
    handleInput() {
      if (this.inputValue !== this.previousInputValue) {
        this.updateSuggestions();
        // this.previousInputValue = this.inputValue;
      }
    },

    async updateSuggestions() {
      // Only proceed if input actually changed
      if (this.inputValue === this.previousInputValue) return;

      if (this.inputValue === '') {
        this.generateDefaultSuggestions();
        this.highlightedText = '';
        return;
      }

      try {
        // Make the API call
        await this.fetchCities(this.inputValue);

        // Then update suggestions with everything (including new cities)
        const inputLower = this.inputValue.toLowerCase();
        const historySuggestions = this.filterHistory(inputLower);
        const stateSuggestions = this.filterStates(inputLower);
        const citySuggestions = this.filterCities(inputLower);

        // Fetch cities immediately when input changes
        // Debounce waits 300ms after last keypress before making API call
        // This prevents excessive API calls while typing
        this.debouncedFetchCities(this.inputValue);

        this.previousInputValue = this.inputValue; // Update previous value

        this.suggestions = [
          ...historySuggestions.map(item => ({ text: item, type: 'history' })),
          ...citySuggestions.map(item => ({ text: item, type: 'city' })),
          // { type: 'separator' }, // Add separator after history items
          ...stateSuggestions.map(item => ({ text: item, type: 'state' })),
        ];

        // Update these after everything is done
        this.previousInputValue = this.inputValue;
        this.updateHighlightedText();
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
      // Before: Only fetched cities after 3 characters
      // This was limiting immediate suggestions 
      // Purely based on especulations that the API could overcharge
      // if (this.inputValue.length === 3 && this.lastInputLength !== 3) {
      //   this.fetchCities(this.inputValue);
      //   this.lastInputLength = 3;  // Atualiza o comprimento anterior
      // } else if (this.inputValue.length !== 3 && this.lastInputLength === 3) {
      //   this.lastInputLength = this.inputValue.length;  // Atualiza o comprimento se sair de 3 caracteres
      // }   
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
      if (this.visibleSuggestions.length > 0 && this.inputValue) {
        const firstSuggestion = this.visibleSuggestions[0].text;
        if (firstSuggestion.toLowerCase().startsWith(this.inputValue.toLowerCase())) {
          this.visibleInput = this.inputValue;
          this.highlightedText = firstSuggestion.slice(this.inputValue.length);
          return;
        }
      }
      this.highlightedText = '';
    },
    selectSuggestion(suggestion) {
      this.inputValue = suggestion.text;
      this.visibleInput = suggestion.text;
      this.highlightedText = '';
      this.addToHistory(suggestion.text);
      this.dropdown = false;
      this.locationChosen = suggestion.text;
      this.fetchCoordinates(suggestion.text); // Chama a função para buscar coordenadas
      this.submit();
    },
    submit() {
      if (this.inputValue && this.suggestions.length > 0) {
        const suggestion = this.suggestions[0];
        if (suggestion && suggestion.text) {
          this.locationChosen = suggestion.text;
          // Only add to history if not already handled by selectSuggestion
          if (!this.locationChosen) {
            this.addToHistory(suggestion.text);
          }
        }
      }
      // this.suggestions = [];
    },
    handleEnter() {
      if (this.suggestions.length > 0) {
        this.selectSuggestion(this.suggestions[0]);
        this.$refs.inputField.blur();
        // Removed setTimeout/submit since selectSuggestion already handles it
        // setTimeout(() => {
        //   this.submit();
        // }, 1000);
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
    clearHistory() {//usar para debug no botão search
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

      if (international || city === 'error' || state === 'error' || city === null) {
        defaultSuggestions = [
          { text: 'Rio de Janeiro - RJ', type: 'city' },
          { text: 'São Paulo', type: 'state' },
          { text: 'Brasil', type: 'country' }
        ];
      } else {

        const locationText = `${city} - ${stateAbbreviation}`;
        // Check if location is in history to determine type
        const locationType = this.searchHistory.includes(locationText) ? 'history' : 'city';

        defaultSuggestions = [
          { text: locationText, type: locationType }, // Use the determined type
          { text: state, type: 'state' },
          { text: 'Brasil', type: 'country' }
        ];
      }

      const historySuggestions = this.searchHistory
        .slice(0, 2)
        .filter(item => !defaultSuggestions.some(def => def.text === item))
        .map(item => ({ text: item, type: 'history' }));

      this.suggestions = [...historySuggestions, ...defaultSuggestions];
      this.updateHighlightedText();
    },

    getImageSource(type) {
      return type === 'history' ? historyIcon : locationIcon;
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
      if (this.inputValue !== '') {
        this.updateHighlightedText();
      }
    },
    toggleCity() {
      this.filterAll = false;
      this.filterCity = true;
      this.filterState = false;
      if (this.inputValue !== '') {
        this.updateHighlightedText();
      }
    },
    toggleState() {
      this.filterAll = false;
      this.filterCity = false;
      this.filterState = true;
      if (this.inputValue !== '') {
        this.updateHighlightedText();
      }
    },
    startDrag(event) {
      this.isDragging = true;
      this.startX = event.pageX || event.touches[0].pageX;
      this.scrollLeft = this.$refs.filterButtonContainer.scrollLeft;
    },
    onDrag(event) {
      if (!this.isDragging) { return; }
      const x = event.pageX || event.touches[0].pageX;
      const walk = (x - this.startX) * 1.5; // Ajuste o fator de multiplicação para a velocidade
      this.$refs.filterButtonContainer.scrollLeft = this.scrollLeft - walk;
    },
    endDrag() {
      this.isDragging = false;
    },



  }
}
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
}

.input-container-dropdown {

  border-radius: 99px;
  border-radius: 99px;
  background: var(--Gray-100, #F8F9FA);
  outline: 2px solid #418377;
  outline-offset: -2px;

  outline: 2px solid #418377;
  outline-offset: -2px;



}

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

  padding: 0;
  /* 21px */
}

.input-field {
  background: var(--Gray-100, #F8F9FA);
  border: none;
  outline: none;
}

.input-overlay {
  position: relative;
  flex: 1;
  overflow: hidden;
  border: none;
  border: none;

  display: flex;
  align-items: center;
  /* Alinha verticalmente os elementos */
  align-items: center;
  /* Alinha verticalmente os elementos */

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
  color: var(--Gray-500, #ADB5BD);
  
  color: var(--Gray-500, #ADB5BD);
  
}

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

.clean-button-hidden {
  display: none;

}

.filter-button-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  /*overflow: hidden;
  text-overflow: ellipsis;
  */
  /*overflow: hidden;
  text-overflow: ellipsis;
  */
}

.filter-button,
.filter-button-active {
  /*display: flex;
  /*display: flex;
  padding: 5px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  
*/
border: none;
padding: 8px 8px 8px 8px;
gap: 10px;
border-radius: 99px;
opacity: 0px;
}

.filter-button {

  color: var(--Theme-Secondary, #525960);
  color: var(--Theme-Secondary, #525960);

  background: var(--Gray-100, #F8F9FA);
  background: var(--Gray-100, #F8F9FA);
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
}

.suggestion-container {
  position: absolute;
  border: 1px solid #ffffff;
  border-left: none;
  border-right: none;
  border-bottom: none;
  gap: 0px;
  border-radius: 16px 16px 8px 8px;
  opacity: 0px;
  /*box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);*/
  gap: 0px;
  border-radius: 16px 16px 8px 8px;
  opacity: 0px;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: var(--Gray-100, #F8F9FA);

}

.suggestion-grid {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding: 16px 16px 24px 16px;
  gap: 24px;

}

.suggestion-grid {

  position: relative;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;

  padding: 16px 16px 24px 16px;
  gap: 24px;

}

.suggestion-container-hidden {
  display: none;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
}

.suggestions-list li:hover {
  background-color: #E9ECEF;
}

.suggestion-item {
  display: flex;
  height: 32px;
  padding: 0px 8px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 4px;
}



/* Add this new class */
.suggestion-item[data-type="separator"] {
  height: 1px;
  background-color: #E9ECEF;
  margin: 0px 0;
  padding: 0;
}

.item-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;/*evita quebra de linha*/ 
  -webkit-box-orient: vertical;/*evita quebra de linha*/ 
  -webkit-line-clamp: 1;


  overflow: hidden;
  color: var(--Body-Text-Body-Color, #212529);
  text-overflow: ellipsis;

  
  /* Body/Small/Regular 
    font-family: Inter;

  
  /* Body/Small/Regular 
    font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  /* 21px */
  


  


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
