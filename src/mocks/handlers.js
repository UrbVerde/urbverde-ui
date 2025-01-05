// urbverde-ui/src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { API_URLS } from '@/constants/endpoints';
import cities from './responses/cities.json';
import categoriesResponse from './responses/categories.json';

export const handlers = [
  
  // Handler for address suggestions
  http.get('*/v1/address/suggestions', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.toLowerCase() || '';

    try {
      // Check if the query is a city code
      if (!isNaN(query)) {
        const cityByCode = cities.find(city => city.code.toString() === query);
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
      // Handle states separately
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

  http.get(API_URLS.CATEGORIES, () => HttpResponse.json(categoriesResponse))
];


    