// src/stores/locationStore.js
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('locationStore', {
  state: () => ({
    cd_mun: null,
    nm_mun: null,
    uf: null,
    category: 'Clima',
    layer: null,
    scale: 'intraurbana',
    coordinates: { lat: null, lng: null },
    zoom: null,
    // If you want to store more location data or fetch states, do it here
  }),
  actions: {
    setLocation({ cd_mun, nm_mun, uf, category, layer, scale }) {
      this.cd_mun = cd_mun ?? null
      this.nm_mun = nm_mun ?? null
      this.uf = uf ?? null
      this.category = category ?? 'clima'
      this.layer = data[0]?.slug ?? 'Temperatura de superfície';
      this.scale = scale ?? 'intraurbana'
    },
    setCoordinates({ lat, lng }) {
      this.coordinates.lat = lat
      this.coordinates.lng = lng
    },

    // Example: a method to fetch coordinates by cd_mun or nm_mun
    async fetchCoordinatesByCdMun(cd_mun) {
      try {
        // Example fetch
        const response = await fetch(`/v1/address/suggestions?query=${cd_mun}`)
        const data = await response.json()
        if (data && data.length && data[0].coordinates) {
          this.setCoordinates(data[0].coordinates)
        }
      } catch (err) {
        console.error('Failed to fetch coords by cd_mun:', err)
      }
    },

    async fetchCoordinatesByName(nm_mun) {
      try {
        // Or your actual API call for city name
        const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${nm_mun}`)
        const data = await response.json()
        // pick the first or best match
        if (data && data.length && data[0].coordinates) {
          this.setCoordinates(data[0].coordinates)
          this.cd_mun = data[0].cd_mun ?? this.cd_mun
        }
      } catch (err) {
        console.error('Failed to fetch coords by name:', err)
      }
    },
  },
})
