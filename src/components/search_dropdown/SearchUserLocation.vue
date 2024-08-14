<template>
    <div>
      <p v-if="city">Você está em: {{ city }}</p>
      <p v-else>Obtendo sua localização...</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        latitude: null,
        longitude: null,
        city: null,
      };
    },
    mounted() {
      this.loadCachedLocation();
    },
    methods: {
      loadCachedLocation() {
        const cachedCity = localStorage.getItem('cachedCity');
        const cachedTimestamp = localStorage.getItem('cachedTimestamp');
        const cacheDuration = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
  
        if (cachedCity && cachedTimestamp) {
          const now = Date.now();
          if (now - cachedTimestamp < cacheDuration) {
            this.city = cachedCity;
          } else {
            this.getLocation(); // Cache expirado, busca nova localização
          }
        } else {
          this.getLocation(); // Nenhum cache encontrado, busca nova localização
        }
      },
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            this.setPosition,
            this.showError
          );
        } else {
          alert("Geolocalização não é suportada por este navegador.");
        }
      },
      setPosition(position) {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getCityName();
      },
      showError(error) {
        console.error("Erro ao obter localização: ", error);
      },
      async getCityName() {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitude}&lon=${this.longitude}`
          );
          const data = await response.json();
          this.city = data.address.city || data.address.town || data.address.village || 'Localidade não identificada';
          
          // Cache a cidade e o timestamp
          localStorage.setItem('cachedCity', this.city);
          localStorage.setItem('cachedTimestamp', Date.now().toString());
        } catch (error) {
          console.error("Erro ao obter o nome da cidade: ", error);
        }
      },
    },
  };
  </script>
  