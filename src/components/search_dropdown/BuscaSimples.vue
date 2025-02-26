<!-- urbverde-ui/src/components/search_dropdown/BuscaSimples.vue -->
<template>
  <GetUserLocation @location-updated="updateLocationData" @location-error="handleLocationFailure" />
  <div class="search-wrapper">
    <div ref="inputContainer"
         :class="{
           'input-container shadow-sm': !dropdown && !isError,
           'input-container-dropdown shadow': dropdown && !isError,
           'input-container-error shake-animation shadow': isError
         }"
         @click="activateInput">
      <div class="input-overlay">
        <input ref="inputField"
               v-model="inputValue"
               @input="handleInput"
               @focus="handleFocus"
               @keydown.enter="handleEnter"
               @keydown="handleKeydown"
               :class="{ 'input-error': isError }"
               :placeholder="!inputValue && !highlightedText ? 'Buscar um local' : ''"
               class="input-field body-small-regular"
               :disabled="!isInputActive"
               @click="activateInput" />
        <div v-if="highlightedText && inputValue" class="suggestion-overlay body-small-regular">
          <span class="suggestion-text body-small-regular">
            <span class="invisible">{{ visibleInput }}</span>
            <span :class="['highlight', { 'highlight-error': isError }]">{{ highlightedText }}</span>
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

    <div ref="suggestionContainerEl"
         :class="{ 'suggestion-container shadow': dropdown, 'suggestion-container-hidden': !dropdown }">
      <div class="suggestion-grid">
        <div class="filter-container">
          <div class="filter-button-container" ref="filterButtonContainer">
            <button
              :class="{ 'filter-button body-small-regular': !filterAll, 'filter-button-active body-small-medium': filterAll }"
              @click="toggleAll">Todos</button>
            <button
              :class="{ 'filter-button body-small-regular': !filterCity, 'filter-button-active body-small-medium': filterCity }"
              @click="toggleCity">Municípios</button>
            <button
              :class="{ 'filter-button body-small-regular': !filterState, 'filter-button-active body-small-medium': filterState }"
              @click="toggleState">Estados</button>
          </div>
        </div>

        <ul v-if="dropdown" class="suggestions-list" ref="dropdownEl">
          <li v-if="suggestions.length === 0 && inputValue.length > 0" class="suggestion-item no-results">
            <i class="bi bi-exclamation-circle"
               id="imgIcon"
               width="20"
               height="20"></i>
            <span class="item-text body-small-regular">Nenhum resultado</span>
          </li>
          <li :class="{ 'suggestion-item': true, 'first-suggestion': inputValue !== '' && index === 0 }"
              v-for="(suggestion, index) in visibleSuggestions"
              :key="suggestion.text"
              @click="selectSuggestion(suggestion)"
              tabindex="0"
              @keydown.enter="selectSuggestion(suggestion)"
              @keydown.up.prevent="focusPreviousSuggestion(index)"
              @keydown.down.prevent="focusNextSuggestion(index)"
              :ref="`suggestionItem-${index}`">

            <i :class="getImageSource(suggestion.type)"
               id="imgIcon"
               width="20"
               height="20"></i>

            <span class="item-text body-small-regular">
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, onBeforeUpdate, watch } from 'vue';
import { useLocationStore } from '@/stores/locationStore';
import GetUserLocation from './GetUserLocation.vue';
import { useRoute } from 'vue-router';

const debug = ref(false);

const props = defineProps({
  openDelay: {
    type: Number,
    default: 0 // 0 means no auto-open
  },
  autoSelectLocation: {
    type: Boolean,
    default: true // Default to true for backward compatibility
  }
});

// Constants
const states = [ // All this shouldnt be hardcorded here in the next versions (!)
  // 'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  // 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  // 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  // 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  // 'Roraima', 'Santa Catarina',
  'São Paulo',
  // 'Sergipe', 'Tocantins', 'Brasil'
];

const emit = defineEmits(['location-updated', 'location-error', 'api-error', 'menu-interaction', 'interaction-succeeded']);

// Refs for DOM elements
const inputField = ref(null);
const dropdownEl = ref(null);
const inputContainer = ref(null);
const suggestionContainerEl = ref(null);
const suggestionItems = ref([]);

// Reactive State
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
const searchHistory = ref([]);
const isError = ref(false);
const errorTimeout = ref(null);
const isTypingBlocked = ref(false);

