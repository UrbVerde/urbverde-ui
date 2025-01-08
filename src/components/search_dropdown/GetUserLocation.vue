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
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'

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
})

const emit = defineEmits(['location-updated', 'location-error'])

// Reactive state
const loading = ref(true)
const error = ref(null)

// We can store all location data in a reactive object:
const locationData = reactive({
  city: null,
  state: null,
  stateAbbreviation: null,
  country: null,
  international: false,
  source: null, // 'geolocation' or 'ipdata'
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
})

onMounted(() => {
  initializeLocation()
})

// Checking the localStorage cache
function checkCachedLocation() {
  const cachedTimestamp = localStorage.getItem('cachedTimestamp')
  const cacheDuration = 24 * 60 * 60 * 1000
  if (cachedTimestamp && (Date.now() - cachedTimestamp) <= cacheDuration) {
    loadCachedLocation()
    return true
  }
  return false
}

// Loading data from localStorage
function loadCachedLocation() {
  const cached = {
    city: localStorage.getItem('cachedCity'),
    state: localStorage.getItem('cachedState'),
    stateAbbreviation: localStorage.getItem('cachedStateAbbreviation'),
    country: localStorage.getItem('cachedCountry'),
    international: localStorage.getItem('cachedInternational') === 'true',
    source: localStorage.getItem('cachedSource')
  }
  Object.assign(locationData, cached)
  emitLocationUpdate()
  loading.value = false
}

// Wrapper to run geolocation + IP location
async function initializeLocation() {
  if (checkCachedLocation()) {
    return
  }
  try {
    // Parallel calls: geolocation + IP
    const [geoLocation, ipLocation] = await Promise.allSettled([
      getGeolocation(),
      getIPLocation()
    ])
    
    // If geolocation succeeded, process it
    if (geoLocation.status === 'fulfilled') {
      processGeolocationData(geoLocation.value)
    }
    // If IP location succeeded, process it
    if (ipLocation.status === 'fulfilled') {
      processIPLocationData(ipLocation.value)
    }
  } catch (err) {
    handleError(err)
  }
}

// Geolocation
function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
  })
}

// IP-based location
async function getIPLocation() {
  try {
    const response = await axios.get(
      `https://api.ipdata.co/?api-key=${props.ipDataApiKey}`
    )
    return response.data
  } catch (err) {
    throw new Error('Erro ao obter localização por IP')
  }
}

// Process the geolocation data (reverse geocode with OSM)
async function processGeolocationData(position) {
  try {
    const { latitude, longitude } = position.coords
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    )
    const data = await response.json()

    updateLocationData({
      city: data.address.city || data.address.town || data.address.village,
      state: data.address.state,
      country: data.address.country,
      source: 'geolocation'
    })
  } catch (error) {
    throw new Error('Erro ao processar dados de geolocalização')
  }
}

// Process IP location
function processIPLocationData(data) {
  if (!props.municipios.includes(data.city)) {
    console.warn(`${data.city} não encontrada na lista de municípios`)
  }
  updateLocationData({
    city: data.city,
    state: data.region,
    country: data.country_name,
    source: 'ipdata'
  })
}

// Update reactive object, cache, and emit
function updateLocationData(data) {
  // Merge data
  Object.assign(locationData, data, {
    international: data.country !== 'Brasil',
    // If country is Brazil, find the matching abbreviation
    stateAbbreviation: data.country === 'Brasil'
      ? locationData.statesBrazil.find(s => s.name === data.state)?.abbreviation
      : null
  })
  
  cacheLocationData()
  emitLocationUpdate()
}

// Save to localStorage
function cacheLocationData() {
  const items = {
    cachedCity: locationData.city,
    cachedState: locationData.state,
    cachedStateAbbreviation: locationData.stateAbbreviation,
    cachedCountry: locationData.country,
    cachedInternational: locationData.international.toString(),
    cachedSource: locationData.source,
    cachedTimestamp: Date.now().toString()
  }
  Object.entries(items).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })
}

// Emit final object to the parent
function emitLocationUpdate() {
  emit('location-updated', { ...locationData })
  loading.value = false
}

// Error handler
function handleError(err) {
  console.error('Location Error:', err)
  error.value = err.message || 'Erro ao obter localização'
  emit('location-error', error.value)
}
</script>