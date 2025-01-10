<!-- urbverde-ui/src/components/search_dropdown/BuscaSimples.vue -->
<template>
  <div class="search-wrapper">
    <GetUserLocation :ip-data-api-key="IPDATA_API_KEY"
                     @location-updated="updateLocationData"
                     @location-error="handleLocationFailure" />

    <div ref="inputContainer"
         :class="{ 'input-container shadow-sm': !dropdown, 'input-container-dropdown shadow': dropdown }"
         @click="activateInput">
      <div class="input-overlay">
        <input ref="inputField"
               v-model="inputValue"
               @input="handleInput"
               @focus="handleFocus"
               @keydown.enter="handleEnter"
               :placeholder="!inputValue && !highlightedText ? 'Buscar um local :)' : ''"
               class="input-field small-regular"
               :disabled="!isInputActive"
               @click="activateInput" />
        <div v-if="highlightedText && inputValue" class="suggestion-overlay small-regular">
          <span class="suggestion-text small-regular">
            <span class="invisible ">{{ visibleInput }}</span>
            <span class="highlight ">{{ highlightedText }}</span>
          </span>
        </div>
      </div>

      <div class="button-container">
        <button :class="{ 'clean-button': inputValue !== '', 'clean-button-hidden': inputValue === '' }"
                @click="clearInput">
          <i class="bi bi-x-lg"
             id="imgIcon"
             width="16"
             height="16"></i>
        </button>

        <button class="search-button" @click.stop="submit">

          <i v-if="!isLoading"
             class="bi bi-search"
             id="imgIcon"
             width="16"
             height="16"></i>
          <div v-else class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </div>

    <div v-if="true" class="button-debug">
      <span>{{ suggestions.length }} sugestão(ões)</span>
      <span>Cache: {{ cachedCities.length }} item(ns)</span>
      <span>Histórico: {{ searchHistory.length }} item(ns)</span>
      <button @click="clearHistory">Limpar Histórico</button>
    </div>

    <div ref="suggestionContainerEl" :class="{ 'suggestion-container shadow': dropdown, 'suggestion-container-hidden': !dropdown }">
      <div class="suggestion-grid">
        <div class="filter-container">
          <div class="filter-button-container" ref="filterButtonContainer">
            <button
              :class="{ 'filter-button small-regular': !filterAll, 'filter-button-active small-medium': filterAll }"
              @click="toggleAll">Todos</button>
            <button
              :class="{ 'filter-button small-regular': !filterCity, 'filter-button-active small-medium': filterCity }"
              @click="toggleCity">Municípios</button>
            <button
              :class="{ 'filter-button small-regular': !filterState, 'filter-button-active small-medium': filterState }"
              @click="toggleState">Estados</button>
          </div>
        </div>

        <ul v-if="dropdown" class="suggestions-list" ref="dropdownEl">
            <li :class="{ 'suggestion-item': true, 'first-suggestion': inputValue !== '' && index === 0 }"
              v-for="(suggestion, index) in visibleSuggestions"
              :key="suggestion"
              @click="selectSuggestion(suggestion)"
              tabindex="0"
              @keydown.enter="selectSuggestion(suggestion)"
              @keydown.up.prevent="focusPreviousSuggestion(index)"
              @keydown.down.prevent="focusNextSuggestion(index)"
              :ref="`suggestionItem-${index}`">

            <i :class=getImageSource(suggestion.type)
               id="imgIcon"
               width="20"
               height="20"></i>

            <span class="item-text small-regular">
              <span class="text-highlight">{{ getMatchedPart(suggestion.text) }}</span>
              <span>{{ getUnmatchedPart(suggestion.text) }}</span>
            </span>
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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, onBeforeUpdate, onUpdated } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import GetUserLocation from './GetUserLocation.vue';
import { API_URLS } from '@/constants/endpoints';

const IPDATA_API_KEY = import.meta.env.VITE_IPDATA_API_KEY;

