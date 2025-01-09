// src/stores/locationStore.js
import { defineStore } from 'pinia';

export const useLocationStore = defineStore('locationStore', {
  state: () => ({
    cd_mun: null,
    nm_mun: null,
    uf: null,
    category: null,
    layer: null,
    scale: null,
    coordinates: { lat: null, lng: null },
    bbox: null,
    zoom: null,
    categories: [],
    selectedCategory: null,
  }),
  actions: {
    setLocation({ cd_mun, nm_mun, uf, category, scale }) {
      this.cd_mun = cd_mun ?? null;
      this.nm_mun = nm_mun ?? null;
      this.uf = uf ?? null;
      this.category = category ?? '?';
      this.layer = this.categories[0]?.slug ?? '?';
      this.scale = scale ?? '?';
    },

    setCoordinates({ lat, lng }) {
      this.coordinates.lat = lat;
      this.coordinates.lng = lng;
    },

    setCategories(categories) {
      this.categories = categories;
    },

    setSelectedCategory(category) {
      this.selectedCategory = category;
      this.category = category.name; // Update the existing category field
      if (category.layers && category.layers.length > 0) {
        this.layer = category.layers[0].slug; // Update layer if available
      }
    },

    // Example: a method to fetch coordinates by cd_mun or nm_mun
    async fetchCoordinatesByCdMun(cd_mun) {
      try {
        // Example fetch
        const response = await fetch(`/v1/address/suggestions?query=${cd_mun}`);
        const data = await response.json();
        if (data && data.length && data[0].coordinates) {
          this.setCoordinates(data[0].coordinates);
        }
      } catch (err) {
        console.error('Failed to fetch coords by cd_mun:', err);
      }
    },

    async fetchCoordinatesByName(nm_mun) {
      try {
        // Or your actual API call for city name
        const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${nm_mun}`);
        const data = await response.json();
        // pick the first or best match
        if (data && data.length && data[0].coordinates) {
          this.setCoordinates(data[0].coordinates);
          this.cd_mun = data[0].cd_mun ?? this.cd_mun;
        }
      } catch (err) {
        console.error('Failed to fetch coords by name:', err);
      }
    },
  },

  getters: {
    // Add some useful getters
    getCurrentCategory: (state) => state.selectedCategory,
    getCategoryName: (state) => state.category,
    getCurrentLayer: (state) => state.layer,
  },
});
