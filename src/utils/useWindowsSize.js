/*

--- 1. Exemplo de uso em um componente com Composition API (script setup)

<script setup>
import { useWindowSize } from '@/utils/composables/useWindowSize';

// Desestruturando apenas o que você precisa usar
const {
  windowWidth,
  isDesktop,
  isMobile,
  smallerThan
} = useWindowSize();

// Exemplos de uso
console.log(`A largura atual da janela é: ${windowWidth.value}px`);
console.log(`É um dispositivo desktop? ${isDesktop()}`);
console.log(`É um dispositivo móvel? ${isMobile()}`);
console.log(`É menor que tablet? ${smallerThan('tablet')}`);

// Usado em templates diretamente
// <div v-if="smallerThan('mobile-large')">Conteúdo otimizado para celular</div>
// <div v-else-if="smallerThan('desktop-small')">Conteúdo otimizado para tablet</div>
// <div v-else>Conteúdo desktop</div>
</script>

--- 2. Exemplo de uso em um componente com Options API

<script>
import { useWindowSize } from '@/utils/composables/useWindowSize';

export default {
  setup() {
    const {
      windowWidth,
      isTablet,
      smallerThan,
      largerThan
    } = useWindowSize();

    // Exponha as propriedades e métodos que serão usados no template
    return {
      windowWidth,
      isTablet,
      smallerThan,
      largerThan
    };
  },
};
</script>

*/

// src/utils/useWindowSize.js
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useWindowSize() {
  // Valores dos breakpoints definidos manualmente, conforme o do breakpoints.scss
  const BREAKPOINTS = {
    MOBILE_SMALL: 375,
    MOBILE_MEDIUM: 481,
    MOBILE_LARGE: 601,
    TABLET: 1026,
    DESKTOP_SMALL: 1281,
    DESKTOP_LARGE: 1921
  };

  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);

  function updateWindowSize() {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  }

  onMounted(() => {
    window.addEventListener('resize', updateWindowSize);
    updateWindowSize();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWindowSize);
  });

  // Funções auxiliares para verificação de breakpoints específicos do sistema
  const isMobileSmall = () => windowWidth.value <= BREAKPOINTS.MOBILE_SMALL;
  const isMobileMedium = () => windowWidth.value > BREAKPOINTS.MOBILE_SMALL && windowWidth.value <= BREAKPOINTS.MOBILE_MEDIUM;
  const isMobileLarge = () => windowWidth.value > BREAKPOINTS.MOBILE_MEDIUM && windowWidth.value <= BREAKPOINTS.MOBILE_LARGE;
  const isTablet = () => windowWidth.value > BREAKPOINTS.MOBILE_LARGE && windowWidth.value <= BREAKPOINTS.TABLET;
  const isDesktopSmall = () => windowWidth.value > BREAKPOINTS.TABLET && windowWidth.value <= BREAKPOINTS.DESKTOP_SMALL;
  const isDesktopLarge = () => windowWidth.value > BREAKPOINTS.DESKTOP_SMALL;

  // Funções auxiliares para categorias gerais
  const isMobile = () => windowWidth.value <= BREAKPOINTS.MOBILE_LARGE;
  const isDesktop = () => windowWidth.value > BREAKPOINTS.TABLET;

  // Funções auxiliares para comparações comuns
  const smallerThan = (breakpoint) => {
    const formattedBreakpoint = breakpoint.toUpperCase().replace('-', '_');
    const breakpointValue = BREAKPOINTS[formattedBreakpoint];
    if (!breakpointValue) {
      console.warn(`Breakpoint ${breakpoint} não encontrado`);

      return false;
    }

    return windowWidth.value <= breakpointValue;
  };

  const largerThan = (breakpoint) => {
    const formattedBreakpoint = breakpoint.toUpperCase().replace('-', '_');
    const breakpointValue = BREAKPOINTS[formattedBreakpoint];
    if (!breakpointValue) {
      console.warn(`Breakpoint ${breakpoint} não encontrado`);

      return false;
    }

    return windowWidth.value > breakpointValue;
  };

  return {
    windowWidth,
    windowHeight,
    breakpoints: BREAKPOINTS,

    // Verificadores específicos
    isMobileSmall,
    isMobileMedium,
    isMobileLarge,
    isTablet,
    isDesktopSmall,
    isDesktopLarge,

    // Categorias gerais
    isMobile,
    isDesktop,

    // Comparadores dinâmicos
    smallerThan,
    largerThan
  };
}