const emit = defineEmits(['location-updated', 'location-error', 'api-error', 'menu-interaction']);
// const props = defineProps({
//   IPDATA_API_KEY: String
// });

// All this shouldnt be hardcorded here in the next versions (!)
const states = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins', 'Brasil'
];

/* ------------ Reactive State ------------ */
const isLoading = ref(false);
const inputValue = ref('');
const locationData = ref(null);
const isInputActive = ref(true);
const suggestions = ref([]);
const dropdown = ref(false);
const coordinates = ref(null);
const previousInputValue = ref('');
const visibleInput = ref('');
const highlightedText = ref('');
const locationChosen = ref('');
const cachedCities = ref([]);
const cachedCityData = ref({});
const searchHistory = ref([]);
const debug = ref(false);

// Filter States
const filterAll = ref(true);
const filterCity = ref(false);
const filterState = ref(false);

// Keep track of codes for quick lookups: { "City - ST": code, "City": code }
const codes = ref({});

// showSuggestions: false, // Controla a exibição das sugestões
// lastInputLength: 0,
// // isDragging: false,
// startX: 0,
// scrollLeft: 0,
// IPDATA_API_KEY: import.meta.env.VITE_IPDATA_API_KEY,
// defaultCoordinates: null, // { lat: -23.30958993100988, lng: -51.36049903673405 }, //Rolândia

/* ------------ Lifecycle ------------ */
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  // //this.debouncedFetchCities = debounce(this.fetchCities, 100);
  loadSearchHistory();
  // generateDefaultSuggestions();
  updateSuggestions();

  // Show dropdown after 2s delay
  setTimeout(() => {
    if (!dropdown.value && inputValue.value === '') {
      dropdown.value = true;
      activateInput();
    }
  }, 2000);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  // //const filterButton = this.$refs.filterButtonContainer;
});

/* ------------ Computed Properties ------------ */
const filteredSuggestions = computed(() => {
  if (filterAll.value) {
    return suggestions.value;
  }
  else if (filterCity.value) {
    return suggestions.value.filter(
      suggestion =>
        suggestion.type === 'city' ||
        (suggestion.type === 'history' && !states.includes(suggestion.text))
    );
  }
  else if (filterState.value) {
    return suggestions.value.filter(
      suggestion =>
        suggestion.type === 'state' ||
        (suggestion.type === 'history' && states.includes(suggestion.text))
    );
  }

  return suggestions.value;
});

const visibleSuggestions = computed(() => {
  const list = filteredSuggestions.value;

  // Find first state suggestion
  const firstStateIndex = list.findIndex(s => s.type === 'state');
  if (firstStateIndex === -1) {
    // No states found, return first 5 items
    return list.slice(0, 5);
  }
  // separate cities from states
  const citiesBefore = list.slice(0, firstStateIndex);
  const statesAfter = list.slice(firstStateIndex);

  // ensure at least one state
  const totalItems = Math.min(5, list.length);
  const citiesCount = Math.min(citiesBefore.length, totalItems - 1); // Reserve 1 spot for state

  return [
    ...citiesBefore.slice(0, citiesCount),
    ...statesAfter.slice(0, totalItems - citiesCount),
  ];
});

/* ------------ Methods (Composition Functions) ------------ */
function selectSuggestion(suggestion) {
  inputValue.value = suggestion.text;
  visibleInput.value = suggestion.text;
  highlightedText.value = '';
  dropdown.value = false;
  locationChosen.value = suggestion.text;

  loadAnimation();
  addToHistory(suggestion.text);
  updateSuggestions();

  const { city } = parseCityState(suggestion.text);
  const locationStore = useLocationStore();
  locationStore.setLocation({
    nm_mun: city,
    cd_mun: codes.value[suggestion.text],
  });

  fetchCoordinates(locationChosen.value);
}
function activateInput() {
  isInputActive.value = true;
  // emit('menu-interaction'); // Emit event for menu interaction
  nextTick(() => {
    if (inputField.value) {inputField.value.focus();}
  });
}

