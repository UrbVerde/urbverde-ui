import { inject } from 'vue';

export function useCardData() {
  const injectedCityCode = inject('cityCode');
  const injectedSelectedYear = inject('selectedYear');

  return {
    injectedCityCode,
    injectedSelectedYear
  };
}
