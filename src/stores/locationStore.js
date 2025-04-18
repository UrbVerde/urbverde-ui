// urbverde-ui/src/stores/locationStore.js
import { defineStore } from 'pinia';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';

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
    categories: [],

    // Loading states
    isLoadingCategories: false,
    error: null,
  }),

  getters: {
    currentCategoryName() {
      return this.category;
    },
    currentLayerName() {
      const currentCategory = this.categories.find(cat => cat.name === this.category);
      const currentLayer = currentCategory?.layers?.find(layer => layer.id === this.layer);

      return currentLayer?.name || '';
    },
    urlParams() {
      const params = {};
      if (this.cd_mun)  {params.code = this.cd_mun;}
      if (this.type)    {params.type = this.type;}
      if (this.year)    {params.year = this.year;}
      if (this.category) {params.category = this.category;}
      if (this.layer)   {params.layer = this.layer;}
      if (this.scale)   {params.scale = this.scale;}

      return params;
    },
    hasLocation() {
      return Boolean(this.cd_mun && this.nm_mun && this.uf);
    }
  },

  actions: {
    async fetchCategories() {
      if (!this.cd_mun || this.isLoadingCategories) {return;}

      this.isLoadingCategories = true;
      console.log('locationStore: Fetching categories for city:', this.cd_mun);

      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/categories?city=${this.cd_mun}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data?.categories) {
          throw new Error('No categories in response');
        }

        // Filtra as categorias se o estado não for SP
        if (this.uf && this.uf !== 'SP') {
          this.categories = data.categories.filter(category => category.id === 'census');
        } else {
          this.categories = data.categories;
        }

        // If we have a current layer, check if it exists in new categories
        if (this.layer) {
          const layerExists = this.categories.some(cat =>
            cat.layers.some(l => l.id === this.layer)
          );
          if (!layerExists) {
            this.setDefaultCategoryAndLayer();
          }
        } else {
          this.setDefaultCategoryAndLayer();
        }
      } catch (error) {
        console.error('locationStore: Error fetching categories:', error);
        this.error = error.message;
        if (this.categories.length > 0) {
          this.setDefaultCategoryAndLayer();
        }
      } finally {
        this.isLoadingCategories = false;
      }
    },

    setDefaultCategoryAndLayer() {
      if (this.categories.length > 0) {
        const firstCategory = this.categories[0];
        const firstLayer = firstCategory.layers?.[0];
        if (firstLayer) {
          console.log('locationStore: Setting default category and layer');
          this.category = firstCategory.name;
          this.layer = firstLayer.id;
        }
      }
    },

    async fetchCoordinatesByCode(cd_mun) {
      console.log('Fetching coordinates for municipal code:', cd_mun);
      try {
        const response = await fetch(`https://api.urbverde.com.br/v1/address/data?code=${cd_mun}`);
        const data = await response.json();
        console.log('Received coordinate data:', data);

        if (data?.name) {
          this.nm_mun = data.name;
        }
        if (data?.state) {
          this.uf = data.state;
        }
        if (data?.type) {
          this.type = data.type;
        }

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

    reset() {
      this.clearLocation();
      this.categories = [];
      this.isLoadingCategories = false;
    },

    async setLocation(payload) {
      console.log('locationStore: setLocation called with:', payload);

      if (payload.cd_mun !== undefined) {this.cd_mun = payload.cd_mun;}
      if (payload.nm_mun !== undefined) {this.nm_mun = payload.nm_mun;}
      if (payload.uf !== undefined)     {this.uf = payload.uf;}
      if (payload.type !== undefined)   {this.type = payload.type;}
      if (payload.year !== undefined)   {this.year = payload.year;}
      if (payload.scale !== undefined)  {this.scale = payload.scale;}

      if (payload.cd_mun !== undefined) {
        // const coords = await this.fetchCoordinatesByCode(payload.cd_mun);
        await this.fetchCategories();
      }

      if (payload.category !== undefined) {this.category = payload.category;}
      if (payload.layer !== undefined) {this.layer = payload.layer;}
    },

    async updateFromQueryParams(query) {
      if (!query) {return;}
      console.log('locationStore: Updating from query params:', query);

      const updates = {
        cd_mun: query.code !== 'null'   ? parseInt(query.code) : undefined,
        type:   query.type !== 'null'   ? query.type : undefined,
        year:   query.year !== 'null'   ? parseInt(query.year) : undefined,
        category: query.category !== 'null' ? query.category : undefined,
        layer:  query.layer !== 'null'  ? query.layer : undefined,
        scale:  query.scale !== 'null'  ? query.scale : undefined,
      };

      await this.setLocation(updates);
    },

    setupUrlSync() {
      const router = useRouter();
      watchEffect(() => {
        if (this.cd_mun) {
          const newParams = this.urlParams;
          const currentQuery = router.currentRoute.value.query;
          if (JSON.stringify(newParams) !== JSON.stringify(currentQuery)) {
            router.replace({ path: '/mapa', query: newParams })
              .catch(err => console.error('Error updating URL:', err));
          }
        }
      });
    },
  }
});