function handleFocus(event) {
  if (!dropdown.value) {
    dropdown.value = true;
    // emit('menu-interaction'); // Emit when dropdown opens
  }
  event.stopPropagation();
}

async function loadAnimation() {
  if (!inputValue.value) {
    alert('Por favor, insira um local.');

    return;
  }
  isLoading.value = true; // spinner on
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));  // Simulates an API call or submission logic
    // console.log('Busca concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a busca:', error);
  } finally {
    isLoading.value = false; // spinner off
  }
}

function getMatchedPart(text) {
  if (!inputValue.value) {return '';}
  const input = inputValue.value.toLowerCase();
  const suggestion = text.toLowerCase();

  return suggestion.startsWith(input)
    ? text.substring(0, inputValue.value.length)
    : '';
}

function getUnmatchedPart(text) {
  if (!inputValue.value) {return text;}
  const input = inputValue.value.toLowerCase();
  const suggestion = text.toLowerCase();

  return suggestion.startsWith(input)
    ? text.substring(inputValue.value.length)
    : text;
}

// Update the location data handler to preserve existing data when appropriate
function updateLocationData(location) {
  // If geolocation or no locationData yet, override
  if (location.source === 'geolocation' || !locationData.value) {
    locationData.value = location;
    // console.log('Location updated from:', location.source);
    cacheCities([location.city]);
    generateDefaultSuggestions();
  }
  else if (!locationData.value.city) {
    // If we don't have a city yet
    locationData.value = location;
    // console.log('Initial location set from:', location.source);
    cacheCities([location.city]);
    generateDefaultSuggestions();
  }
}

function parseCityState(text) {
  // Check if the text contains a state abbreviation
  const parts = text.split(' - ');
  //alert(parts[0]);//está sendo chamado 3x
  if (parts.length === 2) {
    return {
      city: parts[0],
      state: parts[1],
    };
  }

  return { city: text, state: null };
}

// gambiarra momentânea, deverá ser tudo feito pela API
async function fetchCities(query) {
  try {
    // quick fix for city without state abbreviation
    const { city } = parseCityState(query);
    // const response = await fetch(`/v1/address/suggestions?query=${city}`); // Local MSW
    const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${city}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      suggestions.value = [{ text: 'No Results', type: 'noresults' }];

      return;
    }

    suggestions.value = data.map(item => ({
      text: item.state_abbreviation
        ? `${item.display_name} - ${item.state_abbreviation}`
        : item.display_name,
      lat: item.coordinates?.lat,
      lng: item.coordinates?.lng,
      type: 'city',
      // Include other necessary fields if required
    }));

    data.forEach(item => {
      const displayName = item.state_abbreviation
        ? `${item.display_name} - ${item.state_abbreviation}`
        : item.display_name;

      cachedCityData.value[displayName] = {
        code: item.cd_mun,
        type: 'city',
        lat: item.coordinates?.lat,
        lng: item.coordinates?.lng,
      };

      cachedCityData.value[item.display_name] = {
        code: item.cd_mun,
        type: 'city',
        lat: item.coordinates?.lat,
        lng: item.coordinates?.lng,
      };

      codes.value[displayName] = item.cd_mun;
      codes.value[item.display_name] = item.cd_mun;
    });

    suggestions.value = data.map(item => ({
      text: item.state_abbreviation
        ? `${item.display_name} - ${item.state_abbreviation}`
        : item.display_name,
      type: 'city'
    }));

    const newCities = data.map(item =>
      item.state_abbreviation
        ? `${item.display_name} - ${item.state_abbreviation}`
        : item.display_name
    );
    cachedCities.value = [...new Set([...cachedCities.value, ...newCities])];

    // if (!data || data.length === 0) {
    //   suggestions.value = [{ text: 'No Results', type: 'noresults' }];
    //   return;
    // }

    // data.forEach(item => {
    //   const displayName = item.state_abbreviation
    //     ? `${item.display_name} - ${item.state_abbreviation}`
    //     : item.display_name;

    // store in cache
    // cachedCityData.value[displayName] = {
    //   code: item.cd_mun,
    //   type: 'city',
    //   lat: item.coordinates?.lat,
    //   lng: item.coordinates?.lng,
    // };

    // also store without abbreviation (???)
    // cachedCityData.value[item.display_name] = {
    //   code: item.cd_mun,
    //   type: 'city',
    //   lat: item.coordinates?.lat,
    //   lng: item.coordinates?.lng,
    // };
    // });

    // update codes
    // const newCodes = data.reduce((acc, item) => {
    //   const displayName = item.state_abbreviation
    //     ? `${item.display_name} - ${item.state_abbreviation}`
    //     : item.display_name;
    //   acc[displayName] = item.cd_mun; // with state
    //   acc[item.display_name] = item.cd_mun; // without state
    //   return acc;
    // }, {});

    // codes.value = { ...codes.value, ...newCodes };

    // // update cached cities list
    // const newCities = data.map(item =>
    //   item.state_abbreviation
    //     ? `${item.display_name} - ${item.state_abbreviation}`
    //     : item.display_name
    // );
    // cachedCities.value = [...new Set([...cachedCities.value, ...newCities])];

    // persist to localStorage
    localStorage.setItem('cachedCityData', JSON.stringify(cachedCityData.value));
    // console.log('Cached city data:', cachedCityData);
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
}

