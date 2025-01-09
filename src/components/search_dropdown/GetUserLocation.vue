<!-- urbverde-ui/src/components/search_dropdown/GetUserLocation.vue -->
<template>
  <div>
    <!--
      <p v-if="locationData.city">
        Você está em: {{ locationData.city }}, {{ locationData.stateAbbreviation }} ({{ locationData.state }}), {{ locationData.country }}
      </p>
      <p v-else>Obtendo sua localização...</p>
    -->
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

// Using defineProps and defineEmits for <script setup>
const props = defineProps({
  ipDataApiKey: {
    type: String,
    required: true
  },
  municipios: {
    type: Array,
    default: () => []
  },
});

const emit = defineEmits(['location-updated', 'location-error']);

// Reactive state
const loading = ref(true);
const error = ref(null);

// We can store all location data in a reactive object:
const locationData = reactive({
  city: null,
  state: null,
  stateAbbreviation: null,
  country: null,
  international: false,
  source: null, // 'geolocation' or 'ipdata'
  postal: null,  // Add this new field
  regionType: null, // Add this if you want to track region_type
  coordinates: {  // Add coordinates from IP data
    lat: null,
    lng: null
  },
  statesBrazil: [
    { name: 'Acre', abbreviation: 'AC' },
    { name: 'Alagoas', abbreviation: 'AL' },
    { name: 'Amapá', abbreviation: 'AP' },
    { name: 'Amazonas', abbreviation: 'AM' },
    { name: 'Bahia', abbreviation: 'BA' },
    { name: 'Ceará', abbreviation: 'CE' },
    { name: 'Distrito Federal', abbreviation: 'DF' },
    { name: 'Espírito Santo', abbreviation: 'ES' },
    { name: 'Goiás', abbreviation: 'GO' },
    { name: 'Maranhão', abbreviation: 'MA' },
    { name: 'Mato Grosso', abbreviation: 'MT' },
    { name: 'Mato Grosso do Sul', abbreviation: 'MS' },
    { name: 'Minas Gerais', abbreviation: 'MG' },
    { name: 'Pará', abbreviation: 'PA' },
    { name: 'Paraíba', abbreviation: 'PB' },
    { name: 'Paraná', abbreviation: 'PR' },
    { name: 'Pernambuco', abbreviation: 'PE' },
    { name: 'Piauí', abbreviation: 'PI' },
    { name: 'Rio de Janeiro', abbreviation: 'RJ' },
    { name: 'Rio Grande do Norte', abbreviation: 'RN' },
    { name: 'Rio Grande do Sul', abbreviation: 'RS' },
    { name: 'Rondônia', abbreviation: 'RO' },
    { name: 'Roraima', abbreviation: 'RR' },
    { name: 'Santa Catarina', abbreviation: 'SC' },
    { name: 'São Paulo', abbreviation: 'SP' },
    { name: 'Sergipe', abbreviation: 'SE' },
    { name: 'Tocantins', abbreviation: 'TO' },
  ],
});

onMounted(() => {
  initializeLocation();
});

// Checking the localStorage cache
function checkCachedLocation() {
  const cachedTimestamp = localStorage.getItem('cachedTimestamp');
  const cacheDuration = 24 * 60 * 60 * 1000;
  if (cachedTimestamp && (Date.now() - cachedTimestamp) <= cacheDuration) {
    loadCachedLocation();

    return true;
  }

  return false;
}

// Loading data from localStorage
function loadCachedLocation() {
  const cached = {
    city: localStorage.getItem('cachedCity'),
    state: localStorage.getItem('cachedState'),
    stateAbbreviation: localStorage.getItem('cachedStateAbbreviation'),
    country: localStorage.getItem('cachedCountry'),
    international: localStorage.getItem('cachedInternational') === 'true',
    source: localStorage.getItem('cachedSource'),
    postal: localStorage.getItem('cachedPostal'),  // Add this
    coordinates: {  // Add coordinates
      lat: Number(localStorage.getItem('cachedLatitude')),
      lng: Number(localStorage.getItem('cachedLongitude'))
    }
  };
  Object.assign(locationData, cached);
  emitLocationUpdate();
  loading.value = false;
}

