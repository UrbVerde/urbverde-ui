// src/stores/locationStore.js
import { defineStore } from 'pinia';

export const useLocationStore = defineStore('locationStore', {
  state: () => ({
    cd_mun: null,
    nm_mun: null,
    uf: null,
    category: null,
    layer: null,
    year: null,
    type: null,
    scale: null,
    bbox: null,
    categories: [],
  }),

  getters: {
    currentCategoryName: (state) => state.category,
    currentLayerSlug: (state) => state.layer,
    urlParams: (state) => {
      const params = {};
      if (state.cd_mun) {params.code = state.cd_mun;}
      if (state.type) {params.type = state.type;}
      if (state.year) {params.year = state.year;}
      if (state.category) {params.category = state.category;}
      if (state.layer) {params.layer = state.layer;}
      if (state.scale) {params.scale = state.scale;}

      return params;
    }
  },

  actions: {
    async updateLocationData(location) {
      // If we have valid location data, update the store
      if (location.city && location.stateAbbreviation) {
        // const cityWithState = `${location.city} - ${location.stateAbbreviation}`;
        const code = await this.fetchAndStoreCityCode(location.city);

        this.setLocation({
          cd_mun: code,
          nm_mun: location.city,
          uf: location.stateAbbreviation,
          type: 'city',
          year: new Date().getFullYear()
        });
      }
    },

    setLocation({ cd_mun, nm_mun, uf, category, layer, type, year, scale }) {
      // console.log('setLocation called with:', { cd_mun, nm_mun, uf, category, layer, type, year, scale });
      if (cd_mun !== undefined) {this.cd_mun = cd_mun;}
      if (nm_mun !== undefined) {this.nm_mun = nm_mun;}
      if (uf !== undefined) {this.uf = uf;}
      if (category !== undefined) {this.category = category;}
      if (layer !== undefined) {this.layer = layer;}
      if (type !== undefined) {this.type = type;}
      if (year !== undefined) {this.year = year;}
      if (scale !== undefined) {this.scale = scale;}
    },

    async fetchAndStoreCityCode(city) {
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${city}`);
        const data = await response.json();

        if (data && data.length > 0 && !data[0].error) {
          return data[0].cd_mun;
        }
      } catch (error) {
        console.error('Error fetching city code:', error);
      }

      return null;
    },

    updateFromQueryParams(query) {
      if (!query) {return;}
      if (query.code && query.code !== 'null') {this.cd_mun = parseInt(query.code);}
      if (query.type && query.type !== 'null') {this.type = query.type;}
      if (query.year && query.year !== 'null') {this.year = parseInt(query.year);}
      if (query.category && query.category !== 'null') {this.category = query.category;}
      if (query.layer && query.layer !== 'null') {this.layer = query.layer;}
      if (query.scale && query.scale !== 'null') {this.scale = query.scale;}
    },

    setCategories(categories) {
      this.categories = categories;
    },

    setSelectedCategory(category) {
      this.selectedCategory = category;
      this.category = category.name;
      // Always set first layer when category changes
      if (category.layers && category.layers.length > 0) {
        this.layer = category.layers[0].id;
      }
    },

    // Fetch coordinates by municipal code
    async fetchCoordinatesByCode(cd_mun) {
      // console.log('localStore.js -> fetchCoordinatesByCode:', cd_mun);
      if (!cd_mun) {return null;}

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${cd_mun}`);
        const data = await response.json();

        if (data && data.length && data[0].coordinates) {
          return data[0].coordinates;
        }
      } catch (err) {
        console.error('Failed to fetch coords by cd_mun:', err);
      }

      return null;
    },

    // Fetch coordinates by city name
    async fetchCoordinatesByName(nm_mun) {
      // console.log('localStore.js -> fetchCoordinatesByName:', nm_mun);
      if (!nm_mun) {return null;}

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/address/suggestions?query=${nm_mun}`);
        const data = await response.json();

        if (data?.[0]) {
          // If we got coordinates, update municipal code too
          if (data[0].cd_mun) {
            this.cd_mun = data[0].cd_mun;
          }
          if (data[0].coordinates) {
            return data[0].coordinates;
          }
        }
      } catch (err) {
        console.error('Failed to fetch coords by name:', err);
      }

      return null;
    },

    // Clear all location data
    clearLocation() {
      this.cd_mun = null;
      this.nm_mun = null;
      this.uf = null;
      this.category = null;
      this.layer = null;
      this.type = null;
      this.scale = null;
      this.bbox = null;
    },

    // Reset to initial state
    reset() {
      this.clearLocation();
      this.categories = [];
    }
  },
});