async function fetchCoordinates(address) {
  // Parse the address to get city name without state abbreviation
  const { city } = parseCityState(address);
  const cached = cachedCityData.value[address];

  // If already cached with coords, skip API
  if (cached && cached.lat && cached.lng) {
    coordinates.value = { lat: cached.lat, lng: cached.lng };
    emitLocationUpdate({
      lat: cached.lat,
      lng: cached.lng,
      code: cached.code.toString(),
      type: cached.type,
    });

    return;
  }
  // Otherwise, if you must still fetch from API (for the lat/lng):
  try {
    let codeValue = codes.value[address];
    if (!codeValue) {
      await fetchCities(city);
      codeValue = codes.value[address];
      if (!codeValue) {
        handleLocationFailure();
        console.error('Code not found for:', address);

        return;
      }
    }

    // Use the mock API with code
    const response = await fetch(`${API_URLS.SUGGESTIONS}?query=${codeValue}`);
    const data = await response.json();

    if (data && data.length > 0) {
      if (data[0].error) {
        handleLocationFailure();
        console.error('Location error:', data[0].error);

        return;
      }
      const loc = data[0].coordinates;
      if (loc && loc.lat && loc.lng) {
        coordinates.value = { lat: loc.lat, lng: loc.lng };
        emitLocationUpdate({
          ...coordinates.value,
          code: codeValue,
          type: 'city',
        });
      } else {
        handleLocationFailure();
        console.error('Invalid coordinates in response');
      }
    } else {
      handleLocationFailure();
      console.error('No coordinates found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    handleLocationFailure();
  }
}

function handleLocationFailure() {
  coordinates.value = null;
  emitLocationUpdate(null);
  // emit('api-error') if you want a global event
  // emit('location-updated', null);
}

function focusPreviousSuggestion(index) {
  if (index > 0) {
    const previousItem = suggestionItems.value[index - 1];
    if (previousItem) {
      previousItem.focus();
    }
  }
}

function focusNextSuggestion(index) {
  if (index < visibleSuggestions.value.length - 1) {
    const nextItem = suggestionItems.value[index + 1];
    if (nextItem) {
      nextItem.focus();
    }
  }
}

function handleClickOutside(event) {
  const container = inputContainer.value;
  const drop = dropdownEl.value;
  const suggestionContainer = suggestionContainerEl.value;

  if (
    container &&
    !container.contains(event.target) &&
    drop &&
    !drop.contains(event.target) &&
    suggestionContainer &&
    !suggestionContainer.contains(event.target)
  ) {
    dropdown.value = false;
  }
}

function cacheCities(citiesArr) {
  cachedCities.value = [...new Set([...cachedCities.value, ...citiesArr])];
  updateSuggestions();
}

function handleInput() {
  if (inputValue.value !== previousInputValue.value) {
    dropdown.value = inputValue.value !== '';
    updateSuggestions();
    // this.previousInputValue = this.inputValue;
  }
}

async function updateSuggestions(forceUpdate = false) {
  // alert('updateSuggestions');
  if (!forceUpdate && inputValue.value === previousInputValue.value) {return;}
  // Only proceed if input actually changed
  if (inputValue.value === '') {
    generateDefaultSuggestions();
    highlightedText.value = '';

    return;
  }
  try {
    // Make the API call
    await fetchCities(inputValue.value);
    const inputLower = inputValue.value.toLowerCase();

    // Build suggestion arrays
    const historySuggestions = filterHistory(inputLower);
    const stateSuggestions = filterStates(inputLower);
    const citySuggestions = filterCities(inputLower);

    // this.previousInputValue = this.inputValue; // Update previous value

    suggestions.value = [
      ...historySuggestions.map(item => ({ text: item, type: 'history' })),
      ...citySuggestions.map(item => ({ text: item, type: 'city' })),
      // { type: 'separator' }, // Add separator after history items
      ...stateSuggestions.map(item => ({ text: item, type: 'state' })),
    ];

    // Update these after everything is done
    previousInputValue.value = inputValue.value;
    updateHighlightedText();
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
}

function filterHistory(query) {
  return searchHistory.value.filter(item => item.toLowerCase().startsWith(query));
}

function filterStates(query) {
  return states.filter(
    state =>
      state.toLowerCase().startsWith(query) &&
      !searchHistory.value.includes(state)
  );
}

function filterCities(query) {
  return cachedCities.value.filter(
    city =>
      city.toLowerCase().startsWith(query) &&
      !searchHistory.value.includes(city)
  );
}

function updateHighlightedText() {
  if (visibleSuggestions.value.length > 0 && inputValue.value) {
    const first = visibleSuggestions.value[0].text;
    if (first.toLowerCase().startsWith(inputValue.value.toLowerCase())) {
      visibleInput.value = inputValue.value;
      highlightedText.value = first.slice(inputValue.value.length);

      return;
    }
  }
  highlightedText.value = '';
}

function submit() {
  // If there's user input
  if (inputValue.value) {
    // locationChosen -> first suggestion
    const suggestion = suggestions.value[0];
    if (suggestion && suggestion.text) {
      loadAnimation();
      addToHistory(suggestion.text);

      inputValue.value = suggestion.text;
      visibleInput.value = suggestion.text;
      highlightedText.value = '';
      dropdown.value = false;
      locationChosen.value = suggestion.text;

      updateSuggestions();
      fetchCoordinates(locationChosen.value);
    }
  } else {
    // If no input, just restore from locationChosen if present
    if (locationChosen.value) {
      fetchCoordinates(locationChosen.value);
      loadAnimation();
      inputValue.value = locationChosen.value;
      visibleInput.value = locationChosen.value;
      highlightedText.value = '';
      dropdown.value = false;
    } else {
      // Show dropdown if user tries to submit with empty input
      isInputActive.value = true;
      dropdown.value = true;
      alert('Por favor, insira um local.');
    }
  }
}

// Chama a função para buscar coordenadas
function handleEnter() {
  if (suggestions.value.length > 0) {
    selectSuggestion(suggestions.value[0]);
    if (inputField.value) {inputField.value.blur();}
    submit();
  }
}

function addToHistory(item) {
  const itemLower = item.toLowerCase();
  const historyLower = searchHistory.value.map(h => h.toLowerCase());

  if (!historyLower.includes(itemLower)) {
    searchHistory.value.unshift(item);
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop();
    }
    saveSearchHistory();
  }
}

function saveSearchHistory() {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
}

function clearHistory() {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
  alert('Histórico limpo com sucesso!');
}

function clearInput() {
  suggestions.value = [];
  generateDefaultSuggestions();
  inputValue.value = '';
  highlightedText.value = '';
  if (!dropdown.value) {dropdown.value = true;}
}

function loadSearchHistory() {
  const savedHistory = localStorage.getItem('searchHistory');
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory);
  }
  const savedCache = localStorage.getItem('cachedCityData');
  if (savedCache) {
    cachedCityData.value = JSON.parse(savedCache);
  }
}