// Wrapper to run geolocation + IP location
async function initializeLocation() {
  if (checkCachedLocation()) {
    return;
  }
  try {
    // Parallel calls: geolocation + IP
    const [geoLocation, ipLocation] = await Promise.allSettled([
      getGeolocation(),
      getIPLocation()
    ]);

    // If geolocation succeeded, process it
    if (geoLocation.status === 'fulfilled') {
      processGeolocationData(geoLocation.value);
    }
    // If IP location succeeded, process it
    if (ipLocation.status === 'fulfilled') {
      processIPLocationData(ipLocation.value);
    }
  } catch (err) {
    handleError(err);
  }
}

// Geolocation
function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'));

      return;
    }

    function handleError(error) {
      switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log('Usuário não autorizou a geolocalização');
        reject(new Error('Permissão para geolocalização negada pelo usuário'));
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Informações de localização indisponíveis');
        reject(new Error('Informações de localização indisponíveis'));
        break;
      case error.TIMEOUT:
        console.log('Tempo limite excedido para obter localização');
        reject(new Error('Tempo limite excedido para obter localização'));
        break;
      default:
        console.log('Erro desconhecido ao obter localização:', error.message);
        reject(new Error('Erro ao obter localização'));
      }
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      handleError,
      {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  });
}

// IP-based location
async function getIPLocation() {
  try {
    const response = await axios.get(
      `https://api.ipdata.co/?api-key=${props.ipDataApiKey}` //fca7ec8cb54f07bfacf5cb76321d92aef545786dc5699a77c09f3f31
    );

    return response.data;
  } catch (err) {
    throw new Error('Erro ao obter localização por IP');
  }
}

// Process the geolocation data (reverse geocode with OSM)
async function processGeolocationData(position) {
  try {
    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();

    updateLocationData({
      city: data.address.city || data.address.town || data.address.village,
      state: data.address.state,
      country: data.address.country,
      source: 'geolocation'
    });
  } catch (error) {
    throw new Error('Erro ao processar dados de geolocalização');
  }
}

// Process IP location
// Process IP location data
function processIPLocationData(data) {
  if (!data) {
    throw new Error('No IP data received');
  }

  console.log('Raw IP data:', data); // Debug log

  // Extract the required fields from ipdata response
  const locationInfo = {
    city: data.city,
    state: data.region,
    stateAbbreviation: data.region_code, // Direct assignment from region_code
    country: data.country_name,
    postal: data.postal,
    source: 'ipdata',
    coordinates: {
      lat: data.latitude,
      lng: data.longitude
    }
  };

  console.log('Processed location info:', locationInfo); // Debug log

  // Check if city exists in municipios list if provided
  if (props.municipios && props.municipios.length > 0 && !props.municipios.includes(data.city)) {
    console.warn(`${data.city} não encontrada na lista de municípios`);
  }

  // Update the location data with all fields
  updateLocationData(locationInfo);
}

// Update reactive object, cache, and emit
function updateLocationData(data) {
  console.log('Updating location data with:', data); // Debug log

  // Merge data into locationData
  Object.assign(locationData, {
    city: data.city,
    state: data.state,
    stateAbbreviation: data.stateAbbreviation, // Use the direct region_code
    country: data.country,
    postal: data.postal,
    source: data.source,
    coordinates: data.coordinates,
    international: data.country !== 'Brasil' && data.country !== 'Brazil'
  });

  console.log('Updated location data:', locationData); // Debug log

  // Cache the location data
  cacheLocationData();
  // Emit the update
  emitLocationUpdate();
}

// Save to localStorage
function cacheLocationData() {
  const items = {
    cachedCity: locationData.city,
    cachedState: locationData.state,
    cachedStateAbbreviation: locationData.stateAbbreviation,
    cachedCountry: locationData.country,
    cachedPostal: locationData.postal,
    cachedInternational: locationData.international.toString(),
    cachedSource: locationData.source,
    cachedLatitude: locationData.coordinates?.lat?.toString(),
    cachedLongitude: locationData.coordinates?.lng?.toString(),
    cachedTimestamp: Date.now().toString()
  };

  Object.entries(items).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, value);
    }
  });
}

// Emit final object to the parent
function emitLocationUpdate() {
  const locationUpdate = {
    ...locationData,
    coordinates: {
      lat: locationData.coordinates?.lat || 0,
      lng: locationData.coordinates?.lng || 0
    }
  };
  console.log('Emitting location update:', locationUpdate); // Debug log
  emit('location-updated', locationUpdate);
  loading.value = false;
}

// Error handler
function handleError(err) {
  console.error('Location Error:', err);
  error.value = err.message || 'Erro ao obter localização';
  emit('location-error', error.value);
}
</script>
