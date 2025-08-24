// urbverde-ui/src/stores/locationStore.js
import { defineStore } from 'pinia';
import { watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { useLayersStore } from './layersStore';
// import { createMountLayers } from '@/components/map/layers/MountLayers.js';

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
    lng: null,
    lat: null,

    // Map state
    mapState: {
      center: null,
      zoom: null,
      bearing: 0,
      pitch: 0
    },

    // Layer data
    category: null,
    activeMainLayer: null,
    layer: null,
    lastMainLayer: null,
    categories: [],

    // Loading states
    isLoadingCategories: false,
    error: null,

    viewMode: 'map',
  }),

  getters: {
    currentCategoryName() {
      return this.category;
    },
    currentLayerName() {
      const currentCategory = this.categories.find(cat => cat.name === this.category);
      const currentLayer = currentCategory?.layers?.find(layer => layer.id === this.activeMainLayer);

      return currentLayer?.name || '';
    },
    getCategories() {
      return this.categories;
    },
    urlParams() {
      const params = {};
      if (this.cd_mun)  {params.code = this.cd_mun;}
      if (this.viewMode) {params.viewMode = this.viewMode;}
      if (this.type)    {params.type = this.type;}
      if (this.year)    {params.year = this.year;}
      if (this.category) {params.category = this.category;}
      if (this.activeMainLayer)   {params.layer = this.activeMainLayer;}
      if (this.scale)   {params.scale = this.scale;}

      // Adiciona parâmetros do mapa se existirem
      if (this.mapState.center && this.mapState.zoom) {
        params.lat = this.mapState.center[1];
        params.lng = this.mapState.center[0];
        params.zoom = this.mapState.zoom;
        params.bearing = this.mapState.bearing;
        params.pitch = this.mapState.pitch;
      }

      return params;
    },
    urlHash() {
      if (!this.mapState.center || !this.mapState.zoom) {return '';}

      return `@${this.mapState.center[1].toFixed(4)},${this.mapState.center[0].toFixed(4)},${this.mapState.zoom}z,${this.mapState.bearing}b,${this.mapState.pitch}p`;
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
        let data;
        if (this.viewMode === 'policies') {
          // JSON mockado para o modo 'policies'
          data = {
            'categories': [
              {
                'id': 'overview',
                'name': 'Síntese dos indicadores',
                'icon': 'stats.svg',
                'layers': [
                  { 'id': 'about_city', 'name': 'Sobre a cidade', 'isActive': false, 'isNew': true },
                  { 'id': 'danger_zone', 'name': 'Zonas de risco climático', 'isActive': false, 'isNew': false }
                ]
              },
              {
                'id': 'climate',
                'name': 'Clima',
                'icon': 'Snowy Sunny Day.svg',
                'layers': [
                  { 'id': 'surface_temp', 'name': 'Temperatura de superfície', 'isActive': false, 'isNew': true },
                  { 'id': 'max_surface_temp', 'name': 'Temperatura máxima de superfície', 'isActive': false, 'isNew': false },
                  { 'id': 'heat_island', 'name': 'Nível de exposição à ilha de calor', 'isActive': false, 'isNew': false }
                ]
              },
              {
                'id': 'parks',
                'name': 'Parques e Praças',
                'icon': 'Nature.svg',
                'layers': [
                  {
                    'id': 'avg_distance_to_squares',
                    'name': 'Distância media até as praças',
                    'isActive': false,
                    'isNew': false
                  },
                  {
                    'id': 'square_area_per_capita',
                    'name': 'Área de praças por habitante',
                    'isActive': false,
                    'isNew': false
                  },
                  {
                    'id': 'square_served_area',
                    'name': 'Área atendida pelas praças',
                    'isActive': false,
                    'isNew': false
                  },
                  {
                    'id': 'served_population',
                    'name': 'População atendida pelas praças',
                    'isActive': false,
                    'isNew': false
                  }
                ]
              },
              {
                'id': 'vegetation',
                'name': 'Vegetação',
                'icon': 'Oak Tree.svg',
                'layers': [
                  { 'id': 'pcv', 'name': 'Cobertura vegetal (PCV)', 'isActive': false, 'isNew': false },
                  { 'id': 'icv', 'name': 'Cobertura vegetal por habitante (ICV)', 'isActive': false, 'isNew': false },
                  { 'id': 'idsa', 'name': 'Desigualdade sociambiental (IDSA)', 'isActive': false, 'isNew': false },
                  { 'id': 'cvp', 'name': 'Cobertura vegetal por satélite', 'isActive': false, 'isNew': false },
                  { 'id': 'ndvi', 'name': 'Vigor da vegetação (NDVI)', 'isActive': false, 'isNew': false }
                ]
              },
              {
                'id': 'emissions',
                'name': 'Emissões',
                'icon': 'emissions.svg',
                'layers': [
                  { 'id': 'e1', 'name': 'generico 1', 'isActive': false, 'isNew': false },
                  { 'id': 'e2', 'name': 'generico 2', 'isActive': false, 'isNew': false },
                  { 'id': 'e3', 'name': 'generico 3', 'isActive': false, 'isNew': false }
                ]
              },
              {
                'id': 'hidro',
                'name': 'Águas',
                'icon': 'water.svg',
                'layers': [
                  { 'id': 'e1', 'name': 'generico 1', 'isActive': false, 'isNew': false },
                  { 'id': 'e2', 'name': 'generico 2', 'isActive': false, 'isNew': false },
                  { 'id': 'e3', 'name': 'generico 3', 'isActive': false, 'isNew': false }
                ]
              },
              {
                'id': 'agriculture',
                'name': 'Agricultura urbana',
                'icon': 'plant.svg',
                'layers': [
                  { 'id': 'e1', 'name': 'generico 1', 'isActive': false, 'isNew': false },
                  { 'id': 'e2', 'name': 'generico 2', 'isActive': false, 'isNew': false },
                  { 'id': 'e3', 'name': 'generico 3', 'isActive': false, 'isNew': false }
                ]
              },
              {
                'id': 'census',
                'name': 'Censo',
                'icon': 'bi bi-people',
                'layers': [
                  { 'id': 'population', 'name': 'População', 'isActive': false, 'isNew': false }
                ]
              }
            ]
          };
        } else {
          const response = await fetch(`https://api.urbverde.com.br/v1/categories?city=${this.cd_mun}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        }

        if (!data?.categories) {
          throw new Error('No categories in response');
        }

        // Filtra as categorias se o estado não for SP
        if (this.viewMode === 'map') {
          if (this.uf && this.uf !== 'SP') {
            this.categories = data.categories.filter(category => category.id === 'census');

          } else {
            this.categories = data.categories;
          }
        }

        if (this.viewMode === 'policies') {
          if (this.cd_mun && ![3547809, 3548708, 3548807, 3513801, 3529401, 3543303, 3544004].includes(this.cd_mun)) {
            this.categories = data.categories.filter(category => category.id === 'overview');
          } else {
            this.categories = data.categories;
          }
        }

        // If we have a current layer, check if it exists in new categories
        if (this.activeMainLayer) {
          const layerExists = this.categories.some(cat =>
            cat.layers.some(l => l.id === this.activeMainLayer)
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
          this.activeMainLayer = firstLayer.id;
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
      this.activeMainLayer = null;
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
      if (payload.lng !== undefined)    {this.lng = payload.lng;}
      if (payload.lat !== undefined)    {this.lat = payload.lat;}

      if (payload.cd_mun !== undefined) {
        await this.fetchCategories();
      }

      if (payload.category !== undefined) {this.category = payload.category;}
      if (payload.layer !== undefined) {
        this.activeMainLayer = payload.layer;
        this.layer = payload.layer;
      }
    },

    async updateFromQueryParams(query) {
      if (!query) {return;}
      console.log('locationStore: Updating from query params:', query);

      const updates = {
        cd_mun: query.code !== 'null' ? parseInt(query.code) : undefined,
        type: query.type !== 'null' ? query.type : undefined,
        year: query.year !== 'null' ? parseInt(query.year) : undefined,
        category: query.category !== 'null' ? query.category : undefined,
        layer: query.layer !== 'null' ? query.layer : undefined,
        scale: query.scale !== 'null' ? query.scale : undefined,
        viewMode: query.viewMode !== 'null' ? query.viewMode : undefined,
      };

      // Atualiza o estado do mapa se os parâmetros existirem
      if (query.lat && query.lng && query.zoom) {
        this.updateMapState({
          center: [parseFloat(query.lng), parseFloat(query.lat)],
          zoom: parseFloat(query.zoom),
          bearing: query.bearing ? parseInt(query.bearing) : 0,
          pitch: query.pitch ? parseInt(query.pitch) : 0
        });
      }

      await this.setLocation(updates);
    },

    setupUrlSync() {
      const router = useRouter();
      // const layersStore = useLayersStore();

      watchEffect(() => {
        if (this.cd_mun) {
          const newParams = this.urlParams;
          const currentQuery = router.currentRoute.value.query;

          // Compara apenas os parâmetros relevantes, ignorando o hash
          const currentParams = { ...currentQuery };
          delete currentParams.hash;

          if (JSON.stringify(newParams) !== JSON.stringify(currentParams)) {
            router.replace({
              path: '/mapa',
              query: newParams,
              hash: this.urlHash
            }).catch(err => console.error('Error updating URL:', err));
          }
        }
      });

    },

    setViewMode(mode) {
      this.viewMode = mode;
    },

    async updateMunicipalityUrl(code, coords) {
      const router = useRouter();
      const route = useRoute();

      // Atualiza o estado do mapa
      this.updateMapState({
        center: [coords.lng, coords.lat],
        zoom: 14, // Zoom padrão para município
        bearing: 0,
        pitch: 20
      });

      // Atualiza a URL
      await router.replace({
        query: {
          ...route.query,
          scale: 'intraurbana',
          lng: coords.lng,
          lat: coords.lat
        },
        hash: this.urlHash
      });
    },

    updateMapState(state) {
      this.mapState = {
        center: state.center,
        zoom: state.zoom,
        bearing: state.bearing || 0,
        pitch: state.pitch || 0
      };
    },

    getMapState() {
      return this.mapState;
    },

    updateScaleFromZoom(zoom) {
      const newScale = this.getScaleFromZoom(zoom);
      if (this.scale !== newScale) {
        this.setLocation({ scale: newScale });
      }
    },

    getScaleFromZoom(zoom) {
      if (zoom >= 10) {return 'intraurbana';}
      if (zoom > 5) {return 'estadual';}

      return 'nacional';
    }
  }
});