function generateDefaultSuggestions() {
  if (!locationData.value) {return;}
  const { city, state, stateAbbreviation } = locationData.value;
  // let defaultSuggestions = [];
  // if (international || city === 'error' || state === 'error' || city === null) {
  //   // Pre-defined default suggestions
  //   const defaultCity = 'Rio de Janeiro - RJ';
  //   // Fetch the data for Rio de Janeiro if not already cached
  //   if (!this.cachedCityData[defaultCity]) {
  //     this.fetchCities('Rio de Janeiro');
  //   }
  // }
  // If you have a fallback city, you can define it here:
  // alert(stateAbbreviation);
  suggestions.value = [
    { text: `${city} - ${stateAbbreviation || state}`, type: 'city' },
    { text: state, type: 'state' },
    { text: 'Brasil', type: 'country' },
  ];

}

function getImageSource(type) {
  return type === 'history' ? 'bi bi-clock-history' : 'bi bi-geo-alt';
}

function toggleAll() {
  filterAll.value = true;
  filterCity.value = false;
  filterState.value = false;
  updateHighlightedText();
  dropdown.value = true;
  // if (this.inputValue !== '') {
  //   this.updateHighlightedText();
  // }
}

function toggleCity() {
  filterAll.value = false;
  filterCity.value = true;
  filterState.value = false;
  if (inputValue.value !== '') {
    updateHighlightedText();
  }
}