// Cache tracking
// Keep track of codes for quick lookups: { "City - ST": code, "City": code }
const codes = ref({});

// Lifecycle Hooks
onMounted(async() => {
  document.addEventListener('mousedown', handleClickOutside);
  loadSearchHistory();

  // Initialize from Pinia store if values exist
  const locationStore = useLocationStore();
  const route = useRoute();

  // Check if we have URL parameters first
  if (Object.keys(route.query).length > 0) {
    locationStore.updateFromQueryParams(route.query);
  }

  // Now initialize if we have store values
  if (locationStore.cd_mun && locationStore.nm_mun && locationStore.uf) {
    const cityText = `${locationStore.nm_mun} - ${locationStore.uf}`;
    inputValue.value = cityText;
    visibleInput.value = cityText;
    locationChosen.value = cityText;
    codes.value[cityText] = locationStore.cd_mun;

    // Add to cached cities
    if (!cachedCities.value.includes(cityText)) {
      cachedCities.value.push(cityText);
    }

    // Add to history
    addToHistory(cityText);

    // Fetch coordinates for the stored location
    await fetchCoordinates(cityText);
  } else if (props.openDelay > 0) { // Only proceed if openDelay is greater than 0
    // Show dropdown after delay
    setTimeout(() => {
      if (!dropdown.value && inputValue.value === '') {
        dropdown.value = true;
        activateInput();
      }
    }, props.openDelay);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  clearTimeout(errorTimeout.value);
});

onBeforeUpdate(() => {
  suggestionItems.value = [];
});

// Watch for changes in location store to update component
const locationStore = useLocationStore();
watch(() => [locationStore.cd_mun, locationStore.nm_mun, locationStore.uf],
  ([newCdMun, newNmMun, newUf]) => {
    if (newCdMun && newNmMun && newUf) {
      console.log('Location store updated, updating component');
      const cityText = `${newNmMun} - ${newUf}`;
      inputValue.value = cityText;
      visibleInput.value = cityText;
      locationChosen.value = cityText;
      codes.value[cityText] = newCdMun;

      // Add to cached cities
      if (!cachedCities.value.includes(cityText)) {
        cachedCities.value.push(cityText);
      }

      // Add to history
      addToHistory(cityText);
    }
  }
);
watch(inputValue, (newVal) => {
  if (newVal === '') {
    console.log('Input value is now empty, rebuilding suggestions');
    buildSuggestionsFromHistory();
  }
});
watch(
  () => locationStore.cd_mun,
  (newVal) => {
    // When cd_mun becomes null, the store has been reset
    if (newVal === null) {
      console.log('Location store was reset, clearing component state');
      inputValue.value = '';
      visibleInput.value = '';
      locationChosen.value = '';
      highlightedText.value = '';

      // Update suggestions to default
      buildSuggestionsFromHistory();
    }
  }
);

// Computed Properties
const filterAll = ref(true);
const filterCity = ref(false);
const filterState = ref(false);
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

// Watch for changes in inputValue to reset error state
watch(inputValue, (newVal, oldVal) => {
  if (newVal !== oldVal && isError.value) {
    clearErrorState();

    // Immediately update suggestions when coming out of error state
    updateSuggestions(true);
  }
});

// Core Functions (in order of execution)
function activateInput() {
  isInputActive.value = true;

  // Do not clear input on click, just show dropdown
  dropdown.value = true;

  // Generate suggestions based on current value and history
  if (inputValue.value) {
    // If there's current input, use it to search
    updateSuggestions(true);
  } else {
    // Otherwise show default suggestions including history
    buildSuggestionsFromHistory();
  }

  nextTick(() => {
    if (inputField.value) { inputField.value.focus(); }
  });
}

// Improved function to handle city names with consistent formatting
function normalizeLocationName(location) {
  // If it already contains a state abbreviation (e.g., "City - SP"), return as is
  if (/\s-\s[A-Z]{2}$/.test(location)) {
    return location;
  }

  // If it's a state or country, return as is
  if (states.includes(location) || location === 'Brasil') {
    return location;
  }

  // Try to find this city in cached cities with state abbreviation
  const matchingCity = cachedCities.value.find(city => {
    const parts = city.split(' - ');

    return parts.length === 2 && parts[0].toLowerCase() === location.toLowerCase();
  });

  if (matchingCity) {
    return matchingCity;
  }

  // If we have locationData with stateAbbreviation, use it
  if (locationData.value && locationData.value.stateAbbreviation) {
    return `${location} - ${locationData.value.stateAbbreviation}`;
  }

  // Default case: return as is (will be handled later if possible)
  return location;
}

// function getFullStateName(abbreviation) {
//   if (!abbreviation) { return 'São Paulo'; }

//   const stateMap = {
//     'SP': 'São Paulo',
//     'RJ': 'Rio de Janeiro',
//     'MG': 'Minas Gerais',
//     'RS': 'Rio Grande do Sul',
//     'PR': 'Paraná',
//     'SC': 'Santa Catarina',
//     'BA': 'Bahia',
//     'DF': 'Distrito Federal',
//     'ES': 'Espírito Santo',
//     'GO': 'Goiás',
//     'MA': 'Maranhão',
//     'MT': 'Mato Grosso',
//     'MS': 'Mato Grosso do Sul',
//     'PA': 'Pará',
//     'PB': 'Paraíba',
//     'PE': 'Pernambuco',
//     'PI': 'Piauí',
//     'RN': 'Rio Grande do Norte',
//     'AM': 'Amazonas',
//     'RO': 'Rondônia',
//     'RR': 'Roraima',
//     'SE': 'Sergipe',
//     'TO': 'Tocantins',
//     'AC': 'Acre',
//     'AL': 'Alagoas',
//     'AP': 'Amapá',
//     'CE': 'Ceará'
//   };

//   return stateMap[abbreviation] || abbreviation;
// }

function buildSuggestionsFromHistory() {
  console.log('Building suggestions from history');
  console.log('Current locationChosen:', locationChosen.value);
  console.log('Current locationData:', locationData.value);
  console.log('Current searchHistory:', searchHistory.value);
  console.log('Current cachedCities:', cachedCities.value);

  // Create a set to track unique city names (case-insensitive)
  const addedCities = new Set();
  const suggestionsArray = [];

  // First check if we have a current chosen location
  if (locationChosen.value) {
    const { city } = parseCityState(locationChosen.value);
    console.log('Adding chosen location to suggestions:', locationChosen.value);

    // Always show the current chosen location first with 'city' type
    suggestionsArray.push({
      text: locationChosen.value,
      type: 'city' // Always use 'city' type for current location
    });

    // Track this city as added
    addedCities.add(city.toLowerCase());
  }

  // If we have valid location data from GetUserLocation but no chosen location yet
  // This is the crucial part that needs to be fixed
  if (locationData.value && locationData.value.city && !locationChosen.value) {
    const city = locationData.value.city;
    const stateAbbrev = locationData.value.stateAbbreviation || '';
    const cityWithState = `${city} - ${stateAbbrev}`;

    console.log('Checking geolocation city:', city, 'formatted as:', cityWithState);

    // Only add if not already added
    if (!addedCities.has(city.toLowerCase())) {
      console.log('Adding geolocation city to suggestions:', cityWithState);

      // Add the current geolocation with 'city' type
      suggestionsArray.push({
        text: cityWithState,
        type: 'city'
      });

      // Track this city as added
      addedCities.add(city.toLowerCase());
    } else {
      console.log('Geolocation city already added, skipping');
    }
  } else {
    console.log('No geolocation city available or location already chosen');
  }

  // Add recent history items (excluding already added cities)
  if (searchHistory.value.length > 0) {
    console.log('Processing search history for suggestions');

    // Filter history to exclude cities already added
    const filteredHistory = searchHistory.value.filter(item => {
      const { city } = parseCityState(item);
      const isAdded = addedCities.has(city.toLowerCase());
      if (isAdded) {
        console.log(`History item ${item} already added, skipping`);
      }

      return !isAdded;
    });

    console.log('Filtered history items:', filteredHistory);

    // Take only up to 2 recent history items
    const recentHistory = filteredHistory
      .slice(0, 2)
      .map(item => ({
        text: item,
        type: 'history'
      }));

    console.log('Recent history items to add:', recentHistory);

    // Add history items to suggestions
    suggestionsArray.push(...recentHistory);

    // Track these cities as added
    recentHistory.forEach(item => {
      const { city } = parseCityState(item.text);
      addedCities.add(city.toLowerCase());
    });
  }

  // Always add standard options if not already added
  if (!addedCities.has('são paulo')) {
    suggestionsArray.push({ text: 'São Paulo', type: 'state' });
  }

  suggestionsArray.push({ text: 'Brasil', type: 'country' });

  // Update suggestions
  suggestions.value = suggestionsArray;

  console.log('Built suggestions:', suggestionsArray);
}

// Helper function to fetch city code if needed
async function fetchCityCode(city) {
  if (!city) { return null; }

  try {
    console.log(`Fetching city code for: ${city}`);
    const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${city}`);
    const data = await response.json();

    if (data && data.length > 0 && !data[0].error) {
      const item = data[0];
      const stateAbbrev = item.state_abbreviation || '';
      const textKey = `${item.display_name} - ${stateAbbrev}`;

      // Save code in our cache
      const code = item.cd_mun;
      codes.value[textKey] = code;
      console.log(`Found code ${code} for ${textKey}`);

      return code;
    }
  } catch (error) {
    console.error('Error fetching city code:', error);
  }

  return null;
}

async function generateDefaultSuggestions() {
  let defaultSuggestions = [];

  // If we have a chosen location, show it first
  if (locationChosen.value) {
    // Check if this city is in history
    const cityInHistory = searchHistory.value.some(item => {
      const itemCity = item.split(' - ')[0].toLowerCase();
      const chosenCity = locationChosen.value.split(' - ')[0].toLowerCase();

      return itemCity === chosenCity;
    });

    defaultSuggestions.push({
      text: locationChosen.value,
      type: cityInHistory ? 'history' : 'city'
    });
  }

  // Add recent history items (excluding current location)
  const addedCities = defaultSuggestions.map(s =>
    s.text.split(' - ')[0].toLowerCase()
  );

  const recentHistory = searchHistory.value
    .filter(item => {
      const itemCity = item.split(' - ')[0].toLowerCase();

      return !addedCities.includes(itemCity);
    })
    .slice(0, 2) // Take up to 2 recent history items
    .map(item => ({ text: item, type: 'history' }));

  defaultSuggestions = [...defaultSuggestions, ...recentHistory];

  // Always add São Paulo state and Brasil
  defaultSuggestions.push({ text: 'São Paulo', type: 'state' });
  defaultSuggestions.push({ text: 'Brasil', type: 'country' });

  suggestions.value = defaultSuggestions;
}

function showError() {
  isError.value = true;
  isTypingBlocked.value = true;

  // Make sure error state is visibly applied to the input container
  if (inputContainer.value) {
    // Force reapplication of error class
    inputContainer.value.classList.remove('input-container-error');
    void inputContainer.value.offsetWidth;
    inputContainer.value.classList.add('input-container-error');

    // Remove other container classes that might conflict
    inputContainer.value.classList.remove('input-container');
    inputContainer.value.classList.remove('input-container-dropdown');
  }

  // Set timeout for error state (2 seconds)
  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value);
  }

  errorTimeout.value = setTimeout(() => {
    isError.value = false;
    isTypingBlocked.value = false;
  }, 2000);
}

function clearErrorState() {
  isError.value = false;
  isTypingBlocked.value = false;
  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value);
  }
}

function handleKeydown(event) {
  // Handle special case for Backspace and Delete - try to recover from error state
  if (isTypingBlocked.value && (event.key === 'Backspace' || event.key === 'Delete')) {
    // Allow typing and immediately force update with new value
    isTypingBlocked.value = false;
    clearErrorState();

    // Don't wait for handleInput to trigger search
    setTimeout(() => {
      updateSuggestions(true);
    }, 10);

    return;
  }

  // Block other keys when in error state and trigger animation
  if (isTypingBlocked.value && !['Escape', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
    event.preventDefault();
    triggerErrorAnimation();
  }
}

function triggerErrorAnimation() {
  // Reset and retrigger the animation
  if (inputContainer.value) {
    inputContainer.value.classList.remove('shake-animation');
    void inputContainer.value.offsetWidth; // force reflow
    inputContainer.value.classList.add('shake-animation');

    // Make sure error class is applied
    inputContainer.value.classList.remove('input-container');
    inputContainer.value.classList.remove('input-container-dropdown');
    inputContainer.value.classList.add('input-container-error');
  }

  isError.value = true;

  // Reset the timeout
  clearTimeout(errorTimeout.value);
  errorTimeout.value = setTimeout(() => {
    isError.value = false;
    isTypingBlocked.value = false;
  }, 2000);
}

// Fix - Ensure selectSuggestion handles consistent formatting
// Fixed fetchCoordinates to properly handle the API response format
async function fetchCoordinates(address) {
  // Get just the city name without state
  const { city } = parseCityState(address);
  console.log(`Fetching coordinates for: ${city} (from ${address})`);

  try {
    // Fetch coordinates from the API
    const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${city}`);
    const data = await response.json();
    console.log('Coordinate search results:', data);

    // Check if we have a valid response with coordinates
    if (data && data.length > 0) {
      // Extract coordinates from first result
      if (data[0] && data[0].coordinates) {
        const loc = data[0].coordinates;
        coordinates.value = { lat: loc.lat, lng: loc.lng };
        console.log(`Found coordinates: ${loc.lat}, ${loc.lng}`);

        // Save the city code if available
        if (data[0].cd_mun) {
          const cityWithState = address;
          codes.value[cityWithState] = data[0].cd_mun;
          console.log(`Saved code ${data[0].cd_mun} for ${cityWithState}`);
        }

        emitLocationUpdate({
          lat: loc.lat,
          lng: loc.lng,
          type: 'city',
        });

        return true;
      } else {
        console.log('No coordinates found in result:', data[0]);
      }
    }

    console.log('No coordinates found in API response');
    // Don't call handleLocationFailure here as it might interfere with the selection process

    // Try alternate approach - use municipal code instead
    if (codes.value[address]) {
      console.log(`Trying to get coordinates using municipal code: ${codes.value[address]}`);
      const locationStore = useLocationStore();

      return await locationStore.fetchCoordinates(codes.value[address]);
    }

    return false;
  } catch (error) {
    console.error('Error fetching coordinates:', error);

    // Don't call handleLocationFailure here as it might interfere with the selection process
    return false;
  }
}

