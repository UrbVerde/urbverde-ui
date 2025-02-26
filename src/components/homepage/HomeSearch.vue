<!-- urbverde-ui/src/components/homepage/HomeSearch.vue -->
<template>
  <div class="search">
    <div class="search-button shadow">
      <BuscaSimples
        @location-updated="onLocationUpdated"
        @interaction-succeeded="handleNavigation"
        :openDelay="0"
        :autoSelectLocation="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import BuscaSimples from '@/components/search_dropdown/BuscaSimples.vue';

// Define props directly without assignment
defineProps({
  buttonRoute: {
    type: String,
    default: '/mapa',
  },
  buttonLabel: {
    type: String,
    default: 'Acessar',
  },
  filled: {
    type: Boolean,
    default: true,
  },
  iconType: {
    type: String,
    default: 'bootstrap',
  },
  icon: {
    type: String,
    default: 'bi bi-arrow-right',
  },
  allowAutoNavigation: {
    type: Boolean,
    default: false,
  },
});

// Emits definition
const emit = defineEmits(['location-updated']);

// Setup router
const router = useRouter();

// Reactive state
const windowWidth = ref(window.innerWidth);

// Methods
function onLocationUpdated(location) {
  emit('location-updated', location);
}

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

function handleNavigation() {
  setTimeout(() => {
    router.push('/mapa');
  }, 800);
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth);
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/breakpoints.scss';

.search {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: row;
}

.button-primary-link {
  width: 143px;
  height: 48px;
  text-decoration: none;
  margin: 0;
  padding: 0;
}

.button-primary-link-mobile {
  width: 56px;
  height: 48px;
  text-decoration: none;
  margin: 0;
  padding: 0;
}

.search-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 480px;
  position: relative;
  border-radius: 99px;
}

@include breakpoint-down('tablet') {
  .search-button {
    width: 400px;
  }
}

@include breakpoint-down('mobile-large') {
  .search-button {
    width: 320px;
  }
}

@include breakpoint-down('mobile-medium') {
  .search-button {
    width: 272px;
  }
}
</style>