function toggleState() {
  filterAll.value = false;
  filterCity.value = false;
  filterState.value = true;
  if (inputValue.value !== '') {
    updateHighlightedText();
  }
}

// getCachedData() {
//     return {
//       city: localStorage.getItem('cachedCity'),
//       state: localStorage.getItem('cachedState'),
//       stateAbbreviation: localStorage.getItem('cachedStateAbbreviation'),
//       international: localStorage.getItem('cachedInternational') === 'true',
//       latitude: localStorage.getItem('cachedLatitude'),
//       longitude: localStorage.getItem('cachedLongitude'),
//     };
//   },

// Helper to emit location-updated event from script setup
// We can’t use defineEmits directly in the child and pass to child of child
// so we do an old-fashioned dispatch approach or a direct parent bus event.
function emitLocationUpdate(payload) {
  // If you want to communicate to parent, defineEmits:
  // For example:
  // const emit = defineEmits(['location-updated','api-error']);
  // emit('location-updated', payload);
  //
  // Or for your code sample:
  emit('location-updated', payload);
}
// this.suggestions = [];

/* ------------ Template Refs ------------ */

// Refs for DOM elements
const inputField = ref(null);
const dropdownEl = ref(null);
const inputContainer = ref(null);
const suggestionContainerEl = ref(null);
const suggestionItems = ref([]);

// On each update, re-map the suggestion items
onBeforeUpdate(() => {
  suggestionItems.value = [];
});

onUpdated(() => {
  suggestionItems.value = visibleSuggestions.value.map(
    (_, i) => document.querySelector(`[ref="suggestionItem-${i}"]`)
  );
});

