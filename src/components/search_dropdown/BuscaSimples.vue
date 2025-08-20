<!-- urbverde-ui/src/components/search_dropdown/BuscaSimples.vue -->
<template>
  <GetUserLocation @location-updated="updateLocationData" @location-error="handleLocationFailure" />
  <div class="search-wrapper">
    <div ref="inputContainer"
         :class="{
           'input-container shadow-sm': !dropdown && !isError,
           'input-container-dropdown shadow': dropdown && !isError,
           'input-container-error shake-animation shadow': isError,
           'map-mode': viewMode === 'map',
           'policies-mode': viewMode === 'policies'
         }"
         @click="activateInput">
      <div class="input-overlay">
        <input ref="inputField"
               v-model="inputValue"
               @input="handleInput"
               @focus="handleFocus"
               @keydown.enter="handleEnter"
               :placeholder="!inputValue && !highlightedText ? 'Buscar um local' : ''"
               class="input-field body-small-regular"
               :disabled="!isInputActive"
               @click="activateInput" />
        <div v-if="highlightedText && inputValue" class="suggestion-overlay body-small-regular">
          <span class="suggestion-text body-small-regular">
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
  }
});

// Códigos dos municípios do ABC Paulista
const ABC_PAULISTA_CODES = [
  '3547809', // Santo André
  '3548708', // São Bernardo do Campo
  '3548807', // São Caetano do Sul
  '3550308', // São Paulo
  '3513801', // Diadema
  '3529401', // Mauá
  '3543303', // Ribeirão Pires
  '3544103'  // Rio Grande da Serra
];

