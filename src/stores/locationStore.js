// urbverde-ui/src/stores/locationStore.js
import { defineStore } from 'pinia';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { LAYER_CONFIGS } from '@/constants/layers.js';

// Função para obter o ano mais recente baseado no allowedYears da camada
function getLatestYearForLayer(layerId) {
  console.log('[LocationStore] Getting latest year for layer:', layerId);
  const layerConfig = LAYER_CONFIGS[layerId];
  if (layerConfig && layerConfig.allowedYears) {
    const latestYear = Math.max(...layerConfig.allowedYears);
    console.log('[LocationStore] Found layer config, latest year:', latestYear);

    return latestYear;
  }
  console.log('[LocationStore] No layer config found, using fallback year: 2024');

  return 2024; // fallback
}

// Função para obter anos disponíveis baseado no allowedYears da camada
function getAvailableYearsForLayer(layerId) {
  console.log('[LocationStore] Getting available years for layer:', layerId);
  const layerConfig = LAYER_CONFIGS[layerId];
  if (layerConfig && layerConfig.allowedYears) {
    console.log('[LocationStore] Found layer config, available years:', layerConfig.allowedYears);

    return [...layerConfig.allowedYears];
  }
  console.log('[LocationStore] No layer config found, using fallback years');

  return [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]; // fallback
}

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

    viewMode: 'map', // Adicionando viewMode ao estado
  }),

  getters: {
    currentCategoryName() {
      const currentCategory = this.categories.find(cat => cat.id === this.category);

      return currentCategory?.name || this.category;
    },
    currentLayerName() {
      const currentCategory = this.categories.find(cat => cat.id === this.category);
      const currentLayer = currentCategory?.layers?.find(layer => layer.id === this.layer);

      return currentLayer?.name || '';
    },
    currentYear() {
      // Se já temos um ano definido, retorna ele
      if (this.year) {
        return this.year;
      }

      // Caso contrário, retorna o ano mais recente baseado na camada atual
      return getLatestYearForLayer(this.layer);
    },
    availableYears() {
      return getAvailableYearsForLayer(this.layer);
    },
    urlParams() {
      const params = {};
      if (this.cd_mun)  {params.code = this.cd_mun;}
      if (this.viewMode) {params.viewMode = this.viewMode;}
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
      this.isLoadingCategories = true;
      console.log('locationStore: Fetching categories for city:', this.cd_mun);

      try {
        // Construir URL com parâmetros
        const url = new URL('http://localhost:8080/v1/categories');
        url.searchParams.append('city', this.cd_mun);

        // Adicionar viewMode se estiver definido
        if (this.viewMode) {
          url.searchParams.append('viewMode', this.viewMode);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data?.categories) {
          throw new Error('No categories in response');
        }

        // A lógica de filtragem agora é tratada no backend
        this.categories = data.categories;

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
          this.category = firstCategory.id;
          this.layer = firstLayer.id;
        }
      }
    },

    async fetchCoordinatesByCode(cd_mun) {
      console.log('Fetching coordinates for municipal code:', cd_mun);
      try {
        const response = await fetch(`http://localhost:8080/v1/address/data?code=${cd_mun}`);
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
        viewMode: query.viewMode !== 'null' ? query.viewMode : undefined,
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

    setViewMode(mode) {
      this.viewMode = mode;
    },
  }
});