/*
  The code above tries to approximate your event system.
  If you want to define emits at the top:
  ----------------------------------------------------------------------------------
  const emit = defineEmits(['location-updated', 'location-error', 'api-error', 'menu-interaction']);
  function emitLocationUpdate(payload) {
    emit('location-updated', payload);
  }
  function handleLocationFailure() {
    coordinates.value = null;
    emit('location-updated', null);
    emit('api-error');
  }
  ----------------------------------------------------------------------------------
  Then replace the customEvent logic with direct `emit` calls.
*/
</script>

<style scoped>
  #imgIcon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
  }

  /* Base layout */
  .search-wrapper {
    position: relative;
    width: 100%;
  }

  /* Input containers */
  .input-container,
  .input-container-dropdown {
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    height: 48px;
    padding: 0px 16px 0px 24px;
    /* 0px 9px 0px 16px;  */
    position: relative;
    z-index: 1;
    cursor: default;
    /* user-select: none; */
  }

  .input-container {
    border-radius: 99px;
    background: var(--Gray-100, #F8F9FA);

  }

  .input-container-dropdown {
    border-radius: 99px;
    background: var(--Gray-100, #F8F9FA);
    outline: 2px solid #418377;
    outline-offset: -2px;
    user-select: none;
    cursor: default;
  }

  /* Input and overlay */
  .input-field,
  .suggestion-overlay {
    width: 100%;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    color: var(--Body-Text-Body-Color, #212529);
    text-overflow: ellipsis;
    padding: 0;
  }

  .input-field {
    background: var(--Gray-100, #F8F9FA);
    border: none;
    outline: none;
    user-select: none;
    cursor: text;
  }

  .input-overlay {
    position: relative;
    flex: 1;
    overflow: hidden;
    border: none;
    display: flex;
    align-items: center;
  }

  .suggestion-overlay {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    background: transparent;
  }

  /* Text styles */
  .invisible {
    visibility: hidden;
  }

  .highlight {
    color: var(--Gray-500, #ADB5BD);

    color: var(--Gray-500, #ADB5BD);
  }

  .text-highlight {
    font-weight: bold;
  }

  /* Buttons */
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

  /* Filter buttons */
  .filter-button-container {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
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
    padding: 8px;
    gap: 10px;
    border-radius: 99px;
    opacity: 0px;
  }

  .filter-button {
    color: var(--Theme-Secondary, #525960);
    background: var(--Gray-100, #F8F9FA);
  }

  .filter-button-active {
    background: var(--Primary-Fade-100, #D2E8DD);
    color: var(--Theme-Primary, #025949);
  }

  /* Filter container */
  .filter-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  }

  /* Suggestion container */
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
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    background: var(--Gray-100, #F8F9FA);
  }

  .suggestion-container-hidden {
    display: none;
  }

  /* Suggestion grid */
  .suggestion-grid {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    padding: 16px 16px 24px 16px;
    gap: 24px;

  }

  /* Suggestions list */
  .suggestions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    cursor: pointer;
  }

  .suggestions-list li:hover {
    background-color: #E9ECEF;

  }

  .first-suggestion {
    background-color: #E9ECEF !important;
  }

  .suggestion-item {
    width: 100%;
    display: flex;
    height: 40px;
    padding: 8px 8px;
    /* 0px 8px; */
    align-items: center;
    gap: 10px;
    /* This gap is for internal elements like icon and text */
    align-self: stretch;
    border-radius: 4px;
    background-color: transparent;
  }

  .suggestion-item[data-type="separator"] {
    height: 1px;
    background-color: #E9ECEF;
    margin: 0px 0;
    padding: 0;
  }

  .item-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    color: var(--Body-Text-Body-Color, #212529);
    text-overflow: ellipsis;
    /* Body/Small/Regular
      font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    /* 21px */
  }

  /* Icons */
  .suggestion-item .bi {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .button-container .bi {
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  /* Loading */
  .spinner-border {
    width: 16px;
    height: 16px;
    color: var(--Theme-Primary, #025949);
    border-width: 2px;
  }

  /* Debug elements */
  .button-debug {
    display: none;
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