// Enhanced selectSuggestion to ensure code is properly saved
async function selectSuggestion(suggestion) {
  console.log('selectSuggestion:', suggestion);

  if (!suggestion || !suggestion.text) {
    console.error('Invalid suggestion object:', suggestion);

    return;
  }

  // Normalize the selected location
  const normalizedText = normalizeLocationName(suggestion.text);

  inputValue.value = normalizedText;
  visibleInput.value = normalizedText;
  highlightedText.value = '';
  dropdown.value = false;
  locationChosen.value = normalizedText;

  const { city, state } = parseCityState(normalizedText);
  console.log(`Selected city: ${city}, state: ${state}`);

  // Get the city code, or fetch it if not available
  let code = codes.value[normalizedText];

  // First check if we already have the code from the suggestion
  if (suggestion.cd_mun) {
    code = suggestion.cd_mun;
    // Make sure it's in our codes cache
    codes.value[normalizedText] = code;
  }

  // If still no code, try to fetch it
  if (!code) {
    console.log(`No code found for ${normalizedText}, fetching it now`);
    code = await fetchCityCode(city);
  }

  const stateAbbrev = normalizedText.split(' - ')[1];

  // Update Pinia store with the code
  const locationStore = useLocationStore();
  await locationStore.setLocation({
    cd_mun: code,
    nm_mun: city,
    uf: stateAbbrev,
    type: 'city',
    year: '2021', //new Date().getFullYear()
  });

  // Add to history BEFORE fetching coordinates
  addToHistory(normalizedText);

  // Ensure coordinates are fetched after store update
  await fetchCoordinates(normalizedText);

  // Ensure map recenters
  emit('location-updated', coordinates.value);

  // Update UI state
  loadAnimation();
  updateSuggestions();
  clearErrorState();
  emit('interaction-succeeded');
}

