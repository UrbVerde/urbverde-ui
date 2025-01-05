import { API_URLS } from '@/constants/endpoints';
import { http, HttpResponse } from 'msw';

import geocodeV1Response from './responses/geocodeV1.json';

export const handlers = [
  http.get(API_URLS.OPENCAGEDATA, () => HttpResponse.json(geocodeV1Response)),
];
