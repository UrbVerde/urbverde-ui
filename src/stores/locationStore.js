// src/stores/locationStore.js
import { defineStore } from 'pinia';

export const useLocationStore = defineStore('locationStore', {
  state: () => ({
    cd_mun: null,
    nm_mun: null,
    uf: null,
    category: null,
    layer: null,
    year: new Date().getFullYear(),
    type: null,
    scale: null,
    coordinates: { lat: null, lng: null },
    bbox: null,
    zoom: null,
    categories: [],
  }),

  actions: {
    setLocation({ cd_mun, nm_mun, uf, category, layer, type, year, scale }) {
      this.cd_mun = cd_mun ?? null;
      this.nm_mun = nm_mun ?? null;
      this.uf = uf ?? null;
      this.category = category ?? this.category;
      this.layer = layer ?? this.layer;
      this.scale = scale ?? this.scale;
      this.type = type ?? this.type;
      this.year = year ?? this.year;
    },

    // Method to initialize state from URL query params
    updateFromQueryParams(query) {
      if (query) {
        this.uf = query.state ?? this.uf;
        this.cd_mun = parseInt(query.code) ?? this.cd_mun;
        this.type = query.type ?? this.type;
        this.year = parseInt(query.year) ?? this.year; // Add parseInt for year
        this.category = query.category ?? this.category;
        this.layer = query.layer ?? this.layer;
      }
    },

    setCoordinates({ lat, lng }) {
      this.coordinates.lat = lat;
      this.coordinates.lng = lng;
    },

    setCategories(categories) {
      this.categories = categories;
    },

    // setSelectedCategory(category) {
    //   this.selectedCategory = category;
    //   this.category = category.name; // Update the existing category field
    //   if (category.layers && category.layers.length > 0) {
    //     this.layer = category.layers[0].slug; // Update layer if available
    //   }
    // },

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
        if (data?.[0]) {
          if (data[0].coordinates) {
            this.setCoordinates(data[0].coordinates);
          }
          if (data[0].cd_mun) {
            this.cd_mun = data[0].cd_mun;
          }
        }
      } catch (err) {
        console.error('Failed to fetch coords by name:', err);
      }
    },
  },

  getters: {
    currentCategoryName: (state) => state.category,
    currentLayerSlug: (state) => state.layer,
    // Add useful getters for URL params
    urlParams: (state) => ({
      state: state.uf,
      code: state.cd_mun,
      type: state.type,
      year: state.year,
      category: state.category,
      layer: state.layer,
    }),
  },
});