async function loadAnimation() {
  if (!inputValue.value && !locationChosen.value) {
    showError();

    return;
  }
  isLoading.value = true; // spinner on
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));  // Simulates an API call or submission logic
  } catch (error) {
    console.error('Erro durante a busca:', error);
  } finally {
    isLoading.value = false; // spinner off
  }
}

function getMatchedPart(text) {
  if (!inputValue.value) { return ''; }
  const input = inputValue.value.toLowerCase();
  const suggestion = text.toLowerCase();

  return suggestion.startsWith(input)
    ? text.substring(0, inputValue.value.length)
    : '';
}

function getUnmatchedPart(text) {
  if (!inputValue.value) { return text; }
  const input = inputValue.value.toLowerCase();
  const suggestion = text.toLowerCase();

  return suggestion.startsWith(input)
    ? text.substring(inputValue.value.length)
    : text;
}

// Update the location data handler to preserve existing data when appropriate
function updateLocationData(location) {
  console.log('updateLocationData called with:', location);

  // If geolocation or no locationData yet, override
  if (location.source === 'geolocation' || !locationData.value) {
    locationData.value = location;

    // Properly format city with state
    if (location.city && location.stateAbbreviation) {
      const cityWithState = `${location.city} - ${location.stateAbbreviation}`;

      // Add to cached cities
      cacheCities([cityWithState]);

      // If this is geolocation and we don't have a chosen location yet,
      // automatically select this location
      if (props.autoSelectLocation && location.source === 'geolocation' && !locationChosen.value) {
        console.log('Auto-selecting geolocation:', cityWithState);

        // Create a suggestion object
        const geoSuggestion = {
          text: cityWithState,
          type: 'city'
        };

        // Wait a moment to ensure location data is fully processed
        setTimeout(() => {
          selectSuggestion(geoSuggestion);
        }, 100);
      } else {
        // Just update suggestions without auto-selecting
        console.log('Updating suggestions from geolocation without auto-selecting');
        buildSuggestionsFromHistory();
      }
    } else {
      // Still cache the city if we have it
      if (location.city) {
        cacheCities([location.city]);
      }
    }

    // Update suggestions based on the new location
    buildSuggestionsFromHistory();

    console.log('Location updated to:', locationData.value);
  }
  else if (!locationData.value.city) {
    // If we don't have a city yet
    locationData.value = location;
    if (location.city) {
      cacheCities([location.city]);
    }

    // Update suggestions based on the new location
    buildSuggestionsFromHistory();

    console.log('Location city set to:', location.city);
  }
}

