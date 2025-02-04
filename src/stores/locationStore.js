// urbverde-ui/src/stores/locationStore.js

import { defineStore } from 'pinia';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';

/**
 * Store for managing location and map layer state
 */
export const useLocationStore = defineStore('locationStore', {
  state: () => ({
    // Location data
    cd_mun: null,
    nm_mun: null,
    uf: null,
    type: null,
    year: null,
    scale: null,
    bbox: null,

    // Layer data
    category: null,
    layer: null,
    layerName: null,
    categories: [],

    // Loading states
    isLoadingCategories: false,
    error: null,
  }),

  getters: {
    currentCategoryName() {
      return this.category;
    },

    currentLayerSlug() {
      return this.layer;
    },

    currentLayerName() {
      if (this.layerName) {return this.layerName;}

      const currentCategory = this.categories.find(
        cat => cat.name === this.category
      );
      const currentLayer = currentCategory?.layers?.find(
        layer => layer.id === this.layer
      );

      return currentLayer?.display_name || currentLayer?.title || currentLayer?.name || 'layer?';
    },

    urlParams() {
      const params = {};
      if (this.cd_mun) {params.code = this.cd_mun;}
      if (this.type) {params.type = this.type;}
      if (this.year) {params.year = this.year;}
      if (this.category) {params.category = this.category;}
      if (this.layer) {params.layer = this.layer;}
      if (this.scale) {params.scale = this.scale;}

      return params;
    },

    hasLocation() {
      return Boolean(this.cd_mun && this.nm_mun && this.uf);
    }
  },

  actions: {
    /**
     * Fetches categories for the current municipality
     */
    async fetchCategories() {
      if (!this.cd_mun || this.isLoadingCategories) {return;}

      this.isLoadingCategories = true;
      const currentLayer = this.layer; // Store current layer before changes
      console.log('locationStore: Fetching categories for city:', this.cd_mun);

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/categories?city=${this.cd_mun}`);
        if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}

        const data = await response.json();
        if (!data?.categories) {throw new Error('No categories in response');}

        this.categories = data.categories;

        // If we have a current layer, check if it exists in new categories
        if (currentLayer) {
          const layerExists = this.categories.some(category =>
            category.layers.some(layer => layer.id === currentLayer)
          );

          if (!layerExists) {
            // Force select first category/layer if current one doesn't exist
            this.setDefaultCategoryAndLayer();
          }
        } else {
          // No layer selected at all, set default
          this.setDefaultCategoryAndLayer();
        }
      } catch (error) {
        console.error('locationStore: Error fetching categories:', error);
        this.error = error.message;
        // On error, also ensure we have some selection
        if (this.categories.length > 0) {
          this.setDefaultCategoryAndLayer();
        }
      } finally {
        this.isLoadingCategories = false;
      }
    },

    // Helper for setting defaults
    setDefaultCategoryAndLayer() {
      if (this.categories.length > 0) {
        const firstCategory = this.categories[0];
        const firstLayer = firstCategory.layers?.[0];
        if (firstLayer) {
          console.log('locationStore: Setting default category and layer');
          this.category = firstCategory.name;
          this.layer = firstLayer.id;
          this.layerName = firstLayer.display_name || firstLayer.title || firstLayer.name;
        }
      }
    },

    /**
     * Fetches coordinates using municipal code
     * @param {string|number} cd_mun - Municipal code
     * @returns {Promise<{lat: number, lng: number}|null>}
     */
    async fetchCoordinatesByCode(cd_mun) {
      console.log('Fetching coordinates for municipal code:', cd_mun);
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/address/data?code=${cd_mun}`);
        const data = await response.json();
        console.log('Received coordinate data:', data);

        // Extract coordinates from center_options.default
        if (data?.center_options?.default) {
          const { lat, lng } = data.center_options.default;
          console.log('Extracted coordinates:', { lat, lng });

          return { lat, lng };
        }

        console.warn('No coordinates found in response');

        return null;
      } catch (error) {
        console.error('Failed to fetch coords by cd_mun:', error);

        return null;
      }
    },

    /**
     * Fetches coordinates using city name
     * @param {string} nm_mun - Municipality name
     * @returns {Promise<{lat: number, lng: number}|null>}
     */
    async fetchCoordinatesByName(nm_mun) {
      console.log('locationStore.js 123: fetchCoordinatesByName', nm_mun);

      if (!nm_mun) {return null;}

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/address/data?name=${nm_mun}`); //should be display_name
        const data = await response.json();

        if (data?.[0]) {
          if (data[0].cd_mun) {this.cd_mun = data[0].cd_mun;}

          return data[0].coordinates || null;
        }
      } catch (error) {
        console.error('Failed to fetch coords by name:', error);
      }

      return null;
    },

    /**
     * Updates location and related data
     * @param {Object} payload - Location data
     */
    async setLocation(payload) {
      console.log('locationStore: setLocation called with:', payload);

      const oldMunCode = this.cd_mun;
      const oldLayer = this.layer;

      // Update location data
      if (payload.cd_mun !== undefined) {this.cd_mun = payload.cd_mun;}
      if (payload.nm_mun !== undefined) {this.nm_mun = payload.nm_mun;}
      if (payload.uf !== undefined) {this.uf = payload.uf;}
      if (payload.type !== undefined) {this.type = payload.type;}
      if (payload.year !== undefined) {this.year = payload.year;}
      if (payload.scale !== undefined) {this.scale = payload.scale;}

      // Category/layer updates now handled after fetching categories if needed
      const pendingCategoryUpdates = {
        category: payload.category,
        layer: payload.layer,
        layerName: payload.layerName
      };

      // Fetch new categories if municipal code changes
      if (payload.cd_mun !== undefined && payload.cd_mun !== oldMunCode) {
        await this.fetchCategories(oldLayer);
      }

      // Now safe to update category/layer if they were in the payload
      // And not blocked by category loading
      if (!this.isLoadingCategories) {
        if (pendingCategoryUpdates.category !== undefined) {
          this.category = pendingCategoryUpdates.category;
        }
        if (pendingCategoryUpdates.layer !== undefined) {
          this.layer = pendingCategoryUpdates.layer;
          if (pendingCategoryUpdates.layerName !== undefined) {
            this.layerName = pendingCategoryUpdates.layerName;
          }
        }
      }
    },

    /**
     * Sets up URL synchronization with store state
     */
    setupUrlSync() {
      const router = useRouter();

      watchEffect(() => {
        // Only update URL if we have essential parameters and they differ from current route
        if (this.cd_mun) {
          const newParams = this.urlParams;
          const currentQuery = router.currentRoute.value.query;

          // Only update if parameters actually changed
          if (JSON.stringify(newParams) !== JSON.stringify(currentQuery)) {
            router.replace({
              path: '/mapa',
              query: newParams
            }).catch(err => console.error('Error updating URL:', err));
          }
        }
      });
    },

    /**
     * Updates store state from URL query parameters
     * @param {Object} query - URL query parameters
     */
    async updateFromQueryParams(query) {
      if (!query) {return;}
      console.log('locationStore: Updating from query params:', query);

      const updates = {
        cd_mun: query.code !== 'null' ? parseInt(query.code) : undefined,
        type: query.type !== 'null' ? query.type : undefined,
        year: query.year !== 'null' ? parseInt(query.year) : undefined,
        category: query.category !== 'null' ? query.category : undefined,
        layer: query.layer !== 'null' ? query.layer : undefined,
        scale: query.scale !== 'null' ? query.scale : undefined
      };

      await this.setLocation(updates);
    },

    /**
     * Clears all location-related data
     */
    clearLocation() {
      this.cd_mun = null;
      this.nm_mun = null;
      this.uf = null;
      this.category = null;
      this.layer = null;
      this.type = null;
      this.scale = null;
      this.bbox = null;
      this.error = null;
    },

    /**
     * Resets the store to its initial state
     */
    reset() {
      this.clearLocation();
      this.categories = [];
      this.isLoadingCategories = false;
    }
  }
});