const states = [ // All this shouldnt be hardcorded here in the next versions (!)
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins', 'Brasil'
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

// Cache tracking
// Keep track of codes for quick lookups: { "City - ST": code, "City": code }
const codes = ref({});

const locationStore = useLocationStore();

const viewMode = ref(locationStore.viewMode);

watch(() => locationStore.viewMode, async(newMode) => {
  viewMode.value = newMode;

  // Se mudou para o modo policies, direcionar automaticamente para Diadema
  if (newMode === 'policies') {
    // Definir Diadema como localização padrão
    const diademaText = 'Diadema - SP';
    const diademaCode = '3513801';

    // Atualizar o input
    inputValue.value = diademaText;
    visibleInput.value = diademaText;
    locationChosen.value = diademaText;
    codes.value[diademaText] = diademaCode;

    // Atualizar o store de localização
    await locationStore.setLocation({
      cd_mun: diademaCode,
      nm_mun: 'Diadema',
      uf: 'SP',
      type: 'city',
      year: locationStore.currentYear,
    });

    // Buscar coordenadas de Diadema
    await fetchCoordinates(diademaText);

    // Emitir evento de atualização de localização
    emit('location-updated', coordinates.value);
    emit('interaction-succeeded');

    // Adicionar ao histórico
    addToHistory(diademaText);

    // Mostrar sugestões do ABC
    generateDefaultSuggestions();
  }
});

// Watch para monitorar mudanças no store de localização
watch(
  () => [locationStore.nm_mun, locationStore.uf],
  ([newNmMun, newUf]) => {
    if (newNmMun && newUf) {
      const cityText = `${newNmMun} - ${newUf}`;
      inputValue.value = cityText;
      visibleInput.value = cityText;
      locationChosen.value = cityText;
    }
  },
  { immediate: true }
);

// Lifecycle Hooks
onMounted(async() => {
  document.addEventListener('mousedown', handleClickOutside);
  loadSearchHistory();

  // Initialize from Pinia store if values exist
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
  } else if (viewMode.value === 'policies') {
    // Se estiver no modo policies sem localização, direcionar para Diadema
    const diademaText = 'Diadema - SP';
    const diademaCode = '3513801';

    // Atualizar o input
    inputValue.value = diademaText;
    visibleInput.value = diademaText;
    locationChosen.value = diademaText;
    codes.value[diademaText] = diademaCode;

    // Atualizar o store de localização
    locationStore.setLocation({
      cd_mun: diademaCode,
      nm_mun: 'Diadema',
      uf: 'SP',
      type: 'city',
      year: locationStore.currentYear,
    });

    // Buscar coordenadas de Diadema
    fetchCoordinates(diademaText).then(() => {
      emit('location-updated', coordinates.value);
      emit('interaction-succeeded');
    });

    // Adicionar ao histórico
    addToHistory(diademaText);

    // Mostrar sugestões do ABC
    generateDefaultSuggestions();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

onBeforeUpdate(() => {
  suggestionItems.value = [];
});

// onUpdated(() => {
//   suggestionItems.value = visibleSuggestions.value.map(
//     (_, i) => document.querySelector(`[ref="suggestionItem-${i}"]`)
//   );
// });

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

  // Definir o limite baseado no viewMode
  const maxItems = viewMode.value === 'policies' ? 7 : 5;

  // Find first state suggestion
  const firstStateIndex = list.findIndex(s => s.type === 'state');
  if (firstStateIndex === -1) {
    // No states found, return items based on viewMode
    return list.slice(0, maxItems);
  }
  // separate cities from states
  const citiesBefore = list.slice(0, firstStateIndex);
  const statesAfter = list.slice(firstStateIndex);
  // ensure at least one state
  const totalItems = Math.min(maxItems, list.length);
  const citiesCount = Math.min(citiesBefore.length, totalItems - 1); // Reserve 1 spot for state

  return [
    ...citiesBefore.slice(0, citiesCount),
    ...statesAfter.slice(0, totalItems - citiesCount),
  ];
});

// Core Functions (in order of execution)
function activateInput() {
  isInputActive.value = true;
  // Se estiver no modo policies e o input estiver vazio, mostrar sugestões do ABC
  if (viewMode.value === 'policies' && !inputValue.value) {
    generateDefaultSuggestions();
  }
  // emit('menu-interaction'); // Emit event for menu interaction
  nextTick(() => {
    if (inputField.value) { inputField.value.focus(); }
  });
}

function showError() {
  alert('Por favor, insira um local.');
  isError.value = true;
  setTimeout(() => {
    isError.value = false;
  }, 1500);
}

async function selectSuggestion(suggestion) {
  console.log('selectSuggestion:', suggestion);
  const cityText = suggestion.text;
  inputValue.value = cityText;
  visibleInput.value = cityText;
  highlightedText.value = '';
  dropdown.value = false;
  locationChosen.value = cityText;

  const { city, state } = parseCityState(cityText);
  console.log(state);

  // Garantir que temos o código do município
  let code = codes.value[cityText];
  if (!code) {
    try {
      // Buscar o código do município da API
      const response = await fetch(`http://localhost:8080/v1/address/suggestions?query=${city}`);
      const data = await response.json();
      if (data?.[0]?.cd_mun) {
        code = data[0].cd_mun;
        codes.value[cityText] = code;
      }
    } catch (error) {
      console.error('Erro ao buscar código do município:', error);
    }
  }

  const stateAbbrev = cityText.split(' - ')[1];

  // Update Pinia store
  const locationStore = useLocationStore();
  await locationStore.setLocation({
    cd_mun: code,
    nm_mun: city,
    uf: stateAbbrev,
    type: 'city',
    year: locationStore.currentYear,
  });

  // Ensure coordinates are fetched after store update
  await fetchCoordinates(cityText);

  // Ensure map recenters
  emit('location-updated', coordinates.value);

  // Update UI state
  loadAnimation();
  updateSuggestions();
  addToHistory(cityText);
  emit('interaction-succeeded');
}

function handleFocus(event) {
  if (!dropdown.value) {
    dropdown.value = true;
    // Se estiver no modo policies e o input estiver vazio, mostrar sugestões do ABC
    if (viewMode.value === 'policies' && !inputValue.value) {
      generateDefaultSuggestions();
    }
    // emit('menu-interaction'); // Emit when dropdown opens
  }
  event.stopPropagation();
}

async function loadAnimation() {
  if (!inputValue.value && !locationChosen.value) {
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
  // console.log('1 - updateLocationData', location);

  // If geolocation or no locationData yet, override
  if (location.source === 'geolocation' || !locationData.value) {
    locationData.value = location;
    // console.log(locationData.value);
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

async function fetchCities(query) {
  // console.log('1 - fetchCities', query);
  const response = await fetch(`http://localhost:8080/v1/address/suggestions?query=${parseCityState(query).city}`);
  const data = await response.json();
  // console.log('1 - fetchCities', data);

  // console.log('suggestion before', JSON.parse(JSON.stringify(suggestions.value)))
  let filteredData = data.filter(item => !item.error);

  // Se estiver no modo policies, filtrar apenas municípios de São Paulo
  if (viewMode.value === 'policies') {
    filteredData = filteredData.filter(item =>
      item.state_abbreviation === 'SP' || item.state === 'SP'
    );
  }

  suggestions.value = filteredData
    .map(item => {
      // console.log('1 - fetchCities', item);
      const textKey = item.state_abbreviation
        ? `${item.display_name} - ${item.state_abbreviation}`
        : item.display_name;
      codes.value[textKey] = item.cd_mun;

      return {
        text: textKey,
        lat: item.coordinates?.lat,
        lng: item.coordinates?.lng,
        type: 'city',
      };
    });
  // console.log('suggestion after', JSON.parse(JSON.stringify(suggestions.value)))

  // console.log('1 - fetchCitiescachedCities before',cachedCities.value);
  cachedCities.value = suggestions.value.map(s => s.text);
  // console.log('1 - fetchCitiescachedCities after',cachedCities.value);
}

async function fetchCoordinates(address) {
  const { city } = parseCityState(address);

  try {
    // Fetch coordinates from the API
    const response = await fetch(`http://localhost:8080/v1/address/suggestions?query=${city}`);
    const data = await response.json();

    if (data?.[0]?.coordinates) {
      const loc = data[0].coordinates;
      coordinates.value = { lat: loc.lat, lng: loc.lng };
      emitLocationUpdate({
        lat: loc.lat,
        lng: loc.lng,
        type: 'city',
      });
    } else {
      handleLocationFailure();
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
  // console.log('\n 1 - cacheCities', citiesArr);
  // console.log('cachedCities before',cachedCities.value);
  cachedCities.value = [...new Set([...cachedCities.value, ...citiesArr])];
  // console.log('cachedCities before',cachedCities.value);
  updateSuggestions();
}

function handleInput() {
  if (inputValue.value !== previousInputValue.value) {
    dropdown.value = true;
    if (inputValue.value === '') {
      generateDefaultSuggestions();
      highlightedText.value = '';
    } else {
      updateSuggestions();
    }
  }
}

async function updateSuggestions(forceUpdate = false) {
  if (!forceUpdate && inputValue.value === previousInputValue.value) { return; }

  // Se o input estiver vazio, mostrar sugestões padrão
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
    let historySuggestions = [];
    let stateSuggestions = [];
    const citySuggestions = filterCities(inputLower);

    // No modo policies, não incluir histórico nem estados
    if (viewMode.value !== 'policies') {
      historySuggestions = filterHistory(inputLower);
      stateSuggestions = filterStates(inputLower);
    }

    suggestions.value = [
      ...historySuggestions.map(item => ({ text: item, type: 'history' })),
      ...citySuggestions.map(item => ({ text: item, type: 'city' })),
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
  let filteredHistory = searchHistory.value.filter(item => item.toLowerCase().startsWith(query));

  // Se estiver no modo policies, filtrar apenas municípios de São Paulo
  if (viewMode.value === 'policies') {
    filteredHistory = filteredHistory.filter(item => item.includes(' - SP'));
  }

  return filteredHistory;
}

function filterStates(query) {
  return states.filter(
    state =>
      state.toLowerCase().startsWith(query) &&
      !searchHistory.value.includes(state)
  );
}

function filterCities(query) {
  let filteredCities = cachedCities.value.filter(
    city =>
      city.toLowerCase().startsWith(query) &&
      !searchHistory.value.includes(city)
  );

  // Se estiver no modo policies, filtrar apenas municípios de São Paulo
  if (viewMode.value === 'policies') {
    filteredCities = filteredCities.filter(city => city.includes(' - SP'));
  }

  return filteredCities;
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
  if (inputValue.value && suggestions.value.length > 0) {
    // Use the first suggestion only if input is not empty and we have suggestions
    const suggestion = suggestions.value[0];
    if (suggestion && suggestion.text) {
      selectSuggestion(suggestion);  // Handles syncing and recentering
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
  }

  // Fetch coordinates and update the location store
  if (locationChosen.value) {
    fetchCoordinates(locationChosen.value).then(() => {
      const locationStore = useLocationStore();
      const [city, state] = locationChosen.value.split(' - ');
      locationStore.setLocation({
        cd_mun: codes.value[locationChosen.value],
        nm_mun: city,
        uf: state,
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
  }
  if (!inputValue.value) {
    showError();
  }

}

function addToHistory(item) {
  if (item === 'No Results') { return; }
  // if (!codes.value[item]) { return; }
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

function clearHistory() {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
  alert('Histórico limpo com sucesso!');
}

function clearInput() {
  inputValue.value = '';
  highlightedText.value = '';
  dropdown.value = true;
  generateDefaultSuggestions();
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

async function generateDefaultSuggestions() {
  if (viewMode.value === 'policies') {
    // No modo policies, mostrar apenas municípios do ABC Paulista, ignorando localização atual e histórico
    const abcSuggestions = [
      { text: 'Santo André - SP', type: 'city' },
      { text: 'São Bernardo do Campo - SP', type: 'city' },
      { text: 'São Caetano do Sul - SP', type: 'city' },
      { text: 'São Paulo - SP', type: 'city' },
      { text: 'Diadema - SP', type: 'city' },
      { text: 'Mauá - SP', type: 'city' },
      { text: 'Ribeirão Pires - SP', type: 'city' },
      { text: 'Rio Grande da Serra - SP', type: 'city' }
    ];

    // Garantir que todos os códigos estejam disponíveis
    abcSuggestions.forEach(suggestion => {
      const cityName = suggestion.text.split(' - ')[0];
      const cityCode = ABC_PAULISTA_CODES.find(code => {
        // Buscar o código correspondente baseado no nome da cidade
        const cityMap = {
          'Santo André': '3547809',
          'São Bernardo do Campo': '3548708',
          'São Caetano do Sul': '3548807',
          'São Paulo': '3550308',
          'Diadema': '3513801',
          'Mauá': '3529401',
          'Ribeirão Pires': '3543303',
          'Rio Grande da Serra': '3544103'
        };

        return cityMap[cityName] === code;
      });
      if (cityCode) {
        codes.value[suggestion.text] = cityCode;
      }
    });

    suggestions.value = abcSuggestions;

    return;
  }

  // Comportamento original para o modo map
  if (!locationData.value) { return; }

  const { city, state, stateAbbreviation } = locationData.value;
  const cityWithState = `${city} - ${stateAbbreviation || state}`;

  // Fetch city data if we don't have the code
  if (!codes.value[cityWithState]) {
    try {
      const response = await fetch(`http://localhost:8080/v1/address/suggestions?query=${city}`);
      const data = await response.json();

      if (data && data.length > 0 && !data[0].error) {
        const exactMatch = data.find(item =>
          `${item.display_name}` === cityWithState
        );

        if (exactMatch) {
          codes.value[cityWithState] = exactMatch.cd_mun;
        } else {
          console.warn(`Cidade exata não encontrada para ${cityWithState}`);
        }
      }
    } catch (error) {
      console.error('Error fetching city code:', error);
    }
  }

  // Filtrar o histórico para remover a cidade atual se ela estiver presente
  const filteredHistory = searchHistory.value.filter(item => item !== cityWithState);

  // Incluir apenas os 2 primeiros itens do histórico filtrado nas sugestões
  const historySuggestions = filteredHistory.slice(0, 2).map(item => ({ text: item, type: 'history' }));

  // Definir as capitais padrão
  const defaultCapitals = [
    { text: 'Salvador - BA', type: 'city' },
    { text: 'São Paulo - SP', type: 'city' }
  ];

  // Filtrar as capitais para não incluir a cidade atual
  const filteredCapitals = defaultCapitals.filter(capital => capital.text !== cityWithState);

  suggestions.value = [
    ...historySuggestions,
    { text: cityWithState, type: 'city' },
    ...filteredCapitals.slice(0, 2) // Limitar a 2 capitais
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
// We can't use defineEmits directly in the child and pass to child of child
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

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

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

    outline: 1px solid map-get($green, 500);

    &.map-mode {
      outline: 1px solid map-get($theme, primary);
    }

    &.policies-mode {
      outline: 1px solid map-get($yellow, 600);
    }

}

.input-container-dropdown {
  border-radius: 99px;
  background: var(--Gray-100, #F8F9FA);
  outline: 3px solid map-get($theme, primary);
  outline-offset: -3px;
  user-select: none;
  cursor: default;

  &.map-mode {
    outline: 3px solid map-get($theme, primary);
  }

  &.policies-mode {
    outline: 3px solid map-get($yellow, 600);
  }
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
  0%, 100% {
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

  @include breakpoint-down('tablet') {
    .input-container {
      outline: 1px solid map-get($green, 500);
    }
  }
</style>
