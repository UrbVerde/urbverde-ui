// urbverde-ui/src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
// import { API_URLS } from '@/constants/endpoints';
import cities from './responses/cities.json';
import categoriesResponse from './responses/categories.json';

// Function to filter categories based on location code and type
const filterCategories = (code) => {
  // console.log(code, typeof code); // Debug log

  // Deep clone the categories to avoid modifying the original
  const categories = JSON.parse(JSON.stringify(categoriesResponse.categories));

  // Check if it starts with 35 (São Paulo state)
  const isSaoPauloState = String(code).startsWith('35');
  // console.log('Is São Paulo state?', isSaoPauloState); // Debug log
  if (isSaoPauloState) {
    if (code === '3534708') { //Ourinhos-SP
      // The exclusive layer to be added to two categories
      const exclusiveLayer = {
        'id': 'tree_inventory',
        'name': 'Inventário de Árvores',
        'isActive': false,
        'isNew': true
      };
      // Find vegetation category and add the layer at the beginning
      const vegetationCategory = categories.find(cat => cat.id === 'vegetation');
      if (vegetationCategory) {
        vegetationCategory.layers.unshift({ ...exclusiveLayer });
      }
      // Find parks category and add the same layer at the beginning
      const parksCategory = categories.find(cat => cat.id === 'parks');
      if (parksCategory) {
        parksCategory.layers.unshift({ ...exclusiveLayer });
      }
    } else if (code === '3548906') { //São Carlos
      // The exclusive layer to be added to two categories
      const exclusiveLayer = {
        'id': 'fruit_trees',
        'name': 'Pés de Fruta',
        'isActive': false,
        'isNew': true
      };
        // Find vegetation category and add the layer at the beginning
      const agricultureCategory = categories.find(cat => cat.id === 'agriculture');
      if (agricultureCategory) {
        agricultureCategory.layers.unshift({ ...exclusiveLayer });
      }
    } else if (code === '3552205') { //Sorocaba
      // The exclusive layer to be added to two categories
      const exclusiveLayer = {
        'id': 'innundation_points',
        'name': 'Pontos de inundação',
        'isActive': false,
        'isNew': true
      };
        // Find vegetation category and add the layer at the beginning
      const waterCategory = categories.find(cat => cat.id === 'water');
      if (waterCategory) {
        waterCategory.layers.unshift({ ...exclusiveLayer });
      }
    }

    return { categories };
  } else {
    return {
      categories: categories.filter(category =>
        category.id === 'parks' || category.id === 'census' || category.id === 'transport'
      )
    };
  }

};

export const handlers = [

  // Handler for address suggestions
  http.get('*/v1/address/suggestions', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.toLowerCase() || '';

    try {
      // Check if the query is a city code
      if (!isNaN(query)) {
        const cityByCode = cities.find(city => city.code === query);
        if (cityByCode) {
          return HttpResponse.json([{
            display_name: `${cityByCode.name} - ${cityByCode.state}`,
            coordinates: {
              lat: cityByCode.lat,
              lng: cityByCode.lng
            }
          }]);
        }
      }

      // Handle states
      const isState = ['acre', 'alagoas', 'amapá', 'amazonas', 'bahia', 'ceará',
        'distrito federal', 'espírito santo', 'goiás', 'maranhão', 'mato grosso',
        'mato grosso do sul', 'minas gerais', 'pará', 'paraíba', 'paraná',
        'pernambuco', 'piauí', 'rio de janeiro', 'rio grande do norte',
        'rio grande do sul', 'rondônia', 'roraima', 'santa catarina', 'são paulo',
        'sergipe', 'tocantins', 'brasil'].includes(query);
      if (isState) {
        return HttpResponse.json([{
          display_name: query,
          error: 'NO_COORDINATES'
        }]);
      }

      // Search by city name
      const filteredCities = cities.filter(city => {
        const fullName = `${city.name} - ${city.state}`.toLowerCase();

        return fullName.startsWith(query);
      }).slice(0, 5);

      if (filteredCities.length === 0) {
        return HttpResponse.json([{
          display_name: query,
          error: 'CITY_NOT_FOUND'
        }]);
      }

      return HttpResponse.json(filteredCities.map(city => ({
        display_name: `${city.name} - ${city.state}`,
        cd_mun: city.code,
        coordinates: {
          lat: city.lat,
          lng: city.lng
        }
      })));
    } catch (error) {
      console.error('Error in mock handler:', error);

      return HttpResponse.json([{
        display_name: query,
        error: 'INTERNAL_ERROR'
      }]);
    }
  }),

  http.get('*/v1/address/categories', async({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code'); //should use locationStore pinia value instead

    return HttpResponse.json(filterCategories(code));
  })
];