function parseCityState(text) {
  // Check if the text contains a state abbreviation
  const parts = text.split(' - ');
  if (parts.length === 2) {
    return {
      city: parts[0],
      state: parts[1],
    };
  }

  return { city: text, state: null };
}

async function fetchCities(query) {
  try {
    // Show loading state immediately
    isLoading.value = true;

    const requestQuery = parseCityState(query).city;
    console.log(`Fetching cities for query: "${requestQuery}"`);

    const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${requestQuery}`);
    const data = await response.json();

    console.log('API response for cities:', data);

    // Check if the response indicates an error or is empty
    if (!data || data.length === 0 || (data.length === 1 && data[0].error)) {
      console.log('No valid suggestions found in API response');
      suggestions.value = [];
      if (inputValue.value.length > 0) {
        showError();
      }
      isLoading.value = false;

      return false;
    }

    // Process valid results
    const validResults = data.filter(item => !item.error);
    console.log(`Found ${validResults.length} valid results`);

    if (validResults.length === 0) {
      console.log('No valid results after filtering');
      suggestions.value = [];
      if (inputValue.value.length > 0) {
        showError();
      }
      isLoading.value = false;

      return false;
    }

    // Create a set of existing cities for deduplication
    const existingCities = new Set();

    // Extract cities from current chosen location
    if (locationChosen.value) {
      const { city } = parseCityState(locationChosen.value);
      existingCities.add(city.toLowerCase());
    }

    suggestions.value = validResults
      .filter(item => {
        // Handle both state_abbreviation and display_name formats
        const displayName = item.display_name || '';
        const { city } = parseCityState(displayName);

        // Skip if this city is already in suggestions
        if (existingCities.has(city.toLowerCase())) {
          return false;
        }

        // Add to tracking set to avoid future duplicates
        existingCities.add(city.toLowerCase());

        return true;
      })
      .map(item => {
        // Handle both state_abbreviation and display_name formats
        const displayName = item.display_name || '';
        const stateAbbreviation = item.state_abbreviation || '';

        const textKey = stateAbbreviation
          ? `${displayName}${displayName.includes(' - ') ? '' : ` - ${stateAbbreviation}`}`
          : displayName;

        // Always store the code when we get it from the API
        if (item.cd_mun) {
          codes.value[textKey] = item.cd_mun;
          console.log(`Saved code ${item.cd_mun} for ${textKey}`);
        }

        return {
          text: textKey,
          lat: item.coordinates?.lat,
          lng: item.coordinates?.lng,
          type: 'city',
          cd_mun: item.cd_mun  // Include the code in the suggestion object
        };
      });

    // If we have results, clear error state
    if (suggestions.value.length > 0) {
      clearErrorState();

      // Cache the cities we found
      cachedCities.value = [...new Set([...cachedCities.value, ...suggestions.value.map(s => s.text)])];
      console.log('Updated cached cities:', cachedCities.value);

      return true;
    } else {
      console.log('No suggestions after mapping API results');
      showError();
      isLoading.value = false;

      return false;
    }

  } catch (error) {
    console.error('Error fetching cities:', error);
    suggestions.value = [];
    showError();
    isLoading.value = false;

    return false;
  } finally {
    isLoading.value = false;
  }
}

function handleLocationFailure() {
  coordinates.value = null;
  emitLocationUpdate(null);
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

    // Check if locationStore has a location before restoring
    const locationStore = useLocationStore();
    const storeHasLocation = locationStore.hasLocation;

    // Only restore previous location if in error state and we have a chosen location AND the store has a location
    if (isError.value && locationChosen.value && storeHasLocation) {
      console.log('Restoring previous location after error:', locationChosen.value);
      inputValue.value = locationChosen.value;
      clearErrorState();
    } else if (!inputValue.value && locationChosen.value && storeHasLocation) {
      // Only restore if store still has a location
      inputValue.value = locationChosen.value;
    } else if (!storeHasLocation) {
      // Clear the input if store has been reset
      inputValue.value = '';
      locationChosen.value = '';
    }
  }
}

// Improved function to cache cities with consistent formatting
function cacheCities(citiesArr) {
  if (!citiesArr || citiesArr.length === 0) { return; }

  // Normalize city names before caching
  const normalizedCities = citiesArr.map(city => normalizeLocationName(city));

  // Add to cache, ensuring uniqueness
  cachedCities.value = [...new Set([...cachedCities.value, ...normalizedCities])];

  console.log('Updated cached cities:', cachedCities.value);
}

function handleInput() {
  if (isTypingBlocked.value) {
    return;
  }

  if (inputValue.value !== previousInputValue.value) {
    // If we deleted all input, show default suggestions immediately
    if (inputValue.value === '') {
      dropdown.value = true;
      generateDefaultSuggestions();
      highlightedText.value = '';
      previousInputValue.value = '';

      return;
    }

    dropdown.value = true;
    updateSuggestions();
  }
}

async function updateSuggestions(forceUpdate = false) {
  if (!forceUpdate && inputValue.value === previousInputValue.value) {
    return;
  }

  // If input is empty, show default suggestions
  if (inputValue.value === '') {
    buildSuggestionsFromHistory();
    highlightedText.value = '';

    return;
  }

  try {
    // Make the API call
    await fetchCities(inputValue.value);

    const inputLower = inputValue.value.toLowerCase();

    // Get filtered history items (that aren't already in the API results)
    const apiCities = new Set(
      suggestions.value.map(s => parseCityState(s.text).city.toLowerCase())
    );

    // Filter history items that aren't already in API results
    const historySuggestions = searchHistory.value.filter(item => {
      const { city } = parseCityState(item);

      return city.toLowerCase().includes(inputLower) &&
             !apiCities.has(city.toLowerCase());
    });

    // Filter states that match the query
    const stateSuggestions = states.filter(
      state => state.toLowerCase().includes(inputLower)
    );

    // Add history and state suggestions to the results
    if (historySuggestions.length > 0 || stateSuggestions.length > 0) {
      const combinedSuggestions = [
        ...suggestions.value, // API results first
        ...historySuggestions.map(item => ({ text: item, type: 'history' })),
        ...stateSuggestions.map(item => ({ text: item, type: 'state' })),
      ];

      suggestions.value = combinedSuggestions;
    }

    // Update after everything is done
    previousInputValue.value = inputValue.value;
    updateHighlightedText();

  } catch (error) {
    console.error('Error updating suggestions:', error);
    // Only show error if we have input
    if (inputValue.value) {
      showError();
    }
  }
}

// function filterHistory(query) {
//   return searchHistory.value.filter(item =>
//     item.toLowerCase().includes(query)
//   );
// }

// function filterStates(query) {
//   return states.filter(
//     state =>
//       state.toLowerCase().includes(query) &&
//       !searchHistory.value.includes(state)
//   );
// }

// function filterCities(query) {
//   const q = query.toLowerCase();

//   return cachedCities.value
//     .filter(city => city.toLowerCase().includes(q))
//     .sort((a, b) => {
//       // rank by where `q` appears; 0 means 'starts at beginning'
//       const idxA = a.toLowerCase().indexOf(q);
//       const idxB = b.toLowerCase().indexOf(q);

//       return idxA - idxB;
//     });
// }

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
  if (inputValue.value) {
    // Use the first visible suggestion if it exists
    const suggestion = visibleSuggestions.value[0];
    if (suggestion && suggestion.text) {
      selectSuggestion(suggestion);  // Handles syncing and recentering
    } else {
      showError();
      triggerErrorAnimation();
    }
  } else if (locationChosen.value) {
    // Use the last chosen location if no input
    const suggestion = {
      text: locationChosen.value,
      type: 'city' // Default type if not known
    };
    selectSuggestion(suggestion);
  } else {
    showError();
    triggerErrorAnimation();
  }

  // Fetch coordinates and update the location store
  if (locationChosen.value) {
    fetchCoordinates(locationChosen.value).then(() => {
      const locationStore = useLocationStore();
      locationStore.setLocation({
        cd_mun: codes.value[locationChosen.value],
        nm_mun: locationChosen.value.split(' - ')[0],
        uf: locationChosen.value.split(' - ')[1],
      });
    });
    emit('interaction-succeeded');
  }
}

// Chama a função para buscar coordenadas
function handleEnter() {
  if (suggestions.value.length > 0 && inputValue.value) {
    selectSuggestion(suggestions.value[0]);
    if (inputField.value) { inputField.value.blur(); }
    submit();
  } else if (!inputValue.value) {
    showError();
    triggerErrorAnimation();
  } else {
    showError();
    triggerErrorAnimation();
  }
}

// Enhanced function to add items to history with consistent formatting
function addToHistory(item) {
  if (!item || item === 'No Results') { return; }

  // Normalize the location name to ensure consistency
  const normalizedItem = normalizeLocationName(item);

  // Remove any existing entries with the same city name (different format)
  const { city } = parseCityState(normalizedItem);
  searchHistory.value = searchHistory.value.filter(historyItem => {
    const historyCity = parseCityState(historyItem).city.toLowerCase();

    return historyCity !== city.toLowerCase();
  });

  // Add the normalized item to history
  searchHistory.value.unshift(normalizedItem);
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop();
  }

  saveSearchHistory();
}

// Updated clear input to ensure proper suggestions are shown
function clearInput(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  inputValue.value = '';
  highlightedText.value = '';
  previousInputValue.value = '';
  clearErrorState();

  // Ensure dropdown is visible
  dropdown.value = true;

  // Force rebuild of suggestions - make sure to include any selected location
  buildSuggestionsFromHistory();
}

function saveSearchHistory() {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
}

function loadSearchHistory() {
  const savedHistory = localStorage.getItem('searchHistory');
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory);
  }
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

// Helper to emit location-updated event from script setup
function emitLocationUpdate(payload) {
  emit('location-updated', payload);
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
  position: relative;
  z-index: 1;
  cursor: default;
}

.input-container {
  border-radius: 99px;
  background: var(--Gray-100, #F8F9FA);
}

.input-container-dropdown {
  border-radius: 99px;
  background: var(--Gray-100, #F8F9FA);
  outline: 3px solid #418377;
  outline-offset: -3px;
  user-select: none;
  cursor: default;
}

.input-container-error {
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  height: 48px;
  padding: 0px 16px 0px 24px;
  position: relative;
  z-index: 1;
  border-radius: 99px;
  background: #FFF5F5;
  outline: 3px solid #DC3545;
  outline-offset: -3px;
}

/* Explicitly separating animation from error state styling for clean transitions */
.shake-animation {
  animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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

.input-error {
  color: #DC3545;
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
}

.highlight-error {
  color: #DC3545;
}

.text-highlight {
  font-weight: bold;
}

/* Buttons */
.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #212529;
}

.clean-button,
.search-button {
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: #212529;
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
}

.filter-button,
.filter-button-active {
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

.suggestions-list .first-suggestion {
  background-color: #E9ECEF;
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

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-4px);
  }

  40% {
    transform: translateX(4px);
  }

  60% {
    transform: translateX(-2px);
  }

  80% {
    transform: translateX(2px);
  }
}

.shake-animation {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Error state styling */
.input-container-error {
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  height: 48px;
  padding: 0px 16px 0px 24px;
  position: relative;
  z-index: 1;
  border-radius: 99px;
  background: var(--Gray-100, #F8F9FA);
  outline: 3px solid #DC3545;
  outline-offset: -3px;
}
</style>
